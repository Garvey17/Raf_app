import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
    {
        driverNumber: {
            type: String,
            unique: true,
            // Will be auto-generated in pre-save hook
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        phone: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            default: "driver",
        },

        department: {
            type: String,
            default: "logistics",
        },

        vehicleAssigned: {
            type: String, // Vehicle number/ID
            default: null,
        },

        totalDeliveries: {
            type: Number,
            default: 0,
        },

        dateJoined: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "on_leave", "suspended"],
            default: "active",
        },

        licenseNumber: {
            type: String,
            default: "",
        },

        licenseExpiry: {
            type: Date,
            default: null,
        },

        password: {
            type: String, // Hashed password for driver login
        },

        currentLocation: {
            type: String,
            default: "",
        },

        lastDeliveryDate: {
            type: Date,
            default: null,
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },

        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Pre-save hook to generate driver number
driverSchema.pre("save", async function (next) {
    if (!this.driverNumber) {
        try {
            // Generate driver number format: DRV-YYYYMMDD-XXX
            const date = this.dateJoined || new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const dateStr = `${year}${month}${day}`;

            // Count total drivers to generate sequential number
            const count = await mongoose.models.Driver.countDocuments();
            const sequentialNumber = String(count + 1).padStart(3, "0");

            this.driverNumber = `DRV-${dateStr}-${sequentialNumber}`;
        } catch (error) {
            console.error("Error generating driver number:", error);
            // Fallback to timestamp-based number
            this.driverNumber = `DRV-${Date.now()}`;
        }
    }
    next();
});

// Index for efficient querying
driverSchema.index({ status: 1 });
driverSchema.index({ driverNumber: 1 });
driverSchema.index({ vehicleAssigned: 1 });

// Force model recompilation in development to ensure new fields are picked up
if (process.env.NODE_ENV === "development" && mongoose.models.Driver) {
    delete mongoose.models.Driver;
}

export default mongoose.models.Driver || mongoose.model("Driver", driverSchema);
