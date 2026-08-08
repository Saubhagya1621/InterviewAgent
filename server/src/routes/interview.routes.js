import { Router } from "express";
import { handleInterview } from "../controllers/interview.controller.js";

const router = Router();

router.post("/interview", handleInterview);

export default router;
