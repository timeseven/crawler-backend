import { Request } from "express";

export interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}
