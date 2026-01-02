"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import { Search, Truck, Package, User, MapPin, Calendar, Loader2, Star } from "lucide-react";
import { dispatches as dummyDispatches, drivers as dummyDrivers } from "@/lib/dummyData";

export default function DispatchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dispatches, setDispatches] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState({});
    const [dispatching, setDispatching] = useState(null);
    const [driverDialogOpen, setDriverDialogOpen] = useState(false);
    const [currentDispatchId, setCurrentDispatchId] = useState(null);
    const [driverSearchTerm, setDriverSearchTerm] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Simulate async loading
            await new Promise(resolve => setTimeout(resolve, 300));

            // Filter dispatches with status "ready_for_dispatch"
            const readyDispatches = dummyDispatches.filter(d => d.dispatchStatus === "ready_for_dispatch");
            setDispatches(readyDispatches);

            // Filter active drivers
            const activeDrivers = dummyDrivers.filter(d => d.status === "active");
            setDrivers(activeDrivers);
        } catch (err) {
            setError("Failed to fetch data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openDriverDialog = (dispatchId) => {
        setCurrentDispatchId(dispatchId);
        setDriverDialogOpen(true);
        setDriverSearchTerm("");
    };

    const selectDriver = (driver) => {
        setSelectedDriver({
            ...selectedDriver,
            [currentDispatchId]: driver._id
        });
        setDriverDialogOpen(false);
        setCurrentDispatchId(null);
    };

    const handleDispatch = async (dispatchId) => {
        const driverId = selectedDriver[dispatchId];
        if (!driverId) {
            alert("Please select a driver");
            return;
        }

        setDispatching(dispatchId);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Remove from list
            setDispatches(dispatches.filter(d => d._id !== dispatchId));
            setSelectedDriver({ ...selectedDriver, [dispatchId]: "" });

            alert("Order dispatched successfully!");
        } catch (err) {
            alert("Failed to dispatch order");
            console.error(err);
        } finally {
            setDispatching(null);
        }
    };

    const filteredDispatches = dispatches.filter((dispatch) =>
        dispatch.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispatch.order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDrivers = drivers.filter((driver) =>
        driver.name?.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
        driver.vehicleAssigned?.toLowerCase().includes(driverSearchTerm.toLowerCase())
    );

    const getSelectedDriverName = (dispatchId) => {
        const driverId = selectedDriver[dispatchId];
        const driver = drivers.find(d => d._id === driverId);
        return driver ? `${driver.name} - ${driver.vehicleAssigned}` : "Select Driver";
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Calculate stats
    const inTransitCount = dispatches.filter(d => d.dispatchStatus === "in_transit").length;

    return (
        <DashboardLayout title="Dispatch">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold">Dispatch Management</h2>
                    <p className="text-muted-foreground">Assign drivers and manage dispatch queue</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Ready for Dispatch</p>
                                    <p className="text-2xl font-bold">{dispatches.length}</p>
                                </div>
                                <Package className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Available Drivers</p>
                                    <p className="text-2xl font-bold">{drivers.length}</p>
                                </div>
                                <User className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">In Transit</p>
                                    <p className="text-2xl font-bold">{inTransitCount}</p>
                                </div>
                                <Truck className="w-8 h-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by order ID or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
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
                        {/* Dispatch Queue */}
                        <div className="space-y-4">
                            {filteredDispatches.map((dispatch) => (
                                <Card key={dispatch._id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">
                                                            {dispatch.order?.orderNumber || dispatch.orderNumber || "N/A"}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {dispatch.customerName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="warning">Ready for Dispatch</Badge>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Quantity</p>
                                                        <p className="text-sm font-medium">
                                                            {dispatch.productQuantity} items
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Delivery Date</p>
                                                        <p className="text-sm font-medium">
                                                            {new Date(dispatch.deliveryDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Destination</p>
                                                        <p className="text-sm font-medium truncate max-w-[200px]" title={dispatch.destination}>
                                                            {dispatch.destination}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Driver Assignment */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                                    <p className="text-xl font-bold">{formatCurrency(dispatch.totalAmount)}</p>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                    <Button
                                                        variant="outline"
                                                        className="min-w-[200px] justify-start"
                                                        onClick={() => openDriverDialog(dispatch._id)}
                                                    >
                                                        <User className="w-4 h-4 mr-2" />
                                                        {getSelectedDriverName(dispatch._id)}
                                                    </Button>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => handleDispatch(dispatch._id)}
                                                        disabled={dispatching === dispatch._id || !selectedDriver[dispatch._id]}
                                                    >
                                                        {dispatching === dispatch._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Truck className="w-4 h-4" />
                                                        )}
                                                        Dispatch
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredDispatches.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No orders ready for dispatch</p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>

            {/* Driver Selection Dialog */}
            <Dialog open={driverDialogOpen} onOpenChange={setDriverDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Select Driver</DialogTitle>
                        <DialogDescription>
                            Choose a driver to assign to this dispatch
                        </DialogDescription>
                    </DialogHeader>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by driver name or vehicle..."
                            value={driverSearchTerm}
                            onChange={(e) => setDriverSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Driver List */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {filteredDrivers.length > 0 ? (
                            filteredDrivers.map((driver) => (
                                <Card
                                    key={driver._id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => selectDriver(driver)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{driver.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {driver.vehicleAssigned || "No vehicle assigned"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span>{driver.rating || "N/A"}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {driver.totalDeliveries || 0} deliveries
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No drivers found
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
