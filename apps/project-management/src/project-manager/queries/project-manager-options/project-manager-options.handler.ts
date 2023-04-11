import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { Neo4jClient } from "@ns/neo4j";
import { ProjectManagerOptionsQuery } from './project-manager-options.query';

@QueryHandler(ProjectManagerOptionsQuery)
export class ProjectManagerOptionsQueryHandler implements IQueryHandler<ProjectManagerOptionsQuery, any[]>{

   constructor(private readonly client: Neo4jClient){}

   async execute(): Promise<any[]>{
       const queryResult = await this.client.read(this.query);
       const response: any[] = queryResult.records.map(d => d.get("projectManager"))
       return response;
   }


   query = `
        MATCH (pm:ProjectManager)
        WITH pm ORDER BY pm.name
        RETURN {
            id: pm.id,
            name: pm.name,
            color: pm.color
        } AS projectManager
   `;
};