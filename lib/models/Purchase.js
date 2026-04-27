import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    planName: {
      type: String,
      required: [true, "Please provide a plan name"],
      enum: ["ESSENTIAL", "PREMIUM", "ULTIMATE"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    currency: {
      type: String,
      default: "USD",
    },
    devices: {
      type: Number,
      default: 1,
    },
    years: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
