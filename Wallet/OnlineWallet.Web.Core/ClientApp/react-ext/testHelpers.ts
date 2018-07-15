import { ReactWrapper, HTMLAttributes } from "enzyme";
import { TransactionViewModel } from "walletCommon";
import { Component } from "react";

export function unwrap<P, S, C extends Component<P, S>>(component: C): C {
    return (component as any).WrappedComponent as C;
}

export function createTransactions(size: number = 4): TransactionViewModel[] {
    return [
        { key: 1, transactionId: 1, name: "apple", category: "grocery", comment: "Hy", createdAt: "2018-05-26", price: "123", direction: -1, walletId: 1 },
        { key: 2, transactionId: 2, name: "payment", category: "incomes", comment: "Got it", createdAt: "2018-05-27", price: "30000", direction: 1, walletId: 2 },
        { key: 3, transactionId: 3, name: "detergent", category: "cleaning", comment: "for cleaning", createdAt: "2018-05-27", price: "100", direction: -1, walletId: 1 },
        { key: 4, transactionId: 4, name: "movie ticket", category: "fun", comment: "good movie", createdAt: "2018-05-28", price: "1000", direction: 0, walletId: 2 }
    ].slice(0, size);
}

function createDefaultEvent(target: any, eventAttrs?: any) {
    let isDefaultPrevented = false;
    return {
        isDefaultPrevented() { return isDefaultPrevented; },
        preventDefault() { isDefaultPrevented = true; },
        target,
        currentTarget: target,
        ...eventAttrs
    };
}

export function simulateEvent(target: ReactWrapper<HTMLAttributes, any>, event: string);
export function simulateEvent(args: SimulateEventArgs);
export function simulateEvent(args: ReactWrapper<HTMLAttributes, any> | SimulateEventArgs, event?: string) {
    let target: ReactWrapper<HTMLAttributes, any>;
    let eventAttrs;
    let targetAttrs;
    if (isReactWrapper(args)) {
        target = args;
    } else {
        target = args.target;
        event = args.event;
        eventAttrs = args.eventAttrs;
        targetAttrs = args.targetAttrs;
    }
    const domNode = target.getDOMNode() as HTMLInputElement;
    if (targetAttrs) {
        for (const key in targetAttrs) {
            if (targetAttrs.hasOwnProperty(key)) {
                domNode[key] = targetAttrs[key];
            }
        }
    }
    target.simulate(event, createDefaultEvent(domNode, eventAttrs));
}

function isReactWrapper(input: any): input is ReactWrapper<any, any> {
    return !!input.simulate;
}

export function simulateInputChange(input: ReactWrapper<any, any>, text: string) {
    simulateEvent({
        target: input,
        event: "change",
        targetAttrs: {
            value: text
        }
    });
}

export interface SimulateEventArgs {
    target: ReactWrapper<HTMLAttributes, any>;
    event: string;
    eventAttrs?: any;
    targetAttrs?: any;
}
