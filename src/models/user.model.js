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
  const user = this;
  new Promise(async function (resolve, reject) {
    if (user.isModified('password')) {
      const salt = bcrypt.genSaltSync(12);
      if (!salt) {
        reject(Error('Unable to generate Salt'));
      }

      // Hashing the password
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      if (!hashedPassword) {
        reject(Error('Unable to hash the user password'));
      }

      // Saving the hashing password
      user.password = hashedPassword;

      /* await bcrypt.genSalt(20, async function (err, salt) {
        console.log('SALT GENERATED');
        if (err) {
          reject(Error('Unable to generate Salt'));
        }
        console.log('user.password 1:', user.password);
        await bcrypt.hash(user.password, salt, async function (
          err,
          hashedPassword,
        ) {
          console.log('hashedPassword:', hashedPassword);
          user.password = hashedPassword;
          console.log('user.password 2:', user.password);
          if (err) {
            reject(Error('Unable to hash the user password'));
          }
          console.log('RESOLVE');
          resolve();
        });
        console.log('SALT END');
      }); */
    }
  })
    .then(() => {
      console.log('NEXT()');
      next();
    })
    .catch((err) => {
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
