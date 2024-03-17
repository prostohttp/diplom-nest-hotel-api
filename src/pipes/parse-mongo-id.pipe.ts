import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import mongoose from "mongoose";

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any) {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) {
      throw new BadRequestException("Неправильный формат ID");
    }
    return value;
  }
}
