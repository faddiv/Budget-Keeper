import * as React from "react";
import * as classNames from "classnames";

interface TabPaneProps {
    name: string;
    activeKey: string;
}

export const TabPane: React.SFC<TabPaneProps> = ({ name, activeKey, ...rest }) => {
    const active = name === activeKey;
    return (
        <div className={classNames("tab-pane", "fade", { show: active, active })} role="tabpanel" aria-labelledby="home-tab">{rest.children}</div>
    );
};
