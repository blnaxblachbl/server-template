const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand(dotenv.config());

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function seedUsers() {
  //Patient Zero
  let users = await client.query(`
    select * from "User" u
  `);
  if (!users.rowCount) {
    const createdUser = await client.query(
      `
      INSERT INTO "User" (name, email, password) VALUES ($1, $2, $3) RETURNING *
    `,
      [
        "Admin",
        process.env.USER_EMAIL,
        bcrypt.hashSync(process.env.USER_PASSWORD),
      ],
    );
    users = createdUser;
  }
  return users.rows;
}

async function seed() {
  await client.connect();
  try {
    const users = await seedUsers();
    console.log("created user - ", "\x1b[32m", users[0].email, "\x1b[0m");
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}

seed();
