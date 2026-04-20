const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        // Password required only if NOT Google login
        return !this.googleId;
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // password kabhi default response me nahi aayega
    },

    // Google OAuth ID
    googleId: {
      type: String,
      default: null,
    },


    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },


    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

    lastLogin: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);


// Unique email index
userSchema.index({ email: 1 }, { unique: true });

// Google ID index (optional but useful)
userSchema.index({ googleId: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
