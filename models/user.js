var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    monthIncome: {
      type: Number
    },
    monthSaving: {
      type: String
    },
    months: [
        {
            type: Schema.Types.ObjectId,
            ref: "Month"
        }
    ],
    proyectedExpenses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Expense"
        }
    ],
    fixedExpenses : [
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

UserSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password)

};

UserSchema.pre('save', function(callback) {
    var user = this;
  
    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();
  
    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
      if (err) return callback(err);
  
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return callback(err);
        user.password = hash;
        user.status = user.status?1:0
        callback();
      });
    });
  });

const User = mongoose.model("User", UserSchema);
module.exports = User
