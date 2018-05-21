export function unwrap<T>(component: T) {
    return (component as any).WrappedComponent as T;
}
