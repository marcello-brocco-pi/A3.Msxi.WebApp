import { ApiConsumerDto } from "./api-consumer-dto";
import { CategoryDto } from "./category-dto";
import { CompanyDto } from "./company-dto";
import { ServiceDto } from "./service-dto";

export interface ConsumptionsFiltersResponseGetDto {
    consumers: ApiConsumerDto[];
    companies: CompanyDto[];
    categories: CategoryDto[];
    servicesList: ServiceDto[];
}