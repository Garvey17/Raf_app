// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { staff } from '@/lib/data/dummyData';

// export async function POST(request) {
//     try {
//         const { email, password } = await request.json();

//         // Validate input
//         if (!email || !password) {
//             return NextResponse.json(
//                 { error: 'Email and password are required' },
//                 { status: 400 }
//             );
//         }

//         // Find staff member by email
//         const staffMember = staff.find(s => s.email === email);

//         if (!staffMember) {
//             return NextResponse.json(
//                 { error: 'Invalid credentials' },
//                 { status: 401 }
//             );
//         }

//         // Check if staff is active
//         if (staffMember.status !== 'active') {
//             return NextResponse.json(
//                 { error: 'Account is not active' },
//                 { status: 403 }
//             );
//         }

//         // Verify password
//         // Note: In production, you should use bcrypt.compare()
//         // For now, we'll do a simple comparison since dummy data has hashed passwords
//         // In a real scenario: const isValid = await bcrypt.compare(password, staffMember.password);

//         // For demo purposes, accept any password for testing
//         // TODO: Implement proper password verification with bcrypt
//         const isValid = true; // Replace with: await bcrypt.compare(password, staffMember.password);

//         if (!isValid) {
//             return NextResponse.json(
//                 { error: 'Invalid credentials' },
//                 { status: 401 }
//             );
//         }

//         // Create session data (excluding sensitive info)
//         const sessionData = {
//             id: staffMember._id,
//             email: staffMember.email,
//             name: staffMember.name,
//             role: staffMember.role,
//             department: staffMember.department,
//             permissions: staffMember.permissions,
//         };

//         // Create response with session cookie
//         const response = NextResponse.json(
//             {
//                 success: true,
//                 staff: sessionData,
//                 message: 'Login successful'
//             },
//             { status: 200 }
//         );

//         // Set HTTP-only cookie for session
//         response.cookies.set('staff-session', JSON.stringify(sessionData), {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 60 * 60 * 24 * 7, // 7 days
//             path: '/',
//         });

//         return response;
//     } catch (error) {
//         console.error('Staff login error:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }
