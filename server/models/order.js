const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Order Schema
const OrderSchema = new Schema({
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  total: {
    type: Number,
    default: 0,
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  locations: {
    type: Array,
    ref: "Location",
    default: ["Store"],
  },
});

module.exports = Mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// // Order Schema
// const OrderSchema = new Schema({
//   cart: {
//     type: Schema.Types.ObjectId,
//     ref: "Cart",
//   },
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//   },
//   total: {
//     type: Number,
//     default: 0,
//   },
//   updated: Date,
//   created: {
//     type: Date,
//     default: Date.now,
//   },
//   locations: {
//     type: Array,
//     ref: "Location",
//     default: ["Store"],
//   },
// });

// // Export the model
// module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
