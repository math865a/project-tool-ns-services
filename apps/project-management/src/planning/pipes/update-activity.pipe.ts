import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import {
    PipedUpdateActivityDto,
    UpdateActivityDto
} from "@ns/dto";

@Injectable()
export class UpdateActivityPipe implements PipeTransform {
    transform(
        value: { dto: UpdateActivityDto; uid: string },
        metadata: ArgumentMetadata
    ): { dto: PipedUpdateActivityDto; uid: string } {
        return {
            dto: {
                ...value.dto,
                color: value.dto.color || null,
                description: value.dto.description || null,
            },
            uid: value.uid,
        };
    }
}
