import { FormSuccessResponse } from '@ns/definitions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { StageUpdatedEvent } from '@ns/events';
import { UpdateStageCommand } from './update-stage.command';


@CommandHandler(UpdateStageCommand)
export class UpdateStageHandler implements ICommandHandler<UpdateStageCommand, FormSuccessResponse>{

   constructor(private readonly client: Neo4jClient, private readonly publisher: DomainEvents){}

   async execute(command: UpdateStageCommand): Promise<FormSuccessResponse>{
       const queryResult = await this.client.write(this.query, {...command.dto, uid: command.uid});
       this.publisher.publish(new StageUpdatedEvent());
       return new FormSuccessResponse({message: "Stadiet blev ændret"})
   }


   query = `
        MATCH (w:Workpackage)-[sr:AT_STAGE]-(oldStage:Stage)
            WHERE w.id = $workpackageId
        MATCH (newStage: Stage)
            WHERE newStage.name = $stage
        CALL apoc.refactor.to(sr, newStage)
        YIELD output
        SET output += {
            modifiedBy: $uid,
            modifiedAt: timestamp()
        }
        RETURN {
            workpackage: w{.*},
            fromStage: oldStage.name,
            newStage: newStage.name
        } AS result
   `;
};