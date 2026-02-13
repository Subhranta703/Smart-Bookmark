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

## 🔐 Security (Row-Level Security)

All bookmarks are protected using database-level Row-Level Security (RLS).

Users can only:

- View their own bookmarks
- Insert bookmarks linked to their user_id
- Delete their own bookmarks

Example policy:

```sql
using (auth.uid() = user_id);
```
This ensures strict data isolation at the database layer.

⚡ Realtime

Supabase Realtime listens to PostgreSQL changes and updates the UI instantly across open tabs using:

postgres_changes subscription

Any insert or delete event triggers an automatic UI refresh.

🧠 Challenges Faced & Solutions
1️⃣ Google OAuth "Unable to exchange external code"

Issue:
OAuth login failed during deployment with a token exchange error.

Solution:
Aligned Supabase Site URL, Redirect URLs, and Google OAuth Authorized Origins properly. The issue was caused by mismatched domain configuration between local and production environments.

2️⃣ Session Persistence in Next.js App Router

Issue:
Session was not persisting after OAuth redirect, causing dashboard flashes.

Solution:
Switched to Supabase Auth Helpers for Next.js to properly handle session storage and OAuth redirects in App Router.

3️⃣ Realtime Subscription Cleanup

Issue:
Potential memory leaks when navigating away from the dashboard.

Solution:
Ensured realtime channels are properly unsubscribed inside useEffect cleanup.

📸 Preview
<p align="center"> <img src="./public/Screenshot.png" width="800" /> </p>
👨‍💻 Author

Subhranta Kumar
Fullstack Developer
