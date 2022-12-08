
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length, IsOptional } from "class-validator";

export class SignupUserDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public name!: string;
    
    @IsNumber()
    @IsNotEmpty()
    public phone!: number;

    @Length(3, 100)
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @Length(3, 100)
    @IsString()
    @IsNotEmpty()
    public password!: string;

    @IsString()
    @IsNotEmpty()
    public role!: string;

    @IsEmail()
    @IsOptional()
    public company_email!: string;

} 
