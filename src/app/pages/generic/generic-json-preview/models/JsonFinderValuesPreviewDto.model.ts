import { DropdownValueDescDto } from "../../../../core/models/dropdown-value-desc-dto.model";

export interface JsonFinderValuesPreviewBaseDto {
  rowId: string;
  label: string;
  propName: string;
  type: string;
  required: boolean;
  readonly: boolean;
  visible: boolean;
  optionalChecked: boolean;
  prevValue: string;
  newValue: any;
  width: string;
  lentgh: number;
  style: string;
  dropdownStaticValues: DropdownValueDescDto[]|null;
}

export interface JsonFinderPagedValuesPreviewDto{
  isPagedPreview: boolean | false;
  viewerType: PdfViewerType;
  totalRecords: number;
  pageRows: number;
  pageFirst:number;
  singlePageData: JsonFinderValuesPreviewDto[];
  multiPagedDataDto: PageDefPreviewDto[];
}
export interface PageDefPreviewDto {
  pageViewerIdx: number;
  pageDataIdx: number;
  docPagesFilter: string;
  pageTitle: string;
  b64PageContent: string;
  pageData: JsonFinderValuesPreviewDto[];
}


export enum PdfViewerType {
  Default,
  SinglePage,
  Sectioned
}

export interface JsonFinderValuesPreviewDto extends JsonFinderValuesPreviewBaseDto {
  tabCollection: JsonFinderTabCollectionDto;
}
export interface JsonFinderTabCollectionDto {
  lstColHeader: string[];
  lstColValues: JsonFinderValuesPreviewBaseDto[][];
}
export interface StylePreviewDto{
  inputStylePreviewDto: InputStylePreviewDto|null;
  tableStylePreviewDto: TableStylePreviewDto|null;  
}
export interface InputStylePreviewDto{
  backgroudColor: string|null;
  textColor: string|null;
  fontSize: string|null;
  fontWeight: string|null;
  fontStyle: string|null;
  textAlign: string|null;
}
export interface TableStylePreviewDto{
  showheader: boolean|null;  
}

export enum PreviewUpdateOptions{
  wkfWithUpdate = 1,
  savePreview,
  wkfNoUpdate,
  cancelPreview
}