import React from "react";
import { Layout } from "../../layout";
import { AddPerson } from './AddPerson';
import { AddSharedCost } from './AddSharedCost';
import { PersonCostList } from './PersonCostList';
import { SharedPriceList } from './SharedPriceList';
import { usePriceSharing } from "./reducers";
import { noop } from 'helpers';

interface SharePricesProps {

}

export const SharePrices: React.FunctionComponent<SharePricesProps> = () => {
    const {
        state,
        dispatch
    } = usePriceSharing();

    return (
        <Layout>
            <h1>Cost per person</h1>
            <AddPerson dispatch={dispatch} />
            <PersonCostList model={state.costPerPersons} dispatch={dispatch} />
            <h1>Shared costs</h1>
            <AddSharedCost dispatch={dispatch} />
            <SharedPriceList model={state.sharedPrices} />
        </Layout>
    );
};
