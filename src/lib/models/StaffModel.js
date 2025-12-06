import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
    {
        staffNumber: {
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
            default: "",
        },

        role: {
            type: String,
            enum: [
                "admin",
                "transport_officer",
                "warehouse_manager",
                "sales_representative",
                "customer_service",
                "accountant",
                "driver",
                "other"
            ],
            required: true,
        },

        department: {
            type: String,
            enum: [
                "administration",
                "logistics",
                "warehouse",
                "sales",
                "customer_service",
                "finance",
                "operations",
                "other"
            ],
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },

        dateJoined: {
            type: Date,
            default: Date.now,
        },

        password: {
            type: String, // Hashed password for staff login
        },

        lastLogin: {
            type: Date,
            default: null,
        },

        permissions: {
            type: [String], // Array of permission strings
            default: [],
        },

        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Pre-save hook to generate staff number
staffSchema.pre("save", async function (next) {
    if (!this.staffNumber) {
        try {
            // Generate staff number format: STF-YYYYMMDD-XXX
            const date = this.dateJoined || new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const dateStr = `${year}${month}${day}`;

            // Count total staff to generate sequential number
            const count = await mongoose.models.Staff.countDocuments();
            const sequentialNumber = String(count + 1).padStart(3, "0");

            this.staffNumber = `STF-${dateStr}-${sequentialNumber}`;
        } catch (error) {
            console.error("Error generating staff number:", error);
            // Fallback to timestamp-based number
            this.staffNumber = `STF-${Date.now()}`;
        }
    }
    next();
});

// Index for efficient querying
staffSchema.index({ status: 1, department: 1 });
staffSchema.index({ role: 1 });


// Force model recompilation in development to ensure new fields are picked up
if (process.env.NODE_ENV === "development" && mongoose.models.Staff) {
    delete mongoose.models.Staff;
}

export default mongoose.models.Staff || mongoose.model("Staff", staffSchema);
