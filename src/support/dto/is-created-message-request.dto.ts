import { ApiProperty } from "@nestjs/swagger";

export class IsCreatedMessageRequestDto {
    @ApiProperty({ default: "2024-03-10" })
    createdBefore?: string;
}
