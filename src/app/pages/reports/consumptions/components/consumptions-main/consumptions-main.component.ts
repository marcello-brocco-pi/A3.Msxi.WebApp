import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { ApiConsumerDto } from '../../models/api-consumer-dto';
import { CompanyDto } from '../../models/company-dto';
import { CategoryDto } from '../../models/category-dto';
import { ServiceDto } from '../../models/service-dto';
import { ConsumptionsService } from '../../services/consumptions.service';
import { PrimeNG } from 'primeng/config';
import { ComponentBaseComponent } from '../../../../../shared/componentbase/component-base.component';
import { ConsumptionsDataDto } from '../../models/consumptions-data-dto';
import { ConsumptionsFiltersResponseGetDto } from '../../models/consumptions-filters-response-get-dto';
import { ModalMessageService } from '../../../../../shared/modal-message/modal-message.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ConsumptionsRequestGetDto } from '../../models/consumptions-request-get-dto';
import { ConsumptionsResponseGetDto } from '../../models/consumptions-response-get-dto';
import { PanelModule } from 'primeng/panel';
import { ConsumptionsTableComponent } from "../consumptions-table/consumptions-table.component";
import { ConsumptionsCountersTableComponent } from "../consumptions-counters-table/consumptions-counters-table.component";
import { ConsumptionsCounterComponent } from "../consumptions-counter/consumptions-counter.component";
import { ChartModule } from 'primeng/chart';
import { ScrollTop } from 'primeng/scrolltop';
import { ProgressBarModule } from 'primeng/progressbar';
@Component({
    selector: 'app-consumptions-main',
    standalone: true,
    imports: [AccordionModule, DatePickerModule, TranslateModule, CheckboxModule, FluidModule, SelectModule, TooltipModule, TabsModule, CardModule,
    InputTextModule, ReactiveFormsModule, PanelModule, CommonModule, ButtonModule, TableModule,InputIconModule, ConsumptionsTableComponent, ConsumptionsCountersTableComponent, ConsumptionsCounterComponent,
    ChartModule, ScrollTop, ProgressBarModule],
    templateUrl: './consumptions-main.component.html',
})

export class ConsumptionsMainComponent  extends ComponentBaseComponent implements OnInit{
    consumptionFilterForm: FormGroup | null = null;
    consumerList: ApiConsumerDto[] = [];
    companyList: CompanyDto[] = [];
    categoryList: CategoryDto[] = [];
    servicesList: ServiceDto[] = [];
    activeTab: number = 1;
    consumptionData: ConsumptionsDataDto | null = null;
    isLoading: boolean = false;
    
    override ngOnInit(): void {
        super.ngOnInit();  
        this.createFilterForm();
        this.loadFilters();         
    }
    
    protected override applyTranslation(): void {
    }

    get consumerControl() {
        return this.consumptionFilterForm?.get('consumerControl');
    }

    get consumerControlObj() {
      return this.consumptionFilterForm?.get('consumerControlObj');
    }

    get companyControl() {
        return this.consumptionFilterForm?.get('companyControl');
    }

    get companyControlObj() {
        return this.consumptionFilterForm?.get('companyControlObj');
    }

    get categoryControl() {
        return this.consumptionFilterForm?.get('categoryControl');
    }

    get categoryControlObj() {
      return this.consumptionFilterForm?.get('categoryControlObj');
    }

    get servicesControl() {
        return this.consumptionFilterForm?.get('servicesControl');
    }

    get servicesControlObj() {
        return this.consumptionFilterForm?.get('servicesControlObj');
    }

    get dateFrom() {
        return this.consumptionFilterForm?.get('dateFrom');
    }

    get dateTo() {
        return this.consumptionFilterForm?.get('dateTo');
    }

    get onlyBillableControl() {
        return this.consumptionFilterForm?.get('onlyBillableControl');
    }

    get isIncludeDeactivatedConsumer() {
        return this.consumptionFilterForm?.get('isIncludeDeactivatedConsumer');
    }

    get isIncludeDeactivatedCompany() {
        return this.consumptionFilterForm?.get('isIncludeDeactivatedCompany');
    }

