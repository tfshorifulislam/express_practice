import { Application, Request, Response } from "express";
import { Pool } from "pg";
import express from "express";
import config from "./config";
const app: Application = express();
const pool = new Pool({
  connectionString: config.connection_string,
});
// console.log(pool);

const initDb = async () => {
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

    console.log("Connected to the database successfully");
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
};

initDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { name, age, email, password } = req.body;
    const result = await pool.query(
      `
  INSERT INTO users (name, email, password, age) VALUES
  ($1, $2, $3, $4) RETURNING *

  `,
      [name, email, password, age],
    );

    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "users fetched successfully",
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
});

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    console.log(result.rows[0]);
    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
});

app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, email, password } = req.body;
    const result = await pool.query(
      `
      UPDATE users
      SET
      name = COALESCE ($1, name),
      age = COALESCE ($2, age),
      email = COALESCE ($3, email),
      password = COALESCE ($4, password),
      updated_at = NOW()
      WHERE id = $5
      RETURNING *;
      `,
      [name ?? null, age ?? null, email ?? null, password ?? null, id],
    );
    console.log(result.rows[0]);
    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
});

app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
    `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
