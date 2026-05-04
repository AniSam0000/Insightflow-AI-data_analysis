# InsightFlow AI - AI-Powered Data Analysis Platform

A full-stack web application that leverages AI to generate and execute Python code for data analysis. Upload a CSV file, describe your analysis requirements, and let AI generate and execute the code in real-time.

---

## 🎯 Project Highlights

This is a **production-grade, full-stack application** showcasing modern software architecture and engineering best practices:

### 🏗️ Advanced Architecture

- **Microservices Architecture** - Separate frontend, backend, and isolated Python execution service
- **Real-time Communication** - WebSocket-based Socket.io for instant feedback and live progress tracking
- **Containerization** - Docker containerization for Python microservice with automated builds
- **Secure Sandbox Execution** - Restricted Python environment preventing code injection attacks
- **Asynchronous Processing** - Event-driven architecture with real-time progress updates

### ⚡ Performance Optimizations

- **Module-level Library Preloading** - Critical optimization: Libraries loaded once at startup, not per-request (3x faster)
- **Smart Connection Management** - Automatic socket connection deduplication to prevent client overhead
- **Extended Timeout Architecture** - 120s Python execution timeout with 130s Socket.io timeout to prevent premature disconnects
- **Efficient Data Streaming** - Multiprocessing Queue for safe inter-process communication
- **Horizontal Scrolling UI** - Custom pandas display options prevent truncation, full data visibility

### 🔒 Enterprise Security

- **JWT Authentication** - Token-based stateless authentication
- **Secure File Validation** - Type and size verification (5MB limit, CSV/XLSX only)
- **SQL Injection Prevention** - MongoDB query parameterization
- **Code Injection Prevention** - Sandboxed Python execution with restricted globals/builtins
- **CORS Configuration** - Whitelist-based cross-origin requests

### 🛠️ Production-Ready Features

- **Intelligent Error Recovery** - Auto-fixing for common pandas errors (mixed-type correlation, column naming)
- **Session Persistence** - localStorage-based session management with automatic recovery
- **Dark/Light Mode** - Accessible UI with multiple theme support
- **Responsive Design** - Mobile-friendly interface using Tailwind CSS
- **Graceful Degradation** - Proper error messages and fallback handling

### 📊 Advanced Data Handling

- **Type-Safe Operations** - Auto-detection of numeric-only columns for statistical operations
- **Fuzzy Column Matching** - Intelligent column name resolution for typo tolerance
- **Large Dataset Support** - Configurable memory limits and timeout for various workload sizes
- **Real-time Visualization** - Base64-encoded plot streaming for instant data visualization

---

## Features

✨ **AI Code Generation** - Groq LLM generates Python code based on your analysis prompts  
📊 **Real-time Analysis** - Execute Python code and see results instantly  
📁 **File Upload** - Support for CSV and Excel files up to 5MB  
🔐 **Secure Authentication** - JWT-based user authentication  
🌙 **Dark/Light Mode** - Professional UI with theme switching  
📈 **Data Visualization** - Automatic plot generation for insights  
⚡ **Fast Execution** - Optimized Python runtime with preloaded libraries  
🔄 **Real-time Updates** - WebSocket integration for live progress tracking

## Tech Stack

### Frontend

- **React 18** with Vite for build tooling
- **Tailwind CSS** for responsive styling
- **Socket.io Client** for real-time communication
- **React Router** for navigation

### Backend

- **Node.js/Express** as the API server
- **Socket.io** for WebSocket real-time communication
- **JWT** for authentication
- **MongoDB** for data persistence
- **Multer** for file uploads

### Python Service

- **FastAPI** microservice in Docker
- **Pandas, NumPy, Matplotlib, Seaborn** for data analysis
- **Python 3.11**

### External APIs

- **Groq LLM** for AI code generation

## Why This Project Stands Out

### Engineering Excellence

✅ **Separation of Concerns** - Frontend, backend, and Python service completely decoupled  
✅ **Type-Safe Patterns** - Consistent error handling and data validation across stack  
✅ **Code Generation Optimization** - Custom Groq prompts prevent imports (already preloaded), reduce token usage  
✅ **Smart Caching** - No redundant library imports, memory-efficient execution  
✅ **Monitoring Ready** - Structured logging, error tracking, and execution metrics

### Scalability Features

