/**
 * Wallet API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { MoneyDirection } from "./MoneyDirection";

export interface Transaction {
    comment?: string;

    createdAt: string;

    direction: MoneyDirection;

    transactionId?: number;

    name: string;

    category?: string;

    value: number;

    walletId: number;

}