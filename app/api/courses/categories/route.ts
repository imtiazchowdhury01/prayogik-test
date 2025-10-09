// api/courses/categories/route.ts
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextResponse } from "next/server";

interface CreateCategoryRequest {
  name: string;
  slug: string;
  parentCategoryId?: string | null;
  isChild?: boolean;
}

interface UpdateCategoryRequest {
  id: string;
  name: string;
  slug: string;
  parentCategoryId?: string | null;
  isChild?: boolean;
}

interface DeleteCategoryRequest {
  id: string;
}

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
    console.error("[GET_CATEGORIES_ERROR]", error);
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

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if admin user
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 403 });
    }

    const body: CreateCategoryRequest = await request.json();
    const { name, slug, parentCategoryId, isChild } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await db.category.findUnique({
      where: {
        slug,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = await db.category.create({
      data: {
        name,
        slug,
        parentCategoryId: parentCategoryId || null,
        isChild: isChild ?? false,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("[CREATE_CATEGORY_ERROR]", error);
    return NextResponse.json(
      { message: "An error occurred while creating the category" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing category
export async function PUT(request: Request) {
  try {
    const { userId, isAdmin } = await getServerUserSession(request);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 403 });
    }

    const body: UpdateCategoryRequest = await request.json();
    const { id, name, slug, parentCategoryId, isChild } = body;

    if (!id || !name || !slug) {
      return NextResponse.json(
        { error: "ID, name, and slug are required" },
        { status: 400 }
      );
    }

    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        name,
        slug,
        parentCategoryId: parentCategoryId || null,
        isChild: isChild ?? undefined,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("[UPDATE_CATEGORY_ERROR]", error);
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

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if admin user
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Unauthorized Admin", { status: 403 });
    }

    const body: DeleteCategoryRequest = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("[DELETE_CATEGORY_ERROR]", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the category" },
      { status: 500 }
    );
  }
}
