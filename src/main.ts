import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import { useContainer } from "class-validator";
import * as passport from "passport";

import { AppModule } from "./app.module";
import { swaggerConfig } from "./config/swagger.config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.use(helmet());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super_secret",
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.session());
  app.use(passport.initialize());
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const document = SwaggerModule.createDocument(app, swaggerConfig());
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.HTTP_PORT || 3000);
}

bootstrap();
