import { auth } from "@/auth";
import Link from "next/link";


export default async function Home() {
  const session = await auth();

  if(session){
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
    )
  }

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center bg-zinc-900 px-6 text-center overflow-hidden">

      <div className="absolute top-1/2 left-1/2 w-125 h-125 -translate-1/2 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="relative z-10 max-w-3xl space-y-8">
          <h1 className="animate-fade-in-down [animation-duration:2s] text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Next<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-500 bg-size-[200%_auto] animate-gradient">Chat</span>
          </h1>

          <p className="animate-subtitle mx-auto max-w-xl text-lg text-zinc-400 sm:text-xl">
            A real-time messaging platform built for speed and simplicity. 
            Connect with friends instantly without the bloat.
          </p>

          <div className="animate-buttons flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
            href="/signup"
            className="w-full bg-indigo-600 rounded-md px-8 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:bg-indigo-500 hover:-translate-1 hover:scale-105 active:scale-95 transition-all duration-300 sm:w-auto">
              Get Started
            </Link>
            <Link
            href="/login"
            className="w-full bg-zinc-800/80 backdrop-blur-sm rounded-md px-8 py-3 text-sm font-semibold text-white hover:bg-zinc-700 hover:-translate-1 hover:scale-105 active:scale-95 transition-all duration-300 sm:w-auto border border-zinc-700 hover:border-zinc-500">
              Log In
            </Link>
          </div>
        </div>
    </main>
  );
}