import {DateTime as dt} from "luxon"

export class EventBase {
    public readonly timestamp: Date = dt.now().setZone("UTC").toJSDate()
}
