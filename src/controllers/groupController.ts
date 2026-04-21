import { Request, Response } from "express";
import { groups } from "../data/store";
import { Group } from "../models/Group";
import { Member } from "../models/Member";

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

export const addMemberToGroup = (req: Request, res: Response): void => {
  const { groupId } = req.params;
  const { name } = req.body;

  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    res.status(404).json({
      message: "Group not found",
    });
    return;
  }

  if (!name || typeof name !== "string") {
    res.status(400).json({
      message: "Member name is required",
    });
    return;
  }

  const existingMember = group.members.find(
    (member) => member.name.toLowerCase() === name.toLowerCase(),
  );

  if (existingMember) {
    res.status(400).json({
      message: "Member already exists in this group",
    });
    return;
  }

  const newMember: Member = {
    id: Date.now().toString(),
    name,
  };

  group.members.push(newMember);

  res.status(201).json(newMember);
};

export const getAllGroups = (_req: Request, res: Response): void => {
  res.status(200).json(groups);
};

export const getGroupById = (req: Request, res: Response): void => {
  const { groupId } = req.params;

  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    res.status(404).json({
      message: "Group not found",
    });
    return;
  }

  res.status(200).json(group);
};
