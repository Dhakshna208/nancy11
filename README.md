# TruthLens — AI-Powered Image Verification System

![TruthLens](https://img.shields.io/badge/TruthLens-Image%20Verification-blue?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

A full-stack MERN application for detecting AI-generated and manipulated images using advanced AI analysis and reverse image search.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## About

**TruthLens** is an innovative solution to combat image misinformation and deepfakes. In an era where visual content is easily manipulated, TruthLens provides reliable, AI-powered image verification for:

- 📰 News organizations and journalists
- 👥 Social media platforms and content creators
- 🔐 Legal and compliance teams
- 👤 General public and individuals

---

## Features

### Image Upload
- Drag-and-drop and file browser selection
- Multiple format support: JPG, PNG, WebP, GIF
- File size validation (up to 10 MB)
- Real-time upload progress

### AI Analysis
- **AI Detection** — identifies AI-generated images with confidence scores
- **Manipulation Detection** — face manipulation, text overlay, copy-move, and blur analysis
- Confidence metrics (0–100%) with detailed breakdowns

### Reverse Image Search
- Find similar images across the internet
- Identify original sources and track historical usage
- Social media presence detection

### Results Display
- Visual confidence bars with color-coded status (Safe / Suspicious / Detected)
- Comprehensive metrics breakdown and actionable recommendations
- Export results functionality

### History Management
- Complete analysis history with pagination
- Filter and search capabilities
- Re-analyze previous images with detailed timestamps and metadata

### Error Handling
- Graceful API failure handling with user-friendly messages
- Automatic retry mechanisms and service health checks
- Fallback responses for degraded service states

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, CSS3, Axios, JavaScript ES6+ |
| **Backend** | Node.js, Express.js, MongoDB, Multer, CORS |
| **External APIs** | Sightengine (AI & manipulation detection), SerpApi (reverse image search) |
| **Dev Tools** | Git, npm, Postman, VS Code |

---

## Project Structure

```
nancyfinal/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── ResultsDisplay.jsx
│   │   │   ├── History.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── components.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express Backend
│   ├── models/
│   │   └── Analysis.js
│   ├── routes/
│   │   ├── analysis.js
│   │   ├── upload.js
│   │   └── search.js
│   ├── services/
│   │   ├── sightengine.js
│   │   ├── serpapi.js
│   │   └── imageProcessor.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── config/
│   │   └── database.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## Installation

### Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn**
- **MongoDB** (local instance or Atlas cluster)
- API keys for **Sightengine** and **SerpApi**

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/Dhakshna208/nancyfinal.git
cd nancyfinal
```

**2. Install server dependencies**

```bash
cd server
npm install
```

**3. Install client dependencies**

```bash
cd ../client
npm install
```

**4. Configure environment variables** — see [Configuration](#configuration) below.

---

## Configuration

### Server — `server/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/truthlens
MONGODB_NAME=truthlens

# API Keys
SIGHTENGINE_API_KEY=your_sightengine_key
SIGHTENGINE_USER_ID=your_sightengine_user_id
SERPAPI_API_KEY=your_serpapi_key

# CORS
CLIENT_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_FOLDER=./uploads
```

### Client — `client/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
```

### MongoDB Setup

**Local:** Run `mongod` — MongoDB defaults to `localhost:27017`.

**Atlas (recommended):** Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), copy the connection string, and paste it into `MONGODB_URI`.

### API Keys

| Service | Sign-up URL | Variables needed |
|---|---|---|
| Sightengine | [sightengine.com](https://sightengine.com) | `SIGHTENGINE_USER_ID`, `SIGHTENGINE_API_KEY` |
| SerpApi | [serpapi.com](https://serpapi.com) | `SERPAPI_API_KEY` |

---

## Usage

### Development

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client
npm run dev
```

### Production

```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
NODE_ENV=production npm start
```

---

## API Reference

**Base URL:** `http://localhost:5000/api`

### Endpoints

#### `POST /api/analysis/upload`

Upload and analyze an image.

**Content-Type:** `multipart/form-data`  
**Body:** `file` — the image file

**Success response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "analysisResults": {
      "aiDetection": {
        "isAiGenerated": false,
        "confidence": 15,
        "details": { "aiLevel": "low" }
      },
      "manipulationDetection": {
        "isManipulated": false,
        "manipulationTypes": [],
        "confidence": 8
      },
      "reverseSearch": {
        "similarImages": [
          {
            "source": "example.com",
            "title": "Sample Image",
            "url": "https://example.com/image.jpg"
          }
        ],
        "sources": ["example.com"],
        "matchPercentage": 95
      }
    },
    "status": "completed",
    "uploadDate": "2026-03-16T10:30:00Z"
  }
}
```

#### `GET /api/analysis/history?page=1&limit=10`

Retrieve paginated analysis history.

#### `GET /api/analysis/:id`

Retrieve a single analysis by ID.

#### `DELETE /api/analysis/:id`

Delete an analysis record.

### Supported File Types

- JPEG / JPG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)
- GIF (`.gif`)

**Maximum file size:** 10 MB (recommended: < 5 MB for faster processing)

---

## Database Schema

```javascript
{
  _id: ObjectId,
  userId: String,
  imageName: String,
  uploadDate: Date,
  analysisResults: {
    aiDetection: {
      isAiGenerated: Boolean,
      confidence: Number,           // 0–100
      details: {
        aiLevel: String,            // "low" | "medium" | "high"
        description: String
      }
    },
    manipulationDetection: {
      isManipulated: Boolean,
      manipulationTypes: [String],  // "face" | "text" | "copy-move" | etc.
      confidence: Number,
      details: Object
    },
    reverseSearch: {
      similarImages: [
        {
          source: String,
          title: String,
          url: String,
          matchPercentage: Number
        }
      ],
      sources: [String],
      matchPercentage: Number
    }
  },
  status: String,                   // "pending" | "completed" | "error"
  errorMessage: String,
  timestamp: Date,
  ipAddress: String,
  metadata: {
    fileSize: Number,
    dimensions: { width: Number, height: Number },
    format: String
  }
}
```

**Indexes:**
```javascript
db.analyses.createIndex({ uploadDate: -1 })
db.analyses.createIndex({ userId: 1, uploadDate: -1 })
db.analyses.createIndex({ status: 1 })
```

---

## Development

### Running Tests

```bash
# Backend
cd server && npm test

# Frontend
cd client && npm test
```

### Adding a New Feature

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Make and test your changes

# 3. Commit with a clear message
git commit -m "feat: describe what you added"

# 4. Push and open a pull request
git push origin feature/your-feature-name
```

---

## Deployment

### Backend — Heroku

```bash
heroku login
heroku create truthlens-backend

heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set SIGHTENGINE_API_KEY=your_key
heroku config:set SERPAPI_API_KEY=your_key

git push heroku main
```

### Frontend — Vercel

1. Push code to GitHub
2. Import the repository in [vercel.com](https://vercel.com)
3. Add the client environment variables
4. Deploy — future pushes trigger automatic redeployments

### Docker (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
docker build -t truthlens-backend .
docker run -p 5000:5000 truthlens-backend
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code standards:** follow ESLint rules, write meaningful commit messages, comment complex logic, and test thoroughly before submitting.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [Sightengine](https://sightengine.com) — AI detection and manipulation detection APIs
- [SerpApi](https://serpapi.com) — Reverse image search capabilities
- [MongoDB](https://www.mongodb.com) — Reliable database solutions
- React and Express.js open-source communities

---

<div align="center">

Made with ❤️ by [Dhakshna208](https://github.com/Dhakshna208)

⭐ If you find this project helpful, please consider giving it a star!

</div>
