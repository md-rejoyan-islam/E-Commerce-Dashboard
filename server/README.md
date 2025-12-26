<div align="center">

# 🛒 ECO Server

### Enterprise-Grade E-Commerce Backend API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

<p align="center">
  <strong>A robust, scalable, and feature-rich REST API powering modern e-commerce applications</strong>
</p>

---

[Features](#-features) • [Tech Stack](#-tech-stack) • [API Modules](#-api-modules) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation)

</div>

## ✨ Features

<table>
<tr>
<td>

### 🔐 Authentication & Security

- JWT-based authentication with refresh tokens
- Role-based access control (User, Admin, Superadmin)
- Password hashing with bcrypt
- Rate limiting & request validation

</td>
<td>

### 📦 Product Management

- Multi-variant product support
- Dynamic inventory tracking
- Category & brand organization
- Image upload with Multer

</td>
</tr>
<tr>
<td>

### 🛍️ Order Processing

- Complete order lifecycle management
- Order tracking with status updates
- Cancellation & return handling
- Refund processing

</td>
<td>

### 📊 Analytics & Reporting

- Sales analytics with time series
- Revenue comparison (weekly/monthly)
- Top products & low stock alerts
- Category-wise sales breakdown

</td>
</tr>
<tr>
<td>

### 🎯 Marketing Tools

- Campaign management
- Coupon system with validation
- Special offers (BOGO, discounts)
- Banner management

</td>
<td>

### 🏪 Store Management

- Multi-store support
- Store location management
- Wishlist & cart functionality
- Review & FAQ system

</td>
</tr>
</table>

## 🛠️ Tech Stack

| Category           | Technologies                  |
| ------------------ | ----------------------------- |
| **Runtime**        | Node.js 20+                   |
| **Framework**      | Express.js 5.0                |
| **Language**       | TypeScript 5.0                |
| **Database**       | MongoDB with Mongoose         |
| **Validation**     | Zod                           |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **File Upload**    | Multer                        |
| **Logging**        | Winston with Daily Rotate     |
| **Monitoring**     | Prometheus Metrics            |
| **Documentation**  | OpenAPI 3.1 / Swagger UI      |
| **Code Quality**   | ESLint + Prettier + Husky     |

## 📦 API Modules

```
📁 src/modules/
├── 🔐 auth/          # Authentication & session management
├── 👤 user/          # User management (Admin)
├── 📂 category/      # Product categories
├── 🏷️ brand/         # Product brands
├── 📦 product/       # Products, variants, reviews, FAQs
├── 🛒 cart/          # Shopping cart
├── ❤️ wishlist/      # User wishlist
├── 📋 order/         # Order processing & tracking
├── 🏪 store/         # Store management
├── 🖼️ banner/        # Marketing banners
├── 🎯 campaign/      # Marketing campaigns
├── 🎟️ coupon/        # Discount coupons
├── 🎁 offer/         # Special offers
└── 📊 analytics/     # Analytics & reporting
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB 7+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to server directory
cd server

# Install dependencies
pnpm install

# Set up environment variables
cp .env.sample .env

# Start development server
pnpm dev
```

### Environment Variables

```env
# Server
PORT=5050
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ecommerce

# JWT
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=300000
UPLOAD_PATH=./public/uploads
```

### Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `pnpm dev`        | Start development server with hot reload |
| `pnpm build`      | Build for production                     |
| `pnpm start`      | Start production server                  |
| `pnpm lint`       | Run ESLint                               |
| `pnpm lint:fix`   | Fix ESLint errors                        |
| `pnpm format`     | Check code formatting                    |
| `pnpm format:fix` | Fix code formatting                      |
| `pnpm seed`       | Seed database with sample data           |

## 📖 API Documentation

### Swagger UI

Access interactive API documentation at:

```
http://localhost:5050/docs
```

### API Endpoints Overview

| Module     | Base Path            | Description              |
| ---------- | -------------------- | ------------------------ |
| Auth       | `/api/v1/auth`       | Authentication & profile |
| Users      | `/api/v1/users`      | User management          |
| Products   | `/api/v1/products`   | Product catalog          |
| Categories | `/api/v1/categories` | Product categories       |
| Brands     | `/api/v1/brands`     | Product brands           |
| Cart       | `/api/v1/carts`      | Shopping cart            |
| Wishlist   | `/api/v1/wishlist`   | User wishlist            |
| Orders     | `/api/v1/orders`     | Order processing         |
| Analytics  | `/api/v1/analytics`  | Reports & analytics      |
| Stores     | `/api/v1/stores`     | Store management         |
| Banners    | `/api/v1/banners`    | Marketing banners        |
| Campaigns  | `/api/v1/campaigns`  | Campaigns                |
| Coupons    | `/api/v1/coupons`    | Discount coupons         |
| Offers     | `/api/v1/offers`     | Special offers           |

## 📁 Project Structure

```
server/
├── 📁 data/              # Seed data & scripts
├── 📁 docs/              # OpenAPI documentation
├── 📁 public/            # Static files & uploads
├── 📁 src/
│   ├── 📁 app/           # Express app configuration
│   ├── 📁 middlewares/   # Custom middlewares
│   ├── 📁 modules/       # Feature modules
│   ├── 📁 routes/        # Route definitions
│   ├── 📁 utils/         # Utility functions
│   └── 📄 server.ts      # Application entry point
├── 📄 .env.sample        # Environment template
├── 📄 package.json       # Dependencies
└── 📄 tsconfig.json      # TypeScript config
```

## 🔒 Security Features

- 🔑 JWT authentication with token refresh
- 🛡️ Role-based access control (RBAC)
- 🚫 Rate limiting on sensitive endpoints
- ✅ Input validation with Zod schemas
- 🔐 Password hashing with bcrypt
- 🍪 Secure cookie handling
- 📝 Request logging & monitoring

---

<div align="center">

## 📄 License

**PROPRIETARY - ALL RIGHTS RESERVED**

Copyright © 2024-2025 [Md Rejoyan Islam](mailto:rejoyanislam0014@gmail.com)

This software is proprietary. Unauthorized use is prohibited.

---

<sub>Part of the [ECO E-Commerce Platform](../README.md)</sub>

</div>
