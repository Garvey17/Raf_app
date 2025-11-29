import mongoose from "mongoose";

const dispatchSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true, // One dispatch per order
        },

        orderNumber: {
            type: String,
            required: true,
        },

        customerName: {
            type: String,
            required: true,
        },

        productQuantity: {
            type: Number,
            required: true,
        },

        deliveryDate: {
            type: Date,
            required: true,
        },

        destination: {
            type: String, // Drop location/destination
            required: true,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        dispatchStatus: {
            type: String,
            enum: ["ready_for_dispatch", "dispatched", "in_transit", "delivered", "cancelled"],
            default: "ready_for_dispatch",
        },

        driver: {
            type: String, // Driver ID or name
            default: null,
        },

        driverPhone: {
            type: String,
            default: null,
        },

        vehicleNumber: {
            type: String,
            default: null,
        },

        assignedBy: {
            type: String, // Transport officer who assigned the driver
            default: null,
        },

        assignedAt: {
            type: Date, // When driver was assigned
            default: null,
        },

        dispatchedAt: {
            type: Date, // When order was dispatched
            default: null,
        },

        deliveredAt: {
            type: Date, // When order was delivered
            default: null,
        },

        notes: {
            type: String, // Additional dispatch notes
            default: "",
        },
    },
    { timestamps: true }
);

// Index for efficient querying
dispatchSchema.index({ dispatchStatus: 1, deliveryDate: 1 });
dispatchSchema.index({ orderNumber: 1 });

// Force model recompilation in development to ensure new fields are picked up
if (process.env.NODE_ENV === "development" && mongoose.models.Dispatch) {
    delete mongoose.models.Dispatch;
}

export default mongoose.models.Dispatch || mongoose.model("Dispatch", dispatchSchema);
