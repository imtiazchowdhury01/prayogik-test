import {
  PrismaClient,
  SubscriptionType,
  Role,
  UserAccountStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

// Generate referral code helper function
const generateReferralCode = async () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
};

const categoryData = [
  // 1. Digital Marketing (Parent)
  {
    name: "ডিজিটাল মার্কেটিং",
    slug: "digital-marketing",
    isChild: false,
    childCategories: [
      { name: "সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO)", slug: "seo", isChild: true },
      {
        name: "সোশ্যাল মিডিয়া মার্কেটিং (SMM)",
        slug: "social-media-marketing",
        isChild: true,
      },
      { name: "কন্টেন্ট মার্কেটিং", slug: "content-marketing", isChild: true },
      { name: "ইমেইল মার্কেটিং", slug: "email-marketing", isChild: true },
      { name: "কনটেন্ট স্ট্রাটেজি", slug: "content-strategy", isChild: true },
      {
        name: "অ্যাফিলিয়েট মার্কেটিং",
        slug: "affiliate-marketing",
        isChild: true,
      },
      {
        name: "ই-কমার্স",
        slug: "ecommerce",
        isChild: true,
      },
      {
        name: "B2B মার্কেটিং",
        slug: "b2b-marketing",
        isChild: true,
      },
      {
        name: "প্রডাক্ট মার্কেটিং",
        slug: "product-marketing",
        isChild: true,
      },
      {
        name: "সার্চ ইঞ্জিন মার্কেটিং",
        slug: "search-engine-marketing",
        isChild: true,
      },
    ],
  },

  // 2. Web Development (Parent)
  {
    name: "ওয়েব ডেভেলপমেন্ট",
    slug: "web-development",
    isChild: false,
    childCategories: [
      {
        name: "ফ্রন্ট-এন্ড ডেভেলপমেন্ট",
        slug: "frontend-development",
        isChild: true,
      },
      {
        name: "ব্যাক-এন্ড ডেভেলপমেন্ট",
        slug: "backend-development",
        isChild: true,
      },
      {
        name: "ফুল-স্ট্যাক ডেভেলপমেন্ট",
        slug: "fullstack-development",
        isChild: true,
      },
      {
        name: "ওয়ার্ডপ্রেস ডেভেলপমেন্ট",
        slug: "wordpress-development",
        isChild: true,
      },
      {
        name: "ওয়েব ডিজাইন ও ডেভেলপমেন্ট",
        slug: "web-design-development",
        isChild: true,
      },
    ],
  },

  // 3. Design (Parent)
  {
    name: "ডিজাইন",
    slug: "design",
    isChild: false,
    childCategories: [
      { name: "গ্রাফিক্স ডিজাইন", slug: "graphics-design", isChild: true },
      { name: "UI/UX ডিজাইন", slug: "uiux-design", isChild: true },
      { name: "লোগো ডিজাইন", slug: "logo-design", isChild: true },
      { name: "ওয়েব ডিজাইন", slug: "web-design", isChild: true },
      {
        name: "মোশন গ্রাফিক্স ডিজাইন",
        slug: "motion-graphics-design",
        isChild: true,
      },
      { name: "অ্যানিমেশন", slug: "animation", isChild: true },
      { name: "ভিডিও এডিটিং", slug: "video-editing", isChild: true },
    ],
  },

  // 4. Standalone Categories (No parent)
  {
    name: "এন্ড্রোইড ডেভেলপমেন্ট",
    slug: "android-development",
    isChild: false,
  },
  {
    name: "বিজনেস",
    slug: "business",
    isChild: false,
  },
  {
    name: "ডাটা অ্যানালিটিক্স",
    slug: "data-analytics",
    isChild: false,
  },
];

