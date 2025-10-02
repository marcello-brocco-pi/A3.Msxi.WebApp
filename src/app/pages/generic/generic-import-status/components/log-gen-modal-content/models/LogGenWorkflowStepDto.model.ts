import { DataTableInfo } from "../../../../shared/models/DataTableModels/data-table-info";

export interface LogGenWorkflowStepDto {
  id: number;
  key: string;
  timeStamp: string;
  severity: number;
  message: string | null;
  callType: string;
  payload: string | null;
  errors: string | null;
  numRecords: number | null;
  warnings: string | null;
}

export interface LogGenWorkflowStepsResponseGetDto {
  items: LogGenWorkflowStepDto[];
  dataTableInfo: DataTableInfo;
}

export interface LogGenWorkflowStepsRequestGetDto {
  dataTableInfo: DataTableInfo;
}
