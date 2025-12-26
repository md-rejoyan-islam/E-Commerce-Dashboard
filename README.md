<div align="center">

# 🛒 ECO

### Enterprise E-Commerce Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<p align="center">
  <strong>A full-stack, production-ready e-commerce solution with modern technologies</strong>
</p>

---

[Overview](#-overview) • [Projects](#-projects) • [Quick Start](#-quick-start) • [Features](#-features) • [License](#-license)

</div>

## 🌟 Overview

ECO is a comprehensive e-commerce platform built with modern technologies, featuring:

- **🛒 Backend API** - Enterprise-grade REST API with Express.js & MongoDB
- **🎛️ Admin Dashboard** - Beautiful Next.js admin panel with analytics

## 📦 Projects

<table>
<tr>
<td width="50%">

### 🖥️ [Server](./server/README.md)

Enterprise-grade backend API powering the platform.

**Tech Stack:**

- Express.js 5.0
- MongoDB + Mongoose
- TypeScript
- JWT Authentication
- OpenAPI 3.1

**Key Features:**

- 14 API modules
- Role-based access control
- File upload handling
- Analytics & reporting

[📖 View Documentation →](./server/README.md)

</td>
<td width="50%">

### 🎛️ [Dashboard](./dashboard/README.md)

Modern admin dashboard for platform management.

**Tech Stack:**

- Next.js 16
- React 19
- Tailwind CSS 4.0
- Redux Toolkit

**Key Features:**

- Real-time analytics
- Product management
- Order tracking
- Marketing tools

[📖 View Documentation →](./dashboard/README.md)

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB 7+
- pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd eco

# Install all dependencies
pnpm install:all

# Set up environment variables
cp server/.env.sample server/.env
cp dashboard/.env.example dashboard/.env.local

# Start development (both server & dashboard)
pnpm dev
```

### Available Scripts

| Command            | Description                   |
| ------------------ | ----------------------------- |
| `pnpm install:all` | Install all dependencies      |
| `pnpm dev`         | Start both server & dashboard |
| `pnpm build`       | Build both projects           |
| `pnpm start`       | Start production servers      |

## ✨ Features

<table>
<tr>
<td>

### 🔐 Authentication

- JWT with refresh tokens
- Role-based access (User/Admin/Superadmin)
- Secure password hashing
- Session management

</td>
<td>

### 📦 Product Management

- Multi-variant products
- Dynamic pricing
- Inventory tracking
- Image galleries

</td>
</tr>
<tr>
<td>

### 🛍️ Order System

- Complete order lifecycle
- Status tracking
- Cancellation & returns
- Refund processing

</td>
<td>

### 📊 Analytics

- Sales dashboards
- Revenue reports
- Top products
- Performance metrics

</td>
</tr>
<tr>
<td>

### 🎯 Marketing

- Campaign management
- Coupon system
- Special offers
- Banner management

</td>
<td>

### 🏪 Store Features

- Multi-store support
- Category management
- Brand management
- Wishlist & cart

</td>
</tr>
</table>

## 🏗️ Architecture

```
eco/
├── 📁 server/              # Backend API (Express.js)
│   ├── src/modules/        # Feature modules (14 modules)
│   ├── src/middlewares/    # Auth, validation, error handling
│   └── docs/               # OpenAPI documentation
│
├── 📁 dashboard/           # Admin Dashboard (Next.js)
│   ├── app/                # App Router pages
│   ├── components/         # UI components
│   └── lib/features/       # RTK Query API slices
│
├── 📄 package.json         # Workspace configuration
└── 📄 LICENSE              # Proprietary license
```

## 📡 API Endpoints

| Category   | Endpoints | Description                 |
| ---------- | --------- | --------------------------- |
| Auth       | 7         | Authentication & sessions   |
| Users      | 7         | User management             |
| Products   | 20+       | Products, variants, reviews |
| Categories | 7         | Category management         |
| Brands     | 6         | Brand management            |
| Cart       | 8         | Shopping cart               |
| Orders     | 13        | Order processing            |
| Analytics  | 7         | Reports & metrics           |
| Marketing  | 18        | Campaigns, coupons, offers  |

## 🔧 Tech Stack

### Backend

- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.0
- **Database:** MongoDB with Mongoose
- **Validation:** Zod
- **Documentation:** OpenAPI 3.1 / Swagger

### Frontend

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Tailwind CSS 4.0
- **Components:** shadcn/ui + Radix UI
- **State:** Redux Toolkit + RTK Query
- **Forms:** React Hook Form + Zod

---

<div align="center">

## 📄 License

### PROPRIETARY - ALL RIGHTS RESERVED

Copyright © 2024-2025 **Md Rejoyan Islam**

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit written permission from the owner.

See the [LICENSE](LICENSE) file for full terms.

---

### 📬 Contact

For licensing inquiries: [rejoyanislam0014@gmail.com](mailto:rejoyanislam0014@gmail.com)

---

<sub>Made with ❤️ by Md Rejoyan Islam</sub>

</div>
