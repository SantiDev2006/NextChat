"use client"

import { registerUser } from "@/actions/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation"
import React, { useState } from "react";

export default function SignUp() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        const res = await registerUser(formData);

        if(res.error){
            setError(res.error);
            setLoading(false);
            return;
        }

        const singInRes = await signIn("credentials", {
            username,
            password,
            redirect: false
        });

        if (singInRes?.error) {
            setError("Account created, but failed to log in automatically.");
            setLoading(false);
        } else if(singInRes?.ok){
            router.push("/");
            router.refresh();
        }
    }
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full bg-zinc-900 p-4 overflow-hidden">

        {/* Subtle Ambient Background Glow */}
        <div className="absolute w-125 h-125 bg-indigo-600/20 top-1/2 left-1/2 -translate-full rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

        <div className="relative z-10 w-full bg-zinc-800/80 p-8 max-w-sm rounded-xl border border-zinc-700 shadow-2xl animate-fade-in-down">
            <h1 className="text-zinc-100 font-bold text-center text-2xl">
                Create an account
            </h1>

            <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 animate-buttons">
                {error && (
                    <div className="rounded-md bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400 text-center">
                        {error}
                    </div>
                )}

                <div>
                    <label
                    htmlFor="username"
                    className="block mb-1 text-sm font-medium text-zinc-300">
                        Username
                    </label>
                    <input 
                        type="text"
                        name="username"
                        id="username"
                        required
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-2 text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="Choose a username" />
                </div>
                
                <div>
                    <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium text-zinc-300">
                        Email
                    </label>
                    <input 
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-2 text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="you@example.com" />
                </div>

                <div>
                    <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-medium text-zinc-300">
                        Password
                    </label>
                    <input 
                        type="password"
                        name="password"
                        id="password"
                        required
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-2 text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                        placeholder="••••••••"
                        minLength={6} />
                </div>

                <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 mt-2 py-2 px-4 rounded-md font-semibold text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none transition-all duration-300">
                    {loading ? "Signing up..." : "Sign up"}
                </button>
            </form>

            <p className="text-sm text-center mt-6 text-zinc-400 animate-buttons">
                Already have an account?{" "}
                <Link
                href="/login"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Log in
                </Link>
            </p>
        </div>
    </main>
  )
}
