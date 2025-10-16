export interface ChangePasswordRequestDto {
    userName : string | null;
    actualPassword : string | null;
    password : string | null;
    repeatPassword : string | null;
}

export interface UserManagementResponseDto {
    succeeded: boolean;
    messages: string;
}