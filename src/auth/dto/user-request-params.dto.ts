import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class UserRequestParamsDto {
  @ApiProperty({ required: true, default: "admin@site.ru" })
  @IsEmail({}, { message: "Некорректная почта" })
  email: string;
  @ApiProperty({ required: true, default: "123456" })
  password: string;
}
