"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function ClientAreaChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    opacity={0.5}
                />
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                    cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
                    contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                    formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]}
                />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
