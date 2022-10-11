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
import Socket from '@/socket';
import http from 'http';
import { ChatMessage } from '@entities/ChatMessage';
import { ChatRead } from '@entities/ChatRead';
import { ChatRoom } from '@entities/ChatRoom';
import { ChatRoomUser } from '@entities/ChatRoomUser';

class App {
  public app: express.Application;
  public http: http.Server;
  public env: string;
  public port: string | number;
  public host: string;

  constructor() {
    this.app = express();
    this.app.get('/', (req, res) => {
      res.sendFile('index.html', { root: 'src/views' });
    });
    this.http = new http.Server(this.app);
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.connectToDatabase();
    this.initializeErrorHandling();
    this.initializeSocket();
  }

  public listen() {
    this.http.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeSocket() {
    new Socket(this.http);
  }

  private async connectToDatabase() {
    try {
      DI.orm = await MikroORM.init(dbOptions);
      DI.em = DI.orm.em.fork();
      DI.chatMessageRepository = DI.orm.em.fork().getRepository(ChatMessage);
      DI.chatReadRepository = DI.orm.em.fork().getRepository(ChatRead);
      DI.chatRoomRepository = DI.orm.em.fork().getRepository(ChatRoom);
      DI.chatRoomUserRepository = DI.orm.em.fork().getRepository(ChatRoomUser);
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

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

export default App;
