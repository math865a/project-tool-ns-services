import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainEvents } from "@ns/cqrs";
import { BookingStageUpdatedEvent } from '@ns/events';
import { Neo4jClient } from "@ns/neo4j";
import { UpdateBookingStageCommand } from './update-booking-stage.command';

@CommandHandler(UpdateBookingStageCommand)
export class UpdateBookingStageHandler implements ICommandHandler<UpdateBookingStageCommand, any>{

   constructor(private readonly client: Neo4jClient, private readonly publisher: DomainEvents){}

   async execute(command: UpdateBookingStageCommand): Promise<any>{
       const queryResult = await this.client.write(this.query, {...command.dto, uid: command.uid});
       const result: any = queryResult.records[0].get('result');
       this.publisher.publish(new BookingStageUpdatedEvent());
       return result;
   }

   query = `
        MATCH (w:Workpackage)-[rel:AT]->(b:BookingStage)
                WHERE w.id = $workpackageId
        MATCH (newStage:BookingStage)
            WHERE newStage.name = $bookingStage

        CALL {
            WITH rel, newStage
            CALL apoc.refactor.to(rel, newStage)
            YIELD output
    
            SET output += {
                updatedAt: timestamp(),
                uid: $uid
            }
            RETURN output
        }
        RETURN {} AS result
   `;
};

/*        CALL {
            WITH w, newStage
            MATCH (w)-[:HAS*4]->(a:Allocation)-[rel]-(b:BookingStage)
            CALL apoc.refactor.to(rel, newStage)
            YIELD output
            WITH collect(output) AS outputs
            RETURN outputs
        }*/