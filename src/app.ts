import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { logger, stream } from '@utils/logger';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from '@config';
import { dbOptions, DI } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { Server } from 'socket.io';
import http from 'http';
import Socket from '@/socket';
import { UserEntity } from '@entities/users.entity';

class App {
  public app: express.Application;
  public httpServer: http.Server;
  public socket: Socket;
  public io: Server;
  public env: string;
  public port: string | number;
  public host: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 5000;

    this.initializeMiddlewares();
    // this.connectToDatabase();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeHttpServer();
    this.initializeSocket();
  }

  public initializeHttpServer() {
    this.httpServer = http.createServer(this.app);
  }

  private initializeSocket() {
    this.socket = new Socket(this.httpServer);
  }

  public listen() {
    this.app.listen(this.port);
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    try {
      DI.orm = await MikroORM.init(dbOptions);
      DI.em = DI.orm.em.fork();
      DI.userRepository = DI.orm.em.fork().getRepository(UserEntity);
    } catch (error) {
      logger.error(error);
    }
    this.app.use((_1, _2, next) => RequestContext.create(DI.orm.em, next));
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
