import { ViewMode } from "@ns/definitions";

export class GetDetailDto {
    public readonly rowId: string;
    public readonly startDate: string;
    public readonly endDate: string;
    public readonly viewMode: ViewMode;
}