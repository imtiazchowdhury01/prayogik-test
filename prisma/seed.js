import { PrismaClient, SubscriptionType } from "@prisma/client";
const db = new PrismaClient();

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
        name: "ওয়েব ডিজাইন ও ডেভেলপমেন্ট",
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
  } finally {
    await db.$disconnect();
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
        where: { name: rank.name }, // Use `name` as the unique identifier
        update: { ...rank }, // Update with the new data if it exists
        create: { ...rank }, // Create with the new data if it doesn't exist
      });
    }

    console.log("✔ Ranks seeded successfully!🔥");
  } catch (error) {
    console.error("Error seeding the database ranks", error);
    throw error; // Re-throw the error to handle it in the seed.ts file
  } finally {
    await db.$disconnect();
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
        where: { name: discount.name }, // Use `name` as the unique identifier
        update: { ...discount }, // Update with the new data if it exists
        create: { ...discount }, // Create with the new data if it doesn't exist
      });

      console.log(`Upserted discount with name: ${discount.name}`);
    }

    console.log("✔ Membership course price discount seeded successfully!🔥");
  } catch (error) {
    console.error("Error seeding membership course price discount", error);
    throw error; // Re-throw the error to handle it in the seed.ts file
  } finally {
    await db.$disconnect();
  }
}

const subscriptionPlanData = [
  {
    name: "Trial",
    type: SubscriptionType.NONE,
    regularPrice: 0,
    offerPrice: 0,
    durationInMonths: 1,
    durationInYears: 1,
    isTrial: true,
    trialDurationInDays: 30,
    isDefault: false,
  },
  {
    name: "1 Year Plan",
    type: SubscriptionType.YEARLY,
    regularPrice: 10000,
    offerPrice: 8000,
    durationInMonths: 1,
    durationInYears: 1,
    isTrial: false,
    trialDurationInDays: 30,
    isDefault: true,
  },
  {
    name: "2 Year Plan",
    type: SubscriptionType.YEARLY,
    regularPrice: 15000,
    offerPrice: 12000, // Example offer price
    durationInMonths: 1,
    durationInYears: 2,
    isTrial: false,
    trialDurationInDays: 30,
    isDefault: false,
  },

  {
    name: "3 Year Plan",
    type: SubscriptionType.YEARLY,
    regularPrice: 20000,
    offerPrice: 15000,
    durationInMonths: 1,
    durationInYears: 3,
    isTrial: false,
    trialDurationInDays: 30,
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
              isDefault: planData.isDefault,
              subscriptionDiscountId:
                planData.type === "NONE"
                  ? trialDiscount?.id
                  : defaultDiscount.id,
            },
          });
          console.log(`✔ Updated subscription plan: ${planData.name}`);
        } else {
          // Create new plan (exclude the hardcoded subscriptionDiscountId from planData)
          const { subscriptionDiscountId, ...planDataWithoutDiscountId } =
            planData;

          createdOrUpdatedPlan = await db.subscriptionPlan.create({
            data: {
              ...planDataWithoutDiscountId,
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

    console.log("✔ Subscription plans seeded successfully!🔥");
  } catch (error) {
    console.error("Error seeding the database subscription plans", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Seed All
async function seedAll() {
  try {
    console.log("Starting seeding process...");
    // await seedUsers();
    await seedCategory();
    await seedRank();
    await seedDiscount();
    await seedSubscriptionPlan();

    console.log("✔ All seeding completed successfully!🔥");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

// Run the seed function
seedAll();