export async function seedCategory() {
  console.log("Seeding categories...");

  try {
    // First create parent categories
    for (const category of categoryData) {
      if (!category.childCategories) {
        // Handle standalone categories
        await db.category.upsert({
          where: { slug: category.slug },
          update: { name: category.name, isChild: category.isChild },
          create: category,
        });
        console.log(`Upserted standalone category: ${category.slug}`);
        continue;
      }

      // Handle parent categories with children
      const { childCategories, ...parentData } = category;

      const parent = await db.category.upsert({
        where: { slug: parentData.slug },
        update: { name: parentData.name, isChild: parentData.isChild },
        create: parentData,
      });

      console.log(`Upserted parent category: ${parentData.slug}`);

      // Create child categories
      for (const child of childCategories) {
        await db.category.upsert({
          where: { slug: child.slug },
          update: {
            ...child,
            parentCategory: { connect: { id: parent.id } },
          },
          create: {
            ...child,
            parentCategory: { connect: { id: parent.id } },
          },
        });
        console.log(
          `Upserted child category: ${child.slug} under ${parentData.slug}`
        );
      }
    }

    console.log("✔ Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
}

// ------------------ Seed Rank ------------------
const rankData = [
  {
    name: "Three Star",
    description:
      "Three star ranked teacher will get 25% share of revenue from course sell",
    numberOfSales: 1,
    feePercentage: 25,
  },
  {
    name: "Five Star",
    description:
      "Five star ranked teacher will get 30% share of revenue from course sell",
    numberOfSales: 5,
    feePercentage: 30,
  },
  {
    name: "Seven Star",
    description:
      "Seven star ranked teacher will get 40% share of revenue from course sell",
    numberOfSales: 10,
    feePercentage: 40,
  },
];

export async function seedRank() {
  console.log("Seeding ranks...");

  try {
    // Loop through the data and upsert each rank
    for (const rank of rankData) {
      await db.teacherRank.upsert({
        where: { name: rank.name },
        update: { ...rank },
        create: { ...rank },
      });
    }

    console.log("✔ Ranks seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database ranks", error);
    throw error;
  }
}

// ------------------ Seed Discount ------------------
const discountData = [
  {
    name: "Default",
    discountPercentage: 50,
    isDefault: true,
  },
  {
    name: "Trial Discount",
    discountPercentage: 0,
    isDefault: false,
  },
];

export async function seedDiscount() {
  console.log("Seeding membership course price discount...");

  try {
    // Loop through the data and upsert each discount
    for (const discount of discountData) {
      await db.subscriptionDiscount.upsert({
        where: { name: discount.name },
        update: { ...discount },
        create: { ...discount },
      });

      console.log(`Upserted discount with name: ${discount.name}`);
    }

    console.log("✔ Membership course price discount seeded successfully!");
  } catch (error) {
    console.error("Error seeding membership course price discount", error);
    throw error;
  }
}

// ------------------ Seed Subscription Plan ------------------
const subscriptionPlanData = [
  {
    name: "ট্রায়াল",
    type: SubscriptionType.NONE,
    regularPrice: 399,
    offerPrice: 0,
    durationInMonths: 1,
    durationInYears: 1,
    isTrial: true,
    trialDurationInDays: 45,
    trialCourseLimit: 5,
    isDefault: false,
  },
  {
    name: "১ বছরের প্ল্যান",
    type: SubscriptionType.YEARLY,
    regularPrice: 27999,
    offerPrice: 0,
    durationInMonths: 12,
    durationInYears: 1,
    isTrial: false,
    trialDurationInDays: 30,
    trialCourseLimit: 5,
    isDefault: true,
  },
  {
    name: "২ বছরের প্ল্যান",
    type: SubscriptionType.YEARLY,
    regularPrice: 39999,
    offerPrice: 0,
    durationInMonths: 24,
    durationInYears: 2,
    isTrial: false,
    trialDurationInDays: 30,
    trialCourseLimit: 5,
    isDefault: false,
  },
  {
    name: "৩ বছরের প্ল্যান",
    type: SubscriptionType.YEARLY,
    regularPrice: 57999,
    offerPrice: 0,
    durationInMonths: 36,
    durationInYears: 3,
    isTrial: false,
    trialDurationInDays: 30,
    trialCourseLimit: 5,
    isDefault: false,
  },
];

export async function seedSubscriptionPlan() {
  console.log("Seeding subscription plans...");
  try {
    // Find the default discount first
    const defaultDiscount = await db.subscriptionDiscount.findFirst({
      where: { isDefault: true },
    });

    const trialDiscount = await db.subscriptionDiscount.findFirst({
      where: {
        discountPercentage: 0,
      },
    });

    console.log({ trialDiscount });

    if (!defaultDiscount) {
      console.log("⚠ No default discount found");
      return;
    }

    // Process each subscription plan from the data array
    for (const planData of subscriptionPlanData) {
      try {
        // Check if plan already exists by name
        const existingPlan = await db.subscriptionPlan.findFirst({
          where: { name: planData.name },
        });

        let createdOrUpdatedPlan;

        if (existingPlan) {
          // Update existing plan
          createdOrUpdatedPlan = await db.subscriptionPlan.update({
            where: { id: existingPlan.id },
            data: {
              type: planData.type,
              regularPrice: planData.regularPrice,
              offerPrice: planData.offerPrice,
              durationInMonths: planData.durationInMonths,
              durationInYears: planData.durationInYears,
              isTrial: planData.isTrial,
              trialDurationInDays: planData.trialDurationInDays,
              trialCourseLimit: planData.trialCourseLimit,
              isDefault: planData.isDefault,
              subscriptionDiscountId:
                planData.type === "NONE"
                  ? trialDiscount?.id
                  : defaultDiscount.id,
            },
          });
          console.log(`✔ Updated subscription plan: ${planData.name}`);
        } else {
          // Create new plan
          createdOrUpdatedPlan = await db.subscriptionPlan.create({
            data: {
              name: planData.name,
              type: planData.type,
              regularPrice: planData.regularPrice,
              offerPrice: planData.offerPrice,
              durationInMonths: planData.durationInMonths,
              durationInYears: planData.durationInYears,
              isTrial: planData.isTrial,
              trialDurationInDays: planData.trialDurationInDays,
              trialCourseLimit: planData.trialCourseLimit,
              isDefault: planData.isDefault,
              subscriptionDiscountId:
                planData.type === "NONE"
                  ? trialDiscount?.id
                  : defaultDiscount.id,
            },
          });
          console.log(`✔ Created subscription plan: ${planData.name}`);
        }
      } catch (planError) {
        console.error(`Error processing plan ${planData.name}:`, planError);
        // Continue with other plans instead of stopping
        continue;
      }
    }

    console.log("✔ Subscription plans seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database subscription plans", error);
    throw error;
  }
}

// ------------------ Seed Users ------------------
const usersData = [
  {
    name: "Md Shohel Rana",
    email: "shohel.xponent@gmail.com",
    username: "shohel-rana",
  },
  {
    name: "Mokhlesur Rahman",
    email: "mokhles.xponent@gmail.com",
    username: "mokhlesur-rahman",
  },
  {
    name: "Gazi Nafis",
    email: "gazinafis.xponent@gmail.com",
    username: "gazi-nafis",
  },
  {
    name: "Imtiaz",
    email: "imtiaz.xponent@gmail.com",
    username: "imtiaz",
  },
  {
    name: "Anik Deb",
    email: "anikdeb.xponent@gmail.com",
    username: "anik-deb",
  },
  {
    name: "Sakawat Sakib",
    email: "sakawat.sakib.xponent@gmail.com",
    username: "sakawat-sakib",
  },
];

export async function seedUsers() {
  console.log("Seeding users...");

  try {
    const password = "12345678";
    const hashedPassword = await bcrypt.hash(password, 10);

    for (const userData of usersData) {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`User already exists: ${userData.email}`);
        continue;
      }

      // Generate unique referral code using the utility function
      const referralCode = await generateReferralCode();

      // Create user
      const user = await db.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          username: userData.username,
          password: hashedPassword,
          emailVerified: true,
          role: Role.ADMIN,
          isAdmin: true,
          isSuperAdmin: true,
          accountStatus: UserAccountStatus.ACTIVE,
          referralCode: referralCode,
        },
      });

      console.log(`✔ Created user: ${user.email}`);
    }

    console.log("✔ Users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

export async function seedCourses() {
  try {
    // Get a teacher user to assign courses to
    const teacherUser = await db.user.findFirst({
      where: { email: "shohel.xponent@gmail.com" },
    });

    if (!teacherUser) {
      console.log("⚠ No teacher user found. Creating courses skipped.");
      return;
    }

    // Check if teacher profile exists, if not create one
    let teacherProfile = await db.teacherProfile.findUnique({
      where: { userId: teacherUser.id },
    });

    if (!teacherProfile) {
      // Get a teacher rank
      const teacherRank = await db.teacherRank.findFirst({
        where: { name: "Three Star" },
      });

      teacherProfile = await db.teacherProfile.create({
        data: {
          userId: teacherUser.id,
          teacherStatus: "VERIFIED",
          teacherRankId: teacherRank?.id,
          subjectSpecializations: ["ডিজিটাল মার্কেটিং", "ওয়েব ডেভেলপমেন্ট"],
          yearsOfExperience: "৫+ বছর",
          expertiseLevel: "EXPERT",
        },
      });
      console.log(`✔ Created teacher profile for ${teacherUser.email}`);
    }

    // Get categories
    const seoCategory = await db.category.findUnique({
      where: { slug: "seo" },
    });
    const webDevCategory = await db.category.findUnique({
      where: { slug: "web-development" },
    });
    const graphicsCategory = await db.category.findUnique({
      where: { slug: "graphics-design" },
    });

    // Course 1: SEO Course
    const course1 = await db.course.upsert({
      where: { slug: "complete-seo-course-bangla" },
      update: {},
      create: {
        title: "কমপ্লিট SEO কোর্স - বাংলা",
        slug: "complete-seo-course-bangla",
        description:
          "এই কোর্সে আপনি শিখবেন কিভাবে সার্চ ইঞ্জিন অপটিমাইজেশন করতে হয়, কিভাবে ওয়েবসাইট র‌্যাংক করাতে হয়, এবং কিভাবে অর্গানিক ট্রাফিক বাড়ানো যায়।",
        imageUrl:
          "https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/6763b0f4d742a87e9321b996/1757570813245-Abul Kashem.jpg",
        totalDuration: 720, // 12 hours in minutes
        learningOutcomes: [
          "SEO এর মৌলিক ধারণা এবং কৌশল",
          "কিওয়ার্ড রিসার্চ এবং অ্যানালাইসিস",
          "অন-পেজ এবং অফ-পেজ SEO",
          "টেকনিক্যাল SEO এবং সাইট অডিট",
          "লিংক বিল্ডিং স্ট্রাটেজি",
        ],
        requirements: [
          "কম্পিউটার এবং ইন্টারনেট সংযোগ",
          "ইংরেজি ভাষার মৌলিক জ্ঞান",
          "ওয়েবসাইট সম্পর্কে প্রাথমিক ধারণা",
        ],
        whoFor: [
          "ডিজিটাল মার্কেটিং শিখতে আগ্রহী যে কেউ",
          "ব্লগার এবং কনটেন্ট ক্রিয়েটর",
          "ওয়েবসাইট মালিক",
          "ফ্রিল্যান্সার",
        ],
        isPublished: true,
        courseType: "MINI",
        ownership: "TEACHER",
        courseMode: "RECORDED",
        teacherProfileId: teacherProfile.id,
        categoryId: seoCategory?.id,
        prices: {
          create: {
            isFree: false,
            regularAmount: 2999,
            discountedAmount: 1999,
            frequency: "LIFETIME",
            isLifeTime: true,
          },
        },
      },
    });

    // Add lessons for Course 1
    const course1Lessons = [
      {
        title: "SEO কী এবং কেন গুরুত্বপূর্ণ?",
        slug: "what-is-seo-and-why-important",
        description: "SEO এর মৌলিক পরিচিতি এবং এর প্রয়োজনীয়তা",
        position: 1,
        isPublished: true,
        isFree: true,
        duration: 25,
      },
      {
        title: "সার্চ ইঞ্জিন কিভাবে কাজ করে?",
        slug: "how-search-engines-work",
        description: "সার্চ ইঞ্জিনের কার্যপ্রণালী বিস্তারিত",
        position: 2,
        isPublished: true,
        isFree: false,
        duration: 35,
      },
      {
        title: "কিওয়ার্ড রিসার্চ - পার্ট ১",
        slug: "keyword-research-part-1",
        description: "কিভাবে সঠিক কিওয়ার্ড খুঁজে বের করবেন",
        position: 3,
        isPublished: true,
        isFree: false,
        duration: 45,
      },
      {
        title: "অন-পেজ SEO টেকনিক",
        slug: "on-page-seo-techniques",
        description: "পেজ অপ্টিমাইজেশনের বিস্তারিত কৌশল",
        position: 4,
        isPublished: true,
        isFree: false,
        duration: 50,
      },
      {
        title: "ব্যাকলিংক স্ট্রাটেজি",
        slug: "backlink-strategy",
        description: "কোয়ালিটি ব্যাকলিংক তৈরির উপায়",
        position: 5,
        isPublished: true,
        isFree: false,
        duration: 40,
      },
    ];

    for (const lesson of course1Lessons) {
      await db.lesson.upsert({
        where: {
          courseId_slug: {
            courseId: course1.id,
            slug: lesson.slug,
          },
        },
        update: {},
        create: {
          ...lesson,
          courseId: course1.id,
          videoStatus: "READY",
        },
      });
    }

    console.log(
      `✔ Created course: ${course1.title} with ${course1Lessons.length} lessons`
    );

    // Course 2: Web Development Course
    const course2 = await db.course.upsert({
      where: { slug: "web-development-bangla" },
      update: {},
      create: {
        title: "ওয়েব ডেভেলপমেন্ট মাস্টারক্লাস - বাংলা",
        slug: "web-development-bangla",
        description:
          "সম্পূর্ণ বাংলায় ওয়েব ডেভেলপমেন্ট শিখুন। HTML, CSS, JavaScript থেকে শুরু করে React এবং Next.js পর্যন্ত সবকিছু।",
        imageUrl:
          "https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/6763b0f4d742a87e9321b996/1757570813245-Abul Kashem.jpg",
        totalDuration: 1800, // 30 hours
        learningOutcomes: [
          "HTML, CSS, এবং JavaScript এর সম্পূর্ণ জ্ঞান",
          "React এবং Next.js দিয়ে মডার্ন অ্যাপ তৈরি",
          "Responsive ওয়েবসাইট ডিজাইন",
          "API ইন্টিগ্রেশন এবং Database",
          "Deployment এবং Hosting",
        ],
        requirements: [
          "কম্পিউটারের মৌলিক জ্ঞান",
          "ইংরেজি পড়ার সক্ষমতা",
          "শেখার ইচ্ছা এবং ধৈর্য",
        ],
        whoFor: [
          "ওয়েব ডেভেলপার হতে চান যারা",
          "কম্পিউটার সায়েন্স স্টুডেন্ট",
          "ক্যারিয়ার চেঞ্জ করতে চান যারা",
          "ফ্রিল্যান্সিং করতে চান",
        ],
        isPublished: true,
        courseType: "SHORT",
        ownership: "TEACHER",
        courseMode: "RECORDED",
        teacherProfileId: teacherProfile.id,
        categoryId: webDevCategory?.id,
        prices: {
          create: {
            isFree: false,
            regularAmount: 4999,
            discountedAmount: 2999,
            frequency: "LIFETIME",
            isLifeTime: true,
          },
        },
      },
    });

    // Add lessons for Course 2
    const course2Lessons = [
      {
        title: "ওয়েব ডেভেলপমেন্ট পরিচিতি",
        slug: "introduction-to-web-development",
        description: "ওয়েব ডেভেলপমেন্টের মৌলিক ধারণা",
        position: 1,
        isPublished: true,
        isFree: true,
        duration: 30,
      },
      {
        title: "HTML বেসিক টু অ্যাডভান্স",
        slug: "html-basic-to-advanced",
        description: "HTML শেখার সম্পূর্ণ গাইড",
        position: 2,
        isPublished: true,
        isFree: false,
        duration: 120,
      },
      {
        title: "CSS মাস্টারক্লাস",
        slug: "css-masterclass",
        description: "CSS দিয়ে সুন্দর ডিজাইন তৈরি",
        position: 3,
        isPublished: true,
        isFree: false,
        duration: 150,
      },
      {
        title: "JavaScript ফান্ডামেন্টাল",
        slug: "javascript-fundamentals",
        description: "JavaScript এর মূল বিষয়সমূহ",
        position: 4,
        isPublished: true,
        isFree: false,
        duration: 180,
      },
      {
        title: "React দিয়ে UI তৈরি",
        slug: "building-ui-with-react",
        description: "React এর সাথে পরিচয় এবং প্রজেক্ট",
        position: 5,
        isPublished: true,
        isFree: false,
        duration: 200,
      },
      {
        title: "Next.js দিয়ে ফুল স্ট্যাক অ্যাপ",
        slug: "fullstack-app-with-nextjs",
        description: "Next.js দিয়ে সম্পূর্ণ অ্যাপ্লিকেশন তৈরি",
        position: 6,
        isPublished: true,
        isFree: false,
        duration: 240,
      },
    ];

    for (const lesson of course2Lessons) {
      await db.lesson.upsert({
        where: {
          courseId_slug: {
            courseId: course2.id,
            slug: lesson.slug,
          },
        },
        update: {},
        create: {
          ...lesson,
          courseId: course2.id,
          videoStatus: "READY",
        },
      });
    }

    console.log(
      `✔ Created course: ${course2.title} with ${course2Lessons.length} lessons`
    );

    // Course 3: Graphics Design Course
    const course3 = await db.course.upsert({
      where: { slug: "graphics-design-complete-course" },
      update: {},
      create: {
        title: "গ্রাফিক্স ডিজাইন কমপ্লিট কোর্স",
        slug: "graphics-design-complete-course",
        description:
          "Adobe Photoshop এবং Illustrator দিয়ে প্রফেশনাল গ্রাফিক্স ডিজাইন শিখুন। লোগো, পোস্টার, ব্যানার সবকিছু।",
        imageUrl:
          "https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/6763b0f4d742a87e9321b996/1757570813245-Abul Kashem.jpg",
        totalDuration: 900, // 15 hours
        learningOutcomes: [
          "Photoshop এবং Illustrator এ দক্ষতা",
          "লোগো এবং ব্র্যান্ড ডিজাইন",
          "সোশ্যাল মিডিয়া গ্রাফিক্স তৈরি",
          "প্রিন্ট ডিজাইন এবং টাইপোগ্রাফি",
          "পোর্টফোলিও তৈরি",
        ],
        requirements: [
          "কম্পিউটার (Windows/Mac)",
          "Adobe Creative Cloud সাবস্ক্রিপশন",
          "ডিজাইনের প্রতি আগ্রহ",
        ],
        whoFor: [
          "গ্রাফিক্স ডিজাইনার হতে চান যারা",
          "মার্কেটিং প্রফেশনাল",
          "সোশ্যাল মিডিয়া ম্যানেজার",
          "ফ্রিল্যান্সার",
        ],
        isPublished: true,
        courseType: "MINI",
        ownership: "TEACHER",
        courseMode: "RECORDED",
        teacherProfileId: teacherProfile.id,
        categoryId: graphicsCategory?.id,
        prices: {
          create: {
            isFree: false,
            regularAmount: 3499,
            discountedAmount: 1999,
            frequency: "LIFETIME",
            isLifeTime: true,
          },
        },
      },
    });

    // Add lessons for Course 3
    const course3Lessons = [
      {
        title: "গ্রাফিক্স ডিজাইন পরিচিতি",
        slug: "introduction-to-graphics-design",
        description: "গ্রাফিক্স ডিজাইনের বেসিক",
        position: 1,
        isPublished: true,
        isFree: true,
        duration: 20,
      },
      {
        title: "Photoshop ইন্টারফেস এবং টুলস",
        slug: "photoshop-interface-and-tools",
        description: "Photoshop এর সাথে পরিচয়",
        position: 2,
        isPublished: true,
        isFree: false,
        duration: 60,
      },
      {
        title: "লোগো ডিজাইন প্রজেক্ট",
        slug: "logo-design-project",
        description: "প্রফেশনাল লোগো তৈরির কৌশল",
        position: 3,
        isPublished: true,
        isFree: false,
        duration: 90,
      },
      {
        title: "সোশ্যাল মিডিয়া পোস্ট ডিজাইন",
        slug: "social-media-post-design",
        description: "Facebook, Instagram পোস্ট তৈরি",
        position: 4,
        isPublished: true,
        isFree: false,
        duration: 75,
      },
      {
        title: "Illustrator দিয়ে ভেক্টর ডিজাইন",
        slug: "vector-design-with-illustrator",
        description: "Illustrator এর মূল বিষয়",
        position: 5,
        isPublished: true,
        isFree: false,
        duration: 100,
      },
    ];

    for (const lesson of course3Lessons) {
      await db.lesson.upsert({
        where: {
          courseId_slug: {
            courseId: course3.id,
            slug: lesson.slug,
          },
        },
        update: {},
        create: {
          ...lesson,
          courseId: course3.id,
          videoStatus: "READY",
        },
      });
    }

    console.log(
      `✔ Created course: ${course3.title} with ${course3Lessons.length} lessons`
    );
    console.log("✔ All courses seeded successfully!");
  } catch (error) {
    console.error("Error seeding courses:", error);
    throw error;
  }
}
// ------------------ Seed Students ------------------
const studentsData = [
  {
    name: "রাফি আহমেদ",
    email: "rafi.ahmed@example.com",
    username: "rafi-ahmed",
    phoneNumber: "+8801712345601",
    city: "ঢাকা",
    profession: "ছাত্র",
  },
  {
    name: "তাসনিম হাসান",
    email: "tasnim.hasan@example.com",
    username: "tasnim-hasan",
    phoneNumber: "+8801712345602",
    city: "চট্টগ্রাম",
    profession: "ওয়েব ডেভেলপার",
  },
  {
    name: "সাকিব রহমান",
    email: "sakib.rahman@example.com",
    username: "sakib-rahman",
    phoneNumber: "+8801712345603",
    city: "সিলেট",
    profession: "গ্রাফিক্স ডিজাইনার",
  },
  {
    name: "নুসরাত জাহান",
    email: "nusrat.jahan@example.com",
    username: "nusrat-jahan",
    phoneNumber: "+8801712345604",
    city: "রাজশাহী",
    profession: "ডিজিটাল মার্কেটার",
  },
  {
    name: "মাহমুদ হাসান",
    email: "mahmud.hasan@example.com",
    username: "mahmud-hasan",
    phoneNumber: "+8801712345605",
    city: "খুলনা",
    profession: "ফ্রিল্যান্সার",
  },
];

export async function seedStudents() {
  console.log("Seeding students...");

  try {
    const password = "student123";
    const hashedPassword = await bcrypt.hash(password, 10);

    for (const studentData of studentsData) {
      const existingUser = await db.user.findUnique({
        where: { email: studentData.email },
      });

      if (existingUser) {
        console.log(`Student already exists: ${studentData.email}`);
        continue;
      }

      const referralCode = `STU${studentData.username
        .toUpperCase()
        .replace(/-/g, "")}${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      const user = await db.user.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          username: studentData.username,
          password: hashedPassword,
          emailVerified: true,
          role: Role.STUDENT,
          accountStatus: UserAccountStatus.ACTIVE,
          referralCode: referralCode,
          phoneNumber: studentData.phoneNumber,
          city: studentData.city,
          profession: studentData.profession,
          country: "Bangladesh",
        },
      });

      await db.studentProfile.create({
        data: {
          userId: user.id,
        },
      });

      console.log(
        `✔ Created student: ${studentData.email} with referral code: ${referralCode}`
      );
    }

    console.log("✔ Students seeded successfully!");
  } catch (error) {
    console.error("Error seeding students:", error);
    throw error;
  }
}

// ------------------ Seed Teachers ------------------
const teachersData = [
  {
    name: "আবুল কালাম",
    email: "abul.kalam@example.com",
    username: "abul-kalam",
    phoneNumber: "+8801712345701",
    city: "ঢাকা",
    profession: "সিনিয়র ডেভেলপার",
    subjectSpecializations: ["ওয়েব ডেভেলপমেন্ট", "JavaScript", "React"],
    yearsOfExperience: "৮+ বছর",
    expertiseLevel: "EXPERT",
  },
  {
    name: "ফারহানা আক্তার",
    email: "farhana.akter@example.com",
    username: "farhana-akter",
    phoneNumber: "+8801712345702",
    city: "চট্টগ্রাম",
    profession: "ডিজিটাল মার্কেটিং এক্সপার্ট",
    subjectSpecializations: ["SEO", "সোশ্যাল মিডিয়া মার্কেটিং", "কনটেন্ট মার্কেটিং"],
    yearsOfExperience: "৬+ বছর",
    expertiseLevel: "EXPERT",
  },
  {
    name: "কামরুল হাসান",
    email: "kamrul.hasan@example.com",
    username: "kamrul-hasan",
    phoneNumber: "+8801712345703",
    city: "সিলেট",
    profession: "ক্রিয়েটিভ ডিজাইনার",
    subjectSpecializations: ["গ্রাফিক্স ডিজাইন", "UI/UX ডিজাইন", "লোগো ডিজাইন"],
    yearsOfExperience: "৫+ বছর",
    expertiseLevel: "MID_LEVEL",
  },
];

export async function seedTeachers() {
  console.log("Seeding teachers...");

  try {
    const password = "teacher123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacherRank = await db.teacherRank.findFirst({
      where: { name: "Three Star" },
    });

    for (const teacherData of teachersData) {
      const existingUser = await db.user.findUnique({
        where: { email: teacherData.email },
      });

      if (existingUser) {
        console.log(`Teacher already exists: ${teacherData.email}`);
        continue;
      }

      const referralCode = `TCH${teacherData.username
        .toUpperCase()
        .replace(/-/g, "")}${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      const user = await db.user.create({
        data: {
          name: teacherData.name,
          email: teacherData.email,
          username: teacherData.username,
          password: hashedPassword,
          emailVerified: true,
          role: Role.TEACHER,
          accountStatus: UserAccountStatus.ACTIVE,
          referralCode: referralCode,
          phoneNumber: teacherData.phoneNumber,
          city: teacherData.city,
          profession: teacherData.profession,
          country: "Bangladesh",
        },
      });

      await db.teacherProfile.create({
        data: {
          userId: user.id,
          teacherStatus: "VERIFIED",
          teacherRankId: teacherRank?.id,
          subjectSpecializations: teacherData.subjectSpecializations,
          yearsOfExperience: teacherData.yearsOfExperience,
          expertiseLevel: teacherData.expertiseLevel,
        },
      });

      console.log(
        `✔ Created teacher: ${teacherData.email} with referral code: ${referralCode}`
      );
    }

    console.log("✔ Teachers seeded successfully!");
  } catch (error) {
    console.error("Error seeding teachers:", error);
    throw error;
  }
}

// ------------------ Seed Wallets with Credits ------------------
export async function seedWalletsAndCredits() {
  console.log("Seeding wallets and credits...");

  try {
    const students = await db.user.findMany({
      where: { role: Role.STUDENT },
    });

    for (const student of students) {
      const existingWallet = await db.wallet.findUnique({
        where: { userId: student.id },
      });

      if (existingWallet) {
        console.log(`Wallet already exists for user: ${student.email}`);
        continue;
      }

      // Random credit amounts between 100 and 2000
      const creditAmount = Math.floor(Math.random() * (2000 - 100 + 1)) + 100;
      
      // Create wallet
      const wallet = await db.wallet.create({
        data: {
          userId: student.id,
          totalCredits: creditAmount,
          availableCredits: creditAmount,
          lifetimeEarnedCredits: creditAmount,
        },
      });

      // Create credit lot (expires in 1 year)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const createdLot = await db.creditLot.create({
        data: {
          walletId: wallet.id,
          initialAmount: creditAmount,
          remainingAmount: creditAmount,
          expiresAt: expiryDate,
          source: "REFERRAL_BONUS",
          metadata: {
            description: "Initial referral bonus credits",
          },
        },
      });

      // Create wallet transaction for initial credit and link the credit lot via generic reference fields
      await db.walletTransaction.create({
        data: {
          wallet: { connect: { id: wallet.id } },
          type: "REFERRAL_BONUS",
          amount: creditAmount,
          balanceBefore: 0,
          balanceAfter: creditAmount,
          status: "COMPLETED",
          description: "Initial referral bonus credits",
          idempotencyKey: `init-${wallet.id}-${Date.now()}`,
          metadata: {
            source: "seed_data",
            reason: "initial_credits",
          },
          referenceType: 'CREDIT_LOT',
          referenceId: createdLot.id,
        },
      });

      console.log(
        `✔ Created wallet for ${student.email} with ${creditAmount} credits`
      );
    }

    console.log("✔ Wallets and credits seeded successfully!");
  } catch (error) {
    console.error("Error seeding wallets and credits:", error);
    throw error;
  }
}

