import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User, UserSchema } from "./entities/user.entity";
import { IsUniqueEmailConstraint } from "./validators/is-unique-email.validator";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, IsUniqueEmailConstraint],
  exports: [UserService],
})
export class UserModule {}
