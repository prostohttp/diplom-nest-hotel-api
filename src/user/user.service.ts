import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";

import { User, UserDocument } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { IUserService } from "./interfaces/user-service.interface";
import { SearchUserParams } from "./interfaces/search-user-params.interface";
import { ID } from "src/types/id";

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: CreateUserDto): Promise<UserDocument> {
    const hash = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({ ...data, passwordHash: hash });
    if (user) {
      return user.save();
    } else {
      throw new ConflictException(
        "Пользователь с таким email уже зарегистрирован",
      );
    }
  }

  async findById(id: ID): Promise<UserDocument> {
    return this.userModel.findOne({ _id: id });
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async findAll(params: SearchUserParams): Promise<UserDocument[]> {
    const { limit, offset, email = "", name = "", contactPhone = "" } = params;
    return this.userModel
      .find({
        $and: [
          { email: { $regex: email, $options: "i" } },
          { name: { $regex: name, $options: "i" } },
          { contactPhone: { $regex: contactPhone, $options: "i" } },
        ],
      })
      .skip(offset)
      .limit(limit);
  }
}
