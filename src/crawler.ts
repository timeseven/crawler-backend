import superagent from "superagent"; // ts -> .d.ts translate file -> js
import fs from "fs";
import path from "path";

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crawler {
  private filePath = path.resolve(__dirname, "../data/course.json");

  private async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
}

export default Crawler;
