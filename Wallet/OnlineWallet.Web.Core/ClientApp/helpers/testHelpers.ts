export function unwrap<T>(component:T) {
    return <T>(<any>component).WrappedComponent;
}