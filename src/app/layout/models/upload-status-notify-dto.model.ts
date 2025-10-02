export interface UploadStatusNotifyDto {
    userId: number;
    companyId: number;
    status: string;
    fileName: string;
    idLogGenFileManager: number;
    respMsg: string;
    isLoadPreview: boolean;
}

export interface DocCubeHubMessageDto {
    isRemoteError: boolean;
    companyId: number;
    description: string;
}