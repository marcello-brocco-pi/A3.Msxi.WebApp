import { VersionInfoDto } from "./version-info-dto.model";

export interface VersionInfoResultResponseGetDto
{
    items : VersionInfoDto[];
    productVersion : string;
}