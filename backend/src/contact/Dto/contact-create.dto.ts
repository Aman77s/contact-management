import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateContactDto{
    @ApiProperty()
    @IsNotEmpty({message : "Name can't be Null"})
    name: string

    @ApiProperty()
    @IsEmail({}, {message: "Email Must be Valid "})
    email: string 

    @ApiProperty()
    @IsNotEmpty({message: "Phone field can't be Null"})
    phone: string

    @ApiProperty()
    @IsNotEmpty({message: "Address field can't be null"})
    address: string

    @ApiProperty()
    @IsOptional({message : "Add Extra Field If you want to "})
    extra_fields: Record<string, any>

}