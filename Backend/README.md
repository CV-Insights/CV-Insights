# CV Insights backend

The backend is an Express API that uses MongoDB for accounts, resumes, and
analysis results. Uploaded PDF files are stored on disk.

## Project structure

```text
Backend/
|-- src/
|   |-- config/
|   |   `-- db.js                    # MongoDB connection
|   |-- controllers/
|   |   |-- authController.js       # Register, login, and profile handlers
|   |   `-- resumeController.js     # Resume upload and CRUD handlers
|   |-- middleware/
|   |   |-- authMiddleware.js       # Verifies login tokens
|   |   |-- authorizeResumeOwner.js # Checks resume ownership
|   |   |-- errorMiddleware.js      # Converts errors into API responses
|   |   `-- uploadMiddleware.js     # Validates and stores PDF uploads
|   |-- models/
|   |   |-- User.js                 # User database schema
|   |   `-- Resume.js               # Resume and analysis schema
|   |-- routes/
|   |   |-- authRoutes.js           # Authentication endpoints
|   |   `-- resumeRoutes.js         # Resume endpoints
|   |-- services/
|   |   `-- resumeAnalysisService.js # Resume and job keyword analysis
|   |-- app.js                      # Express app and middleware setup
|   `-- server.js                   # Environment setup and startup
|-- test/
|   `-- resumeAnalysisService.test.js
|-- .env.example
`-- package.json
```

## Setup

1. Install Node.js.
2. Open a terminal in the `Backend` folder and run `npm install`.
3. Copy `.env.example` to `.env` in the `Backend` folder.
4. Set `MONGODB_URI` to your local MongoDB or MongoDB Atlas connection string.
5. Replace `JWT_SECRET` with a private random secret. Do not commit `.env`.
6. Start the API with `npm run dev`.

The backend-local `.env` is preferred. The project-root `.env` is used as a
fallback for existing local setups. If Node cannot resolve an Atlas SRV record,
set `MONGODB_DNS_SERVERS` to reachable comma-separated DNS resolver addresses.

The API runs at `http://localhost:5000`. Check `GET /api/health` to confirm that
the API and MongoDB are available.

## API routes

| Method | Path | Login required | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | No | API and database status |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Sign in and receive a JWT |
| GET | `/api/auth/me` | Yes | Get the signed-in user's profile |
| GET | `/api/resumes` | Yes | List the signed-in user's resumes |
| POST | `/api/resumes/upload` | Yes | Upload and analyze a PDF |
| GET | `/api/resumes/:id` | Yes | Read one resume owned by the user |
| GET | `/api/resumes/:id/file` | Yes | Download the original PDF |
| PATCH | `/api/resumes/:id` | Yes | Update a resume |
| DELETE | `/api/resumes/:id` | Yes | Delete a resume and its PDF |

Send the JWT from register or login on protected routes:

```text
Authorization: Bearer YOUR_JWT
```

The API checks authentication before running Multer. Resume ID routes also check
that the requested record belongs to the signed-in user.

## Uploads and analysis

Send `multipart/form-data` to `POST /api/resumes/upload` with:

- `resume`: one PDF file, up to 10 MB.
- `jobDescription`: job description text, up to 30,000 characters.

The PDF is stored at `Backend/uploads/<user-id>/<random-name>.pdf`. MongoDB
stores its metadata, extracted text, job description, and analysis. Only PDFs
with selectable text can be analyzed; scanned PDFs need OCR, which is not
included.

The analyzer normalizes common skill aliases, prioritizes explicitly required
terms, and compares those terms with the extracted resume text. Required terms
count for 4 points, recognized skills for 2 points, and other repeated terms
for 1 point. The resulting score is a transparent text-based estimate, not an
AI assessment or a guarantee of ATS results.

The local upload directory is ignored by Git. Production hosting needs a
persistent disk or object storage because an ephemeral server disk can be
cleared during redeployment.

The frontend's demo dashboard is preview-only. Sign up or sign in before
uploading a resume.
