
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateRentDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public game!: string;

    @Length(13, 15) 
    @IsString()
    @IsNotEmpty()
    public dni!: string;

    @IsNumber()
    @IsNotEmpty()
    public days!: number;

}
