// Local
const client = require("./client");

// Initializations
const lookupService = {};

lookupService.lookupPhoneNumber = (phoneNumber) => {
  const status = new Promise(async (resolve, reject) => {
    let isValid = {};
    // Searching phone number
    await client.lookups
      .phoneNumbers(phoneNumber)
      .fetch((err, number) => {
        // Handle errors
        if (err) {
          isValid.error = err;
        }
      })
      .then((number) => {
        isValid.number = number;
      })
      .catch((err) => {
        isValid.error = err;
      });

    // Resolving promise if not null
    return resolve(isValid);
  })
    .then((isValid) => {
      return isValid;
    })
    .catch((err) => {
      return err;
    });

  return status;
};

module.exports = lookupService;
