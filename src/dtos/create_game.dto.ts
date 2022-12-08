
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateGameDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsNumber()
    @IsNotEmpty()
    public purchase_price!: number;

    @IsNumber()
    @IsNotEmpty()
    public rental_price!: number;

    @IsArray()
    public genres!: string[];

    @IsArray()
    public platforms!: string[];

    @IsNumber()
    @IsNotEmpty()
    public stock!: number;

    @IsString()
    @IsOptional()
    public _id_company!: string;

}
