import { IsString } from "class-validator";

export class CreateVcDTO {
    @IsString()
    userId : string;

    @IsString()
    userName : string;

    @IsString()
    certificateName : string;

    @IsString()
    issueDate : string;

    @IsString()
    event : string;

    @IsString()
    description : string;

    @IsString()
    issuerId : string;

}