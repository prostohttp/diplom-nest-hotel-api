import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";
import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidMongoIdConstraint implements ValidatorConstraintInterface {
    constructor() {}

    async validate(id: string) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        return isValidId;
    }

    defaultMessage() {
        return "Неправильный формат ID";
    }
}

export function IsValidMongoId(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            async: true,
            validator: IsValidMongoIdConstraint,
        });
    };
}
