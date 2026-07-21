"use client";

import { useState } from "react";
import { searchUsers, sendFriendRequest } from "@/actions/user";

// this type matches what SearchUsers returns
type SearchResult = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
};

export default function AddFriend() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the Server Action directly!
      const users = await searchUsers(query);
      setResults(users);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (recerverId: string) => {
    const response = await sendFriendRequest(recerverId);

    if(response?.error){
      alert(response.error);
    } else if(response?.success){
      setSentRequests((prev)=> new Set(prev).add(recerverId));
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-zinc-800 p-6 shadow-lg border border-zinc-700">
      <h2 className="mb-4 text-xl font-bold text-zinc-100">Add a Friend</h2>
      
      {/* The Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or username..."
          className="grow rounded-md border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* The Results List */}
      <div className="flex flex-col gap-2">
        {results.length === 0 && !isLoading && (
          <p className="text-sm text-zinc-400 text-center py-4">No users found.</p>
        )}
        
        {results.map((user) => {
          const hasSent = sentRequests.has(user.id);

          return (
          <div 
            key={user.id} 
            className="flex items-center justify-between rounded-md bg-zinc-700/50 p-3"
          >
            <div className="flex items-center gap-3">
              {/* Fallback avatar if they don't have a Google image */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-600 text-zinc-200 font-bold">
                {user.image ? (
                  <img src={user.image} alt="Avatar" className="h-full w-full rounded-full" />
                ) : (
                  user.name?.charAt(0) || user.username?.charAt(0) || "?"
                )}
              </div>
              <div>
                <p className="font-medium text-zinc-100">{user.name || "Unknown"}</p>
                <p className="text-xs text-zinc-400">@{user.username || "nousername"}</p>
              </div>
            </div>
            
            <button
            onClick={()=>handleAddFriend(user.id)}
            disabled={hasSent}
            className={`rounded px-3 py-1 text-sm font-medium transition ${
              hasSent
              ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
              : "bg-zinc-600 text-zinc-200 hover:bg-zinc-500"
            }`}>
              {hasSent ? "Sent" : "Add"}
            </button>
          </div>
        );
        })}
      </div>
    </div>
  );
}