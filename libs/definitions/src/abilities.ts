import { PureAbility, RawRule } from '@casl/ability';

export enum Action {
    Write = 'write',
    Read = 'read',
    Delete = 'delete',
}

export enum Subject {
    Workpackages = 'Arbejdspakker',
    Capacity = 'Kapacitet',
    ProjectManagers = 'Projektledere',
    Resources = 'Ressourcer',
    ResourceTypes = 'Ressourcetyper',
    Contracts = 'Kontrakter',
    FinancialSources = 'Finanskilder',
    AccessGroups = 'Adgangsgrupper',
    Users = 'Brugere',
}

export type AbilityTuple = [Action, Subject];
export type RawAbility = RawRule<AbilityTuple, any>;
export type Ability = PureAbility<AbilityTuple, any>;
