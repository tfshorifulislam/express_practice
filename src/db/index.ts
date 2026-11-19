import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({ connectionString: config.connection_string });

export const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      age INT,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_Active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      );
      `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS profile(
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE REFERENCES user(id) ON DELETE CASCADE,
        bio TEXT,
        address TEXT,
        phone VARCHAR(15),
        gender VARCHAR(15),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
};
