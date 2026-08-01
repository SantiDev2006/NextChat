"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function searchUsers(searchTerm?: string) {
    const session = await auth();

    // If they aren't logged in, return an empty array
    if(!session?.user?.email) {
        return [];
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });

    if(!currentUser) return [];

    const users = await prisma.user.findMany({
        where: {
            // Rule 1: Never show the current user in their own search results
            id: {
                not: currentUser.id
            },
            // Rule 2: If a searchTerm exists, filter by name OR username
            ...(searchTerm
                ? {
                    OR: [
                        {name: {contains: searchTerm, mode: "insensitive"}},
                        {username: {contains: searchTerm, mode: "insensitive"}}
                    ]
                }
                : {}
            )
        },
        // Rule 3: ONLY return safe public data. Never return passwords or emails to the frontend!
        select: {
            id: true,
            name: true,
            username: true,
            image: true
        },
        // Rule 4: Hard limit to 10 results to protect database performance
        take: 10
    });
    return users;
}

export async function sendFriendRequest(receiverId:string) {
    const session = await auth()

    if(!session?.user?.email){
        return {error:"You must be logged in to send a friend request."};
    }

    const sender = await prisma.user.findUnique({
        where: {email: session.user.email}
    });

    if(!sender) return {error:"User not found."};
    if(sender.id === receiverId) return { error: "You cannot add yourself." };

    try {
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    {senderId: sender.id, receiverId: receiverId},
                    {senderId: receiverId, receiverId: sender.id}
                ]
            }
        });

        if(existingRequest){
            return {error:"A friend request already exists between you two."};
        }

        await prisma.friendRequest.create({
            data: {
                senderId: sender.id,
                receiverId: receiverId,
                status: "PENDING"
            }
        });

        return { success: true };
    } catch(error){
        console.error("Error sending friend request: ", error)
        return {error:"Something went wrong. Please try again."}
    }
}

// Fetch pending requests sent to the current user

export async function getPendingFriendRequests() {
    const session = await auth();
    if(!session?.user?.email) return [];

    const currentUser = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });

    if(!currentUser) return [];

    try {
        const requests = await prisma.friendRequest.findMany({
            where: {
                receiverId: currentUser.id,
                status: "PENDING"
            },
            // fetch the sender's profile info
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                }
            }
        });
        
        return requests;

    } catch (error) {
        console.error("Failed to fetch pending requests: ", error);
        return [];
    }
}

// Accept a friend request

export async function acceptFriendRequest(requestID:string) {
    const session = await auth();
    if(!session?.user?.email) return {error:"Unauthorized"};

    try {
        // update status to "ACCEPTED"
        await prisma.friendRequest.update({
            where: {id: requestID},
            data: {status: "ACCEPTED"}
        });
        
        return { success:true };

    } catch (error) {
        console.error("Failed to accept request");
        return { error: "Failed to accept request" };
    }
}

// Reject a friend request

export async function rejectFriendRequest(requestId:string) {
    const session = await auth();
    if(!session?.user?.email) return { error:"Unauthorized" };

    try {
        // Deleting the record keeps the database clean and allows them to re-send later
        await prisma.friendRequest.delete({
            where: {id: requestId}
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to reject request: ", error);
        return { error:"Failed to reject request" };
    }
}