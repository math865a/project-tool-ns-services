export class TaskProperties {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
}

export class DeliveryProperties extends TaskProperties {
    public readonly color: string;
}

export class CreateActivityDto {
    public readonly anchorId: string;
    public readonly properties: TaskProperties | DeliveryProperties;
    public readonly parent: {
        id: string;
        children: string[];
    };
    public readonly kind: "Delivery" | "Task"

}