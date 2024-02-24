import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import * as session from "express-session";
import { useContainer } from "class-validator";

import { AppModule } from "./app.module";
import { swaggerConfig } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix("api");
  app.use(helmet());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super_secret",
      resave: false,
      saveUninitialized: false,
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig());
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.HTTP_PORT || 3000);
}

bootstrap();
