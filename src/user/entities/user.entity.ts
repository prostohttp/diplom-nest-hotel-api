import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRoles } from "src/types/user-roles";

export type UserDocument = HydratedDocument<User>;

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

  @Prop({
    required: true,
    unique: false,
    default: UserRoles.Client,
    type: String,
  })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
