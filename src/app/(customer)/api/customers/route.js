import { NextResponse } from "next/server";
import { User } from "@/lib/services/dataService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(customer)/api/auth/[...nextauth]/route";

// GET all customers/users
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status"); // filter by active/inactive
        const verificationStatus = searchParams.get("verificationStatus");
        const search = searchParams.get("search"); // search by name, email, or phone

        let query = {};

        // Build query filters
        if (verificationStatus) {
            query.verificationStatus = verificationStatus;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        // Fetch all users
        let customers = await User.find(query)
            .select("-password") // Exclude password from results
            .sort({ createdAt: -1 });

        // Filter by status if needed (since status is a virtual field)
        if (status) {
            customers = customers.filter((customer) => {
                if (!customer.lastPurchaseDate) {
                    return status === "inactive";
                }
                const daysSinceLastPurchase = Math.floor(
                    (Date.now() - new Date(customer.lastPurchaseDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const customerStatus =
                    daysSinceLastPurchase <= 90 ? "active" : "inactive";
                return customerStatus === status;
            });
        }

        // Add status to each customer
        customers = customers.map((customer) => {
            let customerStatus = "inactive";
            if (customer.lastPurchaseDate) {
                const daysSinceLastPurchase = Math.floor(
                    (Date.now() - new Date(customer.lastPurchaseDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                customerStatus = daysSinceLastPurchase <= 90 ? "active" : "inactive";
            }
            return { ...customer, status: customerStatus };
        });

        return NextResponse.json({
            customers,
            count: customers.length,
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json(
            { error: "Failed to fetch customers" },
            { status: 500 }
        );
    }
}
