import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    priceAtPurchase: {
      type: Number,
      default: 0, // Default to 0 if not available yet
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      // Will be auto-generated in pre-save hook
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make optional for now if needed, or keep true if auth is enforced
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    address: {
      type: String,
      required: true,
    },

    deliveryDate: {
      type: Date, // Changed to Date for better querying and sorting
      required: true,
    },

    instructions: {
      type: String,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    // Generate order number format: ORD-YYYYMMDD-XXXX
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}${month}${day}`;

    // Find the count of orders created today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await mongoose.models.Order.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Generate sequential number for today
    const sequentialNumber = String(count + 1).padStart(4, "0");
    this.orderNumber = `ORD-${dateStr}-${sequentialNumber}`;
  }
  next();
});

// Force model recompilation in development to ensure new fields are picked up
if (process.env.NODE_ENV === "development" && mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
