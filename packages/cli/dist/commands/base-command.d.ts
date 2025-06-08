export declare abstract class BaseCommand {
    protected spinner: import("ora").Ora;
    protected log(message: string, type?: 'info' | 'success' | 'error' | 'warn'): void;
    protected startSpinner(text: string): void;
    protected stopSpinner(success?: boolean, text?: string): void;
    abstract execute(): Promise<void>;
}
//# sourceMappingURL=base-command.d.ts.map