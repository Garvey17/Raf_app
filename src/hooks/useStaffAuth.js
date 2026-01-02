"use client";

import { useEffect, useState } from 'react';

/**
 * Hook to get staff info from session storage
 * This is a client-side cache of staff data
 */
export function useStaffInfo() {
    const [staffInfo, setStaffInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('staff-info');
            if (stored) {
                setStaffInfo(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading staff info:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { staffInfo, loading };
}

/**
 * Hook to check if staff has a specific permission
 */
export function useStaffPermission(permission) {
    const { staffInfo } = useStaffInfo();

    if (!staffInfo || !staffInfo.permissions) {
        return false;
    }

    // Check for admin (all permissions)
    if (staffInfo.permissions.includes('all')) {
        return true;
    }

    return staffInfo.permissions.includes(permission);
}

/**
 * Hook to check if staff has a specific role
 */
export function useStaffRole(role) {
    const { staffInfo } = useStaffInfo();

    if (!staffInfo) {
        return false;
    }

    return staffInfo.role === role;
}