    constructor(private consumptionsService: ConsumptionsService, translate : TranslateService,
        private modalMessageService : ModalMessageService, primeNGConfig: PrimeNG) {
        super(translate, primeNGConfig);
    }

    public changeSelConsumer() {
        this.consumerControl?.setValue(this.consumerControlObj?.value?.id);
    }

    public changeSelAzienda() {
        this.companyControl?.setValue(this.companyControlObj?.value?.id);
    }

    public changeSelCategoria() {
        this.categoryControl?.setValue(this.categoryControlObj?.value?.id);
    }

    public changeSelService() {
        this.servicesControl?.setValue(this.servicesControlObj?.value?.id);
    }

    public eseguiClicked() {
        this.loadData();
    }

    public resetFilters() {
        this.loadData();
    }

    private createFilterForm() {
        const now = new Date();
        const firstDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        this.consumptionFilterForm = new FormGroup({
            consumerControl: new FormControl<number | null>(null),
            consumerControlObj: new FormControl<number | null>(null),
            companyControl: new FormControl<number | null>(null),
            companyControlObj: new FormControl<number | null>(null),
            categoryControl: new FormControl<number | null>(null),
            categoryControlObj: new FormControl<number | null>(null),
            servicesControl: new FormControl<number | null>(null),
            servicesControlObj: new FormControl<number | null>(null),
            dateFrom: new FormControl<Date | null>((firstDate)),
            dateTo: new FormControl<Date | null>((lastDate)),
            onlyBillableControl: new FormControl<boolean>(true),
            isIncludeDeactivatedConsumer: new FormControl<boolean>(false),
            isIncludeDeactivatedCompany: new FormControl<boolean>(false)
        });
    }

    private loadFilters() {
        this.isLoading = true;
        this.consumptionsService.getConsumptionsFilters(this.isIncludeDeactivatedConsumer?.value ?? false, this.isIncludeDeactivatedCompany?.value ?? false).subscribe({
        next: (data: ConsumptionsFiltersResponseGetDto) => {
            this.companyList = data.companies;
            this.consumerList = data.consumers;
            this.categoryList = data.categories;
            this.servicesList = data.servicesList;

            if (this.consumerList) {
                this.consumerList.unshift({ id: null, name: this.translate.instant("Tutti") });
            } 

            if (this.companyList && this.companyList.length > 0) {
                this.companyList.unshift({ id: null, name: this.translate.instant("Tutte") });
            }

            if (this.categoryList) {
                this.categoryList.unshift({ id: null, name: this.translate.instant("Tutte") });
            }

            if (this.servicesList) {
                this.servicesList.unshift({ id: null, key: this.translate.instant("Tutti") });
            } 

            this.isLoading = false;
            this.consumptionFilterForm?.enable();
        },
        error: (err) => {
            this.isLoading = false;
            this.consumptionFilterForm?.enable();
            this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
        }
        });
    }

      private loadData() {

        this.isLoading = true;

        const request : ConsumptionsRequestGetDto = {
            consumerId: this.consumerControl?.value,
            companyId: this.companyControl?.value,
            categoryId: this.categoryControl?.value,
            serviceId: this.servicesControl?.value,
            dateFrom: this.dateFrom?.value,
            dateTo: this.dateTo?.value,
            onlyBillable: this.onlyBillableControl?.value,
            isIncludeDeactivatedConsumer: this.isIncludeDeactivatedConsumer?.value ?? false,
            isIncludeDeactivatedCompany: this.isIncludeDeactivatedCompany?.value ?? false
        };

        this.consumptionsService.getConsumptionsData(request).subscribe({
        next: (data: ConsumptionsResponseGetDto) => {
            this.consumptionData = this.consumptionsService.convertConsumptionsDataDtoFromResponse(data);

            this.isLoading = false;
            this.consumptionFilterForm?.enable();
        },
        error: (err) => {
                this.isLoading = false;
                this.consumptionFilterForm?.enable();
                this.modalMessageService.showError(this.modalMessageService.defaultErrorMessage() + err);
            }
        });
    }

    changeIncludeDeactivatedCompany() {
       this.loadFilters();
   }

    changeIncludeDeactivatedConsumer() {
       this.loadFilters();
    }

}