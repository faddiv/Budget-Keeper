using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

namespace OnlineWallet.Web.Modules.HomeModule
{
    public class HomeController : Controller
    {
        public HomeController(IHostingEnvironment hostingEnv)
        {
            WebRootFileProvider = hostingEnv.WebRootFileProvider;
        }

        public IFileProvider WebRootFileProvider { get; }

        public IActionResult Index()
        {
            var fileInfo = WebRootFileProvider.GetFileInfo("index.html");
            if(fileInfo.Exists)
            {
                string content;
                content = ReadFileContent(fileInfo);
                return new ContentResult()
                {
                    Content = content,
                    ContentType = "text/html",
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            else
            {
                return NotFound();
            }
            
        }

        private static string ReadFileContent(IFileInfo fileInfo)
        {
            string content;
            using (var stream = fileInfo.CreateReadStream())
            using (var reader = new StreamReader(stream, Encoding.UTF8))
            {
                content = reader.ReadToEnd();
            }

            return content;
        }
    }
}
