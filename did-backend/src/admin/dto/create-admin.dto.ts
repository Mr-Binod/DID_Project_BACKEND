import { IsString } from "class-validator";

export class CreateAdminDto {
    @IsString()
    adminid : string;

 

}
