
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateCompanyDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsNumber()
    @IsNotEmpty()
    public phone!: number;

    @Length(3, 100)
    @IsString()
    @IsNotEmpty()
    public address!: string;

    @IsNumber()
    @IsNotEmpty()
    public num_branches!: number;

}
