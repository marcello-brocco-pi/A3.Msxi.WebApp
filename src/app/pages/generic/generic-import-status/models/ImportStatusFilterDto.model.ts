
export interface ImportStatusFilterDto {
    operatore : number | null;
    dataInsDa : Date | string | null;
    dataInsA : Date | string | null;
    dataInsDaNgb : Date | null;
    dataInsANgb : Date | null;
    esito : number | null;
    categoria : number | null;
    nomeAllegato : string | null;
}