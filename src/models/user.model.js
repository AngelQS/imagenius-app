// Third
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

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
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Schema pre hooks
userSchema.pre('save', async function (next) {
  new Promise(async function (resolve, reject) {
    const user = this;
    if (user.isModified('password')) {
      salt = await bcrypt.genSalt(20).then(async (salt) => {
        user.password = await bcrypt.hash(user.password, salt);
        resolve();
      });
    }
  }).catch((err) => {
    console.log('CATCH ERROR:', err);
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

module.exports = model('User', userSchema);
