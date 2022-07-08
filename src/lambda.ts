// lambda.ts
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

const express = require('express');
// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this
// is likely due to a compressed response (e.g. gzip) which has not
// been handled correctly by aws-serverless-express and/or API
// Gateway. Add the necessary MIME types to binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

// Create the Nest.js server and convert it into an Express.js server
async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        logger: WinstonModule.createLogger({
          transports: [
            new winston.transports.Console({
              level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
              format: winston.format.combine(
                // winston.format.uncolorize({}),
                // winston.format.simple(),
                winston.format.timestamp(),
                winston.format.label({ label: 'serverless-test' }),
                winston.format.printf(({ level, message, context }) => {
                  return context
                    ? JSON.stringify({
                        level: level,
                        message: message,
                        context: context,
                      })
                    : JSON.stringify({ level: level, message: message });
                }),
              ),
            }),
          ],
        }),
      },
    );
    nestApp.use(eventContext());
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

// Export the handler : the entry point of the Lambda function
export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
