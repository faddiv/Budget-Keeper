using OnlineWallet.ExportImport;
using OnlineWallet.Web.Modules.GeneralDataModule.Commands;
using OnlineWallet.Web.Modules.GeneralDataModule.Queries;
using OnlineWallet.Web.Modules.TransactionModule.Commands;
using OnlineWallet.Web.Modules.TransactionModule.Queries;

namespace OnlineWallet.Web.Core;

public static class Startup
{
    public static void AddWalletServices(this IServiceCollection services)
    {
        services.AddScoped<ITransactionQueries, TransactionQueries>();
        services.AddScoped<IBatchSaveCommand, BatchSaveCommand>();
        services.AddScoped<IWalletQueries, WalletQueries>();
        services.AddScoped<IWalletCommands, WalletCommands>();
        services.AddScoped<IArticleQueries, ArticleQueries>();
        services.AddScoped<IStatisticsQueries, StatisticsQueries>();
        services.AddScoped<ICategoryQueries, CategoryQueries>();
        services.AddScoped<IImportExportQueries, ImportExportQueries>();
        services.AddScoped<IArticleCommands, ArticleCommands>();
        services.AddScoped<IBatchSaveEvent, ArticleUpdateOnBachSave>();
        services.AddSingleton<ICsvExportImport>(provider => new CsvExportImport());
    }
}
