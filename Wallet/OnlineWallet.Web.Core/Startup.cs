using Autofac;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Services.Swagger;
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
            app.UseStaticFiles();
            app.UseMvc();
            app.UseSwagger(options => { });
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "V1 Docs");
                c.ShowJsonEditor();
            });
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<WalletDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("Wallet"));
            });
            services.AddScoped<IWalletDbContext>(provider => provider.GetRequiredService<WalletDbContext>());
            // Add framework services.
            services.AddMvc();
            services.AddCors(options =>
            {
                options.AddPolicy("ApiCors", builder =>
                {
                    builder.WithOrigins("http://localhost:4200");
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
            });

            services.AddSingleton<ICsvExportImport>(provider => new CsvExportImport());
        }

        #endregion
    }
}