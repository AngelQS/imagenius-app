// Third
let cron = require("node-cron");

// Local
//const { User } = require("../models/index.model");

// Initialization
//const now =
console.log("HI");
cron.schedule("* * * * *", () => {
  console.log("EJECUTANDO TAREAS");
});
