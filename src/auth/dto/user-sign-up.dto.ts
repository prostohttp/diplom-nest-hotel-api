import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  MinLength,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { IsUniqueEmail } from "src/user/validators/is-unique-email.validator";

export class SignUpDto {
  @ApiProperty({ default: "test@site.ru" })
  @IsEmail({}, { message: "Некорректный формат email адреса" })
  @IsNotEmpty({ message: 'Поле "email" не должно быть пустым' })
  @IsUniqueEmail({ message: "Пользователь с таким email уже существует" })
  email: string;

  @ApiProperty({ default: "123456" })
  @IsNotEmpty({ message: 'Поле "password" не должно быть пустым' })
  @MinLength(5, { message: "Пароль должен быть не менее 5 символов" })
  password: string;

  @ApiProperty({ default: "test" })
  @IsNotEmpty({ message: 'Поле "name" не должно быть пустым' })
  name: string;

  @ApiProperty({ default: "89123456789" })
  @IsPhoneNumber("RU", { message: "Некорректный формат номера телефона" })
  @IsOptional()
  contactPhone: string;
}
