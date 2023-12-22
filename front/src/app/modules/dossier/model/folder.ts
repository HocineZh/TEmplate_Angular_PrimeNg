export interface Folder {
    id? :number;
    designation?: string;
    parent? : number;
    icon?: string;
    children?: Folder[]
}
