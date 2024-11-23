import { HotelService } from "../hotel.service";
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator,
} from "class-validator";
import { Injectable } from "@nestjs/common";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueTitleConstraint implements ValidatorConstraintInterface {
    constructor(private readonly hotelService: HotelService) {}

    async validate(title: string) {
        const hotel = await this.hotelService.findByTitle(title);
        return !hotel;
    }

    defaultMessage() {
        return "Hotel c таким названием уже существует";
    }
}

export function IsUniqueTitle(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            async: true,
            validator: IsUniqueTitleConstraint,
        });
    };
}
