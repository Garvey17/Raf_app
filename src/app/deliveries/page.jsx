'use client'
import { Card, CardContent } from "@/Components/ui/card";
import { Truck, Package, MapPin, Calendar, Phone, User, Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDeliveryStore } from "@/store/deliveryStore";

export default function DeliveriesPage() {
  const {
    deliveries: apiDeliveries,
    fetchDeliveries,
    updateDeliveryStatus,
    loading,
    updating,
    error,
    successMessage,
    clearError,
    clearSuccessMessage
  } = useDeliveryStore();

  // Sample static orders (replace with DB data later)
  const [dummyDeliveries, setDummyDeliveries] = useState([
    {
      id: "ORD-001",
      customerName: "John Doe",
      phone: "08123456789",
      product: "Dangote Cement 50kg",
      quantity: 50,
      location: "Site 14, Lekki, Lagos",
      deliveryDate: "2024-02-14",
      status: "pending",
    },
    {
      id: "ORD-002",
      customerName: "Mary Adams",
      phone: "09055667788",
      product: "BUA Cement 50kg",
      quantity: 100,
      location: "Old Market Road, Onitsha",
      deliveryDate: "2024-02-12",
      status: "delivered",
    },
  ]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  // Merge dummy and API data
  const allDeliveries = [
    ...dummyDeliveries,
    ...apiDeliveries.map(d => ({
      id: d.deliveryNumber,
      _id: d._id, // Keep MongoDB ID for API calls
      customerName: d.customerName,
      phone: d.phoneNumber,
      product: d.order?.items?.map(i => i.productName).join(", ") || "Unknown Product",
      quantity: d.quantity,
      location: d.dropLocation,
      deliveryDate: new Date(d.deliveryDate).toLocaleDateString(),
      status: d.deliveryStatus === "in_transit" ? "pending" : d.deliveryStatus,
      isApiDelivery: true // Flag to identify API deliveries
    }))
  ];

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter logic
  const filteredDeliveries = allDeliveries.filter((item) => {
    // Map API status 'in_transit' to 'pending' for filter matching if needed, or adjust filter options.
    // For now, let's treat 'in_transit' as 'pending' in the UI or add it to options.
    // The UI has "Pending" and "Delivered". 
    // Let's normalize status for filtering:
    const normalizedStatus = item.status === "in_transit" ? "pending" : item.status;

    const matchesStatus =
      filterStatus === "all" || normalizedStatus === filterStatus;

    const matchesSearch =
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.product.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const markDelivered = async (id, isApiDelivery = false) => {
    // Check if it's a dummy ID
    if (id.startsWith("ORD-") || !isApiDelivery) {
      setDummyDeliveries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "delivered" } : item
        )
      );
    } else {
      // Handle real data update via API
      try {
        await updateDeliveryStatus(id, 'delivered');
        // Success message is handled by the store
      } catch (error) {
        console.error("Failed to mark delivery as delivered:", error);
        // Error is handled by the store
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 bg-gray-50/50 dark:bg-slate-950 min-h-screen">
      {/* Toast Notifications */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">{successMessage}</p>
              <button onClick={clearSuccessMessage} className="ml-auto text-white/80 hover:text-white">
                ×
              </button>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
              <button onClick={clearError} className="ml-auto text-white/80 hover:text-white">
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Deliveries</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Track and manage all delivery orders.</p>
      </div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer, order ID, or product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all md:w-48 text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardContent className="p-4 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Deliveries List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDeliveries.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 sm:p-3 rounded-xl ${order.status === "delivered"
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "bg-yellow-50 dark:bg-yellow-900/20"
                        }`}>
                        <Truck className={`w-5 h-5 sm:w-6 sm:h-6 ${order.status === "delivered"
                          ? "text-emerald-600"
                          : "text-yellow-600"
                          }`} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Order {order.id}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Delivery Order</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-medium ${order.status === "delivered"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                        }`}
                    >
                      {order.status === "delivered" ? "Delivered" : "Pending"}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{order.customerName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Product</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.quantity} bags of {order.product}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Delivery Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.deliveryDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:col-span-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mark as Delivered Button */}
                  {order.status === "pending" && (
                    <button
                      onClick={() => markDelivered(order._id || order.id, order.isApiDelivery)}
                      disabled={updating}
                      className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          Mark as Delivered
                        </>
                      )}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDeliveries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 sm:py-12"
        >
          <Truck className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-400">No deliveries found.</p>
        </motion.div>
      )}
    </div>
  );
}
