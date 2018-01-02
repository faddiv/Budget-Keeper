import * as React from "react";
import { className as cssName } from "./cssHelpers";
import { bind } from "helpers";

export interface AutocompleteModel {
    name?: string;

    nameHighlighted?: string;

}

export namespace Autocomplete {
    export interface Props {
        name: string;
        id?: string;
        value: string;
        onFilter: (searchTerm: string) => Promise<AutocompleteModel[]>;
        onChange?: (value: React.SyntheticEvent<HTMLInputElement>) => void;
        autoFocus?: boolean;
        onSelect?: (selected: AutocompleteModel) => void;
        className?: string;
        focusAction?: (focus: () => void) => void;
    }
    export interface State {
        items: AutocompleteModel[];
        open: boolean;
        focused: boolean;
        active?: AutocompleteModel;
        value: string;
    }
}

export class Autocomplete extends React.Component<Autocomplete.Props, Autocomplete.State> {
    nameInput: HTMLInputElement;

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            open: false,
            focused: false,
            value: props.value
        };
    }

    componentDidMount() {
        window.addEventListener("click", this.globalClick, false);
        window.addEventListener("focus", this.globalFocus, true);
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.globalClick, false);
        window.removeEventListener("focus", this.globalFocus, true);
    }

    componentWillReceiveProps(nextProps: Readonly<Autocomplete.Props>, nextContext: any) {
        this.setState({
            value: nextProps.value
        });
    }

    @bind
    globalClick(event: MouseEvent) {
        if (!this.state.focused) {
            this.close();
        }
    }

    @bind
    globalFocus(event: FocusEvent) {
        if (!this.state.focused && this.state.open) {
            this.close();
        }
    }

    close(state?: Partial<Autocomplete.State>) {
        this.setState({
            open: false,
            active: null,
            ...state as any
        });
    }

    open(state?: Partial<Autocomplete.State>) {
        let active = this.state.active || this.state.items[0];
        if (state && state.items) {
            active = state.items[0];
        }
        this.setState({
            open: true,
            active,
            focused: true,
            ...state as any
        });
    }

    focus() {
        this.nameInput && this.nameInput.focus();
    }

    @bind
    getInput(input: HTMLInputElement) {
        const focusAction = this.props.focusAction;
        if (focusAction && input) {
            focusAction(() => {
                input.focus();
            });
        }
    }

    @bind
    async onChange(event: React.SyntheticEvent<HTMLInputElement>) {
        const value = getInputValue(event);
        this.setValue(value);
        if (canOpen(value)) {
            const items = await this.props.onFilter(value);
            if (items.length > 0) {
                this.open({
                    items
                });
            } else {
                this.close({
                    items: []
                });
            }
        } else {
            this.close({
                items: []
            });
        }
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    }

    select(item: AutocompleteModel) {
        this.setValue(this.getItemValue(item), {
            items: [item]
        }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(item);
            }
        });
    }

    setValue(value: string, state?: Partial<Autocomplete.State>, callback?: () => void) {
        this.setState({
            value,
            ...state as any
        }, callback);
    }

    @bind
    onBlur(event: React.SyntheticEvent<HTMLInputElement>) {
        const value = getInputValue(event);
        this.setState({
            focused: false
        });
    }

    onlyItemActive() {
        return this.state.items.length === 1
            && this.state.items[0] === this.state.active;
    }

    navigate(direction: number) {
        let ok = false;
        if (this.state.open) {
            const index = this.state.items.indexOf(this.state.active) + direction;
            if (0 <= index && index < this.state.items.length) {
                this.setState({
                    active: this.state.items[index]
                });
            }
            ok = true;
        } else {
            if (canOpen(this.state.value) && this.hasSelectable()) {
                this.open();
                ok = true;
            }
        }
        return ok;
    }
    @bind
    onKeyEvent(event: React.KeyboardEvent<HTMLInputElement>) {
        switch (event.key) {
            case "ArrowUp":
                if (this.navigate(-1)) {
                    event.preventDefault();
                }
                break;
            case "ArrowDown":
                if (this.navigate(1)) {
                    event.preventDefault();
                }
                break;
            case "Enter":
                if (this.state.open && this.state.active) {
                    event.preventDefault();
                    this.select(this.state.active);
                    this.close();
                }
                break;
            case "Escape":
                event.preventDefault();
                this.close();
                break;
            default:
                break;
        }
    }

    hasSelectable() {
        return this.state.items.length > 0
            && (this.state.items.length > 1 || this.getItemValue(this.state.items[0]) !== this.state.value);
    }

    onClick(event: React.MouseEvent<HTMLLIElement>, item: AutocompleteModel) {
        this.select(item);
        this.focus();
        this.close({
            focused: false
        });
    }

    @bind
    dropdownClass(): string {
        return cssName("dropdown-menu", this.state.open, "show");
    }

    getItemValue(item: AutocompleteModel) {
        return item.name;
    }

    renderItem(item: AutocompleteModel, active: boolean) {
        return <li key={this.getItemValue(item)}
            className={cssName("dropdown-item", active, "active")}
            onClick={event => this.onClick(event, item)}
            dangerouslySetInnerHTML={{ __html: item.nameHighlighted }}></li>;
    }

    render() {
        const { autoFocus, className, name, id } = this.props;
        const { value, active, items } = this.state;
        return (
            <div style={{ position: "relative" }}>
                <input ref={this.getInput} type="text" className={className}
                    id={id || name} name={name} value={value} autoFocus={autoFocus} autoComplete="off"
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyEvent} />
                <ul className={this.dropdownClass()} style={{ right: 0 }}>
                    {items.map(item => this.renderItem(item, active === item))}
                </ul>
                {this.props.children}
            </div>
        );
    }
}

function getInputValue(event: React.SyntheticEvent<Element>): string {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    return value;
}

function canOpen(value: string) {
    return value && value.length >= 2;
}
