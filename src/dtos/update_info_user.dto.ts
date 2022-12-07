
import { IsString, IsEmail, IsNotEmpty, IsNumber, Length, IsOptional } from "class-validator";

export class UpdateInfoUserDto {

    @Length(3, 50)
    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    public name!: string;
    
    @IsNumber()
    // @IsNotEmpty()
    @IsOptional()
    public phone!: number;

    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    public role!: string;

    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    public _id_role!: string;

} 
