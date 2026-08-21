"use client"

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import GoogleIcon from "@/public/svg/google.svg"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false
    });

    if(res?.error) {
      setError("Invalid username or password.");
      setLoading(false);
    } else if(res?.ok){
      router.push("/");
      router.refresh();
    }
  }

  return (
      <main className="flex min-h-screen w-full items-center justify-center bg-zinc-900 p-4">
        <div className="w-full max-w-sm rounded-xl bg-zinc-800 p-8 shadow-lg border border-zinc-700">
          <h1 className="mb-6 text-center text-2xl font-bold text-zinc-100">
            Next<span className="text-indigo-500">Chat</span> Login
          </h1>

          {/* Google OAuth Provider */}
          <button
          onClick={()=> signIn("google", {callbackUrl:"/"})}
          className="flex w-full mb-6 py-2 px-4 rounded-md bg-white text-zinc-900 font-semibold transition hover:bg-zinc-200 items-center justify-center gap-2">
            <Image
            src={GoogleIcon}
            alt="G"
            width={18}
            height={18}/>
            Sign in with Google
          </button>

          <div className="relative mb-6 flex items-center py-2">
            <div className="grow border-t border-zinc-600"></div>
            <span className="mx-4 shrink text-sm text-zinc-400">or</span>
            <div className="grow border-t border-zinc-600"></div>
          </div>

          {/* Credentials Provider */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            
            {error && (
              <div className="rounded-md bg-red-500/50 border border-red-500/50 p-3 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                Username
              </label>
              <input
                name="username"
                type="text"
                required
                className="w-full rounded-md border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-md border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-blue-600 py-2 px-4 font-semibold text-white transition hover:bg-blue-700"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-400 text-center">
            New to NextChat?{" "}
            <Link
            href="/signup"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    );
}
