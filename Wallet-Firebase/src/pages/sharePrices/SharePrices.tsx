import React, { useState } from "react";
import { Layout } from "../../layout";
import { AddPerson } from './AddPerson';
import { AddSharedCost } from './AddSharedCost';
import { PersonCostList } from './PersonCostList';
import { SharedPriceList } from './SharedPriceList';
import { createInitialModel } from "../../walletServices/priceShareServices";

interface SharePricesProps {

}

export const SharePrices: React.FunctionComponent<SharePricesProps> = () => {
    const [state, ] = useState(createInitialModel);
    return (
        <Layout>
            <h1>Cost per person</h1>
            <AddPerson />
            <PersonCostList model={state.costPerPersons} />
            <h1>Shared costs</h1>
            <AddSharedCost />
            <SharedPriceList model={state.sharedPrices} />
        </Layout>
    );
};
