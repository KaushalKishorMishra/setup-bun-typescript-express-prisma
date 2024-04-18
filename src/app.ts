import express, { Application } from "express";
import { log, stream } from "@/utils/logger.utils";
import { CREDENTIALS, LOG_FORMAT, ORIGIN, PORT } from "@config";
import { prismaConnect } from "@database";
import cors from "cors";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import { Routes } from "@interfaces/route.interface";
import { ErrorMiddleware } from "@middlewares/error.middleware";
import hpp from "hpp";
import helmet from "helmet";

export class App {
  public app: Application;
  public port: number | string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = PORT ? parseInt(PORT) : 3000;
    this.initialize_db_connection();
    this.initialize_middlewares();
    this.initialize_routes(routes);
    this.initialize_error_handler();
  }

  public listen() {
    try {
      this.app.listen(this.port, () => {
        log.info(`🚀 App listening on the port ${this.port}`);
        log.info(`🚀 App running on localhost:${this.port}`);
      });
    } catch (err) {
      log.error(err);
      console.log(err);
    }
  }

  private async initialize_db_connection() {
    await prismaConnect();
  }

  private initialize_middlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }))
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS}));
    this.app.use(hpp())
    this.app.use(helmet())
  }

  private initialize_routes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/api", route.router)
    })
  }

  private initialize_error_handler() {
    this.app.use(ErrorMiddleware)
  }

}
