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

  // 🔐 Protect dashboard first
useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) router.push("/"); // redirect if not logged in
  };
  checkSession();
}, [router]);


  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel("realtime bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addBookmark = async () => {
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

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">My Bookmarks</h1>

      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 flex-1"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="border p-2 flex-1"
        />
        <button
          onClick={addBookmark}
          className="bg-green-600 text-white px-4"
        >
          Add
        </button>
      </div>

      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {bookmark.title}
          </a>
          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
