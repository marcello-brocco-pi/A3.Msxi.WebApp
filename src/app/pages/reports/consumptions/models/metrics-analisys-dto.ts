import { CompanyConsumerMetricsRowDto } from "./company-consumer-metrics-row-dto";
import { NumericIndicatorDto } from "./numeric-indicator-dto";

export interface MetricsAnalisysDto {
    type: 'CONSUMER' | 'COMPANY';
    title: string;
    totalIndicatorItems: NumericIndicatorDto[];
    consumptionsDetailRows: CompanyConsumerMetricsRowDto[];
}