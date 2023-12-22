export interface DocumentVersion {
    id: number,
    isnotable: boolean,
    ispublier: boolean,
    datePublication: Date | null,
    dateValidation: Date | null,
    version: number,
    dateChargement: Date,
    isecraser: boolean
}
