import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: "User" })
    author: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    sentAt: Date;

    @Prop({ required: true })
    text: string;

    @Prop({ required: false })
    readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
