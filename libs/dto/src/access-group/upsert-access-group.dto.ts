import { OmitType } from "@nestjs/mapped-types";
import { IPermissions, PipedPermission } from "@ns/definitions";

export class UpsertAccessGroupDto {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly color: string;
    public readonly isAdmin: boolean;
    public readonly users: string[];
    public readonly permissions: {
        [pageName: string]: IPermissions;
    };
}

export class PipedUpsertAccessGroupDto extends OmitType(UpsertAccessGroupDto, [
    "permissions",
]) {
    public readonly permissions: PipedPermission[];
}
