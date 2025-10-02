import { CompanyInfo } from "./company-info.model";

export interface UserInfo {
    id : number | null;
    username : string | null;
    fullName : string | null;
    roles : string[] | null;
    companies : CompanyInfo[] | null;
    companyName : string | null;
}
