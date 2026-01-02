# Staff Authentication Setup Guide

## Quick Start

### 1. Environment Variables

Add to your `.env` file:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# For creating staff accounts via API (optional)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Create Your First Staff Account

#### Option A: Via Supabase Dashboard (Recommended for first account)

1. **Create Auth User**:
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add user"
   - Email: `admin@company.com`
   - Password: `Admin123!`
   - Check "Auto Confirm User"
   - Click "Create user"

2. **Add Staff Record**:
   - Go to Table Editor → `staff` table
   - Click "Insert row"
   - Fill in:
     ```
     email: admin@company.com
     name: Admin User
     role: admin
     department: administration
     status: active
     permissions: ["all"]
     staff_number: STF-20260101-001
     ```
   - Click "Save"

3. **Test Login**:
   - Navigate to `/admin/auth/staff-login`
   - Login with `admin@company.com` / `Admin123!`
   - Should redirect to `/admin`

#### Option B: Via API (After first admin is created)

```javascript
// POST /api/admin/create-staff
const response = await fetch('/api/admin/create-staff', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'staff@company.com',
    password: 'SecurePassword123!',
    name: 'Staff Member',
    role: 'sales_representative',
    department: 'sales',
    permissions: ['view_customers', 'create_orders'],
    phone: '+234-901-222-2222'
  })
});
```

### 3. Staff Roles & Permissions

#### Available Roles:
- `admin` - Full system access
- `transport_officer` - Manage dispatches and drivers
- `warehouse_manager` - Manage inventory
- `sales_representative` - Customer and order management
- `customer_service` - Customer support
- `accountant` - Financial operations
- `driver` - Delivery operations
- `other` - Custom role

#### Common Permission Sets:
```javascript
// Admin
permissions: ['all']

// Transport Officer
permissions: ['manage_dispatches', 'assign_drivers', 'view_deliveries']

// Warehouse Manager
permissions: ['manage_inventory', 'approve_orders', 'view_products']

// Sales Representative
permissions: ['view_customers', 'create_orders', 'view_analytics']

// Customer Service
permissions: ['view_customers', 'view_orders', 'send_notifications']

// Accountant
permissions: ['view_payments', 'verify_payments', 'view_analytics']
```

## Usage in Code

### Server Components

```javascript
import { getStaffSession, hasStaffPermission } from '@/lib/auth/staffAuth';

export default async function AdminPage() {
  const staff = await getStaffSession();
  
  if (!staff) {
    redirect('/admin/auth/staff-login');
  }

  const canManageOrders = await hasStaffPermission('manage_orders');

  return (
    <div>
      <h1>Welcome, {staff.name}</h1>
      <p>Role: {staff.role}</p>
      {canManageOrders && <OrderManagement />}
    </div>
  );
}
```

### Client Components

```javascript
'use client';

import { useStaffInfo, useStaffPermission } from '@/hooks/useStaffAuth';
import StaffLogoutButton from '@/Components/StaffLogoutButton';

export default function AdminDashboard() {
  const { staffInfo, loading } = useStaffInfo();
  const canViewAnalytics = useStaffPermission('view_analytics');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {staffInfo?.name}</h1>
      {canViewAnalytics && <AnalyticsDashboard />}
      <StaffLogoutButton />
    </div>
  );
}
```

## Security Notes

### Row Level Security (RLS)

Add these policies to your `staff` table:

```sql
-- Enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Staff can read their own data
CREATE POLICY "Staff can read own data"
ON staff FOR SELECT
USING (auth.email() = email);

-- Only admins can insert/update staff
CREATE POLICY "Admins can manage staff"
ON staff FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM staff
    WHERE email = auth.email()
    AND 'all' = ANY(permissions)
  )
);
```

### Password Policy

In Supabase Dashboard → Authentication → Policies:
- Minimum password length: 8 characters
- Require uppercase: Yes
- Require lowercase: Yes
- Require numbers: Yes
- Require special characters: Recommended

## Troubleshooting

### "Access denied. This account is not registered as staff"
- Ensure the email exists in both Supabase Auth AND the staff table
- Check that the email matches exactly (case-sensitive)

### "Your account is not active"
- Check `status` field in staff table is set to `'active'`

### Middleware redirects to login even when authenticated
- Clear browser cookies and try again
- Check Supabase project URL and keys in `.env`
- Verify staff record exists with correct email

## Files Created

- ✅ `/app/admin/auth/staff-login/page.jsx` - Login page
- ✅ `/app/admin/auth/staff-login/StaffLoginForm.jsx` - Login form
- ✅ `/middleware.js` - Updated for Supabase staff auth
- ✅ `/lib/auth/staffAuth.js` - Server-side auth utilities
- ✅ `/hooks/useStaffAuth.js` - Client-side auth hooks
- ✅ `/Components/StaffLogoutButton.jsx` - Logout component
- ✅ `/api/admin/create-staff/route.js` - Staff creation API
- ✅ `/lib/utils/createStaffAccount.js` - Staff creation utility

## Next Steps

1. ✅ Create first admin account
2. ✅ Test login flow
3. [ ] Add logout button to admin layout
4. [ ] Implement password reset flow
5. [ ] Add staff management page
6. [ ] Set up RLS policies
7. [ ] Configure email templates
