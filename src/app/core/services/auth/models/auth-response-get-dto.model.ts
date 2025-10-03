export interface UserInfo {
    id : number | null;
    username : string | null;
    fullName : string | null;
    roles : string[] | null;
    companies : CompanyInfo[] | null;
    companyName : string | null;
}
export interface AuthResponseGetDto {
    token: string | null;
    userInfo: UserInfo | null;
    isAuthSuccessful: boolean;
    errorMessage: string;
}

export interface CompanyInfo {
    id : number | null;
    name : string | null;
}
