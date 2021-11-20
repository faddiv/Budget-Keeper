using Microsoft.EntityFrameworkCore;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.GeneralDataModule.Commands;
using OnlineWallet.Web.Modules.GeneralDataModule.Queries;
using OnlineWallet.Web.Modules.TransactionModule.Commands;
using OnlineWallet.Web.Modules.TransactionModule.Queries;

var builder = WebApplication.CreateBuilder(args);
/*builder.Configuration.AddJsonFile("appsettings.json");
builder.Configuration.AddJsonFile($"appsettings.{builder.Environment}.json", true);*/
var Configuration = builder.Configuration;
var services = builder.Services;
// Add services to the container.

services.AddControllersWithViews();
services.AddDbContext<IWalletDbContext, WalletDbContext>(options =>
{
    options.UseSqlServer(Configuration.GetConnectionString("Wallet"));
});
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
services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        //options.RoutePrefix = string.Empty;
    });
} else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
