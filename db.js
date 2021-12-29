const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: "localhost",
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
});
module.exports = client;
