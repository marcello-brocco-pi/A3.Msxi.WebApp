export interface ChangePasswordRequestPatchDto {
    actualPassword : string | null;
    password : string | null;
    repeatPassword : string | null;
}
