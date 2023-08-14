import express, { Request, Response, NextFunction } from "express";
import router from "./router";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "session",
    keys: ["teacher Even"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
// // Issue 2: When I use middleware, the actual type can't be changed after modifying req or res
// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.teacherName = "Even";
//   next();
// });
app.use(router);
app.listen(7001, () => {
  console.log("server is running");
});
