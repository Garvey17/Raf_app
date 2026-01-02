"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { customers as dummyCustomers } from "@/lib/dummyData";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, MapPin, Phone, Mail, ShoppingCart, Loader2, Trash2, User, Calendar } from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // Simulate async loading
            await new Promise(resolve => setTimeout(resolve, 300));

            // Filter by search term
            let filteredCustomers = dummyCustomers;
            if (searchTerm) {
                filteredCustomers = dummyCustomers.filter(customer =>
                    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer.city.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setCustomers(filteredCustomers);
        } catch (err) {
            setError("Failed to fetch customers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCustomer = async () => {
        if (!customerToDelete) return;

        setDeleting(true);
        try {
            const response = await fetch(`/api/customers/${customerToDelete.id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                // Remove customer from local state
                setCustomers(customers.filter(c => c.id !== customerToDelete.id));
                setCustomerToDelete(null);
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            alert("Failed to delete customer");
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <DashboardLayout title="Customers">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Customer Management</h2>
                        <p className="text-muted-foreground">Manage and view all customers</p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Customer
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, email, or city..."
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
                        {/* Customers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {customers.map((customer) => (
                                <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                                                    <p className="text-sm text-muted-foreground truncate max-w-[150px]" title={customer.id}>
                                                        ID: {customer.id.slice(-6)}
                                                    </p>
                                                </div>
                                                <Badge variant={customer.status === "active" ? "success" : "secondary"}>
                                                    {customer.status}
                                                </Badge>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                    <span className="truncate" title={customer.email}>{customer.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                    <span>{customer.phone || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                    <span className="truncate">{customer.city}, {customer.state}</span>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-border">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Total Orders</p>
                                                    <p className="text-base sm:text-lg font-semibold flex items-center gap-1">
                                                        <ShoppingCart className="w-4 h-4" />
                                                        {customer.totalOrders}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Total Spent</p>
                                                    <p className="text-base sm:text-lg font-semibold break-words">
                                                        {formatCurrency(customer.totalSpent)}
                                                    </p>
                                                </div>
                                            </div>

                                            {customer.outstandingBalance > 0 && (
                                                <div className="pt-2">
                                                    <Badge variant="warning" className="w-full justify-center">
                                                        Outstanding: {formatCurrency(customer.outstandingBalance)}
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-9"
                                                    onClick={() => setSelectedCustomer(customer)}
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="h-9"
                                                    onClick={() => setCustomerToDelete(customer)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {customers.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <p className="text-muted-foreground">No customers found</p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!customerToDelete} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{customerToDelete?.name}</strong> and all associated data.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCustomer}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Customer"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Customer Details Dialog */}
            <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Customer Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information for {selectedCustomer?.name}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedCustomer && (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                                        <p className="text-sm text-muted-foreground">ID: {selectedCustomer.id}</p>
                                    </div>
                                    <Badge variant={selectedCustomer.status === "active" ? "success" : "secondary"}>
                                        {selectedCustomer.status}
                                    </Badge>
                                </div>

                                {/* Contact Information */}
                                <div className="grid gap-3 p-4 rounded-lg border bg-muted/50">
                                    <h4 className="font-semibold text-sm">Contact Information</h4>
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">Email:</span>
                                            <span>{selectedCustomer.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">Phone:</span>
                                            <span>{selectedCustomer.phone || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">Location:</span>
                                            <span>{selectedCustomer.city}, {selectedCustomer.state}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Statistics */}
                                <div className="grid gap-3 p-4 rounded-lg border bg-muted/50">
                                    <h4 className="font-semibold text-sm">Order Statistics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Orders</p>
                                            <p className="text-2xl font-bold flex items-center gap-2">
                                                <ShoppingCart className="w-5 h-5" />
                                                {selectedCustomer.totalOrders}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Spent</p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(selectedCustomer.totalSpent)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Outstanding Balance */}
                                {selectedCustomer.outstandingBalance > 0 && (
                                    <div className="p-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">Outstanding Balance</p>
                                                <p className="text-xs text-muted-foreground">Amount pending payment</p>
                                            </div>
                                            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-500">
                                                {formatCurrency(selectedCustomer.outstandingBalance)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4 border-t">
                                <Button className="flex-1">
                                    Create New Order
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
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
