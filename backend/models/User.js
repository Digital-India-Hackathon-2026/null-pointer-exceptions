const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  label: { type: String, required: true }, // "Myself", "Amma", "Ramesh (friend)"
  isSelf: { type: Boolean, default: false },
  age: Number,
  gender: { type: String, enum: ["male", "female", "other"] },
  state: String,
  occupation: String,
  maritalStatus: String,
  socialCategory: String,
  hasDisability: { type: String, enum: ["yes", "no", "not_sure"], default: "not_sure" },

  income: { type: Number, default: null },
  incomeRange: { type: String, default: null }, // used when exact income unknown
  incomeUnknown: { type: Boolean, default: false },

  landValue: { type: Number, default: null },
  landValueRange: { type: String, default: null },
  landValueUnknown: { type: Boolean, default: false }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profiles: [ProfileSchema]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
