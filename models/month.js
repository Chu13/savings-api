const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const monthSchema = new Schema(
  {
    name: { 
      type: String 
    },
    income: { 
      type: Number 
    },
    proyectedSavings: { 
      type: Number 
    },
    extraIncome: { 
      type: Number 
    },
    proyectedExpenses: [
        {
          type: Schema.Types.ObjectId,
          ref: "Expense"
        }
      ],
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expense"
      }
    ],
    balance: { 
      type: Number 
    },        
  },
  {
    timestamps: true,
    usePushEach: true
  }
);

const Month = mongoose.model("Month", monthSchema);

module.exports = Month;
