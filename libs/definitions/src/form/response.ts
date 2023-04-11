export class FormSuccessResponse {
    public readonly status = "ok";
    public readonly id: string;
    public readonly message?: string;
    constructor({ id, message }: { id?: string; message?: string }) {
        this.id = id ?? "";
        this.message = message;
    }
}

export class FormErrorResponse {
    public readonly status = "error";
    public readonly message?: string;
    public readonly validation: { [index: string]: string };
    constructor({
        message,
        validation,
    }: {
        message?: string;
        validation?: { [index: string]: string };
    }) {
        this.message = message;
        this.validation = validation ?? {};
    }
}
export type FormResponse = FormSuccessResponse | FormErrorResponse;
