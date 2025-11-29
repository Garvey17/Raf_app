import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    image: { type: String },
    password: { type: String }, // only for credentials provider
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified"],
      default: "unverified"
    },
    lastPurchaseDate: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field to determine if customer is active or inactive
// Active = purchased within last 90 days, Inactive = no purchase or >90 days ago
UserSchema.virtual("status").get(function () {
  if (!this.lastPurchaseDate) {
    return "inactive";
  }

  const daysSinceLastPurchase = Math.floor(
    (Date.now() - this.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceLastPurchase <= 90 ? "active" : "inactive";
});

// Force model recompilation in development to ensure new fields are picked up
if (process.env.NODE_ENV === "development" && mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model("User", UserSchema);
