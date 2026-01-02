import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Get Supabase client for server components
 */
async function getSupabaseServer() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        }
    );
}

/**
 * Get the current staff session from Supabase
 * @returns {Object|null} Staff data or null if not authenticated as staff
 */
export async function getStaffSession() {
    try {
        const supabase = await getSupabaseServer();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return null;
        }

        // Get staff data
        const { data: staffData, error: staffError } = await supabase
            .from('staff')
            .select('*')
            .eq('email', user.email)
            .single();

        if (staffError || !staffData) {
            return null;
        }

        return {
            id: staffData.id,
            email: staffData.email,
            name: staffData.name,
            role: staffData.role,
            department: staffData.department,
            permissions: staffData.permissions || [],
            staffNumber: staffData.staff_number,
            status: staffData.status,
        };
    } catch (error) {
        console.error('Error getting staff session:', error);
        return null;
    }
}

/**
 * Check if the current user is authenticated as staff
 * @returns {boolean} True if authenticated as staff, false otherwise
 */
export async function isStaffAuthenticated() {
    const session = await getStaffSession();
    return !!session && session.status === 'active';
}

/**
 * Check if the current staff has a specific permission
 * @param {string} permission - Permission to check
 * @returns {boolean} True if has permission, false otherwise
 */
export async function hasStaffPermission(permission) {
    const session = await getStaffSession();

    if (!session || !session.permissions) {
        return false;
    }

    // Check for "all" permission (admin)
    if (session.permissions.includes('all')) {
        return true;
    }

    return session.permissions.includes(permission);
}

/**
 * Check if the current staff has a specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if has role, false otherwise
 */
export async function hasStaffRole(role) {
    const session = await getStaffSession();

    if (!session) {
        return false;
    }

    return session.role === role;
}

/**
 * Require staff authentication, redirect to login if not authenticated
 * Use this in server components
 */
export async function requireStaffAuth() {
    const session = await getStaffSession();

    if (!session) {
        throw new Error('Unauthorized - Staff authentication required');
    }

    if (session.status !== 'active') {
        throw new Error('Unauthorized - Staff account is not active');
    }

    return session;
}
