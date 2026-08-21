import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await auth();

  if(!session){
    redirect("/login");
  }

  return (
    <section className="flex flex-col flex-1 min-w-0">
      <header className="flex h-14 items-center px-6 border-b border-zinc-700 bg-zinc-800 shrink-0 shadow-sm">
        <h2 className="text-xl font-bold text-zinc-100">Welcome</h2>
      </header>

      <div className="flex flex-col flex-1 justify-end p-6 gap-4 overflow-y-auto">
        <div className="text-center text-zinc-400 mt-auto mb-auto">
          <h3 className="text-2xl font-bold text-zinc-300 mb-2">Welcome to NextChat</h3>
          <p>Select a user on the left to start a conversation.</p>
        </div>
      </div>
    </section>
  );
}