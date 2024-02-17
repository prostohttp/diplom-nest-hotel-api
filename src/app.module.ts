import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { HotelModule } from "./hotel/hotel.module";
import { ReservationModule } from "./reservation/reservation.module";
import { ChatModule } from "./chat/chat.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [UserModule, HotelModule, ReservationModule, ChatModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
