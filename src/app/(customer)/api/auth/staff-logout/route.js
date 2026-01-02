import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Create response
        const response = NextResponse.json(
            { success: true, message: 'Logout successful' },
            { status: 200 }
        );

        // Clear the staff session cookie
        response.cookies.delete('staff-session');

        return response;
    } catch (error) {
        console.error('Staff logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
