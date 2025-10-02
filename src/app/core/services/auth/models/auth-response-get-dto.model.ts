import { UserInfo } from "../../../models/user-info";


export interface AuthResponseGetDto {
    userInfo : UserInfo;
    token : string;
}