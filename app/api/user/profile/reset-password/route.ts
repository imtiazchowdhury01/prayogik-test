import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerUserSession } from '@/lib/getServerUserSession';
import bcrypt from 'bcrypt';
import { ResetPasswordRequestSchema } from '@/lib/utils/openai/types';

/**
 * Resets the password for an authenticated user.
 *
 * Steps:
 * - Validates user session
 * - Parses and validates request body (`oldPassword`, `newPassword`)
 * - Verifies old password and ensures the new password is different
 * - Hashes and updates the new password in the database
 *
 * @param {Request} request - Incoming HTTP request with JSON body containing `oldPassword` and `newPassword`.
 * @returns {Promise<Response>} JSON response with success message or error.
 *
 * Status codes:
 * - 200: Password updated successfully
 * - 400: Validation failed or old/new password issues
 * - 401: Unauthorized (no valid session)
 * - 404: User not found
 * - 500: Internal server error
 */


export async function POST(request: Request) {
  try {
    // Validate session
    const { userId } = await getServerUserSession();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { oldPassword, newPassword } = ResetPasswordRequestSchema.parse(body);

    // Find user with password included
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      }
    });
    // console.log('user result:', userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    // Check if user has a password set
    if (!user.password) {
      return NextResponse.json(
        { error: 'User does not have a password set' },
        { status: 400 }
      );
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'আপনার দেওয়া পুরনো পাসওয়ার্ড ভুল হয়েছে।' },
        { status: 400 }
      );
    }

    // Check if new password is same as old
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'নতুন পাসওয়ার্ড পুরনো পাসওয়ার্ড থেকে ভিন্ন হতে হবে।' },
        { status: 400 }
      );
    }

    // Hash and update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        resetToken: null,
      },
    });
    // Clear reset token if it exists
    return NextResponse.json(
      { message: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।' },
      { status: 200 }
    );

  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}