using Autofac;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.Common.Swagger;
using OnlineWallet.Web.DataLayer;
using Swashbuckle.AspNetCore.Swagger;

namespace OnlineWallet.Web
{
    public class Startup
    {
        #region  Constructors

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        #endregion

        #region Properties

        public IConfigurationRoot Configuration { get; }

        #endregion

        #region  Public Methods

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseCors("ApiCors");
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseSwagger(options => { });
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "V1 Docs");
                c.ShowJsonEditor();
            });
            app.UseMvc(route =>
            {
                route.MapRoute("Default", "{controller}/{action}/{id?}");
            });
            app.UseMiddleware<ServeIndexHtmlMiddleware>();
        }


        public void ConfigureContainer(ContainerBuilder builder)
        {
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<WalletDbContext>(options =>
            {
                //options.UseSqlServer(Configuration.GetConnectionString("Wallet"));
                options.UseSqlite(Configuration.GetConnectionString("WalletSQLite"));
            });
            services.AddScoped<IWalletDbContext>(provider => provider.GetRequiredService<WalletDbContext>());
            // Add framework services.
            services.AddMvc();
            services.AddCors(options =>
            {
                options.AddPolicy("ApiCors", builder =>
                {
                    builder.WithOrigins("http://localhost:4200");
					builder.WithOrigins("http://localhost:4201");
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                });
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1",
                    new Info
                    {
                        Version = "v1",
                        Title = "Wallet API"
                    }
                );

                c.OperationFilter<ApplySummariesOperationFilter>();
                c.OperationFilter<ApplyGenericResponseType>();
                c.OperationFilter<ApplyArrayOnGetAllOperationFilter>();
                c.OperationFilter<ApplyFileUploadOperationFilter>();
                c.OperationFilter<ApplyCompositeInputModelOperationFilter>();
                c.SchemaFilter<ApplyNewtonsoftJsonSchemaFilters>();

            });

            services.AddSingleton<ICsvExportImport>(provider => new CsvExportImport());
        }

        #endregion
    }
}
