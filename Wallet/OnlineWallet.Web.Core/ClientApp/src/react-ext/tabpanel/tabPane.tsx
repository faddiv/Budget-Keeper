import classNames from "classnames";
import { FunctionComponent } from "react";

interface TabPaneProps {
    name: string;
    activeKey: string;
}

export const TabPane: FunctionComponent<TabPaneProps> = ({ name, activeKey, ...rest }) => {
    const active = name === activeKey;
    return (
        <div className={classNames("tab-pane", "fade", { show: active, active })} role="tabpanel" aria-labelledby="home-tab">{rest.children}</div>
    );
};
