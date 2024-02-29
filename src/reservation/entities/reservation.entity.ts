import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  })
  hotelId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "HotelRoom",
    required: true,
  })
  roomId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, unique: false })
  dateStart: Date;

  @Prop({ required: false, unique: false })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
