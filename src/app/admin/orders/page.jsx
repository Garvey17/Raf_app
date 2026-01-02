"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { orders as dummyOrders } from "@/lib/dummyData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Search, Package, User, MapPin, Calendar, CheckCircle, XCircle, Loader2, Phone, Mail } from "lucide-react";

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvingOrder, setApprovingOrder] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Simulate async loading for realistic UX
            await new Promise(resolve => setTimeout(resolve, 300));

            // Filter by status if needed
            let filteredOrders = dummyOrders;
            if (statusFilter !== "all") {
                filteredOrders = dummyOrders.filter(order => order.status === statusFilter);
            }

            setOrders(filteredOrders);
        } catch (err) {
            setError("Failed to fetch orders");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveOrder = async (orderId) => {
        setApprovingOrder(orderId);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update local state
            setOrders(orders.map(order =>
                order._id === orderId
                    ? { ...order, status: "approved" }
                    : order
            ));

            alert("Order approved successfully!");
        } catch (err) {
            alert("Failed to approve order");
            console.error(err);
        } finally {
            setApprovingOrder(null);
        }
    };

    const handleRejectOrder = async (orderId) => {
        if (!confirm("Are you sure you want to reject this order?")) return;

        setApprovingOrder(orderId);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setOrders(orders.map(order =>
                order._id === orderId
                    ? { ...order, status: "cancelled" }
                    : order
            ));

            alert("Order cancelled successfully!");
        } catch (err) {
            alert("Failed to reject order");
            console.error(err);
        } finally {
            setApprovingOrder(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items?.some(item =>
                item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
            );

        return matchesSearch;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "delivered":
                return "success";
            case "shipped":
            case "dispatched":
                return "info";
            case "approved":
            case "paid":
                return "warning";
            case "cancelled":
                return "destructive";
            default:
                return "default";
        }
    };

    const statusCounts = {
        all: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        approved: orders.filter((o) => o.status === "approved").length,
        paid: orders.filter((o) => o.status === "paid").length,
        shipped: orders.filter((o) => o.status === "shipped").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
    };

    return (
        <DashboardLayout title="Orders">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold">Order Management</h2>
                    <p className="text-muted-foreground">View and manage all orders</p>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by order ID, customer, or product..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto">
                                {["all", "pending", "approved", "paid", "shipped", "delivered"].map((status) => (
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

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 p-8">Error: {error}</div>
                ) : (
                    <>
                        {/* Orders List */}
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <Card key={order._id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant={getStatusVariant(order.status)}>
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Customer</p>
                                                        <p className="text-sm font-medium truncate max-w-[150px]">{order.customerName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Items</p>
                                                        <p className="text-sm font-medium">
                                                            {order.items?.length || 0} item(s)
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Delivery Date</p>
                                                        <p className="text-sm font-medium">
                                                            {new Date(order.deliveryDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Location</p>
                                                        <p className="text-sm font-medium truncate max-w-[200px]" title={order.address}>{order.address}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Items List */}
                                            {order.items && order.items.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-semibold">Order Items:</p>
                                                    <div className="space-y-1">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="text-sm text-muted-foreground truncate">
                                                                • {item.quantity} x <span className="truncate inline-block max-w-[200px] align-bottom" title={item.productName}>{item.productName}</span> @ {formatCurrency(item.priceAtPurchase)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Amount and Actions */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                                    <p className="text-xl sm:text-2xl font-bold">{formatCurrency(order.totalAmount)}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {order.status === "pending" && (
                                                        <>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="gap-2"
                                                                onClick={() => handleApproveOrder(order._id)}
                                                                disabled={approvingOrder === order._id}
                                                            >
                                                                {approvingOrder === order._id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle className="w-4 h-4" />
                                                                )}
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="gap-2"
                                                                onClick={() => handleRejectOrder(order._id)}
                                                                disabled={approvingOrder === order._id}
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="min-w-[100px]"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredOrders.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <p className="text-muted-foreground">No orders found</p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>

            {/* Order Details Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Order Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information for order {selectedOrder?.orderNumber}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Order Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{selectedOrder.orderNumber}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Ordered on {new Date(selectedOrder.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <Badge variant={getStatusVariant(selectedOrder.status)} className="text-sm">
                                    {selectedOrder.status}
                                </Badge>
                            </div>

                            {/* Customer Information */}
                            <div className="grid gap-3 p-4 rounded-lg border bg-muted/50">
                                <h4 className="font-semibold text-sm">Customer Information</h4>
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Name:</span>
                                        <span>{selectedOrder.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Phone:</span>
                                        <span>{selectedOrder.customerPhone || "N/A"}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <span className="font-medium">Address:</span>
                                        <span className="flex-1">{selectedOrder.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Delivery Date:</span>
                                        <span>{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="grid gap-3 p-4 rounded-lg border bg-muted/50">
                                <h4 className="font-semibold text-sm">Order Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-lg">
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.productName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{formatCurrency(item.priceAtPurchase)}</p>
                                                    <p className="text-sm text-muted-foreground">per unit</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No items</p>
                                    )}
                                </div>
                            </div>

                            {/* Special Instructions */}
                            {selectedOrder.instructions && (
                                <div className="grid gap-3 p-4 rounded-lg border bg-muted/50">
                                    <h4 className="font-semibold text-sm">Special Instructions</h4>
                                    <p className="text-sm">{selectedOrder.instructions}</p>
                                </div>
                            )}

                            {/* Total Amount */}
                            <div className="flex items-center justify-between p-4 rounded-lg border bg-primary/5">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="text-3xl font-bold">{formatCurrency(selectedOrder.totalAmount)}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4 border-t">
                                {selectedOrder.status === "pending" && (
                                    <>
                                        <Button
                                            className="flex-1"
                                            onClick={() => {
                                                handleApproveOrder(selectedOrder._id);
                                                setSelectedOrder(null);
                                            }}
                                            disabled={approvingOrder === selectedOrder._id}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve Order
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                handleRejectOrder(selectedOrder._id);
                                                setSelectedOrder(null);
                                            }}
                                            disabled={approvingOrder === selectedOrder._id}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                    </>
                                )}
                                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
