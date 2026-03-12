#!/usr/bin/env node
/**
 * reset-db.js — Drop all tables and recreate from Sequelize models.
 *
 * Usage:
 *   node backend/scripts/reset-db.js
 *
 * This uses Sequelize's sync({ force: true }) which drops every table
 * respecting FK order, then recreates them from the model definitions.
 */
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const sequelize = require("../src/config/database");

// Load all models + associations (side-effect import)
require("../src/models");

async function reset() {
  try {
    console.log("⏳ Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Connected.");

    console.log("⏳ Dropping all tables and recreating from models...");
    await sequelize.sync({ force: true });
    console.log("✅ All tables recreated successfully.");

    console.log("\n📋 Tables in database:");
    const [results] = await sequelize.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`,
    );
    results.forEach((r) => console.log(`   - ${r.tablename}`));

    process.exit(0);
  } catch (err) {
    console.error("❌ Reset failed:", err);
    process.exit(1);
  }
}

reset();
