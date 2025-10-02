export interface TotalValueDto<T> 
{
    value : T;
    valueOnError : T;
    valueOnSuccess : T;
}