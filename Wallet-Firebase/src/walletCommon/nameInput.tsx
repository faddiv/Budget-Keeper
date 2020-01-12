import React from "react";
import { Autocomplete } from "../react-ext";
import { articleService, ArticleModel } from "../walletServices";

interface NameInputProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    onSelect?: (selected: ArticleModel) => void;
}

export const NameInput: React.SFC<NameInputProps> = ({ value, onChange, ...rest }) => {
    function onChangeInternal(evt: React.SyntheticEvent<HTMLInputElement>) {
        onChange(evt.currentTarget.value);
    }
    return (
        <Autocomplete id="article" name="article" placeholder="Article name" onFilter={filter} onError={error} value={value} onChange={onChangeInternal} {...rest}>
            {rest.children}
        </Autocomplete>
    );
};

function filter(value: string) {
    return articleService.searchArticles(value);
}

function error(err: Error) {
    console.error(err);
}
