import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/config/dbSetup";
import Order from "@/lib/models/OrderModel";

// GET /api/analytics/dashboard - Get dashboard analytics
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        // Date calculations
        const now = new Date();
        const last30DaysStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const previous30DaysStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const previous30DaysEnd = last30DaysStart;

        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);

        const last12DaysStart = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000);

        // 1. Calculate Revenue (last 30 days)
        const currentRevenue = await Order.aggregate([
            {
                $match: {
                    status: { $in: ["paid", "delivered", "approved"] },
                    createdAt: { $gte: last30DaysStart, $lte: now }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        const previousRevenue = await Order.aggregate([
            {
                $match: {
                    status: { $in: ["paid", "delivered", "approved"] },
                    createdAt: { $gte: previous30DaysStart, $lt: previous30DaysEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        const currentRevenueValue = currentRevenue[0]?.total || 0;
        const previousRevenueValue = previousRevenue[0]?.total || 0;
        const percentageChange = previousRevenueValue > 0
            ? ((currentRevenueValue - previousRevenueValue) / previousRevenueValue) * 100
            : 0;

        // 2. Get Active Orders
        const activeOrders = await Order.aggregate([
            {
                $match: {
                    status: { $in: ["pending", "approved", "shipped"] }
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const orderStats = {
            pending: 0,
            approved: 0,
            shipped: 0,
            total: 0
        };

        activeOrders.forEach(stat => {
            orderStats[stat._id] = stat.count;
            orderStats.total += stat.count;
        });

        // 3. Calculate Volume (this week)
        const volumeData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: weekStart }
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$items.quantity" }
                }
            }
        ]);

        const volumeBought = volumeData[0]?.totalQuantity || 0;

        // 4. Sales Performance (last 12 days)
        const salesPerformance = await Order.aggregate([
            {
                $match: {
                    status: { $in: ["paid", "delivered", "approved"] },
                    createdAt: { $gte: last12DaysStart }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Fill in missing days with 0 revenue
        const performanceMap = new Map();
        salesPerformance.forEach(day => {
            performanceMap.set(day._id, day.revenue);
        });

        const last12Days = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            last12Days.push({
                date: dateStr,
                revenue: performanceMap.get(dateStr) || 0
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                revenue: {
                    current: currentRevenueValue,
                    previous: previousRevenueValue,
                    percentageChange: Math.round(percentageChange * 10) / 10,
                    period: "last30Days"
                },
                orders: {
                    active: orderStats.total,
                    pending: orderStats.pending,
                    approved: orderStats.approved,
                    shipped: orderStats.shipped
                },
                volume: {
                    current: volumeBought,
                    period: "thisWeek"
                },
                salesPerformance: last12Days
            }
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics", details: error.message },
            { status: 500 }
        );
    }
}
