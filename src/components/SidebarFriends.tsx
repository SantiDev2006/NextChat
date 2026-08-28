"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Friend {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
}

interface OnlineUser {
    userId: string;
    socketId: string;
}

let socket: Socket;

export default function SidebarFriends({
    friends,
    currentUserId
}: {
    friends: Friend[];
    currentUserId: string;
}) {

    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

    useEffect(() => {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "https://localhost:3001";
      socket = io(wsUrl);

      socket.emit("add_new_user", currentUserId);

      socket.on("get_online_users", (users:OnlineUser[])=>{
        setOnlineUsers(users);
      })
    
      return () => {
        socket.disconnect();
      }
    }, [currentUserId]);

    // function to generate initials (e.g., "Santiago Peralta" -> "SP")
  const getInitials = (name: string) => {
    const nameArray = name.split(" ");
    if (nameArray.length >= 2) {
      return `${nameArray[0][0]}${nameArray[1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  if(friends.length === 0){
    return <p className="text-xs text-zinc-500 px-2 py-4 text-center">No friends yet. :/</p>
  }
    
  return (
    <>
        {friends.map(friend=>{
            const isOnline = onlineUsers.some(user=> user.userId === friend.id);

            return (
                <Link
                    key={friend.id}
                    href={`/chat/${friend.id}`}
                    className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-800 cursor-pointer group transition-colors"
                >
                    <div className="relative shrink-0 flex items-center justify-center">
                        {friend.image ? (
                            <Image 
                                src={friend.image}
                                alt="👤"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover group-hover:ring-2 group-hover:ring-indigo-400 transition-all"
                            /> 
                        ) : (
                            <div className="flex w-8 h-8 bg-zinc-700 rounded-full items-center justify-center text-sm font-medium text-white group-hover:ring-2 group-hover:ring-indigo-400 transition-all">
                                {getInitials(friend.name || friend.username || "Unknown")}
                            </div>
                        )}

                        {isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-zinc-900 z-10 transition-all duration-300"></div>
                        )}
                    </div>
                    <span className="truncate font-medium text-zinc-300">
                        {friend.name || friend.username}
                    </span>
                </Link>
            )
        })}
    </>
  )
}
