import { Router } from "express";
import { addMemberToGroup, createGroup } from "../controllers/groupController";

const router = Router();

router.post("/", createGroup);
router.post("/:groupId/members", addMemberToGroup);

export default router;
