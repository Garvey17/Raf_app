import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/config/dbSetup";
import Order from "@/lib/models/OrderModel";

// GET /api/analytics/export - Export analytics as CSV or PDF
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

        const { searchParams } = new URL(req.url);
        const format = searchParams.get("format") || "csv";

        // Get analytics data
        const now = new Date();
        const last30DaysStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const orders = await Order.find({
            createdAt: { $gte: last30DaysStart }
        }).sort({ createdAt: -1 }).lean();

        if (format === "csv") {
            // Generate CSV
            const csvRows = [
                ["Date", "Order ID", "Customer", "Status", "Items", "Total Amount"].join(",")
            ];

            orders.forEach(order => {
                const date = new Date(order.createdAt).toLocaleDateString();
                const orderId = order._id.toString();
                const customer = order.customerName;
                const status = order.status;
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const total = order.totalAmount || 0;

                csvRows.push([
                    date,
                    orderId,
                    `"${customer}"`,
                    status,
                    itemCount,
                    total
                ].join(","));
            });

            // Add summary
            csvRows.push("");
            csvRows.push("Summary");
            csvRows.push(`Total Orders,${orders.length}`);
            csvRows.push(`Total Revenue,${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)}`);
            csvRows.push(`Total Items,${orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}`);

            const csvContent = csvRows.join("\n");

            return new NextResponse(csvContent, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="analytics-${new Date().toISOString().split('T')[0]}.csv"`
                }
            });
        } else if (format === "pdf") {
            // For PDF, we'll create a simple HTML that can be printed to PDF
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Analytics Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #2563eb; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #2563eb; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
    .summary { margin-top: 30px; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #2563eb; }
  </style>
</head>
<body>
  <h1>Analytics Report</h1>
  <p>Generated on: ${new Date().toLocaleDateString()}</p>
  <p>Period: Last 30 Days</p>
  
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Order ID</th>
        <th>Customer</th>
        <th>Status</th>
        <th>Items</th>
        <th>Total Amount</th>
      </tr>
    </thead>
    <tbody>
      ${orders.map(order => `
        <tr>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>${order._id.toString().slice(-8)}</td>
          <td>${order.customerName}</td>
          <td>${order.status}</td>
          <td>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
          <td>₦${(order.totalAmount || 0).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="summary">
    <h2>Summary</h2>
    <p><strong>Total Orders:</strong> ${orders.length}</p>
    <p><strong>Total Revenue:</strong> ₦${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}</p>
    <p><strong>Total Items:</strong> ${orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}</p>
  </div>
  
  <script>
    // Auto-print on load
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
      `;

            return new NextResponse(htmlContent, {
                headers: {
                    "Content-Type": "text/html",
                }
            });
        }

        return NextResponse.json(
            { error: "Invalid format. Use 'csv' or 'pdf'" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error exporting analytics:", error);
        return NextResponse.json(
            { error: "Failed to export analytics", details: error.message },
            { status: 500 }
        );
    }
}
