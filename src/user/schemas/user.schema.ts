import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  Client = "client",
  Admin = "admin",
  Manager = "manager",
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: false })
  passwordHash: string;

  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: false, unique: false })
  contactPhone: string;

  @Prop({ required: true, unique: false, default: UserRole.Client })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
