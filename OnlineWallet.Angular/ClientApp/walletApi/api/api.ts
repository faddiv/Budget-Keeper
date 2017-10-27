export * from './ArticleApi';
import { ArticleApi } from './ArticleApi';
export * from './ImportApi';
import { ImportApi } from './ImportApi';
export * from './TransactionApi';
import { TransactionApi } from './TransactionApi';
export * from './WalletApi';
import { WalletApi } from './WalletApi';
export const APIS = [ArticleApi, ImportApi, TransactionApi, WalletApi];
