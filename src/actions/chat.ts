"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Find an existing chat, or start a new one
export async function getOrCreateConversation(friendId:string) {
    const session = await auth();
    if(!session?.user?.email) return { error: "Unauthorized" };

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if(!currentUser) return { error: "User not found" };

    try {
        // Check if a conversation already exists
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    {
                        participants: {
                            some: {
                                id: currentUser.id
                            }
                        }
                    },
                    {
                        participants: {
                            some: {
                                id: friendId
                            }
                        }
                    }
                ]
            }
        });

        if(existingConversation) {
            return {conversation: existingConversation};
        }

        // If no conversation exists, create a new one
        const newConversation = await prisma.conversation.create({
            data: {
                participants: {
                    connect: [
                        { id: currentUser.id },
                        { id: friendId }
                    ]
                }
            }
        });

        return {conversation: newConversation};
    } catch (error) {
        console.error("Error occurred while fetching conversation:", error);
        return { error: "Error occurred while fetching conversation" };
    }
}

// Fetch all previous messages for the chat window
export async function getMessages(conversationId:string) {
    try {
        const messages = await prisma.message.findMany({
            where: { conversationId },
            // Include the sender's details
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            // Order them by the time they were created so the newest are at the bottom
            orderBy: {
                createdAt: "asc"
            }
        });

        return {messages};
    } catch (error) {
        console.error("Error fetching messages: ", error);
        return { error: "Error occurred while fetching messages" };
    }
}

export async function sendMessage(conversationId:string, body:string) {
    const session = await auth();
    if(!session?.user?.email) return { error: "Unauthorized" };

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if(!currentUser) return { error: "User not found" };

    try {
        const message = await prisma.message.create({
            data: {
                conversationId,
                body,
                senderId: currentUser.id
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        return { message };
    } catch (error) {
        console.error("Error sending message: ", error);
        return { error: "Error occurred while sending message" };
    }
}