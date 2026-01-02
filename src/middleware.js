import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Explicitly set Edge Runtime
export const runtime = 'experimental-edge'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (pathname.includes('/_next/') || pathname.includes('/api/') || pathname === '/favicon.ico') {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Supabase auth error:', error.message)
    }

    // ========== ADMIN ROUTES AUTHENTICATION ==========
    if (pathname.startsWith('/admin')) {
      const adminPublicRoutes = ['/admin/auth/staff-login']
      const isAdminPublic = adminPublicRoutes.some((route) => pathname.startsWith(route))

      // If not authenticated
      if (!user && !isAdminPublic) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/auth/staff-login'
        return NextResponse.redirect(url)
      }

      // If authenticated, verify they are staff
      if (user && !isAdminPublic) {
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('status')
          .eq('email', user.email)
          .single()

        // Not a staff member or error fetching staff data
        if (staffError || !staffData) {
          const url = request.nextUrl.clone()
          url.pathname = '/admin/auth/staff-login'
          return NextResponse.redirect(url)
        }

        // Staff member but not active
        if (staffData.status !== 'active') {
          const url = request.nextUrl.clone()
          url.pathname = '/admin/auth/staff-login'
          return NextResponse.redirect(url)
        }
      }

      // If authenticated and trying to access login page, redirect to admin dashboard
      // BUT ONLY if they are a valid active staff member
      if (user && isAdminPublic) {
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('status')
          .eq('email', user.email)
          .single()

        // Only redirect to dashboard if they are valid active staff
        if (!staffError && staffData && staffData.status === 'active') {
          const url = request.nextUrl.clone()
          url.pathname = '/admin'
          return NextResponse.redirect(url)
        }
        // If they are logged in but not valid staff, let them stay on the login page
        // (The login page checks will likely show them an error or sign them out)
      }

      return supabaseResponse
    }

    // ========== CUSTOMER ROUTES AUTHENTICATION ==========
    const customerPublicRoutes = ["/auth/login", "/auth/register", "/auth/reset-password", "/auth/verify-email", "/website"]
    const isCustomerPublic = customerPublicRoutes.some((route) => pathname.startsWith(route))

    // If not authenticated & route is protected → redirect to login
    if (!user && !isCustomerPublic) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    // If authenticated and they try to access public routes -> redirect to customer dashboard
    if (user && isCustomerPublic) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)

    // On error, redirect to appropriate login page
    if (pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/auth/staff-login'
      return NextResponse.redirect(url)
    } else {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
