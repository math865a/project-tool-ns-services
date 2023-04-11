import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import {
    ScheduleInstruction,
    SummaryView
} from "@ns/definitions";
import { DateTime as dt } from "luxon";

@Injectable()
export class SummaryViewPipe implements PipeTransform {
    transform(
        value: {
            view: SummaryView;
            uid: string;
        },
        metadata: ArgumentMetadata
    ): ScheduleInstruction {
        const period =
            value.view === SummaryView.Short ? this.getShort() : this.getLong();
        return {
            id: value.uid,
            ...period,
        };
    }

    getMonday() {
        const today = dt.now();
        return today.minus({ days: today.weekday - 1 });
    }

    getShort() {
        const start = this.getMonday();
        return {
            start: start.toISODate(),
            end: start.plus({ weeks: 2 }).toISODate(),
        };
    }

    getLong() {
        const start = this.getMonday();
        return {
            start: start.toISODate(),
            end: start.plus({ weeks: 6 }).toISODate(),
        };
    }
}
