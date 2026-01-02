"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, CreditCard, CheckCircle, Clock, User } from "lucide-react";
import { payments } from "@/lib/dummyData";

export default function PaymentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const statusCounts = {
        all: payments.length,
        completed: payments.filter((p) => p.status === "completed").length,
        pending: payments.filter((p) => p.status === "pending").length,
    };

    return (
        <DashboardLayout title="Payments">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold">Payment Management</h2>
                    <p className="text-muted-foreground">Track and verify all payments</p>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by payment ID, order ID, or customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                {["all", "completed", "pending"].map((status) => (
                                    <Button
                                        key={status}
                                        variant={statusFilter === status ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter(status)}
                                        className="whitespace-nowrap"
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments List */}
                <div className="space-y-4">
                    {filteredPayments.map((payment) => (
                        <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${payment.status === "completed"
                                                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                                                    : "bg-yellow-100 dark:bg-yellow-900/30"
                                                }`}>
                                                <CreditCard className={`w-6 h-6 ${payment.status === "completed"
                                                        ? "text-emerald-600"
                                                        : "text-yellow-600"
                                                    }`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{payment.id}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Order: {payment.orderId}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={payment.status === "completed" ? "success" : "warning"}>
                                            {payment.status}
                                        </Badge>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Customer</p>
                                                <p className="text-sm font-medium">{payment.customerName}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Payment Method</p>
                                            <p className="text-sm font-medium">{payment.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Payment Date</p>
                                            <p className="text-sm font-medium">
                                                {new Date(payment.paymentDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Reference</p>
                                            <p className="text-sm font-medium font-mono">{payment.reference}</p>
                                        </div>
                                    </div>

                                    {/* Amount and Actions */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Amount</p>
                                            <p className="text-2xl font-bold">{formatCurrency(payment.amount)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {payment.status === "pending" && (
                                                <Button variant="success" size="sm" className="gap-2">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Verify Payment
                                                </Button>
                                            )}
                                            {payment.status === "completed" && payment.verifiedBy && (
                                                <div className="text-sm text-muted-foreground">
                                                    Verified by: {payment.verifiedBy}
                                                </div>
                                            )}
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredPayments.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-muted-foreground">No payments found</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
