import { AttachmentDto } from "../../../shared/models/AttachmentDto";

export interface SourceEmailResponseGetDto {
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
    isProcessed: boolean;
    dateProcessed: string | null;
    emailAttachs: UploadedAttachmentDto[];
    paragraphs: ParagraphsDto[];
}

export interface UploadedAttachmentDto extends AttachmentDto {
    uploadedPath: string;
}

export interface ParagraphsDto {
    title: string;
    content: string;
}