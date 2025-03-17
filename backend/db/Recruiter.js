const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true, // Remove extra spaces
      match: [
        /^[0-9]{10}$/, // Validate 10-digit phone number
        "Please provide a valid 10-digit phone number1",
      ],
    },
    bio: {
      type: String,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("RecruiterInfo", schema);
