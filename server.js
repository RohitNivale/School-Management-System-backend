require("dotenv").config();

const app = require("./app");
const connectToDatabase = require("./database");
const port = process.env.PORT || 5000;

async function run() {
  await connectToDatabase();
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

if (require.main === module) {
  run().catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exitCode = 1;
  });
}

module.exports = app;