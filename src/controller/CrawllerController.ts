import fs from "fs";
import path from "path";
import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { controller, get, enumerable, use } from "../decorator";
import { getResponseData } from "../utils/util";
import Crawler from "../utils/crawler";
import Analyzer from "../utils/analyzer";
import { BodyRequest } from "../const/interface";

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  console.log("checklogin middleware");
  const isLogin = !!(req.session ? req.session.login : false);
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "Please Login"));
  }
};

const test = (req: Request, res: Response, next: NextFunction): void => {
  console.log("test middleware");
};

@controller("/")
export class CrawllerController {
  @get("/getData")
  @enumerable(true)
  @use(checkLogin)
  @use(test)
  getData(req: BodyRequest, res: Response): void {
    const secret = "XXXXX";
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyzer.getInstance();
    new Crawler(url, analyzer);
    res.json(getResponseData(true));
  }

  @get("/showData")
  @enumerable(true)
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData(false, "No Content!"));
    }
  }
}
