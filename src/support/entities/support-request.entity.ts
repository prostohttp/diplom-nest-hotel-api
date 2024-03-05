import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type SupportRequestDocument = HydratedDocument<SupportRequest>;

@Schema()
export class SupportRequest {
  @Prop({ required: true, ref: "Message" })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false, ref: "Message" })
  messages: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false })
  isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
