export interface ICommand<TState> {
    execute?(value?: TState): void;
}