import { Router } from "express";
import {
    addExpenseToGroup,
  addMemberToGroup,
  createGroup,
  getAllGroups,
  getGroupBalances,
  getGroupById,
} from "../controllers/groupController";

const router = Router();

router.post("/", createGroup);
router.post("/:groupId/members", addMemberToGroup);
router.post("/:groupId/expenses", addExpenseToGroup);

router.get("/", getAllGroups);
router.get("/:groupId", getGroupById);
router.get("/:groupId/balances", getGroupBalances);

export default router;
