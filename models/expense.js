const mongoose = require('mongoose');
let clasificationEnum = ['fixed', 'extra'];
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    clasification: {
        type: String, enum: clasificationEnum, default: 'extra'
    },
    type: {
        type: String
    },
    Date: {
        type: Date
    },
    Place: {
        type: Number
    },
    amountPaid: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    payMethod: {
        type: Number
    },        
  },
  {
    timestamps: true,
    usePushEach: true
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;