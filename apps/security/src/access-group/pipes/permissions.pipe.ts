import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { IPermissions, PipedPermission } from "@ns/definitions";
import { PipedUpsertAccessGroupDto, UpsertAccessGroupDto } from "@ns/dto";
import { map } from "lodash";
@Injectable()
export class PermissionsPipe implements PipeTransform {
    transform(
        value: {dto: UpsertAccessGroupDto, uid: string},
        metadata: ArgumentMetadata
    ): {dto: PipedUpsertAccessGroupDto, uid: string} {
        return {
            ...value,
            dto: {
                ...value.dto,
                permissions: this.formatPermissions(value.dto.permissions),
            }
        }
    }

    formatPermissions(permissions: {
        [pageName: string]: IPermissions;
    }): PipedPermission[] {
        return map(permissions, (value, key) => [key, value]);
    }
}
