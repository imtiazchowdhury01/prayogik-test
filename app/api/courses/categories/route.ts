// @ts-nocheck

import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

// GET: Fetch all categories
export async function GET(request: Request) {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        parentCategoryId: true,
        isChild: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            courses: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching categories" },
      { status: 500 }
    );
  }
}

// POST: Create a new category
export async function POST(request: Request) {
  try {
    const { userId } = await getServerUserSession(request);

    // Check if admin user
    const user = await db.user.findUnique({
      where: {
        id: userId,
        isAdmin: true,
      },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    const { name, slug, ...rest } = await request.json();
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const category = await db.category.findUnique({
      where: {
        slug,
      },
    });

    if (category) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = await db.category.create({
      data: { name, slug, ...rest },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the category" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing category
export async function PUT(request: Request) {
  try {
    const { isAdmin } = await getServerUserSession(request);

    if (!isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    const { id, name, slug, ...rest } = await request.json();
    // console.log({ id, name, slug });

    if (!id || !name || !slug) {
      return NextResponse.json(
        { error: "ID, name, and slug are required" },
        { status: 400 }
      );
    }

    const updatedCategory = await db.category.update({
      where: { id },
      data: { name, slug, ...rest },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the category" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a category
export async function DELETE(request: Request) {
  try {
    const { userId } = await getServerUserSession(request);

    // Check if admin user
    const user = await db.user.findUnique({
      where: {
        id: userId,
        isAdmin: true,
      },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the category" },
      { status: 500 }
    );
  }
}
