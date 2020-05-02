// Third
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// Local
const capitalize = require("../utils/capitalize");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Schema pre hooks
userSchema.pre("save", async function (next) {
  const user = this;
  new Promise(async function (resolve, reject) {
    // Cleaning user input data
    user.fullname = capitalize(user.fullname);
    user.username = user.username.toLowerCase();
    user.email = user.email.toLowerCase();

    // Hashing the password
    if (user.isModified("password")) {
      const salt = bcrypt.genSaltSync(12);
      if (!salt) {
        reject(Error("Unable to generate Salt"));
      }

      // Getting hashed password
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      if (!hashedPassword) {
        reject(Error("Unable to hash the user password"));
      }

      // Saving the hashing password
      user.password = hashedPassword;
    }
  })
    .then(() => {
      console.log("NEXT()");
      next();
    })
    .catch((err) => {
      console.log("CATCH ERROR:", err);
      next(err);
    });
});

userSchema.methods.matchPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(`Passwords are not equals: ${err}`);
  }
};

// Index created from mongodb client
/* db.users.createIndex(
  { createdAt: 1 },
  {
    name: "createdAtIndex",
    expireAfterSeconds: 30,
    partialFilterExpression: { isVerified: false },
  }
); */

module.exports = model("User", userSchema);
