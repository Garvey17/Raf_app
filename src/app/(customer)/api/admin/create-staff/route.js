/**
 * Admin API Route - Create Staff Account
 * 
 * This endpoint allows admins to create new staff accounts.
 * Requires admin authentication.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Add this to your .env file
);

export async function POST(request) {
    try {
        const {
            email,
            password,
            name,
            role,
            department,
            phone = '',
            permissions = [],
            status = 'active',
            notes = ''
        } = await request.json();

        // Validate required fields
        if (!email || !password || !name || !role || !department) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Step 1: Create Supabase Auth user using Admin API
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                name,
                role,
            }
        });

        if (authError) {
            return NextResponse.json(
                { error: `Failed to create auth user: ${authError.message}` },
                { status: 500 }
            );
        }

        // Step 2: Create staff record
        const { data: staffData, error: staffError } = await supabaseAdmin
            .from('staff')
            .insert({
                id: authData.user.id, // Use same ID as auth user
                email,
                name,
                role,
                department,
                phone,
                permissions,
                status,
                notes,
                date_joined: new Date().toISOString(),
            })
            .select()
            .single();

        if (staffError) {
            // Rollback: Delete auth user if staff creation fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

            return NextResponse.json(
                { error: `Failed to create staff record: ${staffError.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Staff account created successfully',
                staff: {
                    id: staffData.id,
                    email: staffData.email,
                    name: staffData.name,
                    role: staffData.role,
                    department: staffData.department,
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating staff account:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
