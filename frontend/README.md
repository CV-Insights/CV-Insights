# CV Insights

CV Insights is a React application built with Vite.

## Run locally

Start MongoDB and the API first; see `../Backend/README.md` for the database URI and API setup. Register or sign in in the app before uploading. Resume upload and history require an account.

```powershell
npm install
npm run dev
```

The frontend uses `http://localhost:5000/api` by default. To point it at a different API, create a `.env` file in `Frontend` with:

```text
VITE_API_URL=http://localhost:5000/api
```

Restart Vite after changing the environment file. The browser sends your login token with private API requests. Uploaded PDFs are stored in `Backend/uploads` and their extracted text, job description, and keyword analysis are stored in MongoDB.

## Build for production

```powershell
npm run build
```
