export interface ConsumptionsRequestGetDto {
    consumerId : number | null;
    companyId : number | null;
    serviceId : number | null;
    categoryId : number | null;
    dateFrom : Date;
    dateTo : Date;
    onlyBillable : boolean;
    isIncludeDeactivatedConsumer: boolean;
    isIncludeDeactivatedCompany: boolean;
}