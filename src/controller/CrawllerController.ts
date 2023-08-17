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
  const isLogin = !!(req.session ? req.session.login : false);
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "Please Login"));
  }
};

@controller("/api")
export class CrawllerController {
  @get("/getData")
  @enumerable(true)
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const url = "https://crawler-target-test.netlify.app/";
    const analyzer = Analyzer.getInstance();
    new Crawler(url, analyzer);
    res.json(getResponseData<responseResult.getData>(true));
  }

  @get("/showData")
  @enumerable(true)
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData<responseResult.showData>(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData<responseResult.showData>(false, "No Content!"));
    }
  }
}
