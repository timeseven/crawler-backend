import "reflect-metadata";
import { Request, Response } from "express";
import { controller, get, enumerable, post } from "../decorator";
import { getResponseData } from "../utils/util";
import { BodyRequest } from "../const/interface";

@controller("/")
export class LoginController {
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false);
  }

  @post("/login")
  @enumerable(true)
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData(false, "Already Login"));
    } else {
      if (password === "123" && req.session) {
        req.session.login = true;
        res.json(getResponseData(true));
      } else {
        res.json(getResponseData(false, "Login Failed"));
      }
    }
  }

  @get("/logout")
  @enumerable(true)
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData(true));
  }

  @get("/")
  @enumerable(true)
  home(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.send(`
      <html>
        <body>
          <a href="/showData">Show Data</a>
          <a href="/getData">Go Crawler</a>
          <a href="/logout">Exit</a>
        </body>
      </html>`);
    } else {
      res.send(`
      <html>
        <body>
            <form method="post" action="/login">
              <input type="password" name="password" />
              <button>Login</button>
            </form>
        </body>
      </html>`);
    }
  }
}
