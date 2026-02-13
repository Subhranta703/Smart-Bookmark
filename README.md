# Smart Bookmark Manager

A secure, real-time bookmark management application built with Next.js and Supabase.

🔗 **Live App:**  
https://smart-bookmark-vert.vercel.app

---

## 🚀 Features

- Google OAuth authentication
- Private user-specific bookmarks
- Add & delete bookmarks
- Real-time sync across tabs
- Row-Level Security (RLS) enforced at database level
- Minimal black & white UI

---

## 🛠 Tech Stack

- Next.js (App Router)
- Supabase (Auth, PostgreSQL, Realtime)
- Tailwind CSS
- Vercel Deployment

---

## 🔐 Security

Row-Level Security ensures users can only access their own bookmarks:

sql
using (auth.uid() = user_id);

All data isolation is enforced at the database layer.

⚡ Realtime

Supabase Realtime listens to database changes and updates the UI instantly across open sessions.

📸 Preview
<p align="center"> <img src="./public/Screenshot.png" width="800" /> </p>
👨‍💻 Author

Subhranta Kumar
Fullstack Developer



