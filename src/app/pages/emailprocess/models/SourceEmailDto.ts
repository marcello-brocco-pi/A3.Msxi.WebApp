import { AttachmentDto } from "../../../shared/models/AttachmentDto";
// SourceEmailResponseGetDto
export interface SourceEmailDto {
    id: number;
    uploadedPath: string;
    uploadedFileName: string;
    kbHubSourceSyncId: number;
    messageId: string | null;
    from: string;
    to: string;
    cc: string | null;
    bcc: string | null;
    subject: string;
    dateSent: string | null;
    dateReceived: string | null;
    bodyText: string | null;
    hasAttachments: boolean;
    size: number | null;
    rawHeaders: string | null;
    status: number;
    dateProcessed: string | null;
    userIdLastUpdate: string | null;
    dateLastUpdate: string | null;
    emailAttachs: UploadedAttachmentDto[];
    paragraphs: ParagraphsDto[];
}

export interface UploadedAttachmentDto extends AttachmentDto {
    uploadedPath: string;
}

export interface ParagraphsDto {
    id:number
    title: string;
    content: string;
    rowIndex: number;
    isInEditMode: boolean;
    isSaving: boolean;
}

export enum EProcessStatus {
    Unprocessed = 1,
    Processed = 2,
    InReview = 3,
    Finalized = 4
}

export interface PatchParagrahRequestDto {
    userIdLastUpdate: string;
    content: string;
}

export interface PatchParagrahRequestDto {
    content: string;
}

export interface PatchEmailRequestDto {
    userIdLastUpdate: string;
    status: number;
}