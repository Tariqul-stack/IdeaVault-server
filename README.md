# 🚀 IdeaVault Server — REST API Backend

The backend REST API for **IdeaVault** — a startup idea sharing platform. Built with Node.js, Express.js, and MongoDB Atlas.

🌐 **Live API:** [https://ideavault-server-alpha.vercel.app](https://ideavault-server-alpha.vercel.app)  
💻 **Frontend Repo:** [IdeaVault-client](https://github.com/Tariqul-stack/IdeaVault-client)

---

## ✨ Key Features

- 🔐 **JWT-based Auth Verification** — Verifies BetterAuth session tokens on every protected route
- 💡 **Full Idea CRUD** — Create, read, update, and delete startup ideas with ownership validation
- 💬 **Comment System** — Add, edit, and delete comments with user-level permission control
- 🔖 **Bookmark System** — Save and manage bookmarked ideas per user
- 🔍 **Search & Filter** — Case-insensitive regex search by title, filter by category with pagination
- 📊 **Category Stats** — Aggregated idea counts per category using MongoDB aggregation pipeline

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| MongoDB Native Driver | Database queries (no Mongoose) |
| BetterAuth | Session token verification |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |
| nodemon | Development auto-restart |

---

## 📁 Project Structure

```
ideavault-server/
├── controllers/
│   ├── ideaController.js       ← Idea CRUD logic
│   ├── commentController.js    ← Comment CRUD logic
│   └── bookmarkController.js   ← Bookmark logic
├── middleware/
│   └── verifyToken.js          ← Auth token verification
├── routes/
│   ├── ideaRoutes.js           ← Idea + Comment routes
│   └── bookmarkRoutes.js       ← Bookmark routes
├── lib/
│   └── db.js                   ← MongoDB connection
├── .env                        ← Environment variables
└── index.js                    ← Express app entry point
```

---

## 🔗 API Endpoints

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health check |

### Ideas (Public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ideas` | Get all ideas (pagination, search, filter) |
| GET | `/api/ideas/categories/stats` | Get idea count per category |
| GET | `/api/ideas/:id` | Get single idea by ID |

### Ideas (Private 🔐)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ideas/my-ideas` | Get current user's ideas |
| POST | `/api/ideas` | Create new idea |
| PATCH | `/api/ideas/:id` | Update idea (owner only) |
| DELETE | `/api/ideas/:id` | Delete idea (owner only) |

### Comments (Public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ideas/:id/comments` | Get all comments for an idea |

### Comments (Private 🔐)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ideas/user/my-comments` | Get current user's comments |
| POST | `/api/ideas/:id/comments` | Add comment to an idea |
| PATCH | `/api/ideas/:id/comments/:commentId` | Update own comment |
| DELETE | `/api/ideas/:id/comments/:commentId` | Delete own comment |

### Bookmarks (Private 🔐)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookmarks` | Get user's bookmarks |
| POST | `/api/bookmarks` | Add bookmark |
| DELETE | `/api/bookmarks/:ideaId` | Remove bookmark |

---

## 🔑 Authentication

Every private route uses `verifyToken` middleware:

1. Extracts `Bearer` token from `Authorization` header
2. Sends token to BetterAuth `/api/auth/get-session` endpoint
3. If valid — attaches `req.user` with user info and calls `next()`
4. If invalid — returns `401 Unauthorized` or `403 Forbidden`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Running IdeaVault frontend (for BetterAuth session verification)

### Installation

```bash
# Clone the repository
git clone https://github.com/Tariqul-stack/IdeaVault-server.git
cd IdeaVault-server

# Install dependencies
npm install

# Create .env file
touch .env
# Fill in your environment variables (see below)

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ideavault
CLIENT_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
```

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 8000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLIENT_URL` | Frontend URL (for CORS) |
| `BETTER_AUTH_SECRET` | Same secret as frontend BetterAuth |
| `BETTER_AUTH_URL` | Frontend URL (for session verification) |

---

## 📊 Query Parameters

### GET /api/ideas

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 9) |
| `search` | string | Search by title (regex, case-insensitive) |
| `category` | string | Filter by category name |

**Example:**
```
GET /api/ideas?page=1&limit=6&search=AI&category=Technology
```

---

## 🌐 Deployment

Deployed on **Vercel** with the following config (`vercel.json`):

```json
{
  "version": 2,
  "builds": [{ "src": "index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "index.js" }]
}
```

---

## 👤 Author

**Tariqul Islam**

- GitHub: [Tariqul-stack](https://github.com/Tariqul-stack)
- Frontend: [IdeaVault-client](https://github.com/Tariqul-stack/IdeaVault-client)
- Live Site: [idea-vault-client-kohl.vercel.app](https://idea-vault-client-kohl.vercel.app)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).