import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: {
      type: String,
      unique: true,
      // Will be auto-generated based on order number in pre-save hook
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "bank_transfer", "ussd", "mobile_money", "cash", "other"],
      required: true,
    },

    reference: {
      type: String, // External payment reference (e.g., Paystack reference)
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    verifiedBy: {
      type: String, // Staff number/ID who verified the payment
      default: null,
    },

    verifiedAt: {
      type: Date, // When the payment was verified
      default: null,
    },

    // Legacy field for backward compatibility
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    channel: {
      type: String, // Legacy field - use paymentMethod instead
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate payment number based on order number
paymentSchema.pre("save", async function (next) {
  if (!this.paymentNumber && this.order) {
    try {
      // Fetch the order to get its order number
      const Order = mongoose.models.Order;
      const order = await Order.findById(this.order);

      if (order && order.orderNumber) {
        // Generate payment number format: PAY-{orderNumber}
        this.paymentNumber = `PAY-${order.orderNumber}`;
      } else {
        // Fallback: generate a unique payment number
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateStr = `${year}${month}${day}`;

        const count = await mongoose.models.Payment.countDocuments();
        const sequentialNumber = String(count + 1).padStart(4, "0");
        this.paymentNumber = `PAY-${dateStr}-${sequentialNumber}`;
      }
    } catch (error) {
      console.error("Error generating payment number:", error);
      // Fallback to timestamp-based number
      this.paymentNumber = `PAY-${Date.now()}`;
    }
  }
  next();
});

// Force model recompilation in development to ensure new fields are picked up
if (process.env.NODE_ENV === "development" && mongoose.models.Payment) {
  delete mongoose.models.Payment;
}

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

