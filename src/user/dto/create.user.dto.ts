import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
} from "class-validator";
import { IsUniqueEmail } from "../validators/is.unique.email.validator";
import { UserRole } from "../schemas/user.schema";

export class CreateUserDto {
  @IsEmail({}, { message: "Некорректный формат email адреса" })
  @IsNotEmpty({ message: 'Поле "email" не должно быть пустым' })
  @IsUniqueEmail({ message: "Пользователь с таким email уже существует" })
  email: string;

  @IsNotEmpty({ message: 'Поле "password" не должно быть пустым' })
  password: string;

  @IsNotEmpty({ message: 'Поле "name" не должно быть пустым' })
  name: string;

  @IsPhoneNumber("RU", { message: "Некорректный формат номера телефона" })
  @IsOptional()
  contactPhone: string;

  @IsEnum(UserRole, {
    message: "Поле role может быть client | admin | manager",
  })
  @IsNotEmpty({ message: "Поле role не должно быть пустым" })
  role: UserRole;
}