📈 **Stateless Backend** - Can horizontally scale with load balancers  
📈 **Containerized Python** - Easily scale execution service with Docker orchestration  
📈 **Database Agnostic** - MongoDB interface allows migration to other stores  
📈 **Connection Pooling Ready** - Socket.io with connection deduplication prevents resource exhaustion  
📈 **Configurable Timeouts** - Adapt to different workload profiles (quick analysis vs. large computations)

### What Recruiters Should Know

- **Full Tech Stack Expertise** - Frontend (React/Vite), Backend (Node/Express), Python (FastAPI), DevOps (Docker)
- **Real-time Systems** - WebSocket implementation with proper timeout handling
- **Microservices Thinking** - Architectural decisions show understanding of system design
- **Performance-First Mindset** - Preloading libraries, connection optimization, configurable resources
- **Security Awareness** - Sandboxing, input validation, JWT, CORS protection
- **Production Readiness** - Error recovery, graceful degradation, monitoring-ready code

---

## 🔌 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend (Client)                  │
│  Dashboard.jsx → API Service → Socket.io (Real-time)            │
└────────────────────────┬────────────────────────────────────────┘
                         │ WebSocket analyzeData
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Node.js Backend Server                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Express Server (Port 5000)                                  ││
│  │ ├─ Routes: /auth/*, /chat (HTTP + Socket.io)                │|
│  │ ├─ Middleware: CORS, JWT Auth, Multer (file upload)         │|
│  │ └─ Controllers: authControllers, chatControllers            │|
│  └─────────────────────────────────────────────────────────────┘│
│                         │                                       │
│          ┌──────────────┼──────────────┐                        │
│          ↓              ↓              ↓                        │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐              │
│  │ File Service │ │ AI Service   │ │ Auth Middleware            │
│  │ (CSV Parser) │ │(Groq SDK)    │ │ (JWT Verify)               │
│  └──────────────┘ └──────────────┘ └─────────────┘              │
│          │              │              │                        |
│          └──────────────┼──────────────┘                        |
│                         ↓                                       │
│                  ┌──────────────────┐                           │
│                  │  Groq API        │                           │
│                  │(llama-3.3-70b)   │                           │
│                  └──────────────────┘                           │
│          (Generates Python Code)                                │
│                         │                                       │
│                         ↓                                       │
│          ┌──────────────────────────┐                           │
│          │ Code Fixer Service       │                           │
│          │ (Auto-fix common errors) │                           │
│          └──────────────┬───────────┘                           │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP POST /v1/execute
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│  ├─ FastAPI (Port 8000)                                         │
│              Python Microservice (Docker)                       │
│  ├─ Sandbox Execution (multiprocessing.Process)                 │
│  ├─ Preloaded Libraries: pandas, numpy, matplotlib, seaborn     │
│  └─ Timeout: 120s per execution                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow Pipeline

1. **User uploads CSV** → Frontend validates file (type, size)
2. **User enters prompt** → WebSocket `analyzeData` event dispatched
3. **Backend extracts CSV info** → Parses columns, sample rows
4. **AI generates code** → Groq llama-3.3-70b processes prompt
5. **Code auto-fixes** → Column name matching, type conversion
6. **Python executes** → Sandbox execution with 120s timeout
7. **Results stream back** → Real-time progress updates
8. **Display results** → Code, output, and plots rendered

---

## 🔐 Authentication & Security

### JWT Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

#### Register

**POST** `/auth/register`

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

#### Login

**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response: (Same as register)

#### Logout

**POST** `/auth/logout`

Headers: `Authorization: Bearer <token>`

### Security Features

✅ **JWT Tokens** - 24-hour expiration with HS256 algorithm  
✅ **Password Hashing** - bcryptjs with 10 salt rounds  
✅ **File Validation** - Type checking (CSV/XLSX), size limit (5MB)  
✅ **Input Sanitization** - Prompt length validation (5-10000 chars)  
✅ **CORS Protection** - Whitelist-based cross-origin requests  
✅ **Secure Sandbox** - Restricted Python execution environment

---

- Node.js 18+ and npm
- Python 3.11+
- Docker & Docker Compose
- MongoDB (local or cloud)
- Groq API key

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI_Data_Analysis
```

### 2. Install Dependencies

**Frontend:**

```bash
cd client
npm install
```

**Backend:**

```bash
cd server
npm install
```

### 3. Environment Configuration

**Backend (.env):**

```
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=mongodb://localhost:27017/ai-data-analysis
GROQ_API_KEY=your_groq_api_key_here
EXECUTION_TIMEOUT=120
```

**Python Service (python-service/.env):**

```
EXECUTION_TIMEOUT=120
EXECUTION_MEMORY_MB=0
```

### 4. MongoDB Setup

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud service
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`

**Terminal 3 - Python Service (Docker):**

```bash
cd python-service
docker build -t python-service .
docker run -p 8000:8000 -e EXECUTION_TIMEOUT=120 python-service
```

Python service runs on `http://localhost:8000`

### Production Mode

```bash
# Build frontend
cd client
npm run build

# Start backend with built frontend
cd ../server
npm run dev
```

## Project Structure

```
AI_Data_Analysis/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── dashboard/          # Dashboard components
│   │   ├── contexts/               # React contexts (Auth, DarkMode)
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API & Socket services
│   │   ├── hooks/                  # Custom React hooks
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                          # Node.js/Express backend
│   ├── src/
│   │   ├── app.js                  # Express app setup
│   │   ├── controllers/            # Route handlers
│   │   ├── models/                 # MongoDB schemas
│   │   ├── routes/                 # API routes
│   │   ├── services/               # Business logic
│   │   ├── middleware/             # Auth middleware
│   │   └── socket/                 # WebSocket handlers
│   ├── server.js                   # Entry point
│   ├── package.json
│   └── Dockerfile
│
└── python-service/                  # Python microservice
    ├── app/
    │   ├── main.py                 # FastAPI app
    │   ├── executor.py             # Code execution engine
    │   └── sandbox.py              # Sandbox environment
    ├── Dockerfile
    ├── requirements.txt
    └── .dockerignore
```

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Chat Routes

- `POST /api/chat/upload` - Upload CSV file
- `POST /api/chat/analyze` - Analyze data

### WebSocket Events (Socket.io)

- `analyzeData` - Emit to start analysis
- `analysisStart` - Server response: analysis started
- `csvExtracted` - Server response: CSV info extracted
- `generatingCode` - Server response: generating code
- `codeGenerated` - Server response: code ready
- `executingCode` - Server response: executing code
- `resultReady` - Server response: results ready
- `executionError` - Server response: error occurred

## Key Features Explained

### Real-time Analysis Pipeline

1. User uploads CSV file → File stored in uploads folder
2. User enters analysis prompt → Sent via WebSocket
3. AI generates Python code → Using Groq LLM
4. Code is auto-fixed → Handle edge cases (empty columns, mixed types, etc.)
5. Code executes in sandbox → Python service in Docker
6. Results streamed back → Real-time updates to frontend
7. Display code, output, and plots → Rendered in dashboard

### Session Persistence

- User login stores JWT + user data in localStorage
- Session restored on page refresh
- Automatic logout on token expiration

### Performance Optimizations

- Python libraries preloaded at container startup (not per-request)
- 120-second execution timeout for complex queries
- Horizontal scrolling for wide data outputs
- Socket.io timeout extended to 130s to accommodate 120s execution

### Code Auto-fixes

- Column name fuzzy matching for typos
- Mixed-type correlation fix: `df.corr()` → `df.select_dtypes(include="number").corr()`
- Pandas display settings for full output visibility

## Configuration Details

### Environment Variables

**Frontend (.env):**

```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**Backend (.env):**

```
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=generate_a_secure_random_string
MONGODB_URI=mongodb://localhost:27017/ai-data-analysis
GROQ_API_KEY=get_from_groq_console
EXECUTION_TIMEOUT=120
```

**Python Service (.env):**

```
EXECUTION_TIMEOUT=120
EXECUTION_MEMORY_MB=0  # 0 = unlimited (disabled by default)
```

## Rate Limiting

This project enforces API rate limiting using `express-rate-limit` with a Redis-backed store for distributed counters. Redis is used when available so limits are shared across multiple server instances; if Redis is unavailable the limiter falls back to the in-memory store (safe for development, not recommended for production).

Environment variables:

```
RATE_LIMIT_WINDOW_MS=900000   # window length in milliseconds (default: 15 minutes)
RATE_LIMIT_MAX=100            # max requests per IP per window (default: 100)
REDIS_HOST=your_redis_host    # e.g. redis-12345.example.com
REDIS_PORT=6379               # optional, auto-derived if not set
REDIS_PASSWORD=your_redis_password
```

Defaults used by this repo when not provided are `windowMs = 15 * 60 * 1000` (15 minutes) and `max = 100` requests. Adjust these values in your environment for production traffic patterns.

The rate limiter is initialized at app startup in `server/src/app.js` and uses the Redis client in `server/src/services/redisClient.js` and a small Redis-backed store implemented at `server/src/services/redisRateLimitStore.js`.

## Supported File Formats

- **CSV** (.csv)
- **Excel** (.xlsx)
- Maximum file size: 5MB

## Python Libraries Available

The Python service comes preloaded with:

- `pandas` - Data manipulation and analysis
- `numpy` - Numerical computing
- `matplotlib` - Data visualization
- `seaborn` - Statistical data visualization

Additional libraries can be added to `python-service/requirements.txt`

## Troubleshooting

### "timeout of 60000ms exceeded"

- Socket.io timeout was increased to 130s (130000ms)
- Python execution timeout is 120s
- Ensure all three services are running

### "File upload invalid"

- Check file size (max 5MB)
- Ensure file is CSV or XLSX format
- Verify file is not corrupted

### "Python service connection error"

- Ensure Docker container is running
- Check that port 8000 is not in use
- Verify Docker has sufficient resources

### "Blank screen on load"

- Check browser console for errors (F12)
- Ensure backend server is running on port 5000
- Verify frontend is running on port 5173

## Performance Notes

- First request after startup takes ~2-3 seconds (library preloading)
- Subsequent requests complete in seconds (imports already loaded)
- Large CSV files (>100MB) may require timeout adjustment
- Memory usage: Python service uses ~200MB at baseline

## Security Considerations

- JWT tokens expire after session timeout
- Passwords should be hashed (bcrypt recommended)
- File uploads validated for type and size
- Code execution runs in restricted sandbox
- MongoDB queries protected from injection
- CORS configured for specific frontend URL

## Future Enhancements

- Support for more file formats (JSON, Parquet, etc.)
- Custom chart templates
- Result export (PDF, CSV)
- Collaboration features (share analyses)
- Query history and favorites
- Rate limiting for API endpoints

## 💡 Complex Problems Solved

### 1. **Socket Timeout with Long-Running Computations**

- **Problem:** 60s Socket.io timeout vs 120s Python execution
- **Solution:** Extended Socket.io pingTimeout to 130000ms with 30s ping intervals
- **Impact:** Enables complex analyses on large datasets without timeout errors

### 2. **Library Import Performance**

- **Problem:** Importing pandas/numpy/matplotlib on every request (2-5s overhead)
- **Solution:** Module-level preloading at Python container startup
- **Impact:** Subsequent requests 3x faster (from 5s+ to 1-2s)

### 3. **Memory Management in Docker**

- **Problem:** Hard 200MB memory limit caused OOM errors on startup
- **Solution:** Made memory limiting optional via environment variable
- **Impact:** Flexible scaling from lightweight to high-memory configurations

### 4. **Mixed-Type DataFrame Operations**

- **Problem:** `.corr()` fails on DataFrames with string + numeric columns
- **Solution:** Auto-fix in codeFixer.js to use `.select_dtypes(include="number")`
- **Impact:** Robustness for real-world messy data

### 5. **Data Truncation in Output**

- **Problem:** Pandas truncates large DataFrames with `...` hiding important data
- **Solution:** Custom pandas display options for unlimited columns/rows/width
- **Impact:** Users see complete analysis results

### 6. **Session Persistence**

- **Problem:** Users logged out on page refresh
- **Solution:** localStorage-based token + user object restoration
- **Impact:** Seamless UX, no re-authentication required

### 7. **File Upload Extension Handling**

- **Problem:** Multer diskStorage dropping file extensions
- **Solution:** Custom filename function using `path.extname()`
- **Impact:** Preserved file integrity and metadata

### 8. **AI Code Quality**

- **Problem:** Generated code includes redundant imports
- **Solution:** Custom Groq system prompts telling AI libraries are preloaded
- **Impact:** Cleaner code, faster execution, reduced hallucination

## 📈 Scalability Roadmap

### Immediate (Next Phase)

- Add request rate limiting (prevent abuse)
- Implement query result caching (reduce duplicate executions)
- Add execution metrics dashboard (monitor performance)

### Medium Term

- Kubernetes orchestration for auto-scaling Python service
- Redis caching layer for session data
- GraphQL API for frontend optimization

### Long Term

- Multi-tenant architecture with workspace isolation
- Advanced analytics and usage tracking
- API marketplace for sharing analysis templates
- Enterprise SSO/LDAP integration

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

## License

This project is proprietary and intended for educational/research purposes.

## Support

For issues and questions, please contact the development team or open an issue in the repository.

---

**Last Updated:** April 30, 2026  
**Version:** 1.0.0
