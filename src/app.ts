import { Application } from "express";
import express from "express";
import { userRoute } from "./modules/users/user.route";
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.use("/api/v1/users", userRoute);

export default app;