// ------------------ Seed Additional Wallet Transactions ------------------
export async function seedWalletTransactions() {
  console.log("Seeding additional wallet transactions...");

  try {
    const wallets = await db.wallet.findMany({
      include: { user: true },
    });

    const transactionTypes = [
      "REFERRAL_BONUS",
      "MILESTONE_BONUS",
      "ADMIN_CREDIT",
      "PROMOTIONAL",
    ];

    for (const wallet of wallets) {
      // Create 2-4 random transactions per wallet
      const numTransactions = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < numTransactions; i++) {
        const transactionType =
          transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const amount = Math.floor(Math.random() * 500) + 50;
        const balanceBefore = wallet.availableCredits;
        const balanceAfter = balanceBefore + amount;

        // Create random date within last 3 months
        const createdDate = new Date();
        createdDate.setDate(
          createdDate.getDate() - Math.floor(Math.random() * 90)
        );

        // For credit-adding transactions, create a credit lot and link it
        let createdTxnData = {
          walletId: wallet.id,
          type: transactionType,
          amount: amount,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          status: "COMPLETED",
          description: `${transactionType.replace(/_/g, " ").toLowerCase()} credit`,
          idempotencyKey: `trans-${wallet.id}-${Date.now()}-${i}`,
          createdAt: createdDate,
          metadata: {
            transactionNumber: i + 1,
            userId: wallet.userId,
          },
        };

        if (["REFERRAL_BONUS", "MILESTONE_BONUS", "ADMIN_CREDIT", "PROMOTIONAL"].includes(transactionType)) {
          const lotExpiry = new Date();
          lotExpiry.setMonth(lotExpiry.getMonth() + 12);
          const createdLot = await db.creditLot.create({
            data: {
              walletId: wallet.id,
              initialAmount: amount,
              remainingAmount: amount,
              expiresAt: lotExpiry,
              source: transactionType,
              metadata: { seed: true },
            },
          });

          // store the credit lot id on the transaction using generic reference fields
          createdTxnData.referenceType = 'CREDIT_LOT';
          createdTxnData.referenceId = createdLot.id;
        }

        // use nested wallet connect instead of walletId scalar
        if (createdTxnData.walletId) delete createdTxnData.walletId;
        createdTxnData.wallet = { connect: { id: wallet.id } };
        await db.walletTransaction.create({ data: createdTxnData });

        // Update wallet
        await db.wallet.update({
          where: { id: wallet.id },
          data: {
            totalCredits: { increment: amount },
            availableCredits: { increment: amount },
            lifetimeEarnedCredits: { increment: amount },
          },
        });
      }

      console.log(
        `✔ Created ${numTransactions} transactions for ${wallet.user.email}`
      );
    }

    console.log("✔ Wallet transactions seeded successfully!");
  } catch (error) {
    console.error("Error seeding wallet transactions:", error);
    throw error;
  }
}

