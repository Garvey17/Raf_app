/**
 * Staff Account Creation Utility
 * 
 * This script helps create staff accounts in Supabase.
 * Run this in your browser console or create an admin API endpoint.
 */

import { createClient } from '@/lib/supabase/supabaseClient';

/**
 * Create a new staff account
 * @param {Object} staffData - Staff account data
 * @returns {Promise<Object>} Created staff data
 */
export async function createStaffAccount(staffData) {
    const supabase = createClient();

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
    } = staffData;

    try {
        // Step 1: Create Supabase Auth user
        // Note: This requires admin privileges. 
        // In production, use Supabase Admin API or create via dashboard
        console.log('Creating Supabase Auth user...');

        // For now, the user needs to sign up themselves
        // Or you can use Supabase Admin API with service role key
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/admin/auth/staff-login`,
            }
        });

        if (authError) {
            throw new Error(`Auth creation failed: ${authError.message}`);
        }

        console.log('Auth user created:', authData.user?.email);

        // Step 2: Create staff record
        console.log('Creating staff record...');

        const { data: staffRecord, error: staffError } = await supabase
            .from('staff')
            .insert({
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
            throw new Error(`Staff record creation failed: ${staffError.message}`);
        }

        console.log('Staff account created successfully:', staffRecord);
        return staffRecord;

    } catch (error) {
        console.error('Error creating staff account:', error);
        throw error;
    }
}

/**
 * Example usage:
 * 
 * createStaffAccount({
 *   email: 'admin@company.com',
 *   password: 'SecurePassword123!',
 *   name: 'Admin User',
 *   role: 'admin',
 *   department: 'administration',
 *   permissions: ['all'],
 *   phone: '+234-901-111-1111',
 *   notes: 'System administrator'
 * });
 */

// Predefined staff roles
export const STAFF_ROLES = {
    ADMIN: 'admin',
    TRANSPORT_OFFICER: 'transport_officer',
    WAREHOUSE_MANAGER: 'warehouse_manager',
    SALES_REP: 'sales_representative',
    CUSTOMER_SERVICE: 'customer_service',
    ACCOUNTANT: 'accountant',
    DRIVER: 'driver',
    OTHER: 'other'
};

// Predefined departments
export const DEPARTMENTS = {
    ADMINISTRATION: 'administration',
    LOGISTICS: 'logistics',
    WAREHOUSE: 'warehouse',
    SALES: 'sales',
    CUSTOMER_SERVICE: 'customer_service',
    FINANCE: 'finance',
    OPERATIONS: 'operations',
    OTHER: 'other'
};

// Common permission sets
export const PERMISSION_SETS = {
    ADMIN: ['all'],
    TRANSPORT: ['manage_dispatches', 'assign_drivers', 'view_deliveries'],
    WAREHOUSE: ['manage_inventory', 'approve_orders', 'view_products'],
    SALES: ['view_customers', 'create_orders', 'view_analytics'],
    CUSTOMER_SERVICE: ['view_customers', 'view_orders', 'send_notifications'],
    ACCOUNTANT: ['view_payments', 'verify_payments', 'view_analytics'],
};
