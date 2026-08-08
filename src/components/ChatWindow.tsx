"use client"

import React, { useEffect, useRef, useState } from 'react'
import sendIcon from '@/public/svg/send.svg'
import Image from 'next/image';
import { sendMessage } from '@/actions/chat';

type Message = {
    id: string;
    body: string;
    senderId: string;
    sender: {
        id: string;
        name: string;
        image: string | null;
    }
}

export default function ChatWindow({
    conversationId,
    currentUserId,
    initialMessages,
}: {
    conversationId: string;
    currentUserId: string;
    initialMessages: any[];
}) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const handleSend = async (e: React.SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!inputText.trim()) return;

        // Save and immediately clear the input for a snappy feel
        const TextToSend = inputText;
        setInputText("");

        const res = await sendMessage(conversationId, TextToSend);

        if(res.message) {
            setMessages((prev) => [...prev, res.message as Message]);
        }
    }

  return (
    <div className='flex flex-col flex-1 overflow-hidden bg-zinc-900'>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-zinc-500">
                    <p>Say hello to start a conversation!</p>
                </div>
            ): (
                messages.map((msg)=> {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div 
                        key={msg.id}
                        className={`flex w-full ${isMe ?
                            "justify-end"
                            : "justify-start"
                        }`}>
                            <div className={`flex max-w-[70%] gap-3 ${isMe ? "flex-row-reverse": "flex-row"}`}>
                                {!isMe && (
                                    <div className="shrink-0 mt-auto">
                                        {msg.sender.image ? (
                                            <Image 
                                            src={msg.sender.image}
                                            alt='Avatar'
                                            width={28}
                                            height={28}
                                            className='w-7 h-7 rounded-full object-cover'/>
                                        ): (
                                            <div className="flex w-7 h-7 bg-zinc-700 rounded-full items-center justify-center text-xs font-bold text-white">
                                                {msg.sender.name?.charAt(0) || "?"}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                                    isMe
                                    ? "bg-zinc-600 text-white rounded-br-sm"
                                    : "bg-zinc-700 text-zinc-100 rounded-bl-sm"
                                }`}>
                                    {msg.body}
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
            <div ref={bottomRef} />
        </div>
        
        <div className="p-4 bg-zinc-800 border-t border-zinc-700">
            <form 
            onSubmit={handleSend}
            className="flex items-center gap-3 max-w-5xl mx-auto"
            >
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-zinc-700 text-zinc-100 placeholder-zinc-100 rounded-full px-2.5 py-2.5 outline-none focus:ring-indigo-500 focus:ring-2 transition-shadow"
                    autoComplete="off"
                />
                <button 
                type="submit"
                disabled={!inputText.trim()}
                className="flex shrink-0 items-center justify-center rounded-full bg-indigo-600 w-11 h-11 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white transition-colors"
                >
                    <Image 
                    src={sendIcon}
                    alt="➔"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                    />
                </button>
            </form>
        </div>
    </div>
  )
}
