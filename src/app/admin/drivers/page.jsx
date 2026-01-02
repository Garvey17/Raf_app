"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, User, Mail, Phone, Truck, Star, Loader2, Calendar } from "lucide-react";
import { drivers as dummyDrivers } from "@/lib/dummyData";

export default function DriversPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDrivers();
    }, [statusFilter]);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            // Simulate async loading
            await new Promise(resolve => setTimeout(resolve, 300));

            // Filter by status
            let filteredDrivers = dummyDrivers;
            if (statusFilter !== "all") {
                filteredDrivers = dummyDrivers.filter(driver => driver.status === statusFilter);
            }

            setDrivers(filteredDrivers);
        } catch (err) {
            setError("Failed to fetch drivers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDrivers = drivers.filter((driver) =>
        driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.driverNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.vehicleAssigned?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusCounts = {
        all: drivers.length,
        active: drivers.filter((d) => d.status === "active").length,
        inactive: drivers.filter((d) => d.status === "inactive").length,
        on_leave: drivers.filter((d) => d.status === "on_leave").length,
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "active":
                return "success";
            case "inactive":
                return "default";
            case "on_leave":
                return "warning";
            default:
                return "default";
        }
    };

    return (
        <DashboardLayout title="Drivers">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Driver Management</h2>
                        <p className="text-muted-foreground">Manage drivers and vehicle assignments</p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Driver
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by name, ID, email, or vehicle..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto">
                                {["all", "active", "inactive", "on_leave"].map((status) => (
                                    <Button
                                        key={status}
                                        variant={statusFilter === status ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter(status)}
                                        className="whitespace-nowrap"
                                    >
                                        {status === "on_leave" ? "On Leave" : status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
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
                        {/* Drivers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDrivers.map((driver) => (
                                <Card key={driver._id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Avatar and Name */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-lg font-semibold">
                                                            {driver.name?.split(" ").map((n) => n[0]).join("")}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{driver.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{driver.driverNumber}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={getStatusBadgeVariant(driver.status)}>
                                                    {driver.status === "on_leave" ? "On Leave" : driver.status}
                                                </Badge>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    <span className="truncate">{driver.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    <span>{driver.phone}</span>
                                                </div>
                                            </div>

                                            {/* Vehicle Info */}
                                            {driver.vehicleAssigned && (
                                                <div className="p-3 bg-muted/50 rounded-xl">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Truck className="w-4 h-4 text-muted-foreground" />
                                                            <div className="flex-1">
                                                                <p className="text-xs text-muted-foreground">Vehicle Assigned</p>
                                                                <p className="font-medium">{driver.vehicleAssigned}</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Total Deliveries</p>
                                                                <p className="font-medium">{driver.totalDeliveries || 0}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Rating</p>
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                    <span className="font-medium">{driver.rating || "N/A"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* License Info */}
                                            {driver.licenseNumber && (
                                                <div className="text-sm">
                                                    <p className="text-xs text-muted-foreground">License Number</p>
                                                    <p className="font-medium">{driver.licenseNumber}</p>
                                                    {driver.licenseExpiry && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Expires: {new Date(driver.licenseExpiry).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Status and Join Date */}
                                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                                <div className="text-sm">
                                                    <p className="text-xs text-muted-foreground">Joined</p>
                                                    <p className="font-medium">
                                                        {new Date(driver.dateJoined || driver.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {driver.lastDeliveryDate && (
                                                    <div className="text-sm text-right">
                                                        <p className="text-xs text-muted-foreground">Last Delivery</p>
                                                        <p className="font-medium">
                                                            {new Date(driver.lastDeliveryDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    View Profile
                                                </Button>
                                                <Button variant="ghost" size="sm" className="flex-1">
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredDrivers.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No drivers found</p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
