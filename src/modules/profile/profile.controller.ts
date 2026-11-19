import { Request, Response } from "express";
import { ProfileService } from "./prifile.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await ProfileService.createProfileIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "user create successfull !!",
      data: result,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error create user!!",
      error: error.message,
    });
  }
};

export const profileController = {
  createProfile,
};
