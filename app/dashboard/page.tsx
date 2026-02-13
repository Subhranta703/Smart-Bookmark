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
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <button onClick={logout} className="text-red-500">
          Logout
        </button>
      </div>

      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 flex-1 rounded"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={addBookmark}
          className="bg-green-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex justify-between items-center border p-3 rounded"
        >
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {b.title}
          </a>
          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}