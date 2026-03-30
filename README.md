# ☁️ Cloud Drive — Frontend

A modern cloud file storage web application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌐 Live URL
**https://cloud-drive-frontend-ten.vercel.app**

## 🛠️ Tech Stack
| Technology | Purpose |
|-----------|---------|
| Next.js 14 (App Router) | React Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| TanStack Query | Server State |
| Axios | HTTP Client |
| Supabase JS | OAuth Client |
| Lucide React | Icons |
| Vercel | Deployment |

## ✅ Features

### 🔐 Authentication
- Email/Password login & register
- Google OAuth (one-click)
- Forgot/Reset password via email
- JWT token with localStorage
- Profile management with avatar

### 📁 File Management
- Drag & drop file upload
- Real-time upload progress bar
- File preview (images, PDFs, video, audio)
- Image zoom & rotate
- Rename, move, delete files
- Drag & drop to move into folders

### 🗂️ Folder Management
- Create, rename, delete folders
- Nested folder navigation
- Breadcrumb navigation
- Drag & drop organization

### 🔍 Search & Sort
- Real-time search across files & folders
- Click result to preview file
- Sort by Name / Date / Size / Type
- Grid / List view toggle

### 🔗 Sharing
- Share with user (View/Edit)
- Revoke access
- Shared with Me page
- Public share links
- Link expiry + password protection
- Public share page (no login)

### 📊 Dashboard
- Google Drive style layout
- Recent files quick access
- Storage indicator
- Activity log
- Dark/Light theme

### 📱 UI/UX
- Responsive design (mobile + desktop)
- Dark/Light theme toggle
- Smooth animations
- Loading skeletons

## 📁 Project Structure
```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx           # Main dashboard
│   │   ├── activity/          # Activity log
│   │   ├── profile/           # User profile
│   │   ├── recent/            # Recent files
│   │   ├── shared/            # Shared with me
│   │   ├── starred/           # Starred items
│   │   └── trash/             # Trash
│   ├── auth/callback/         # OAuth callback
│   ├── login/                 # Login page
│   ├── register/              # Register page
│   ├── forgot-password/       # Forgot password
│   ├── reset-password/        # Reset password
│   └── share/[token]/         # Public share page
├── components/
│   ├── files/
│   │   ├── FileGrid.tsx       # File grid/list
│   │   ├── FilePreviewModal.tsx
│   │   ├── ShareModal.tsx
│   │   ├── LinkModal.tsx
│   │   └── UploadModal.tsx
│   ├── folders/
│   │   ├── FolderGrid.tsx
│   │   └── NewFolderModal.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Toolbar.tsx
│   └── search/
│       └── SearchBar.tsx
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── useFiles.ts
│   └── useFolders.ts
└── lib/
    └── api.ts                 # Axios instance
```

## 🔧 Local Setup
```bash
# Clone
git clone https://github.com/shishvishwakarma995-png/cloud-drive-frontend
cd cloud-drive-frontend

# Install
npm install --legacy-peer-deps

# Environment
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Development
npm run dev

# Build
npm run build
```

## 🔑 Environment Variables
```env
NEXT_PUBLIC_API_URL=https://cloud-drive-backend-n66o.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📱 Pages
| Route | Description |
|-------|-------------|
| / | Landing page |
| /login | Sign in |
| /register | Create account |
| /forgot-password | Reset email |
| /reset-password | New password |
| /dashboard | Main file manager |
| /dashboard/recent | Recent files |
| /dashboard/starred | Starred items |
| /dashboard/shared | Shared with me |
| /dashboard/trash | Deleted items |
| /dashboard/activity | Activity log |
| /dashboard/profile | User profile |
| /share/[token] | Public share |
| /auth/callback | OAuth callback |

## 🚀 Deployment
- **Platform:** Vercel
- **Auto-deploy:** Push to main branch
- **Build:** `npm run build`
- **Framework:** Next.js (auto-detected)