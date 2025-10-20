# Sapelaweddo LMS - Backend Server

This is the Express.js backend server for the Sapelaweddo Learning Management System.

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** for database
- **Firebase Admin SDK** for authentication verification
- **Mongoose** for MongoDB ODM

## Prerequisites

- Node.js 18+ or Bun runtime
- MongoDB database (MongoDB Atlas recommended)
- Firebase project with Admin SDK credentials

## Environment Variables

Create a `.env` file in the `server` directory:

\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email

# CORS
FRONTEND_URL=https://your-frontend-url.vercel.app
\`\`\`

## Local Development

1. Install dependencies:
\`\`\`bash
npm install
# or
bun install
\`\`\`

2. Create `.env` file with your credentials

3. Start the development server:
\`\`\`bash
npm run dev
# or
bun run dev
\`\`\`

The server will run on `http://localhost:5000`

## Deployment to Render

### Step 1: Push to GitHub

Make sure your code is pushed to GitHub (the server folder should be in your repository).

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `sapelaweddo-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install` or `bun install`
- **Start Command**: `npm start` or `bun start`

**Environment:**
- **Instance Type**: Free or Starter (depending on your needs)

### Step 3: Add Environment Variables

In the Render dashboard, add these environment variables:

\`\`\`
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key_with_newlines
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
FRONTEND_URL=https://your-vercel-app.vercel.app
\`\`\`

**Important Notes:**
- For `FIREBASE_PRIVATE_KEY`, paste the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Make sure to preserve the `\n` newline characters in the private key
- Get your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get Firebase credentials from Firebase Console > Project Settings > Service Accounts

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically deploy your backend
3. Once deployed, you'll get a URL like: `https://sapelaweddo-backend.onrender.com`
4. Copy this URL - you'll need it for the frontend configuration

### Step 5: Update Frontend

Update your frontend's `.env.local` file with the backend URL:

\`\`\`env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
\`\`\`

Then redeploy your frontend on Vercel.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/check-registration` - Check if user is registered

### Students
- `GET /api/students` - Get all students (admin only)
- `GET /api/students/statistics` - Get student statistics

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (admin only)
- `DELETE /api/notices/:id` - Delete notice (admin only)

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create class (admin only)
- `DELETE /api/classes/:id` - Delete class (admin only)

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create exam (admin only)
- `DELETE /api/exams/:id` - Delete exam (admin only)

### Papers
- `GET /api/papers` - Get all papers
- `POST /api/papers` - Upload paper (admin only)
- `DELETE /api/papers/:id` - Delete paper (admin only)

### Submissions
- `GET /api/submissions` - Get all submissions
- `POST /api/submissions` - Submit exam answer
- `PATCH /api/submissions/:id/mark` - Mark submission (admin only)

### Work Time
- `GET /api/worktime/:studentId` - Get work time records
- `POST /api/worktime` - Submit work time

## Monitoring

After deployment on Render:
- Check logs in the Render dashboard
- Monitor performance and errors
- Set up alerts for downtime

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for Render)
- Ensure network access is configured properly

### Firebase Authentication Issues
- Verify Firebase credentials are correct
- Check that private key has proper newline characters
- Ensure service account has necessary permissions

### CORS Issues
- Verify `FRONTEND_URL` environment variable matches your Vercel deployment
- Check that the frontend is using the correct backend URL

## Support

For issues or questions, please open an issue on GitHub or contact support.