// ------------------ Seed Purchases & Invoice History ------------------
export async function seedPurchasesAndInvoices() {
  console.log("Seeding purchases (invoices) and payments...");

  try {
    // Pick some students who have wallets
    const students = await db.user.findMany({ where: { role: Role.STUDENT } });

    if (!students || students.length === 0) {
      console.log('⚠ No students found for purchases seeding.');
      return;
    }

    // Use first 3 students for invoice history
    const selected = students.slice(0, 3);

    for (const [idx, student] of selected.entries()) {
      const studentProfile = await db.studentProfile.findUnique({ where: { userId: student.id } });
      const wallet = await db.wallet.findUnique({ where: { userId: student.id } });

      if (!studentProfile) {
        console.log(`⚠ No student profile for ${student.email}, skipping invoice`);
        continue;
      }

      // Create a purchase (invoice)
      const totalAmount = 1999 + idx * 500; // vary amounts
      // Use some credits up to 80% if wallet exists
      let creditsUsedTk = 0;
      let creditsUsed = 0;

      if (wallet && wallet.availableCredits > 0) {
        // available credits are stored as credits; 100 credits = 1 BDT
        // convert available credits to BDT
        const availableTk = wallet.availableCredits / 100;
        const maxAllowedTk = totalAmount * 0.8;
        creditsUsedTk = Math.min(availableTk, maxAllowedTk);
        creditsUsed = Math.round(creditsUsedTk * 100); // back to credits
      }

      const remainingAmount = Math.max(0, totalAmount - creditsUsedTk);

      const purchase = await db.purchase.create({
        data: {
          studentProfileId: studentProfile.id,
          purchaseType: 'SINGLE_COURSE',
          totalAmountTk: totalAmount,
          creditsUsedTk: creditsUsedTk,
          totalPaidTk: totalAmount - remainingAmount,
          remainingAmountTk: remainingAmount,
          paymentStatus: remainingAmount === 0 ? 'COMPLETED' : 'PENDING',
        },
      });

      // If credits used, create a CreditPayment and a WalletTransaction deduction
      if (creditsUsed > 0 && wallet) {
        const transactionId = `seed-credit-${wallet.id}-${Date.now()}-${idx}`;

        await db.creditPayment.create({
          data: {
            purchaseId: purchase.id,
            amountTk: creditsUsedTk,
            walletId: wallet.id,
            transactionId,
            status: 'COMPLETED',
            idempotencyKey: `seed-credit-${purchase.id}-${transactionId}`,
          },
        });

        // Create wallet transaction (deduction)
        const balanceBefore = wallet.availableCredits;
        const deductCredits = Math.min(wallet.availableCredits, creditsUsed);
        const balanceAfter = balanceBefore - deductCredits;

        // create wallet transaction for deduction and attach purchaseId
        await db.walletTransaction.create({
          data: {
            wallet: { connect: { id: wallet.id } },
            type: 'PURCHASE_DEDUCTION',
            amount: -deductCredits,
            balanceBefore: balanceBefore,
            balanceAfter: balanceAfter,
            status: 'COMPLETED',
            description: `Used ${creditsUsedTk} BDT credits for purchase ${purchase.id}`,
            idempotencyKey: `seed-wallet-trans-${wallet.id}-${purchase.id}-${Date.now()}`,
            metadata: { purchaseId: purchase.id, seed: true },
            purchase: { connect: { id: purchase.id } },
            referenceType: 'PURCHASE',
            referenceId: purchase.id,
          },
        });
        // Update wallet numbers
        await db.wallet.update({
          where: { id: wallet.id },
          data: {
            availableCredits: balanceAfter,
            usedCredits: { increment: deductCredits },
            totalCredits: { decrement: 0 },
          },
        });

        // Deduct from credit lots FIFO
        const lots = await db.creditLot.findMany({ where: { walletId: wallet.id, remainingAmount: { gt: 0 }, isExpired: false }, orderBy: { expiresAt: 'asc' } });
        let remainingToDeduct = deductCredits;
        // running balance starts at the original balanceBefore
        let runningBalanceBefore = balanceBefore;
        for (const lot of lots) {
          if (remainingToDeduct <= 0) break;
          const take = Math.min(lot.remainingAmount, remainingToDeduct);
          await db.creditLot.update({ where: { id: lot.id }, data: { remainingAmount: { decrement: take } } });
          // compute per-lot transaction balances
          const lotBalanceBefore = runningBalanceBefore;
          const lotBalanceAfter = lotBalanceBefore - take;
          // create a transaction linking to the lot for traceability (store lot id in metadata)
          await db.walletTransaction.create({
            data: {
              wallet: { connect: { id: wallet.id } },
              type: 'PURCHASE_DEDUCTION',
              amount: -take,
              balanceBefore: lotBalanceBefore,
              balanceAfter: lotBalanceAfter,
              status: 'COMPLETED',
              description: `Deducted ${take} credits from lot ${lot.id} for purchase ${purchase.id}`,
              idempotencyKey: `seed-lot-deduct-${wallet.id}-${lot.id}-${purchase.id}-${Date.now()}`,
              // Link to the purchase explicitly and record lot id in metadata for traceability
              purchase: { connect: { id: purchase.id } },
              referenceType: 'PURCHASE',
              referenceId: purchase.id,
              metadata: { lotDeduction: true, seed: true, lotId: lot.id },
            },
          });
          // update running balance and remainingToDeduct
          runningBalanceBefore = lotBalanceAfter;
          remainingToDeduct -= take;
        }
      }

      // If still remainingAmount and small, create a CashPayment to mark invoice paid
      if (remainingAmount > 0 && remainingAmount <= 500) {
        await db.cashPayment.create({
          data: {
            purchaseId: purchase.id,
            amountTk: remainingAmount,
            status: 'COMPLETED',
            idempotencyKey: `seed-cash-${purchase.id}-${Date.now()}`,
            receivedAt: new Date(),
          },
        });

        // Mark purchase as completed
        await db.purchase.update({ where: { id: purchase.id }, data: { paymentStatus: 'COMPLETED', fullyPaidAt: new Date(), totalPaidTk: totalAmount } });
      }

      console.log(`✔ Created invoice (purchase) ${purchase.id} for ${student.email}`);
    }

    console.log('✔ Purchases and invoice history seeded successfully!');
  } catch (error) {
    console.error('Error seeding purchases/invoices:', error);
    throw error;
  }
}

