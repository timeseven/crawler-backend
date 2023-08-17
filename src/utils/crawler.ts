import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { Course } from "./analyzer";

export interface AnalyzerInterface {
  analyze: (data: Course[], filePath: string) => string;
}

class Crawler {
  private filePath = path.resolve(__dirname, "../../data/course.json");

  private async getHtmlData() {
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--fast-start", "--disable-extensions", "--no-sandbox"],
      ignoreHTTPSErrors: true,
    });

    // Create a page
    const page = await browser.newPage();

    // Go to your site
    await page.goto(this.url);

    // Query for an element handle.
    await page.waitForSelector(".course-item");
    let result = await page.$$eval(".course-item", (options) => {
      return options.map((option, index) => {
        return {
          title: option.querySelector(".course-desc")?.innerHTML || "",
          count: parseInt(option.querySelector(".course-num")?.innerHTML || ""),
        };
      });
    });

    // Close browser.
    await browser.close();

    return result;
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  private async initSpiderProcess() {
    const data = await this.getHtmlData();
    const fileContent = this.analyzer.analyze(data, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: AnalyzerInterface) {
    this.initSpiderProcess();
  }
}

export default Crawler;
