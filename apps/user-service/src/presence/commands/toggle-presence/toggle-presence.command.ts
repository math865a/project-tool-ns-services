

export class TogglePresenceCommand {
    constructor(public readonly isOnline: boolean, public readonly timestamp: number, public readonly uid: string) {}
}

