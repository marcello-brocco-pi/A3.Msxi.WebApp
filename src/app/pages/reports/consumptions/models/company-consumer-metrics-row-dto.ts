import { TotalValueDto } from "./total-value.dto";

export interface CompanyConsumerMetricsRowDto {
    callerId: number;
    callerName: string;
    serviceId: number;
    serviceName: string;
    totalPageCount: TotalValueDto<number>;
    totalTokenCount: TotalValueDto<number>;
    totalInputTokenCount: number;
    totalOutputTokenCount: number;
    totalRequestCount: TotalValueDto<number>;
    totalErrorCount: number;
}