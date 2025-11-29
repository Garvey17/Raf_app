import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
    {
        deliveryNumber: {
            type: String,
            unique: true,
            // Will be auto-generated in pre-save hook
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true, // One delivery per order
        },

        dispatch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dispatch",
            required: true,
        },

        orderNumber: {
            type: String,
            required: true,
        },

        customerName: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        },

        dropLocation: {
            type: String, // Destination/delivery address
            required: true,
        },

        phoneNumber: {
            type: String,
            required: true,
        },

        deliveryDate: {
            type: Date,
            required: true,
        },

        driver: {
            type: String,
            required: true,
        },

        driverPhone: {
            type: String,
            required: true,
        },

        truckNumber: {
            type: String, // Vehicle/truck number
            required: true,
        },

        dispatchedAt: {
            type: Date,
            required: true,
        },

        deliveredAt: {
            type: Date,
            default: null,
        },

        receivedBy: {
            type: String, // Name of person who received delivery
            default: null,
        },

        deliveryStatus: {
            type: String,
            enum: ["in_transit", "delivered", "failed", "returned"],
            default: "in_transit",
        },

        deliveryNotes: {
            type: String,
            default: "",
        },

        proofOfDelivery: {
            type: String, // URL to image/document
            default: null,
        },
    },
    { timestamps: true }
);

// Pre-save hook to generate delivery number
deliverySchema.pre("save", async function (next) {
    if (!this.deliveryNumber) {
        try {
            // Generate delivery number format: DEL-{orderNumber}
            if (this.orderNumber) {
                this.deliveryNumber = `DEL-${this.orderNumber}`;
            } else {
                // Fallback: generate unique delivery number
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const dateStr = `${year}${month}${day}`;

                const count = await mongoose.models.Delivery.countDocuments();
                const sequentialNumber = String(count + 1).padStart(4, "0");
                this.deliveryNumber = `DEL-${dateStr}-${sequentialNumber}`;
            }
        } catch (error) {
            console.error("Error generating delivery number:", error);
            this.deliveryNumber = `DEL-${Date.now()}`;
        }
    }
    next();
});

// Index for efficient querying
deliverySchema.index({ deliveryStatus: 1, deliveryDate: 1 });
deliverySchema.index({ orderNumber: 1 });
deliverySchema.index({ driver: 1 });

// Force model recompilation in development to ensure new fields are picked up
if (process.env.NODE_ENV === "development" && mongoose.models.Delivery) {
    delete mongoose.models.Delivery;
}

export default mongoose.models.Delivery || mongoose.model("Delivery", deliverySchema);
