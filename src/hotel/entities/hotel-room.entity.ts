import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type HotelRoomDocument = HydratedDocument<HotelRoom>;

@Schema()
export class HotelRoom {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    })
    hotel: MongooseSchema.Types.ObjectId | string;

    @Prop({ required: false, unique: false })
    description: string;

    @Prop({ required: false, unique: false, default: [] })
    images: string[];

    @Prop({ required: true, unique: false })
    createdAt: Date;

    @Prop({ required: true, unique: false })
    updatedAt: Date;

    @Prop({ required: true, unique: false, default: true })
    isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
