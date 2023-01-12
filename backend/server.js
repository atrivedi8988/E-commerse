const app = require("./app");
const dotenv = require("dotenv");
const databaseConnect = require("./config/databaseConnect");

// Handling uncaught exception

process.on("uncaughtException", (err) => {
    console.log(`Error ${err.message}`);
    console.log(`Shutting down the server due to unhandled rejection`);
    process.exit(1)
  });
  
  
// config
dotenv.config({ path: "./backend/config/config.env" });

// connecting to the database
databaseConnect();

const server = app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

// unhandled promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting down the server due to unhandled rejection`);

  server.close(() => {
    process.exit(1);
  });
});
