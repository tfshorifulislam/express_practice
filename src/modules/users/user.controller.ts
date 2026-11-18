import { Request, Response } from "express";
import { userService } from "./user.service";
import { initDb } from "../../db";

// create user into db

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
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
};

// get all user from db;

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();
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
};

// get only one user from db

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getSingleUserFromDB(id as string);
    console.log(result);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "user not found!!",
      });
    }

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
};

// update user;
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.usesrUpdateFromDB(req.body, id as string);
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
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};
