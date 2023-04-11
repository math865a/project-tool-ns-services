import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteResourceTypeCommand } from "./delete-resourcetype.command";

@CommandHandler(DeleteResourceTypeCommand)
export class DeleteResourceTypeHandler
    implements ICommandHandler<DeleteResourceTypeCommand>
{
    async execute(command: DeleteResourceTypeCommand) {
        throw new Error("Method not implemented.");
    }
}
