import { Module } from "@nestjs/common";
import { SupportEmployeeService } from "./employee.service";
import { SupportEmployeeController } from "./employee.controller";

@Module({
    controllers: [SupportEmployeeController],
    providers: [SupportEmployeeService],
})
export class SupportEmployeeModule {}
