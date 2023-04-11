import {DateTime as dt} from "luxon"

export class EventBase {
    public readonly timestamp: number = dt.now().setZone("UTC").toMillis();
}
