import express, { Application } from "express";
import { log } from "@/utils/logger";

export class App {
  public app: Application;
  public port: number | string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  }

  public listen() {
    try {
      this.app.listen(this.port, () => {
        log.info(`🚀 App listening on the port ${this.port}`);
      });
    } catch (err) {
      log.error(err);
      console.log(err);
    }
  }
}
