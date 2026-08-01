"use client"

import { acceptFriendRequest, getPendingFriendRequests, rejectFriendRequest } from "@/actions/user";
import Image from "next/image";
import { useEffect, useState } from "react";
import AcceptIcon from '@/public/svg/accept.svg';
import rejectIcon from '@/public/svg/reject.svg';

// based on the prisma query
type RequestWithSender = {
    id: string;
    sender: {
        id: string;
        name: string | null;
        username: string | null;
        image: string | null;
    }
}

export default function PendingRequests() {
    const [requests, setRequests] = useState<RequestWithSender[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchRequests = async () =>{
            const data = await getPendingFriendRequests();

            // TypeScript needs a little help knowing this matches our specific include shape
            setRequests(data as unknown as RequestWithSender[]);
            setIsLoading(false);
        }
        fetchRequests();
    }, []);

    const handleAccept = async (requestId: string) => {
        const res = await acceptFriendRequest(requestId);
        if(res.success){
            // Remove it from the list instantly without reloading the page
            setRequests((prev)=> prev.filter((req)=> req.id !== requestId))
        }
    }

    const handleReject = async (requestId: string) => {
        const res = await rejectFriendRequest(requestId);
        if(res.success) {
            setRequests((prev)=> prev.filter((req)=>req.id !== requestId))
        }
    }

    if(isLoading){
        return <div className="text-zinc-400 py-8 text-center">Loading requests...</div>;
    }

  return (
    <div className="w-full max-w-2xl">
        <h2 className="text-xl mb-4 font-bold text-zinc-100 uppercase tracking-wider">
            Pending — {requests.length}
        </h2>

        {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <p>No pending requests.</p>
            </div>
        ) : (
            <div className="flex flex-col gap-2">
                {requests.map((request)=>(
                    <div 
                    key={request.id}
                    className="flex items-center justify-between rounded-xl bg-zinc-800/50 p-4 border border-zinc-700/50 hover:border-zinc-600 transition">
                        <div className="flex items-center gap-4">
                            {/* Sender Avatar */}
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-zinc-700 text-zinc-200 font-bold">
                                {request.sender.image ? (
                                    <Image
                                    src={request.sender.image}
                                    alt={`${request.sender.name}'s avatar`}
                                     width={48}
                                     height={48}
                                    className="rounded-full object-cover"/>
                                ) : (
                                    request.sender.name?.charAt(0) || request.sender.username?.charAt(0) || "?"
                                )}
                            </div>

                            {/* Sender Info */}
                            <div className="flex flex-col">
                                <div className="font-semibold text-zinc-100">{request.sender.name || "Unknown"}</div>
                                <span className="text-xs text-zinc-400">{request.sender.username || "nousername"}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                            onClick={()=> handleAccept(request.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-zinc-300 hover:bg-green-600 hover:text-white transition"
                            title="Accept">
                                <Image src={AcceptIcon} alt="☑" width={20} height={20}/>
                            </button>
                            <button
                            onClick={()=> handleReject(request.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-zinc-300 hover:bg-red-500 hover:text-white transition">
                                <Image
                                src={rejectIcon}
                                alt="X"
                                width={20}
                                height={20}
                                title="Reject"/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}
