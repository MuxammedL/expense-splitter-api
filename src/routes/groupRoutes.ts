import { Router } from "express";
import {
    addExpenseToGroup,
  addMemberToGroup,
  createGroup,
  getAllGroups,
  getGroupById,
} from "../controllers/groupController";

const router = Router();

router.post("/", createGroup);
router.post("/:groupId/members", addMemberToGroup);
router.post("/:groupId/expenses", addExpenseToGroup);
router.get("/", getAllGroups);
router.get("/:groupId", getGroupById);

export default router;
