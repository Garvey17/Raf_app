"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, User, Mail, Phone, Briefcase, Truck, Loader2 } from "lucide-react";
import { staff as dummyStaff } from "@/lib/dummyData";

export default function StaffPage() {
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        password: "",
        notes: "",
    });
    const [error, setError] = useState("");

    const fetchStaff = async () => {
        try {
            setIsLoading(true);
            // Simulate async loading
            await new Promise(resolve => setTimeout(resolve, 300));

            setStaffList(dummyStaff);
        } catch (error) {
            console.error("Error fetching staff:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Create new staff member with dummy ID
            const newStaff = {
                _id: `new-${Date.now()}`,
                staffNumber: `STF-${String(staffList.length + 1).padStart(3, '0')}`,
                ...formData,
                status: "active",
                createdAt: new Date().toISOString(),
            };

            setStaffList([...staffList, newStaff]);
            setIsDialogOpen(false);
            setFormData({
                name: "",
                email: "",
                phone: "",
                role: "",
                department: "",
                password: "",
                notes: "",
            });

            alert("Staff member created successfully!");
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredStaff = staffList.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.staffNumber && member.staffNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "all" || member.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const roleCounts = {
        all: staffList.length,
        admin: staffList.filter((s) => s.role === "admin").length,
        sales: staffList.filter((s) => s.role === "sales").length,
        dispatch: staffList.filter((s) => s.role === "dispatch").length,
        driver: staffList.filter((s) => s.role === "driver").length,
    };

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case "admin":
                return "default";
            case "sales":
                return "info";
            case "dispatch":
                return "warning";
            case "driver":
                return "success";
            default:
                return "default";
        }
    };

    const roles = [
        "admin",
        "transport_officer",
        "warehouse_manager",
        "sales_representative",
        "customer_service",
        "accountant",
        "driver",
        "sales",
        "dispatch",
        "other"
    ];

    const departments = [
        "administration",
        "logistics",
        "warehouse",
        "sales",
        "customer_service",
        "finance",
        "operations",
        "management",
        "other"
    ];

    return (
        <DashboardLayout title="Staff">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Staff Management</h2>
                        <p className="text-muted-foreground">Manage staff members and roles</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Staff Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Staff Member</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                {error && (
                                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                        {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name *</label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email *</label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Password *</label>
                                        <Input
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Role *</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Department *</label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>
                                                    {dept.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-medium">Notes</label>
                                        <Input
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            placeholder="Additional notes..."
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Create Staff Member
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by name, ID, or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto">
                                {["all", "admin", "sales", "dispatch", "driver"].map((role) => (
                                    <Button
                                        key={role}
                                        variant={roleFilter === role ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setRoleFilter(role)}
                                        className="whitespace-nowrap"
                                    >
                                        {role.charAt(0).toUpperCase() + role.slice(1)} ({roleCounts[role]})
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Staff Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStaff.map((member) => (
                            <Card key={member._id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {/* Avatar and Name */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-lg font-semibold">
                                                        {member.name.split(" ").map((n) => n[0]).join("")}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{member.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{member.staffNumber}</p>
                                                </div>
                                            </div>
                                            <Badge variant={getRoleBadgeVariant(member.role)}>
                                                {member.role}
                                            </Badge>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span>{member.phone || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                                <span>{member.department}</span>
                                            </div>
                                        </div>

                                        {/* Driver-specific info */}
                                        {member.role === "driver" && member.vehicleAssigned && (
                                            <div className="p-3 bg-muted/50 rounded-xl">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Truck className="w-4 h-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Vehicle Assigned</p>
                                                            <p className="font-medium">{member.vehicleAssigned}</p>
                                                        </div>
                                                    </div>
                                                    {member.totalDeliveries && (
                                                        <div className="text-sm">
                                                            <p className="text-xs text-muted-foreground">Total Deliveries</p>
                                                            <p className="font-medium">{member.totalDeliveries}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Status and Join Date */}
                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="text-sm">
                                                <p className="text-xs text-muted-foreground">Joined</p>
                                                <p className="font-medium">
                                                    {new Date(member.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge variant={member.status === "active" ? "success" : "default"}>
                                                {member.status}
                                            </Badge>
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
                )}

                {!isLoading && filteredStaff.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No staff members found</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
