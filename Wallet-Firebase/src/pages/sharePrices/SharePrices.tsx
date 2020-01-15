import React from "react";
import { Layout } from "../../layout";
import { AddPerson } from './AddPerson';
import { AddSharedCost } from './AddSharedCost';
import { PersonCostList } from './PersonCostList';
import { SharedPriceList } from './SharedPriceList';

interface SharePricesProps {

}

export const SharePrices: React.FunctionComponent<SharePricesProps> = () => {
    return (
        <Layout>
            <h1>Cost per person</h1>
            <AddPerson />
            <PersonCostList />
            <h1>Shared costs</h1>
            <AddSharedCost />
            <SharedPriceList />
        </Layout>
    );
};
