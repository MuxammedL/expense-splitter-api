import { Request, Response } from "express";
import { groups } from "../data/store";
import { Group } from "../models/Group";

export const createGroup = (req: Request, res: Response): void => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    res.status(400).json({
      message: "Group name is required",
    });
    return;
  }

  const newGroup: Group = {
    id: Date.now().toString(),
    name,
    members: [],
    expenses: [],
  };

  groups.push(newGroup);

  res.status(201).json(newGroup);
};
