export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { EventStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const title = searchParams.get('title') || undefined;
    const type = searchParams.get('type') as 'EOI' | 'PAID' | 'FREE' | undefined;
    const status = searchParams.get('status') as EventStatus| undefined;
    const isOnline = searchParams.get('isOnline') ? searchParams.get('isOnline') === 'true' : undefined;
    const sort = (searchParams.get('sort') as 'asc' | 'desc') || 'asc';

    // Validate pagination limits
    const validatedPage = Math.min(Math.max(page, 1), 50);
    const validatedLimit = Math.min(Math.max(limit, 1), 50);
    const skip = (validatedPage - 1) * validatedLimit;

    // Build where clause
    const whereClause: any = {
      status: status || 'UPCOMING',
      isPublished: true,
    };

    // Add optional filters
    if (title) {
      whereClause.title = {
        contains: title,
        mode: 'insensitive'
      };
    }

    if (type) {
      whereClause.type = type;
    }

    if (isOnline !== undefined) {
      whereClause.isOnline = isOnline;
    }

    // Get total count for pagination
    const totalEvents = await db.event.count({
      where: whereClause
    });

    // Fetch events with pagination and sorting
    const events = await db.event.findMany({
      where: whereClause,
      orderBy: {
        date: sort // Sort by event date
      },
      skip,
      take: validatedLimit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        price: true,
        date: true,
        isOnline: true,
        location: true,
        zoomLink: true,
        imageUrl: true,
        isPublished: true,
        mapLocation: true,
        type: true,
        status: true,
        faqs: true,
        speakers: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const totalPages = Math.ceil(totalEvents / validatedLimit);

    const response = {
      events,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        totalEvents,
        totalPages,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { 
        error: true, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}