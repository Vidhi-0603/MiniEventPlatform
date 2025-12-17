// models/Rsvp.js
const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate RSVP
rsvpSchema.index({ user: 1, event: 1 }, { unique: true });

const rsvpModel = mongoose.model("Rsvp", rsvpSchema);
module.exports = rsvpModel;