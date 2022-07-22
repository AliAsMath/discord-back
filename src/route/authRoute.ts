import { Router } from "express";
import { controller } from "../controller/auth/authController";
import Joi from "joi";
import { createValidator } from "express-joi-validation";

const router = Router();
const validator = createValidator();

const registerSchema = Joi.object({
  mail: Joi.string().email().required(),
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(6).max(12).required(),
});

const loginSchema = Joi.object({
  mail: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
});

router.post(
  "/register",
  validator.body(registerSchema),
  controller.postRegister
);

router.post("/login", validator.body(loginSchema), controller.postLogin);

export default router;
