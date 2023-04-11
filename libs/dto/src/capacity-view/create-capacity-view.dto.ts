import { ViewMode } from "@ns/definitions";

export class CreateCapacityViewDto {
    public readonly viewId: string;
    public readonly name: string;
    public readonly resources: string[];
    public readonly bookingStages: string[];
    public readonly order: 1 | -1;
    public readonly showResourcesWithNoBookings: boolean;
    public readonly viewMode: ViewMode
}
