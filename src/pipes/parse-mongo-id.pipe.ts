import { Injectable, PipeTransform } from "@nestjs/common";
import { isValidIdHandler } from "src/utils";

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any) {
    return isValidIdHandler(value);
  }
}
