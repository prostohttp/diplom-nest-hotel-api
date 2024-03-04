import { BadRequestException } from "@nestjs/common";
import mongoose from "mongoose";

export const isValidIdHandler = (id: string) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw new BadRequestException("Неправильный формат ID");
  }
  return id;
};
