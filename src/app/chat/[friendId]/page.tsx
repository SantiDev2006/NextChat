import { getMessages, getOrCreateConversation } from '@/actions/chat';
import { auth } from '@/auth';
import ChatWindow from '@/components/ChatWindow';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function ChatPage({ params }: { params: { friendId: string } }) {
    const p = await params;
    const friendId = p.friendId;
    const session = await auth();
    if(!session?.user?.email) redirect("/");

    const currentUser = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    });

    if(!currentUser) redirect("/");

    const friend = await prisma.user.findUnique({
        where: {
            id: friendId,
        },
        select: {
            id: true,
            name: true,
            username: true,
            image: true,
        }
    });
    if(!friend) return <div className="p-8 text-zinc-400">User not found</div>;

    const convRes = await getOrCreateConversation(friendId);
    if(!convRes.conversation) return <div className="p-8 text-zinc-400">Something went wrong</div>;

    const msgRes = await getMessages(convRes.conversation.id);
    const initialMessages = msgRes.messages || [];

    const displayName = friend.name || friend.username || "Unknown User";

  return (
    <section className="flex-1 flex flex-col h-screen bg-zinc-900 min-w-0">

        <header className="flex h-14 items-center shrink-0
        border-b border-zinc-700 px-4 gap-4">
            {friend.image ? (
                <Image 
                    src={friend.image}
                    alt={displayName}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                />
            ): (
                <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-zinc-300">
                    {displayName.charAt(0).toUpperCase()}
                </div>
            )}
            <div className="flex flex-col">
                <span className="font-bold text-zinc-100">{displayName}</span>
            </div>
        </header>

        <ChatWindow 
            conversationId={convRes.conversation.id}
            currentUserId={currentUser.id}
            initialMessages={initialMessages}
        />
    </section>
  )
}
