import { pool } from "../../db";
import { Iuser } from "./user.interface";

// user create function;
const createUserIntoDB = async (payload: Iuser) => {
  const { name, age, email, password } = payload;
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, age) VALUES
    ($1, $2, $3, $4) RETURNING *
  
    `,
    [name, email, password, age],
  );

  return result;
};

// get all user from db;
const getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

// get single user ;
const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

// update user from db;
const usesrUpdateFromDB = async (payload: any, id: string) => {
  const { name, age, email, password } = payload;
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

  return result;
};

// delete user from db;
const userDeleteFromDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id = $1
    `,
    [id],
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  usesrUpdateFromDB,
  userDeleteFromDB,
};
