# FastForms 🚀

An AI-powered form builder that lets you create and edit Google Forms through natural conversation.

## 🎯 Overview

FastForms is a learning and portfolio project that demonstrates how AI can simplify form creation. Instead of manually building forms through Google Forms' interface, users can simply describe what they need and let AI handle the heavy lifting.

**Core Idea:** Chat → Google Form

## ✨ Features

- **AI-Powered Form Builder**: Describe your form requirements and AI generates it for you
- **Edit via Chat**: Modify existing Google Forms by chatting with the AI
- **Google Forms Integration**: Seamlessly create and manage Google Forms
- **User-Friendly Interface**: Intuitive chat-based experience
- **Quick Prototyping**: Rapidly create forms for surveys, quizzes, and feedback collection

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with Turbopack for fast development
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - High-quality React components
- **Lucide React** - Beautiful icon library

### Backend

- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe backend code
- **Express.js** - Lightweight web framework
- **ts-node** - TypeScript execution for Node

## 📂 Project Structure

```
FastForms/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Express server
│   ├── src/
│   │   └── index.ts        # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
cd FastForms
```

2. **Install Frontend Dependencies**

```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**

```bash
cd ../backend
npm install
```

### Running the Project

**Frontend (Development)**

```bash
cd frontend
npm run dev
```

Runs on `http://localhost:3000`

**Backend (Development)**

```bash
cd backend
npm run dev
```

Runs on `http://localhost:3000` (configure as needed)

**Build for Production**

Frontend:

```bash
cd frontend
npm run build
npm run start
```

Backend:

```bash
cd backend
npm run build
npm run serve
```

## 🎓 Learning Goals

This project is designed to help me learn and demonstrate:

- ✅ Full-stack web development (Next.js + Express.js)
- ✅ TypeScript and type-safe code
- ✅ API integration with Google Forms
- ✅ AI/LLM integration for natural language processing
- ✅ Building responsive UIs with modern frameworks
- ✅ Backend API development
- ✅ Database design and management (coming soon)

## 📝 Project Status

Currently in active development with the following phases:

- [x] Frontend scaffold with Next.js
- [x] Navigation and Hero components
- [ ] Backend API setup
- [ ] Google Forms API integration
- [ ] AI/LLM integration (Claude, GPT, etc.)
- [ ] Authentication (Google OAuth)
- [ ] Form management dashboard
- [ ] Database integration
- [ ] Testing suite

## 🔮 Future Enhancements

- Support for other form platforms (Typeform, Jotform, etc.)
- Advanced form customization through chat
- Form analytics and insights
- Template library
- Collaboration features
- Mobile app

## 📚 Resources Used

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Google Forms API](https://developers.google.com/forms/api)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI Components](https://ui.shadcn.com/)

## 🤝 Contributing

This is a personal learning project, but feedback and suggestions are welcome!

## 📄 License

This project is open for educational purposes.

---

**Note**: This is an active learning project. Code and documentation will be updated as the project evolves.
