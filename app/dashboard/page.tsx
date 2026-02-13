"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: any;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      setBookmarks(data || []);

      channel = supabase
        .channel("bookmarks")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookmarks" },
          async () => {
            const { data } = await supabase
              .from("bookmarks")
              .select("*")
              .order("created_at", { ascending: false });

            setBookmarks(data || []);
          }
        )
        .subscribe();

      setLoading(false);
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [router]);

  const addBookmark = async () => {
    if (!title || !url) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

return (
  <div className="min-h-screen bg-black text-white flex flex-col">
    
    {/* Main Content */}
    <div className="flex-1">
      <div className="max-w-2xl mx-auto px-6 py-14 space-y-10">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            My Bookmarks
          </h1>
          <button
            onClick={logout}
            className="text-sm border border-white/20 px-4 py-1.5 rounded-md hover:bg-white hover:text-black transition-all duration-200"
          >
            Logout
          </button>
        </div>

        {/* Add Form */}
        <div className="flex gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="bg-black border border-white/20 px-4 py-2 rounded-md flex-1 focus:outline-none focus:border-white transition"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            className="bg-black border border-white/20 px-4 py-2 rounded-md flex-1 focus:outline-none focus:border-white transition"
          />
          <button
            onClick={addBookmark}
            className="border border-white px-5 py-2 rounded-md hover:bg-white hover:text-black transition-all duration-200"
          >
            Add
          </button>
        </div>

        {/* Bookmark List */}
        <div className="space-y-4">
          {bookmarks.length === 0 && (
            <p className="text-white/40 text-sm">
              No bookmarks added yet.
            </p>
          )}

          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="flex justify-between items-center border border-white/10 px-4 py-3 rounded-md hover:border-white/30 transition"
            >
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                {b.title}
              </a>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-white/60 hover:text-white transition text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="border-t border-white/10 py-6">
      <div className="max-w-2xl mx-auto px-6 text-center text-sm text-white/50">
        <p>
          Built by <span className="text-white font-medium">Subhranta Kumar</span>
        </p>
        <p className="mt-1">
          Fullstack Developer · React · Next.js · Supabase
        </p>
      </div>
    </footer>

  </div>
);
}