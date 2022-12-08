
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreatePurchaseDto {

    @Length(3, 50)
    @IsString()
    @IsNotEmpty()
    public game!: string;

    @IsNumber()
    @IsNotEmpty()
    public amount!: number;

}
