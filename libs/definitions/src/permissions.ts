import { Action, Subject } from "./abilities";


export class PagePermissions {
    public readonly page: Subject;
    public readonly permissions: IPermissions;
}


export class IPermissions {
    public readonly [Action.Write]: boolean;
    public readonly [Action.Delete]: boolean;
    public readonly [Action.Read]: boolean; 
}