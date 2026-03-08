# 🐛 WormGPT

A sleek, modern AI chat interface powered by DeepSeek — built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Real-time AI chat** — Conversational interface with DeepSeek API integration
- **Rich Markdown rendering** — Full GFM support: tables, task lists, code blocks, strikethrough, and more
- **Syntax-highlighted code** — Beautiful code blocks with language detection
- **Typewriter effect** — Smooth word-by-word reveal for AI responses
- **Responsive design** — Works flawlessly on desktop and mobile
- **Dark theme** — Easy on the eyes, built for late-night sessions

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Markdown | react-markdown + remark-gfm |
| Animation | Motion (Framer Motion) |
| AI Backend | DeepSeek API |

## 🚀 Getting Started

```sh
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/       # UI components (ChatMessage, PromptInput, CodeBlock)
├── hooks/            # Custom React hooks
├── lib/              # Utilities & API integration (DeepSeek)
├── pages/            # Route pages (Index, NotFound)
└── index.css         # Design system tokens & global styles
```

## 📝 License

MIT
