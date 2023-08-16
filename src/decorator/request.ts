import { CrawllerController, LoginController } from "../controller";
import { Methods } from "../const/enum";

function getRequestDecorator(type: Methods) {
  return function (path: string) {
    return function (target: CrawllerController | LoginController, key: string) {
      Reflect.defineMetadata("path", path, target, key);
      Reflect.defineMetadata("method", type, target, key);
    };
  };
}

export const get = getRequestDecorator(Methods.get);
export const post = getRequestDecorator(Methods.post);
