import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteContractCommand } from "./delete-contract.command";

@CommandHandler(DeleteContractCommand)
export class DeleteContractHandler implements ICommandHandler<DeleteContractCommand> {
    async execute(command: DeleteContractCommand) {
        throw new Error("Method not implemented.")
    }
}
