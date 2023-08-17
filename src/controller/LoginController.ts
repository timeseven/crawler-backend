import "reflect-metadata";
import { Response } from "express";
import { controller, get, enumerable, post } from "../decorator";
import { getResponseData } from "../utils/util";
import { BodyRequest } from "../const/interface";

@controller("/api")
export class LoginController {
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false);
  }

  @get("/isLogin")
  @enumerable(true)
  isLogin(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
    const result = getResponseData<responseResult.isLogin>(isLogin);
    res.json(result);
  }

  @post("/login")
  @enumerable(true)
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData<responseResult.login>(true));
    } else {
      if (password === "123" && req.session) {
        req.session.login = true;
        res.json(getResponseData<responseResult.login>(true));
      } else {
        res.json(getResponseData<responseResult.login>(false, "Login Failed"));
      }
    }
  }

  @get("/logout")
  @enumerable(true)
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData<responseResult.logout>(true));
  }
}
