import { signIn } from "@/auth";

export default function Login() {
  return (
      <main className="flex min-h-screen w-full items-center justify-center bg-zinc-900 p-4">
        <div className="w-full max-w-sm rounded-xl bg-zinc-800 p-8 shadow-lg border border-zinc-700">
          <h1 className="mb-6 text-center text-2xl font-bold text-zinc-100">
            NextChat Login
          </h1>

          {/* Google OAuth Provider */}
          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
            className="mb-6"
          >
            <button
              type="submit"
              className="w-full rounded-md bg-red-600 py-2 px-4 font-semibold text-white transition hover:bg-red-700"
            >
              Sign in with Google
            </button>
          </form>

          <div className="relative mb-6 flex items-center py-2">
            <div className="grow border-t border-zinc-600"></div>
            <span className="mx-4 shrink text-sm text-zinc-400">or</span>
            <div className="grow border-t border-zinc-600"></div>
          </div>

          {/* Credentials Provider */}
          <form
            action={async (formData) => {
              "use server"
              await signIn("credentials", formData)
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                Username
              </label>
              <input
                name="username"
                type="text"
                required
                className="w-full rounded-md border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:border-blue-500 focus:outline-none"
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
              className="mt-2 w-full rounded-md bg-blue-600 py-2 px-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Sign in
            </button>
          </form>
        </div>
      </main>
    );
}
