const dns = require("node:dns");
const mongoose = require("mongoose");

const DEFAULT_CONNECTION_TIMEOUT_MS = 10000;

function getDnsServers() {
  return (process.env.MONGODB_DNS_SERVERS || "")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);
}

function configureDns() {
  const dnsServers = getDnsServers();

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
}

function getConnectionTimeoutMs() {
  return (
    Number(process.env.MONGODB_TIMEOUT_MS) || DEFAULT_CONNECTION_TIMEOUT_MS
  );
}

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to Backend/.env.");
  }

  configureDns();

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: getConnectionTimeoutMs(),
  });

  console.log("Connected to MongoDB.");
}

module.exports = connectDatabase;
