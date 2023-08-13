import { Router, Request, Response } from "express";
import Crawler from "./crawler";
import DellAnalyzer from "./dellAnalyzer";

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

router.get("/getData", (req: Request, res: Response) => {
  const secret = "XXXXX";
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = DellAnalyzer.getInstance();
  new Crawler(url, analyzer);
  res.send("bye world");
});

export default router;
