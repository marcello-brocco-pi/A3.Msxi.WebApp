import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";

import { ChartType } from "chart.js";

import { TranslateService } from "@ngx-translate/core";
import { ServiceBaseService } from "../../../../shared/services/service-base.service";
import { DateUtilsService } from "../../../generic/shared/services/date-utils.service";
import { ChartDataSetItemDto } from "../models/chart-dataset-item-dto";
import { ChartItemDto } from "../models/chart-item-dto";
import { ChartJSItemDto } from "../models/chartjs-item-dto";
import { ConsumptionsDataDto } from "../models/consumptions-data-dto";
import { ConsumptionsFiltersResponseGetDto } from "../models/consumptions-filters-response-get-dto";
import { ConsumptionsRequestGetDto } from "../models/consumptions-request-get-dto";
import { ConsumptionsResponseGetDto } from "../models/consumptions-response-get-dto";
import ChartDataLabels from 'chartjs-plugin-datalabels'
@Injectable({
  providedIn: 'root'
})
export class ConsumptionsService extends ServiceBaseService {


  constructor(private readonly http: HttpClient, private readonly dateUtilsService: DateUtilsService, translate : TranslateService) {
    super(translate);
  }

  protected override applyTranslation(): void {
      // Implement any translation logic here if needed
  }
  
  public pieChartPlugins = [ ChartDataLabels ];
  public getConsumptionsFilters(isIncludeDeactivatedConsumer: boolean, isIncludeDeactivatedCompany: boolean): Observable<ConsumptionsFiltersResponseGetDto> {
    const params = new HttpParams()
      .set('isIncludeDeactivatedConsumer', isIncludeDeactivatedConsumer.toString())
      .set('isIncludeDeactivatedCompany', isIncludeDeactivatedCompany.toString());

    return this.http.get<ConsumptionsFiltersResponseGetDto>(this.BASE_URL + '/ReportsConsumptions/Filters/Default', { params })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public getConsumptionsData(request: ConsumptionsRequestGetDto): Observable<ConsumptionsResponseGetDto> {
    request.dateTo.setHours(23, 59, 59, 999);
    let params = new HttpParams()
      .append("companyId", request.companyId ?? '')
      .append("categoryId", request.categoryId ?? '')
      .append("serviceId", request.serviceId ?? '')
      .append("consumerId", request.consumerId ?? '')
      .append("dateFrom", this.dateUtilsService.getISODateWithTZFromDateObject(request.dateFrom))
      .append("dateTo", this.dateUtilsService.getISODateWithTZFromDateObject(request.dateTo))
      .append("onlyBillable", request.onlyBillable.toString())
      .append("isIncludeDeactivatedConsumer", request.isIncludeDeactivatedConsumer.toString())
      .append("isIncludeDeactivatedCompany", request.isIncludeDeactivatedCompany.toString());


    return this.http.get<ConsumptionsResponseGetDto>(this.BASE_URL + '/ReportsConsumptions', { params: params })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public convertConsumptionsDataDtoFromResponse(response: ConsumptionsResponseGetDto): ConsumptionsDataDto {
    let result: ConsumptionsDataDto = {

      metricsDetails: {
        totalIndicatorItems: response.metricsDetails.totalIndicatorItems,
        consumersDetails: response.metricsDetails.consumersDetails,
        companiesDetails: response.metricsDetails.companiesDetails,
        chartsItems: this.convertChartItemsFromResponse(response.metricsDetails.chartsItems)
      }
    };

    return result;
  }

  private convertChartItemsFromResponse(responseChartItems: ChartItemDto[]): ChartJSItemDto[] {
    const res: ChartJSItemDto[] = [];
    if (responseChartItems && responseChartItems.length > 0) {

      for (const item of responseChartItems) {
        const convertedChartJsItem: ChartJSItemDto = {
          title: item.title,
          lineChartType: item.lineChartType,
          chartData: {
            datasets: item.chartData.chartDataSetItems.map(e => this.convertChartItemFromResponse(e, item.lineChartType)),
            labels: item.chartData.labels
          },
          chartOptions: this.convertChartOptionsFromResponse(item.lineChartType),
          chartPlugins: this.pieChartPlugins
        };
        res.push(convertedChartJsItem);
      }
    }
    return res;
  }

  private convertChartItemFromResponse(item: ChartDataSetItemDto, chartType: ChartType): any {
    const documentStyle = getComputedStyle(document.documentElement);
    if (chartType == 'line') {
      return {
        data: item.data,
        label: item.label,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    }else if (chartType == 'pie') {
      return {
        data: item.data,
        hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')] // getRandomColor(item.data.length) 
      }
    }

  }

  

  private convertChartOptionsFromResponse(chartType: ChartType): any {
    if (chartType == 'line') {
      return {
        elements: {
          line: {
            tension: 0.5,
          },
        },
        scales: {
          // We use this empty structure as a placeholder for dynamic theming.
          y: {
            position: 'left',
          },
          y1: {
            position: 'right',
            grid: {
              color: 'rgba(115,163,217,1)',
            },
            ticks: {
              color: 'rgba(115,163,217,1)',
            },
          },
        },
        plugins: {
          legend: { display: true },
          datalabels: {
            display: 'auto',
            color: '#fff'
          }
        },
      }
    } else if (chartType == 'pie') {
      
      return {
        plugins: {
          
          legend: {
            display: true,
            position: 'right',
          },
          datalabels: {
            display: 'auto',

            formatter: (value : any, context : any) => {
              let percentage = (value / context.chart._metasets
              [context.datasetIndex].total * 100)
                  .toFixed(2) + '%';
              return percentage + '\n' + '( ' + value + ' )';
          }
          },
        },
      }
    }
  }

}
function getRandomColor(count: number) {
var colors = [];
for (var i = 0; i < count; i++) {
   var letters = '0123456789ABCDEF'.split('');
   var color = '#';
      for (var x = 0; x < 6; x++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
      }
   return colors;
}

