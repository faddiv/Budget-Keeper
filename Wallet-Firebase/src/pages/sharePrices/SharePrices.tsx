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
    const state = usePriceSharing();
    var addPersonHandler = useCallback((name: string) => {
        console.log(name);
    }, []);
    var addSharedItemHandler = useCallback((name: string) => {
        console.log(name);
    }, []);
    return (
        <Layout>
            <h1>Cost per person</h1>
            <AddPerson onAddPerson={addPersonHandler} />
            <PersonCostList model={state.costPerPersons} />
            <h1>Shared costs</h1>
            <AddSharedCost onAddSharedCost={addSharedItemHandler} />
            <SharedPriceList model={state.sharedPrices} />
        </Layout>
    );
};
