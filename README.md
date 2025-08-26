# PrayogikLMS
![Version](https://img.shields.io/badge/version-1.0.0-blue)
## Overview

[Prayogik](https://prayogik.com/home) is an online Learning Management System (LMS) built with Nextjs, Tailwind CSS, Shadcn UI, Prisma, Mongodb. It provides a comprehensive platform for managing online courses, subscriptions, teacher revenue, user profiles, progress tracking, and more.

# Key Features

## Authentication & Security
- **User Roles**
  - Student (default)
  - Teacher (verified)
  - Co-Teacher
  - Admin
  - SuperAdmin
- **Registration & Login**
  - Email/password authentication
  - Social login (Google/GitHub)
  - Account verification via email
  **Forget Password**
  - Users can request a password reset by entering their registered email address.  
  - A secure password reset link is sent to the email.  
  - The link allows users to create a new password.  
  - Password reset tokens expire after a set time for security.  
- **Access Control**
  - Role-based permissions
  - JWT token authentication
  - Session management
- **Security**
  - Password encryption
  - Rate limiting for API endpoints

## Student Features
- **Course Management**
  - Browse & filter courses easily
  - Purchase courses securely via integrated Payment System
- **Learning Progress**
  - Track progress by marking lessons as completed/uncompleted
  - Automatic progress calculation for each purchased course
- **Dashboard**
  - Manage enrolled **Regular** and **Prime** subscription courses
  - View progress tracking
  - Update personal profile information

## Teacher Features
- **Verification**
  - Apply to become a verified teacher
  - Switch between Teacher Mode and Student Mode (after verification)
- **Course Creation**
  - Create and manage courses/lessons
  - Drag-and-drop chapter reordering
  - Rich text editor for lesson content
- **Media Management**
  - Upload course/lesson videos via **VdoCipher**
  - Upload thumbnails and attachments via **AWS S3**
- **Collaboration**
  - Assign verified teachers as **Co-Teachers** to courses

## Co-Teacher Features
- Access assigned courses with limited permissions:
  - Can edit content, reorder chapters, upload materials
  - **Cannot** delete courses/lessons
  - **Cannot** manage Co-Teacher assignments
- Only main teacher (creator) can:
  - Assign/remove Co-Teachers
  - Delete course/lessons

## Admin Features
- **User Management**
  - Manage Students and Teachers
  - Process Teacher Applications
- **Course Management**
  - Manage all courses
  - Create/manage **Course Roadmaps** with statuses:
    - Planned | In Progress | Completed
  - Manage Categories/Subcategories
- **Teacher Management**
  - Manage all teachers
  - Teacher Ranks system:

    | Rank        | Description                                      |
    |-------------|--------------------------------------------------|
    | Seven Star  | Highest earning tier for top-performing teachers |
    | Five Star   | Mid-level tier for active teachers              |
    | Three Star  | Base tier for new/beginner teachers             |

  - Manage earning tiers and performance metrics
  - Oversee Co-Teacher assignments
- **Subscription Management**
  - Subscription Plans
  - Discounts & Coupons
  - Subscribers
  - Manual Payments
- **Financial Oversight**
  - Generate Monthly Earnings reports
  - Track teacher payments
  - Monitor platform-wide revenue analytics

## Pricing & Payments
- **Subscription Plans**
  - Purchase for enhanced access
  - Subscription-based discounts on paid courses
- **Payment Options**
  - Secure online payments
  - Manual payment handling for offline purchases

## Analytics
- **Teacher Analytics**
  - View individual earnings
  - Track engagement metrics
- **Admin Analytics**
  - Platform-wide revenue tracking
  - Performance metrics by:
    - Course
    - Subscription type
    - Instructor  

## Tech Stack

- **Frontend**: Next.js 14+, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB (with Prisma ORM)
- **Authentication**: NextAuth.js
- **Rich Text Editors**: Jodit
- **File Uploads**: UploadThing, AWS S3
- **Testing**: Playwright, Jest

## Prerequisites

- npm (v11.x or higher)
- Node.js (v18.x or higher)
- MongoDB (v4.x or higher)
- AWS S3 bucket (for file uploads)
- Google reCAPTCHA credentials (optional)
- Nodemailer configuration (for email features)

## Project Setup

### 1. Clone the repository

```bash
git clone git clone https://github.com/kashem76/prayogikmain.git
cd prayogik-lms
```
### 2. Install dependencies
```bash
npm install
```
### 3. Set up environment variables
Create a .env file in the root directory with the following variables:

```js
# node environment
NODE_ENV=development

# Database
DATABASE_URL=

# Base url
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

VDOCIPHER_API_SECRET=
VDOCHIPER_HOOK_TOKEN=

# Google cloud app
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/callback/google

# Google Recaptcha
NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY=
NEXT_PUBLIC_GOOGLE_RECAPTCHA_SECRET_KEY=

# NextAuth and JWT
NEXTAUTH_SECRET=
JWT_SECRET_KEY=

# SMTP
SMTP_USERNAME=
SMTP_APP_PASS=

ADMIN_RECIPIENT_EMAIL=

# Youtube, Vimeo API
NEXT_PUBLIC_YOUTUBE_API_KEY=
NEXT_PUBLIC_VIMEO_ACCESS_TOKEN=

# AWS keys for upload image into s3
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
NEXT_PUBLIC_MAX_FILE_SIZE_MB="5"

# Teacher APP URL
NEXT_PUBLIC_TEACHER_APP_URL=https://yourdomain.com
BKASH_MANUAL_PAYMENT_NUMBER=
SUPPORT_NUMBER=
```

### 4. Set up database
Run the following commands to initialize your database:

```bash
npx prisma generate
npx prisma db push
npm run seed
```
### 5. Run the development server
```bash
npm run dev
```

## Available Scripts

- npm run dev: Starts the development server

- npm run build: Builds the application for production

- npm run start: Starts the production server

- npm run lint: Runs ESLint

- npm run seed: Seeds the database with sample data

- npm test: Runs tests (Playwright & Jest)

## Project Structure

```bash
PRAYOGIKMAIN/
├── .next/                    # Next.js build output (auto-generated)
├── .vscode/                 # VS Code settings
├── actions/                 # Server/Client actions (e.g., for Next.js Server Actions)
├── app/                     # App directory for Next.js 13+ routing
│   ├── (authentication)/    # Authentication-related pages (login, signup, etc.)
│   ├── (coming-soon)/       # Placeholder routes or features under development
│   ├── (course)/courses/    # Main courses page and course-related routes
│   ├── (dashboard)/         # Dashboard layout for admin/teachers/students
│   ├── (preview)/           # Course or content preview routes
│   ├── (site)/              # Marketing or landing pages (home, about, etc.)
│   ├── api/                 # API routes (Next.js API handlers)
│   ├── api-doc/             # API documentation or Swagger-related routes
│   ├── error.tsx            # Custom error page
│   ├── favicon.ico          # Favicon
│   ├── globals.css          # Global CSS (Tailwind, custom styles)
│   ├── layout.tsx           # Root layout component
│   └── not-found.tsx        # Custom 404 page
│
├── components/              # Reusable UI components (buttons, cards, etc.)
├── constants/               # App-wide constant values and enums
├── data/                    # Static or seed data files
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions, helpers, and shared logic
├── node_modules/            # Installed dependencies
├── playwright-report/       # Playwright test results and reports
├── prisma/                  # Prisma schema and database-related files
├── public/                  # Public assets (images, fonts, etc.)
├── services/                # API service functions, external integrations
│
├── .env                     # Environment variables
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignored files list
├── .npmrc                   # NPM settings
├── components.json          # Possibly auto-generated component mapping
├── jest.setup.js            # Jest test setup file
├── jest.config.js           # Jest configuration
├── middleware.ts            # Next.js middleware for auth, redirects, etc.
├── next-env.d.ts            # TypeScript declarations for Next.js
├── next.config.js           # Next.js configuration
├── package-lock.json        # Dependency lock file
├── package.json             # Project metadata and dependencies
├── postcss.config.js        # PostCSS configuration
├── README.md                # Project overview and documentation
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vercel.json              # Vercel deployment configuration
```
## Deployment

Vercel (Recommended)

- Push your code to a Git repository

- Create a new project in Vercel

- Add all environment variables

- Set build command: npm run build

## Additional Features

- Rich text editing with Jodit

- File uploads with AWS S3

- Data visualization with Recharts

- Responsive carousels with Swiper

- Form validation with React Hook Form and Zod

- Progress indicators and loaders

- Confetti effects for celebrations

## API Documentation
![OAS Version](https://img.shields.io/badge/OAS_version-3.0-blue)

### Authentication
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | User registration | Public |
| `/api/auth/check-username` | POST | Check username availability | Public |
| `/api/auth/adduser` | POST | Admin add new user | Admin |
| `/api/auth/reset-password` | POST | Initiate password reset | Public |
| `/api/auth/reset-password-submit` | POST | Complete password reset | Public |
| `/api/auth/session` | GET | Get current session | Authenticated |
| `/api/auth/role` | POST | Switch user role | Authenticated |

### User Management
#### Profile
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/user/profile/{userId}` | GET | Get user profile | Authenticated |
| `/api/user/profile/{userId}` | PUT | Update profile | Owner/Admin |
| `/api/user/profile/reset-password` | POST | Change password | Authenticated |

#### Progress & Courses
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/user/userprogress` | GET | Get learning progress | Student |
| `/api/user/courses/dashboard` | GET | Get dashboard courses | Student |
| `/api/user/subscription` | GET | Get user subscription | Authenticated |

### Teacher Management
#### Teacher Operations
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/teacher/apply-for-teacher` | POST | Apply as teacher | Student |
| `/api/teacher` | GET | List all teachers | Public |
| `/api/teacher/verified` | GET | List verified teachers | Public |
| `/api/teacher/ranks` | GET | Get teacher ranking system | Public |

#### Earnings & Payments
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/teacher/analytics` | GET | Get teaching analytics | Teacher |
| `/api/teacher/account/overview` | GET | Account summary | Teacher |
| `/api/teacher/payment/paymentHistory` | GET | Payment history | Teacher |
| `/api/teacher/earnings` | POST | Earnings report | Teacher |
| `/api/teacher/payment/paymentMethods` | GET | List payment methods | Teacher |
| `/api/teacher/payment/paymentMethods` | POST | Add payment method | Teacher |
| `/api/teacher/payment/paymentMethods/{id}` | PATCH | Update payment method | Teacher |
| `/api/teacher/payment/paymentMethods/{id}` | DELETE | Remove payment method | Teacher |

### Course Management
#### Course Operations
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/courses` | GET | Browse courses | Public |
| `/api/courses` | POST | Create course | Teacher |
| `/api/courses/freecourse` | POST | Enroll in free course | Student |
| `/api/courses/{courseId}/publish` | PATCH | Publish course | Teacher/Admin |
| `/api/courses/{courseId}/unpublish` | PATCH | Unpublish course | Teacher/Admin |
| `/api/courses/access/free` | POST | Grant free access | Admin |

#### Lesson Management
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/front/lessons/lesson` | POST | Get lesson details | Public |
| `/api/courses/{courseId}/lessons/reorder` | PUT | Reorder lessons | Teacher |
| `/api/courses/{courseId}/lessons/{lessonId}/publish` | PATCH | Publish lesson | Teacher |
| `/api/courses/{courseId}/lessons/{lessonId}/unpublish` | PATCH | Unpublish lesson | Teacher |

#### Categories
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/courses/categories` | GET | List categories | Public |
| `/api/courses/categories` | POST | Create category | Admin |
| `/api/courses/categories` | PUT | Update category | Admin |
| `/api/courses/categories` | DELETE | Delete category | Admin |

#### Course Roadmap
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/manage/course-roadmap` | GET/POST | List/Create roadmaps |
| `/api/admin/manage/course-roadmap/{id}` | PUT/DELETE | Update/Delete roadmap |

### Admin Operations
#### User Administration
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | List all users |
| `/api/admin/users/{userId}` | GET | Get user details |
| `/api/admin/users/{userId}` | PUT | Update user |

#### Teacher Administration
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/teachers` | GET | List all teachers |
| `/api/admin/teachers/{teacherId}` | GET/ PUT | Get/Update teacher |
| `/api/admin/teachers/ranks` | POST | Create rank |
| `/api/admin/teachers/ranks/{id}` | PUT/DELETE | Update/Delete rank |
| `/api/admin/teachers/earnings` | POST | View earnings |
| `/api/admin/teachers/earnings/pay` | POST | Process payment |

### Subscription Services
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/subscriptions` | GET | List plans | Public |
| `/api/subscriptions` | POST | Create plan | Admin |
| `/api/subscriptions/discounts` | GET | List discounts | Public |
| `/api/subscriptions/discounts` | POST | Create discount | Admin |
| `/api/subscriptions/discounts/{id}` | PUT | Update discount | Admin |
| `/api/subscriptions/discounts/{id}` | DELETE | Remove discount | Admin |
| `/api/subscribers` | GET | List subscribers | Admin |
| `/api/subscribers/{id}` | GET/PUT | Get/Update subscriber | Admin |

### Payment Processing
#### Bkash Payments
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/bkash-manual-payment` | GET | List payments | Admin |
| `/api/bkash-manual-payment` | POST | Create payment | Admin |
| `/api/bkash-manual-payment/{id}` | GET | Get payment | Admin |
| `/api/bkash-manual-payment/{id}` | PUT | Update payment | Admin |
| `/api/bkash-manual-payment/{id}` | DELETE | Remove payment | Admin |