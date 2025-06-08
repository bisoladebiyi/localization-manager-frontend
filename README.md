# 🌐 Localization Manager — Frontend

This is the frontend for the Localization Manager, built with **Next.js**, **Tailwind CSS**, and **Zustand** for global state management. It allows users to manage, edit, and translate localization keys across multiple (fixed) languages.

---

## 🌟 Features

- View and edit localization keys
- Delete localization keys
- Input translations for multiple languages
- Auto-save on blur with visual feedback
- State management with Zustand
- Toast notifications for actions

---

## ⚙️ Tech Stack

- **Next.js** — React framework
- **Tailwind CSS** — Utility-first styling
- **Zustand** — Lightweight state management
- **Axios** — API communication
- **React Toastify** — Notification system
- **TypeScript** — Type safety

---

## 🌐 Live Site
[Live Link](https://localization-manager-frontend.vercel.app/)

## 📦 Installation

```bash
git clone https://github.com/bisoladebiyi/localization-manager-frontend.git
npm install
```

## 🔐 Environment Variables

Create your `.env` file in root folder

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## ▶️ Running the App

```bash
npm run dev
```

## ✅ Testing

```bash
npm test
```
**Tests cover:**

- Component render tests  