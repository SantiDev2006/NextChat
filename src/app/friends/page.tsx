import AddFriend from '@/components/AddFriend'

export default function FriendsPage() {
  return (
    <section className='flex flex-1 min-w-0 h-full flex-col bg-zinc-900'>
        <header className="flex h-14 shrink-0 items-center border-b border-zinc-700 bg-zinc-800 px-6 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-100">Friends</h2>
        </header>

        <div className="flex flex-1 items-start justify-center p-6 overflow-y-auto">
            <AddFriend/>
        </div>
    </section>
  )
}
