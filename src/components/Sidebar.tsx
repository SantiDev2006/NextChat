import React from 'react'
import Link from 'next/link'
import { auth, signOut } from '@/auth'

export default async function Sidebar() {
  // 1. Fetch the active user session securely on the server
  const session = await auth();
  const user = session?.user;

  // 2. Set up fallbacks in case data is missing
  const displayName = user?.name || "Unknown User";
  const avatarImage = user?.image;

  // 3. Helper function to generate initials (e.g., "Santiago Peralta" -> "SP")
  const getInitials = (name: string) => {
    const nameArray = name.split(" ");
    if (nameArray.length >= 2) {
      return `${nameArray[0][0]}${nameArray[1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside className="flex flex-col w-72 bg-zinc-900 h-screen border-r border-zinc-800 shrink-0">
      <div className="flex h-14 items-center px-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100">
          Next<span className="text-indigo-500">Chat</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        
        {/* NEW: Find Friends Button */}
        <Link 
          href="/friends"
          className="flex w-full items-center gap-3 px-2 py-2 mb-4 rounded-md text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
        >
          <img 
            src="/svg/friends.svg" 
            alt="Find Friends" 
            className="w-5 h-5 opacity-70 invert" 
          />
          <span className="font-medium">Find Friends</span>
        </Link>

        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-2 mt-2">
          Direct Messages
        </p>

        {/* This is a placeholder for your future friends list */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-800 cursor-pointer group transition-colors">
          <div className="relative shrink-0">
            <div className="flex w-8 h-8 bg-indigo-500 rounded-full items-center justify-center text-sm font-medium text-white group-hover:ring-indigo-400 transition-all">
              JD
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-zinc-900"></div>
          </div>
          <span className="truncate font-medium text-zinc-300">John Doe (Mock)</span>
        </div>
      </div>

      {/* DYNAMIC: Current User Profile Section */}
      <div className="flex items-center justify-between h-18 bg-zinc-900 border-t border-zinc-800 p-3 shrink-0">
        <div className="flex items-center gap-3 truncate">
          
          {/* Automatically display Google Avatar or fallback initials */}
          {avatarImage ? (
            <img 
              src={avatarImage} 
              alt={displayName} 
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center w-9 h-9 bg-zinc-700 rounded-full text-sm font-medium text-zinc-300 shrink-0">
              {getInitials(displayName)}
            </div>
          )}

          <div className="flex flex-col truncate border-r border-zinc-700 pr-3">
            <span className="text-sm font-bold text-zinc-100 truncate">
              {displayName}
            </span>
            <span className="text-xs text-zinc-500">Online</span>
          </div>
        </div>

        {/* NEW: Server Action Logout Button */}
        <form action={async () => {
          "use server"
          await signOut()
        }}>
          <button 
            type="submit" 
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-md transition"
            title="Log out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    </aside>
  )
}