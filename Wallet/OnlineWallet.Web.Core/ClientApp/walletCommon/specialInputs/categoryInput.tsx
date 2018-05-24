import * as React from "react";
import { CategoryModel, categoryService } from "walletApi";
import { Autocomplete } from "react-ext";

interface CategoryInputProps {
    value: string;
    onError: (error: Error) => void;
    onChange?: (value: React.SyntheticEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
    onSelect?: (selected: CategoryModel) => void;
    className?: string;
}

export const CategoryInput: React.SFC<CategoryInputProps> = ({ value, onChange, autoFocus, onSelect, className, onError, ...rest }) => {
    return (
        <Autocomplete name="category" value={value} onFilter={filter} autoFocus={autoFocus} onChange={onChange} onSelect={onSelect} className={className} onError={onError}>
            {rest.children}
        </Autocomplete>
    );
};

function filter(value: string) {
    return categoryService.filterBy(value);
}
