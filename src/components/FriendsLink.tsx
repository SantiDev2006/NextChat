"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FriendsIcon from "@/public/svg/friends.svg";


export default function FriendsLink({pendingCount}: {pendingCount: number}) {
    const pathname = usePathname();
    const isActive = pathname === "/friends"
  return (
    <Link
    href={isActive ? "#" : "/friends"}
    className={`flex w-full items-center justify-between px-2 py-2 mb-4 rounded-md transition group ${
        isActive
        ? "bg-zinc-800 text-zinc-100 pointer-events-none"
        : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
    }`}
    aria-disabled={isActive}>
        <div className="flex items-center gap-3">
            <Image 
                src={FriendsIcon}
                alt="𐦂𖠋"
                width={20}
                height={20}
                className={`transition-opacity ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
            />
            <span className="font-medium">Friends</span>
        </div>

        {pendingCount > 0 && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow-sm">
                {pendingCount}
            </div>
        )}
    </Link>
  )
}
