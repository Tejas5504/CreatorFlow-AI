import express from "express";
import { generateScript, getUserScripts, deleteScript } from "../controllers/ScriptController.js";
import protect from "../middlewares/auth.js";

const ScriptRouter = express.Router();

ScriptRouter.post("/generate", protect, generateScript);
ScriptRouter.get("/user", protect, getUserScripts);
ScriptRouter.delete("/delete/:id", protect, deleteScript);

export default ScriptRouter;
