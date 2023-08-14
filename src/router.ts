import fs from "fs";
import path from "path";
import { Router, Request, Response, NextFunction } from "express";
import Crawler from "./utils/crawler";
import Analyzer from "./utils/analyzer";
import { getResponseData } from "./utils/util";

// Issue 1: When type file .d.ts from express is used, the expression about type of .d.ts is not correct
// Fix: extends and rewrite
interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "Please Login"));
  }
};

const router = Router();
router.get("/", (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
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
});
router.get("/logout", (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.json(getResponseData(true));
});

router.post("/login", (req: BodyRequest, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
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
});

router.get("/getData", checkLogin, (req: BodyRequest, res: Response) => {
  const secret = "XXXXX";
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = Analyzer.getInstance();
  new Crawler(url, analyzer);
  res.json(getResponseData(true));
});

router.get("/showData", checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, "../data/course.json");
    const result = fs.readFileSync(position, "utf-8");
    res.json(getResponseData(JSON.parse(result)));
  } catch (e) {
    res.json(getResponseData(false, "No Content!"));
  }
});

export default router;
