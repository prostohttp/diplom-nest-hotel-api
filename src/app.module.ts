import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { HotelModule } from "./hotel/hotel.module";
import { ReservationModule } from "./reservation/reservation.module";
import { SupportRequestModule } from "./support/request.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import mongoose from "mongoose";

mongoose.set("toJSON", {
  versionKey: false,
});

@Module({
  imports: [
    UserModule,
    HotelModule,
    ReservationModule,
    SupportRequestModule,
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL_DOCKER),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
