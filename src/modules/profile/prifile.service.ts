import { pool } from "../../db";

const createProfileIntoDB = async (payload: any) => {
  const { user_id, bio, address, phone, gender } = payload;
  const result = await pool.query(
    `
    INSERT INTO users (user_id, bio, address, phone, gender) VALUES
    ($1, $2, $3, $4 ,$5) RETURNING *
  
    `,
    [user_id, bio, address, phone, gender],
  );

  return result;
};

export const ProfileService = {
  createProfileIntoDB,
};
