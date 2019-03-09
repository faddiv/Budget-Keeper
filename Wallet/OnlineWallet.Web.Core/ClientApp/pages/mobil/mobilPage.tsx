import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { RootState } from "reducers";
import { MobileSyncActions } from "reducers/mobileSync";
import { Layout } from "layout";

interface MobilPageProps extends ReturnType<typeof mapDispatchToProps>, ReturnType<typeof mapStateToProps> {

}

const MobilPageInternal: React.SFC<MobilPageProps> = ({ state, mobileSyncActions }) => {
    let btnText = "Sync from Local to Mobile";
    let disabled = false;
    switch (state.state) {
        case "downloading":
            btnText = "Downloading...";
            disabled = true;
            break;
        case "uploading":
            btnText = "Uploading...";
            disabled = true;
            break;
    }
    function clickHandler() {
        mobileSyncActions.syncToMobile();
    }
    return (
        <Layout>
            <button type="button" className="btn btn-primary" disabled={disabled} onClick={clickHandler}>{btnText}</button>
        </Layout>
    );
};

function mapStateToProps(state: RootState) {
    return {
        state: state.mobileSync
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        mobileSyncActions: bindActionCreators(MobileSyncActions, dispatch)
    };
}

export const MobilPage = connect(mapStateToProps, mapDispatchToProps)(MobilPageInternal);
