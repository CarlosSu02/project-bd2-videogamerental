
import { IsString, IsNotEmpty, IsNumber, Length, IsOptional } from "class-validator";

export class CreateCustomerDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public name!: string;
    
    @Length(13, 15) 
    @IsString()
    @IsNotEmpty()
    public dni!: string;

    @IsNumber()
    @IsNotEmpty()
    public phone!: number;

    @Length(3, 100)
    @IsString()
    @IsNotEmpty()
    public address!: string;

    @IsString()
    @IsOptional()
    public _id_company!: string;

} 
