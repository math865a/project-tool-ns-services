import { CreateCalendarHandler } from "./create-calendar.command";
import { GenerateWorkDaysHandler } from "./generate-workdays.command";

export const commandHandlers = [CreateCalendarHandler, GenerateWorkDaysHandler]