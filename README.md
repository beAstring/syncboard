# SyncBoard 📋

SyncBoard is a modern, high-performance project management application designed to streamline team collaboration and issue tracking. Built with a focus on speed and developer experience, it provides a highly responsive Kanban interface for managing tasks, tracking deadlines, and coordinating team efforts.

## 🚀 Tech Stack

This project is built using modern full-stack web technologies to ensure type safety, scalability, and a flawless user experience.

- **Framework:** [Next.js](https://nextjs.org/) (App Router & Server Actions)
- **Language:** TypeScript
- **Database:** PostgreSQL (Hosted on [Neon](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** Tailwind CSS
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)

## ✨ Core Features (MVP)

SyncBoard implements a complete, end-to-end project management workflow.

### 🔐 Authentication & Security

- **Secure Authentication:** Passwordless and OAuth login flows powered by Clerk.
- **Database Synchronization:** Automated user profile syncing between Clerk and the Neon database.

### 🏢 Workspace Management

- **Project Boards:** Create dedicated project spaces with specific titles, descriptions, and overarching deadlines.
- **Invite System:** Seamlessly onboard team members by generating unique, secure invite links for specific projects.
- **Dashboard Overview:** A centralized hub to view all owned and joined projects at a glance, including quick-status task counts.

### 🎯 Issue Tracking & Kanban

- **Interactive Kanban Board:** Drag-and-drop interface to move tasks fluidly between columns (To Do, In Progress, Done).
- **Comprehensive Task Details:** Create tasks with titles, descriptions, status tracking, priority levels, and individual deadlines.
- **Task Assignment:** Assign specific tickets to team members within a project.

### 💬 Collaboration

- **Issue Comments:** Dedicated discussion threads on every individual task.
- **In-App Notifications:** Real-time alerts when a user is assigned to a new task or mentioned in a comment thread.

## 🌟 Advanced Features

Beyond standard issue tracking, SyncBoard includes several advanced features that elevate the user experience:

- **Rich Text Formatting:** Issue descriptions support rich text editing (bolding, lists, code blocks) via integrated editor components.
- **Dynamic Board Filtering:** Instantly declutter the Kanban board by filtering tasks assigned only to you.
- **Role-Based Access Control (RBAC):** Distinct `ADMIN` and `MEMBER` roles. Project creators maintain administrative control over project deletion and member management, while members collaborate on tasks.

## 💻 Local Development Setup

