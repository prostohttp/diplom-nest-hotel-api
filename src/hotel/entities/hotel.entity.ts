import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type HotelDocument = HydratedDocument<Hotel>;

@Schema()
export class Hotel {
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: false, unique: false })
    description: string;

    @Prop({ required: true, unique: false })
    createdAt: Date;

    @Prop({ required: true, unique: false })
    updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
