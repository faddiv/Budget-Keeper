import * as React from 'react';

interface TabPaneProps { name, activeKey }

export const TabPane: React.SFC<TabPaneProps> = ({ name, activeKey, ...rest }) => {
    var className = ["tab-pane", "fade"];
    const isActive = name === activeKey;
    if (isActive) {
        className.push("show");
        className.push("active");
    }
    return (
        <div className={className.join(' ')} role="tabpanel" aria-labelledby="home-tab">{rest.children}</div>
    );
};