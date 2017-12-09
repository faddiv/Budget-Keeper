import * as React from 'react';
import { className } from 'react-ext';

interface TabPaneProps { name, activeKey }

export const TabPane: React.SFC<TabPaneProps> = ({ name, activeKey, ...rest }) => {
    const isActive = name === activeKey;
    return (
        <div className={className("tab-pane", "fade", isActive, "show", "active")} role="tabpanel" aria-labelledby="home-tab">{rest.children}</div>
    );
};