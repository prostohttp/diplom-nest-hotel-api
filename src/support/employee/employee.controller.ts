import { Controller } from "@nestjs/common";
import { SupportEmployeeService } from "./employee.service";

@Controller("employee")
export class SupportEmployeeController {
    constructor(private readonly employeeService: SupportEmployeeService) {}
}
