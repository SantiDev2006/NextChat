"use client"

import AddFriend from '@/components/AddFriend'
import PendingRequests from '@/components/PendingRequests';
import { useState } from 'react';
import friendsOutlIcon from '@/public/svg/friendsOutl.svg';
import Image from 'next/image';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"add" | "pending">("pending");
  return (
    <section className='flex flex-1 min-w-0 h-full flex-col bg-zinc-900'>
        <header className="flex h-14 shrink-0 items-center gap-6 border-b border-zinc-700 bg-zinc-800 px-6 shadow-sm">
          <div className="flex items-center gap-2 border-r border-zinc-700 pr-6">
            <Image
            src={friendsOutlIcon}
            alt='𖠋𖠋'
            width={24}
            height={24}/>
          <h2 className="text-lg font-bold text-zinc-100">Friends</h2>
          </div>

          <nav className="flex gap-4">
            <button
            onClick={()=> setActiveTab("pending")}
            className={`px-2 py-1 rounded-md transition font-medium text-sm ${
              activeTab === "pending"
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300"
            }`}>
              Pending
            </button>
            <button
            onClick={()=> setActiveTab("add")}
            className={`px-3 py-1 rounded-md transition font-medium text-sm ${
              activeTab === "add"
              ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
              : "text-green-500 hover:bg-zinc-700/50"
            }`}>
              Add Friend
            </button>
          </nav>
        </header>

        <div className="flex flex-1 items-start justify-center p-6 overflow-y-auto">
          {activeTab === "pending" && <PendingRequests />}
          {activeTab === "add" && <AddFriend />}
        </div>
    </section>
  )
}
