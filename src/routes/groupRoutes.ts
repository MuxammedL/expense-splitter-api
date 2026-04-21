import { Router } from "express";
import {
  addMemberToGroup,
  createGroup,
  getAllGroups,
  getGroupById,
} from "../controllers/groupController";

const router = Router();

router.post("/", createGroup);
router.post("/:groupId/members", addMemberToGroup);
router.get("/", getAllGroups);
router.get("/:groupId", getGroupById);

export default router;
