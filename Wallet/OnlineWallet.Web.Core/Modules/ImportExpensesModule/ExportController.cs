using System;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Services.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.ImportExpensesModule
{
    [Route("api/v1/[controller]")]
    public class ExportController : Controller
    {
        public ExportController()
        {

        }

        [HttpGet]
        [SwaggerOperationFilter(typeof(FileDownloadOperationFilter))]
        public IActionResult FromRange(DateTime from, DateTime to, string fileName)
        {
            
            return File(Encoding.UTF8.GetBytes(string.Join(";","Hello", "World", from.ToLongDateString(),to.ToLongDateString())), "text/csv", System.IO.Path.ChangeExtension(fileName, "csv"));
        }
    }
}