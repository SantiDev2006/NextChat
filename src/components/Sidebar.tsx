import Link from 'next/link'
import { auth, signOut } from '@/auth'
import Image from 'next/image';
import logoutIcon from '@/public/svg/logout.svg';
import { prisma } from '@/lib/prisma';
import FriendsLink from './FriendsLink';
import SidebarFriends from './SidebarFriends';

export default async function Sidebar() {
  const session = await auth();
  const user = session?.user;

  // function to generate initials (e.g., "Santiago Peralta" -> "SP")
  const getInitials = (name: string) => {
    const nameArray = name.split(" ");
    if (nameArray.length >= 2) {
      return `${nameArray[0][0]}${nameArray[1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  let friends: any[] = [];
  let pendingCount = 0;

  let dbUser: Awaited<ReturnType<typeof prisma.user.findUnique>> | null = null;

  if(user?.email){
    dbUser = await prisma.user.findUnique({
      where: {email:user.email}
    });

    if (dbUser) {
      const currentUserId = dbUser.id;

      // count pending requests
      pendingCount = await prisma.friendRequest.count({
        where: {
          receiverId: currentUserId,
          status: "PENDING",
        }
      });

      // Get all accepted friendships
      const acceptedRequests = await prisma.friendRequest.findMany({
        where: {
          OR: [{
            senderId: currentUserId
          }, {
            receiverId: currentUserId
          }],
          status: "ACCEPTED"
        },
        include: {
          sender: true,
          receiver: true
        }
      });

      friends = acceptedRequests.map(
        req => req.senderId === currentUserId
        ? req.receiver
        : req.sender
      );
    }
  }

  // Set up fallbacks in case data is missing
  const displayName = dbUser?.name || dbUser?.username || user?.name || "Unknown User";
  const avatarImage = dbUser?.image || user?.image;

  return (
    <aside className="flex flex-col w-72 bg-zinc-900 h-screen border-r border-zinc-800 shrink-0">
      <Link href="/" className="flex h-14 items-center px-4 border-b border-zinc-800 hover:bg-zinc-800/50 transition">
        <h1 className="text-xl font-bold text-zinc-100">
          Next<span className="text-indigo-500">Chat</span>
        </h1>
      </Link>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <FriendsLink pendingCount={pendingCount}/>

        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-2 mt-2">
          Direct Messages
        </p>

        {/* friends list */}
        {dbUser && (
          <SidebarFriends friends={friends} currentUserId={dbUser.id} />
        )}
      </div>

      {/* User Profile Section */}
      <div className="flex items-center justify-between h-18 bg-zinc-900 border-t border-zinc-800 p-3 shrink-0">
        <div className="flex items-center gap-3 truncate">
          
          {/* Automatically display Google Avatar or fallback initials */}
          {avatarImage ? (
            <Image 
              src={avatarImage} 
              alt={displayName} 
              width={36}
              height={36}
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

        {/* Logout Button */}
        <form action={async () => {
          "use server"
          await signOut()
        }}>
          <button 
            type="submit" 
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-md transition"
            title="Log out"
          >
            <Image
            src={logoutIcon}
            alt='↦'
            width={18}
            height={18}/>
          </button>
        </form>
      </div>
    </aside>
  )
}