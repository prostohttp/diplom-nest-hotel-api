import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  MinLength,
} from "class-validator";
import { IsUniqueEmail } from "../validators/is-unique-email.validator";
import { UserRole } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
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

  @ApiProperty({ default: "client" })
  @IsEnum(UserRole, {
    message: "Поле role может быть client | admin | manager",
  })
  @IsNotEmpty({ message: "Поле role не должно быть пустым" })
  role: UserRole;
}