// ------------------ Update Main Seed Function ------------------
async function seedAll() {
  try {
    console.log("Starting seeding process...");
    await seedCategory();
    await seedRank();
    await seedDiscount();
    await seedSubscriptionPlan();
    await seedUsers();
    await seedCourses();
    await seedStudents();
    await seedTeachers();
    await seedWalletsAndCredits();
    await seedWalletTransactions();
    await seedPurchasesAndInvoices();
    await seedReferralsAndStats();

    console.log("✔ All seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await db.$disconnect();
  }
}

// Seed All
// async function seedAll() {
//   try {
//     console.log("Starting seeding process...");
//     await seedCategory();
//     await seedRank();
//     await seedDiscount();
//     await seedSubscriptionPlan();
//     await seedUsers();
//     await seedCourses();

//     console.log("✔ All seeding completed successfully!");
//   } catch (error) {
//     console.error("Error during seeding:", error);
//   } finally {
//     await db.$disconnect();
//   }
// }

// Run the seed function
seedAll();

// ------------------ Seed Referrals & ReferrerStats ------------------
export async function seedReferralsAndStats() {
  console.log('Seeding referrals and referrer stats...');

  try {
    // pick first teacher as referrer
    const teachers = await db.user.findMany({ where: { role: Role.TEACHER } });
    const students = await db.user.findMany({ where: { role: Role.STUDENT } });

    if (!teachers.length || !students.length) {
      console.log('⚠ Not enough users for referrals seeding.');
      return;
    }

    const referrer = teachers[0];

    // Create a few referrals linking students to the teacher
    for (let i = 0; i < Math.min(3, students.length); i++) {
      const referee = students[i];
      // avoid duplicates
      const existing = await db.referral.findFirst({ where: { refereeUserId: referee.id } });
      if (existing) continue;

      const referral = await db.referral.create({
        data: {
          referrerUserId: referrer.id,
          refereeUserId: referee.id,
          referrerType: 'TEACHER',
          program: 'TEACHER_REF',
          referralCode: `REF-${referrer.username}-${i}`,
          status: 'REGISTERED',
          idempotencyKey: `seed-ref-${referrer.id}-${referee.id}`,
          registeredAt: new Date(),
        },
      });

      // Create a commission record for teacher
      // Prefer to link the commission to a purchase made by the referee if available
      const refereeProfile = await db.studentProfile.findUnique({ where: { userId: referee.id } });
      let sourcePurchase = null;
      if (refereeProfile) {
        sourcePurchase = await db.purchase.findFirst({ where: { studentProfileId: refereeProfile.id } });
      }
      if (!sourcePurchase) {
        // fallback to any existing purchase
        sourcePurchase = await db.purchase.findFirst();
      }

      if (!sourcePurchase) {
        console.log(`⚠ No purchase found to attach commission for referee ${referee.email}, skipping commission creation.`);
      } else {
        await db.referrerCommission.create({
          data: {
            referralId: referral.id,
            beneficiaryUserId: referrer.id,
            sourcePurchaseId: sourcePurchase.id,
            amountTk: 500,
            status: 'PENDING',
            idempotencyKey: `seed-comm-${referral.id}`,
          },
        });
      }
    }

    // Update/create referrer stats
    const existingStats = await db.referrerStats.findUnique({ where: { referrerUserId: referrer.id } });
    const totalReferees = await db.referral.count({ where: { referrerUserId: referrer.id } });
    const cashEarningsPending = await db.referrerCommission.aggregate({ _sum: { amountTk: true }, where: { beneficiaryUserId: referrer.id, status: 'PENDING' } });
    const approvedSum = await db.referrerCommission.aggregate({ _sum: { amountTk: true }, where: { beneficiaryUserId: referrer.id, status: 'APPROVED' } });
    const paidSum = await db.referrerCommission.aggregate({ _sum: { amountTk: true }, where: { beneficiaryUserId: referrer.id, status: 'PAID' } });

    if (existingStats) {
      await db.referrerStats.update({ where: { referrerUserId: referrer.id }, data: { totalReferees, cashEarningsPending: cashEarningsPending._sum.amountTk || 0, cashEarningsApproved: approvedSum._sum.amountTk || 0, cashEarningsPaid: paidSum._sum.amountTk || 0, lifetimeRevenueFromReferees: (approvedSum._sum.amountTk || 0) + (paidSum._sum.amountTk || 0) } });
    } else {
      await db.referrerStats.create({ data: { referrerUserId: referrer.id, totalReferees, cashEarningsPending: cashEarningsPending._sum.amountTk || 0, cashEarningsApproved: approvedSum._sum.amountTk || 0, cashEarningsPaid: paidSum._sum.amountTk || 0, lifetimeRevenueFromReferees: (approvedSum._sum.amountTk || 0) + (paidSum._sum.amountTk || 0) } });
    }

    console.log('✔ Referrals and referrer stats seeded');
  } catch (error) {
    console.error('Error seeding referrals/stats:', error);
    throw error;
  }
}
