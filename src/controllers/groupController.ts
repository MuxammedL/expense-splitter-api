import { Request, Response } from "express";
import { groups } from "../data/store";
import { Group } from "../models/Group";
import { Member } from "../models/Member";
import { Expense } from "../models/Expense";
import {
  calculateBalances,
  calculateSettlements,
} from "../services/expenseService";

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

export const addExpenseToGroup = (req: Request, res: Response): void => {
  const { groupId } = req.params;
  const { title, amount, paidByMemberId, participantIds } = req.body;

  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    res.status(404).json({
      message: "Group not found",
    });
    return;
  }

  if (!title || typeof title !== "string") {
    res.status(400).json({
      message: "Expense title is required",
    });
    return;
  }

  if (typeof amount !== "number" || amount <= 0) {
    res.status(400).json({
      message: "Amount must be a number greater than 0",
    });
    return;
  }

  if (!paidByMemberId || typeof paidByMemberId !== "string") {
    res.status(400).json({
      message: "paidByMemberId is required",
    });
    return;
  }

  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    res.status(400).json({
      message: "participantIds must be a non-empty array",
    });
    return;
  }

  const payerExists = group.members.some(
    (member) => member.id === paidByMemberId,
  );

  if (!payerExists) {
    res.status(400).json({
      message: "Paid by member does not exist in this group",
    });
    return;
  }

  const allParticipantsExist = participantIds.every((participantId: string) =>
    group.members.some((member) => member.id === participantId),
  );

  if (!allParticipantsExist) {
    res.status(400).json({
      message: "One or more participantIds do not exist in this group",
    });
    return;
  }

  const newExpense: Expense = {
    id: Date.now().toString(),
    title,
    amount,
    paidByMemberId,
    participantIds,
    createdAt: new Date().toISOString(),
  };

  group.expenses.push(newExpense);

  res.status(201).json(newExpense);
};

export const getGroupBalances = (req: Request, res: Response): void => {
  const { groupId } = req.params;

  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    res.status(404).json({
      message: "Group not found",
    });
    return;
  }

  const result = calculateBalances(group);

  res.status(200).json(result);
};

export const getGroupSettlements = (req: Request, res: Response): void => {
  const { groupId } = req.params;

  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    res.status(404).json({
      message: "Group not found",
    });
    return;
  }

  const settlements = calculateSettlements(group);

  res.status(200).json(settlements);
};
