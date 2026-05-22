# QTS Resource Hub - Setup & User Guide
## Quantity Surveying Department Academic Platform

**Programmed by: Opatola Abdulhamid Gbolahan**

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [File Structure](#file-structure)
4. [Hosting Guide](#hosting-guide)
5. [Database Setup (Supabase)](#database-setup)
6. [How to Upload Slides](#how-to-upload-slides)
7. [Admin Guide](#admin-guide)
8. [User Guide](#user-guide)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

QTS Resource Hub is a comprehensive academic platform designed specifically for the Quantity Surveying Department. It provides students with:
- Access to lecture slides organized by level and semester
- Interactive quizzes with instant marking
- GPA calculator for academic planning
- Study timer for productivity
- Discussion forum for peer learning
- Assignment tracker
- Leaderboard for motivation
- Bookmark system for quick access

---

## ✨ Features

### For Students:
1. **Course Materials** - Browse and download slides by level (100L-500L)
2. **Quizzes** - Take course-specific quizzes with instant results
3. **GPA Calculator** - Calculate GPA with 5-point grading system
4. **Study Timer** - Track study sessions
5. **Discussion Forum** - Ask questions and share knowledge
6. **Assignment Tracker** - Manage deadlines
7. **Bookmarks** - Save favorite courses
8. **Leaderboard** - Compete with peers
9. **Announcements** - Stay updated with department news

### For Admin (You):
1. **Upload Slides** - Add PDF/PPT files to any course
2. **Manage Announcements** - Post important notices
3. **Monitor Activity** - Track user engagement
4. **Quiz Management** - Add/edit quiz questions

---

## 📁 File Structure

```
qts-hub/
├── index.html              # Home page
├── login.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # User dashboard
├── courses.html            # Course listings
├── quiz.html               # Quiz interface
├── gpa-calculator.html     # GPA calculator
├── study-timer.html        # Study timer
├── forum.html              # Discussion forum
├── leaderboard.html        # Quiz leaderboard
├── announcements.html      # Announcements board
├── bookmarks.html          # User bookmarks
├── assignments.html        # Assignment tracker
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── main.js         # Main JavaScript
│   └── images/             # Image uploads
└── README.md               # This file
```

---

## 🚀 Hosting Guide

### Option 1: GitHub Pages (FREE - Recommended for static hosting)

1. **Create a GitHub Account**
   - Go to https://github.com
   - Sign up with your email

2. **Create a New Repository**
   - Click the "+" icon → "New repository"
   - Name it: `qts-resource-hub`
   - Make it **Public**
   - Click "Create repository"

3. **Upload Your Files**
   - Click "uploading an existing file"
   - Drag and drop ALL files from the `qts-hub` folder
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to repository → "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click "Save"
   - Wait 2-5 minutes
   - Your site will be live at: `https://yourusername.github.io/qts-resource-hub`

### Option 2: Netlify (FREE - Better for dynamic features)

1. Go to https://www.netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Deploy manually"
4. Drag and drop the `qts-hub` folder
5. Your site will be live instantly with a random URL
6. You can customize the URL in site settings

### Option 3: Vercel (FREE - Fastest)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Click "Deploy"
6. Your site will be live in seconds

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new organization (e.g., "QTS Department")
5. Create a new project:
   - Name: `qts-resource-hub`
   - Database Password: Create a strong password (SAVE THIS!)
   - Region: Choose closest to your location
   - Click "Create new project"

### Step 2: Get Your API Keys

1. In your Supabase dashboard, click "Project Settings" (gear icon)
2. Go to "API" section
3. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh12345678.supabase.co`)
   - **anon/public** key (starts with `eyJ...`)

### Step 3: Update Your Website

1. Open `assets/js/main.js`
2. Find these lines at the top:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace with your actual values:
   ```javascript
   const SUPABASE_URL = 'https://your-project-url.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJyour-anon-key-here';
   ```
4. Save and re-upload to your host

### Step 4: Create Database Tables

In Supabase SQL Editor, run these queries:

```sql
-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  level integer,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Slides table
create table public.slides (
  id uuid default gen_random_uuid() primary key,
  course_code text not null,
  course_level integer not null,
  semester text not null,
  file_name text not null,
  file_url text not null,
  uploaded_by uuid references auth.users,
  uploaded_at timestamp with time zone default timezone('utc'::text, now())
);

-- Quizzes table
create table public.quizzes (
  id uuid default gen_random_uuid() primary key,
  course_code text not null,
  question text not null,
  options jsonb not null,
  correct_answer integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Quiz results table
create table public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  course_code text not null,
  score integer not null,
  total_questions integer not null,
  percentage integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now())
);

-- Announcements table
create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  is_important boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Forum topics table
create table public.forum_topics (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  course_code text,
  author_id uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Step 5: Set Up Storage (For Slides)

1. In Supabase, go to "Storage" in the left sidebar
2. Click "New bucket"
3. Name: `slides`
4. Check "Public bucket" (so students can download)
5. Click "Create bucket"

---

## 📤 How to Upload Slides

### Method 1: Through Supabase Dashboard (Easiest)

1. Log into your Supabase dashboard
2. Go to "Storage" → "slides" bucket
3. Create folders for organization:
   - `100l/first-semester/`
   - `100l/second-semester/`
   - `200l/first-semester/`
   - etc.
4. Click "Upload file"
5. Select your PDF/PPT file
6. Copy the file URL
7. Go to "Table Editor" → `slides` table
8. Insert a new row:
   - `course_code`: e.g., "QTS 101"
   - `course_level`: e.g., 100
   - `semester`: "first" or "second"
   - `file_name`: e.g., "QTS101_Week1_Slides.pdf"
   - `file_url`: Paste the URL from step 6

### Method 2: Through Website (After Setup)

Once Supabase is connected, you can add an admin upload feature:

1. Add this to `main.js`:
```javascript
async function uploadSlideFile(file, courseCode, level, semester) {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `${level}l/${semester}/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('slides')
    .upload(filePath, file);

  if (error) {
    showToast('Upload failed: ' + error.message, 'error');
    return;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('slides')
    .getPublicUrl(filePath);

  // Save to database
  await supabase.from('slides').insert({
    course_code: courseCode,
    course_level: level,
    semester: semester,
    file_name: file.name,
    file_url: publicUrl
  });

  showToast('Slide uploaded successfully!', 'success');
}
```

2. Add an upload form to your admin panel

---

## 👨‍💼 Admin Guide

### Adding New Quiz Questions:

1. Go to Supabase Table Editor
2. Select `quizzes` table
3. Click "Insert row"
4. Fill in:
   - `course_code`: The course code (e.g., "QTS 101")
   - `question`: The question text
   - `options`: JSON array like `["Option A", "Option B", "Option C", "Option D"]`
   - `correct_answer`: Index of correct answer (0, 1, 2, or 3)

### Posting Announcements:

1. Go to Supabase Table Editor
2. Select `announcements` table
3. Click "Insert row"
4. Fill in:
   - `title`: Announcement title
   - `content`: Full announcement text
   - `is_important`: Check if it's urgent

### Managing Users:

1. In Supabase, go to "Authentication" → "Users"
2. View all registered users
3. You can:
   - View user details
   - Reset passwords
   - Ban/unban users
   - Send password recovery emails

---

## 👤 User Guide

### For Students:

1. **Register/Login**
   - Click "Register" to create an account
   - Select your current level
   - Use your email and password to login

2. **Access Course Materials**
   - Go to "Courses" page
   - Select your level (100L, 200L, etc.)
   - Choose semester (First or Second)
   - Click on any course to see available slides
   - Download slides by clicking the file name

3. **Take Quizzes**
   - Go to "Quizzes" page
   - Select a course
   - Answer all questions
   - Click "Submit" to see your score immediately
   - View your ranking on the Leaderboard

4. **Calculate GPA**
   - Go to "GPA Calculator"
   - Add your courses, units, and grades
   - Click "Calculate GPA"
   - See your class standing

5. **Track Assignments**
   - In your Dashboard, go to "Assignments"
   - Add new assignments with due dates
   - Mark completed assignments
   - Never miss a deadline!

6. **Use Study Timer**
   - Go to "Study Timer"
   - Click "Start" to begin tracking
   - Take breaks using the Pomodoro technique
   - Build consistent study habits

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Ensure your Supabase project is active (not paused)
- Check browser console for error messages

### Issue: "Slides not showing"
- Verify slides are uploaded to correct path in Storage
- Check that database rows match the file paths
- Ensure RLS policies allow public read access

### Issue: "Quiz not loading"
- Check that quiz questions exist in the database
- Verify the course code matches exactly (case-sensitive)
- Check browser console for JavaScript errors

### Issue: "Cannot login/register"
- Check Supabase Auth settings
- Ensure email confirmation is disabled (or configure SMTP)
- Verify network connection

---

## 📞 Support

For technical support or questions:
- **Developer**: Opatola Abdulhamid Gbolahan
- **Platform**: QTS Resource Hub
- **Year**: 2026

---

## 📝 License

This project is created for the Quantity Surveying Department.
All rights reserved.

**Built with ❤️ by Opatola Abdulhamid Gbolahan**
