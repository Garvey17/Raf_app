"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Truck, Package, MapPin, Calendar, Phone, User, CheckCircle, Loader2 } from "lucide-react";
import { deliveries as dummyDeliveries } from "@/lib/dummyData";

export default function DeliveriesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDeliveries();
    }, [statusFilter]);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            // Simulate async loading
            await new Promise(resolve => setTimeout(resolve, 300));

            // Filter by status
            let filteredDeliveries = dummyDeliveries;
            if (statusFilter !== "all") {
                filteredDeliveries = dummyDeliveries.filter(delivery => delivery.deliveryStatus === statusFilter);
            }

            setDeliveries(filteredDeliveries);
        } catch (err) {
            setError("Failed to fetch deliveries");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDeliveries = deliveries.filter((delivery) =>
        delivery.deliveryNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusCounts = {
        all: deliveries.length,
        in_transit: deliveries.filter((d) => d.deliveryStatus === "in_transit").length,
        delivered: deliveries.filter((d) => d.deliveryStatus === "delivered").length,
    };

    return (
        <DashboardLayout title="Deliveries">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold">Delivery Tracking</h2>
                    <p className="text-muted-foreground">Track and manage all deliveries</p>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by delivery ID, order ID, or customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                {["all", "in_transit", "delivered"].map((status) => (
                                    <Button
                                        key={status}
                                        variant={statusFilter === status ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter(status)}
                                        className="whitespace-nowrap"
                                    >
                                        {status === "in_transit" ? "In Transit" : status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
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
                        {/* Deliveries List */}
                        <div className="space-y-4">
                            {filteredDeliveries.map((delivery) => (
                                <Card key={delivery._id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${delivery.deliveryStatus === "delivered"
                                                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                                                        : "bg-blue-100 dark:bg-blue-900/30"
                                                        }`}>
                                                        <Truck className={`w-6 h-6 ${delivery.deliveryStatus === "delivered"
                                                            ? "text-emerald-600"
                                                            : "text-blue-600"
                                                            }`} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{delivery.deliveryNumber}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Order: {delivery.order?.orderNumber || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant={delivery.deliveryStatus === "delivered" ? "success" : "info"}>
                                                    {delivery.deliveryStatus === "in_transit" ? "In Transit" : "Delivered"}
                                                </Badge>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Customer</p>
                                                        <p className="text-sm font-medium">{delivery.customerName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Phone</p>
                                                        <p className="text-sm font-medium">{delivery.customerPhone || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2 md:col-span-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Delivery Address</p>
                                                        <p className="text-sm font-medium">{delivery.dropLocation}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Driver Info */}
                                            <div className="p-4 bg-primary/5 rounded-xl">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Driver</p>
                                                        <p className="text-sm font-medium">{delivery.driverName || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Driver Phone</p>
                                                        <p className="text-sm font-medium">{delivery.driverPhone || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Vehicle</p>
                                                        <p className="text-sm font-medium">{delivery.vehicleNumber || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-muted-foreground">Created:</span>
                                                    <span className="font-medium">
                                                        {new Date(delivery.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                {delivery.deliveredAt && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="text-muted-foreground">Delivered:</span>
                                                        <span className="font-medium">
                                                            {new Date(delivery.deliveredAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                                {delivery.signature && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="text-muted-foreground">Signed by: {delivery.signature}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            {delivery.deliveryStatus === "in_transit" && (
                                                <div className="flex gap-2 pt-4 border-t border-border">
                                                    <Button variant="default" size="sm" className="gap-2">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Mark as Delivered
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredDeliveries.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No deliveries found</p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
