
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class UpdateRentDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public game!: string;

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public _id_rent!: string;

    @IsBoolean()
    @IsNotEmpty()
    public returned!: boolean;

}
