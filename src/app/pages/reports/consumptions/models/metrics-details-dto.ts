import { MetricsAnalisysDto } from "./metrics-analisys-dto";
import { NumericIndicatorDto } from "./numeric-indicator-dto";

export interface MetricsDetailsDto<ChartType> {
    totalIndicatorItems: NumericIndicatorDto[];
    consumersDetails: MetricsAnalisysDto;
    companiesDetails: MetricsAnalisysDto;
    chartsItems: ChartType[];
}