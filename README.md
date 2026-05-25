# VoltMart — Electrical Items E-commerce (Next.js)

A modern e-commerce site for electrical items built with Next.js 14, Tailwind CSS, shadcn/ui and MongoDB.

## ✨ Features

- 🛍️ Product catalog (LED bulbs, fans, switches, wires, MCBs, tools)
- 🔍 Search & category filters
- 🛒 Persistent cart (saved in localStorage)
- 📦 Checkout flow with order confirmation
- 💾 MongoDB persistence (with **in-memory fallback** if MongoDB isn't available)
- 📱 Fully responsive design

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js 18 or higher
- (Optional) MongoDB running locally — if not available, the app uses an in-memory store automatically

### Steps

```bash
# 1. Install dependencies
yarn install

# 2. (Optional) Configure MongoDB
# Edit .env and set MONGO_URL — or leave as-is to use in-memory fallback

# 3. Start the dev server
yarn dev

# 4. Open http://localhost:3000
```

## ⚙️ Environment Variables (`.env`)

```env
MONGO_URL=mongodb://localhost:27017   # optional; falls back to memory if unreachable
DB_NAME=voltmart
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> 💡 **No MongoDB?** No problem — the app auto-detects and serves products from memory. Orders placed will live for the lifetime of the server process.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | Health check (shows MongoDB status) |
| GET | `/api/products` | List all products (supports `?category=` and `?search=`) |
| GET | `/api/products/:id` | Get a single product |
| GET | `/api/categories` | List distinct categories |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id` | Get a single order |

## 🔧 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Icons:** lucide-react
- **DB:** MongoDB (with in-memory fallback)
- **Notifications:** Sonner

## 📂 Project Structure

```
app/
├── api/[[...path]]/route.js   # All backend API routes
├── layout.js                  # Root layout
├── page.js                    # Main e-commerce UI
└── globals.css                # Global styles
components/ui/                 # shadcn components
.env                           # Environment variables
package.json
```

## 🪟 Windows Users

The `dev` script uses `cross-env` so commands work on Windows / Mac / Linux. Just run `yarn dev`.

## 📜 License

MIT
