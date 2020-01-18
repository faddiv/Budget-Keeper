import React, { useState, useCallback } from "react";
import { Layout } from "../../layout";
import { AddPerson } from './AddPerson';
import { AddSharedCost } from './AddSharedCost';
import { PersonCostList } from './PersonCostList';
import { SharedPriceList } from './SharedPriceList';
import { usePriceSharing } from "./reducers";

interface SharePricesProps {

}

export const SharePrices: React.FunctionComponent<SharePricesProps> = () => {
    const {
        state,
        addPersonHandler,
        addSharedCostHandler
    } = usePriceSharing();

    return (
        <Layout>
            <h1>Cost per person</h1>
            <AddPerson onAddPerson={addPersonHandler} />
            <PersonCostList model={state.costPerPersons} />
            <h1>Shared costs</h1>
            <AddSharedCost onAddSharedCost={addSharedCostHandler} />
            <SharedPriceList model={state.sharedPrices} />
        </Layout>
    );
};
