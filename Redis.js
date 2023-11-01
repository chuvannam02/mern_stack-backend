const dotenv = require("dotenv");
dotenv.config();
const redis = require("redis");
// Connect Redis Cloud

console.log("Before client.connect()...");
const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  legacyMode: true, // Add this to createClient
});
client.on("error", (error) => console.error(`Error : ${error}`));
client.on("connect", function () {
  console.log("Connected! to Redis Cloud");
});
client.connect();
module.exports = client;
