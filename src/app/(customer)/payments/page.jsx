'use client'
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Wallet, CreditCard, Search, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { usePaymentStore } from "@/store/paymentStore";

export default function PaymentsPage() {
  const {
    payments: apiPayments,
    fetchPayments,
    loading,
    error,
    clearError,
  } = usePaymentStore();

  // Sample dummy data (replace with DB data later)
  const [dummyPayments] = useState([
    {
      id: "TXN-001",
      type: "goods_payment",
      customer: "John Doe",
      phone: "08123456789",
      amount: 150000,
      mode: "Bank Transfer",
      date: "2024-02-14",
      status: "successful",
    },
    {
      id: "TXN-002",
      type: "deposit",
      customer: "Mary Adams",
      phone: "09055667788",
      amount: 50000,
      mode: "Cash",
      date: "2024-02-12",
      status: "successful",
    },
    {
      id: "TXN-003",
      type: "goods_payment",
      customer: "Emeka Obi",
      phone: "07033445566",
      amount: 200000,
      mode: "POS",
      date: "2024-02-10",
      status: "pending",
    },
  ]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Merge dummy and API data
  const allPayments = [
    ...dummyPayments,
    ...apiPayments.map(p => ({
      id: p.paymentNumber,
      _id: p._id, // Keep MongoDB ID for API calls
      type: p.paymentMethod === "cash" ? "deposit" : "goods_payment", // Map payment method to type
      customer: p.customerName,
      phone: p.user?.phone || "N/A",
      amount: p.amount,
      mode: p.paymentMethod,
      date: new Date(p.createdAt).toLocaleDateString(),
      status: p.verificationStatus === "approved" ? "successful" : p.verificationStatus === "rejected" ? "failed" : "pending",
      verificationStatus: p.verificationStatus,
      isApiPayment: true // Flag to identify API payments
    })
    )
  ];

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filtering logic
  const filteredPayments = allPayments.filter((p) => {
    const matchesType = filterType === "all" || p.type === filterType;
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;

    const matchesSearch =
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  // Summary Calculations
  const summary = useMemo(() => {
    const totalReceived = allPayments
      .filter((p) => p.status === "successful")
      .reduce((acc, p) => acc + p.amount, 0);

    const totalDeposits = allPayments
      .filter((p) => p.type === "deposit" && p.status === "successful")
      .reduce((acc, p) => acc + p.amount, 0);

    const totalGoodsPayments = allPayments
      .filter((p) => p.type === "goods_payment" && p.status === "successful")
      .reduce((acc, p) => acc + p.amount, 0);

    return { totalReceived, totalDeposits, totalGoodsPayments };
  }, [allPayments]);

  const summaryCards = [
    {
      title: "Total Amount Received",
      value: summary.totalReceived,
      icon: DollarSign,
      color: "blue"
    },
    {
      title: "Customer Deposits",
      value: summary.totalDeposits,
      icon: Wallet,
      color: "emerald"
    },
    {
      title: "Goods Payments",
      value: summary.totalGoodsPayments,
      icon: CreditCard,
      color: "purple"
    }
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 bg-gray-50/50 dark:bg-slate-950 min-h-screen">
      {/* Toast Notifications */}
      <AnimatePresence>
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Payments & Transactions</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Track all payment transactions and deposits.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</h3>
                  <div className={`p-2 bg-${card.color}-50 dark:bg-${card.color}-900/20 rounded-lg group-hover:scale-110 transition-transform`}>
                    <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${card.color}-600`} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">₦{card.value.toLocaleString()}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer or transaction ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all md:w-48 text-sm sm:text-base"
              >
                <option value="all">All Types</option>
                <option value="goods_payment">Goods Payment</option>
                <option value="deposit">Deposit</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all md:w-48 text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Transaction ID</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Customer</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hidden md:table-cell">Type</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hidden lg:table-cell">Payment Mode</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hidden lg:table-cell">Date</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{p.id}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{p.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.phone}</p>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                      ₦{p.amount.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      {p.type === "goods_payment" ? (
                        <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          Goods Payment
                        </span>
                      ) : (
                        <span className="px-2 sm:px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                          Deposit
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{p.mode}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{p.date}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${p.status === "successful"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                          : p.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredPayments.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No payment records found.</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
