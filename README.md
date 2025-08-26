# PrayogikLMS

## Overview

Prayogik is a Learning Management System (LMS) built with Nextjs, Tailwind CSS, Shadcn UI, Prisma, Mongodb and aamarPay. It provides a comprehensive platform for managing online courses, subscriptions, teacher revenue, user profiles, progress tracking, and more.

## Key Features

- Authentication with nextAuth
- Browse & Filter Courses
- Purchase Courses using aamarPay
- Mark Chapters as Completed or Uncompleted
- Purchase subscription plan
- Purchase course with subscription discount
- Progress Calculation of each Course
- Student Dashboard
- Profile Update
- Teacher mode
- Create new Courses
- Create new Chapters
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails, attachments and videos using UploadThing
- Rich text editor for chapter description
- Analytics and revenue
- Accounts
- Admin mode
- Manage Users
- Manage Teachers
- Manage Courses and Categories
- Manage subscription
- Manage teachers Rank
- Manage Teachers payments-
- ORM using
- MongoDB database

## Technologies Used

- **Frontend:**

  - Nextjs
  - Shadcn UI
  - Styled with Tailwind CSS

- **Backend:**

  - Nextjs

- **ORM:**

  - Prisma

- **Database:**
  - MongoDB

### Setup .env file

```js
DATABASE_URL;
NEXT_PUBLIC_APP_URL;
NEXT_PUBLIC_BASE_URL;
VDOCIPHER_API_SECRET;
VDOCHIPER_HOOK_TOKEN;
AAMARPAY_URL;
AAMARPAY_MERCHANT_ID;
AAMARPAY_STORE_ID;
AAMARPAY_SIGNATURE_KEY;
GOOGLE_CLIENT_ID;
GOOGLE_CLIENT_SECRET;
GOOGLE_CALLBACK_URL;
NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
NEXT_PUBLIC_GOOGLE_RECAPTCHA_SECRET_KEY;
NEXTAUTH_SECRET;
JWT_SECRET_KEY;
SMTP_USERNAME;
SMTP_APP_PASS;
ADMIN_RECIPIENT_EMAIL;
NEXT_PUBLIC_YOUTUBE_API_KEY;
NEXT_PUBLIC_VIMEO_ACCESS_TOKEN;
AWS_REGION;
AWS_ACCESS_KEY_ID;
AWS_SECRET_ACCESS_KEY;
AWS_BUCKET_NAME;
NEXT_PUBLIC_MAX_FILE_SIZE_MB;
NEXT_PUBLIC_TEACHER_APP_URL;
```

### Setup Prisma

Add MongoDB Database

```shell
npx prisma format
npx prisma generate
npx prisma db push

```

### Install packages

```shell
npm i
```

## Installation

Clone the project

```bash
git clone https://github.com/kashem76/prayogikmain.git
```

### Setup instruction for Frontend

1. Move into the directory

```bash
cd "directory name"
```

2. install dependenices

```bash
npm install
```

3.  run the server

```bash
npm run dev
```

## Prerequisites

Before running this project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher)
- [MongoDB](https://www.mongodb.com/) (v4.x or higher)
