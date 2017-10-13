using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;

namespace OnlineWallet.Web.Common
{
    public class ServeIndexHtmlMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private readonly IFileProvider _fileProvider;

        public ServeIndexHtmlMiddleware(RequestDelegate next,
            IHostingEnvironment hostingEnv, ILoggerFactory loggerFactory)
        {
            if (hostingEnv == null)
            {
                throw new ArgumentNullException(nameof(hostingEnv));
            }

            if (loggerFactory == null)
            {
                throw new ArgumentNullException(nameof(loggerFactory));
            }

            _next = next ?? throw new ArgumentNullException(nameof(next));
            _fileProvider = hostingEnv.WebRootFileProvider;
            _logger = loggerFactory.CreateLogger<ServeIndexHtmlMiddleware>();
        }
        class FileToServe
        {
            public FileToServe(IFileInfo file)
            {
                File = file;
                var last = File.LastModified;
                LastModified = new DateTimeOffset(last.Year, last.Month, last.Day, last.Hour, last.Minute, last.Second, last.Offset).ToUniversalTime();
                long etagHash = LastModified.ToFileTime() ^ Length;
                ETag = new EntityTagHeaderValue('\"' + Convert.ToString(etagHash, 16) + '\"');
            }

            public IFileInfo File { get; }
            public long Length => File.Length;
            public string PhysicalPath => File.PhysicalPath;
            public DateTimeOffset LastModified { get; }
            public EntityTagHeaderValue ETag { get; }
        }
        private FileToServe GetFileToServe()
        {
            var _fileInfo = _fileProvider.GetFileInfo("index.html");
            if (_fileInfo.Exists)
            {
                return new FileToServe(_fileInfo);
            }
            return null;
        }

        /// <summary>
        /// Processes a request to determine if it matches a known file, and if so, serves it.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public Task Invoke(HttpContext context)
        {
            // If we get here, we can try to serve the file
            var headers = context.Request.GetTypedHeaders();
            if (headers.Accept.FirstOrDefault()?.MediaType.Value == "text/html")
            {
                var fileToServe = GetFileToServe();
                if (fileToServe != null)
                {
                    if (ComputeIfModifiedSince(fileToServe, headers))
                    {
                        ApplyResponseHeaders(context.Response, 200, fileToServe);
                        var sendFile = context.Features.Get<IHttpSendFileFeature>();
                        if (sendFile != null)
                        {
                            return sendFile.SendFileAsync(fileToServe.PhysicalPath, 0, fileToServe.Length, CancellationToken.None);
                        }
                        else
                        {
                            using (var readStream = fileToServe.File.CreateReadStream())
                            {
                                readStream.Seek(0, SeekOrigin.Begin);
                                return StreamCopyOperation.CopyToAsync(readStream, context.Response.Body, fileToServe.Length, context.RequestAborted);
                            }
                        }
                    }
                    else
                    {
                        ApplyResponseHeaders(context.Response, 304, fileToServe);
                        return Task.FromResult(0);//TODO: https://github.com/aspnet/StaticFiles/blob/dev/src/Microsoft.AspNetCore.StaticFiles/Constants.cs CompletedTask 
                    }
                }
            }
            return _next(context);
        }


        private bool ComputeIfModifiedSince(FileToServe file, RequestHeaders _requestHeaders)
        {
            var now = DateTimeOffset.UtcNow;

            // 14.25 If-Modified-Since
            var ifModifiedSince = _requestHeaders.IfModifiedSince;
            if (ifModifiedSince.HasValue && ifModifiedSince <= now)
            {
                bool modified = ifModifiedSince < file.LastModified;
                return modified;
            }

            // 14.28 If-Unmodified-Since
            var ifUnmodifiedSince = _requestHeaders.IfUnmodifiedSince;
            if (ifUnmodifiedSince.HasValue && ifUnmodifiedSince <= now)
            {
                bool unmodified = ifUnmodifiedSince >= file.LastModified;
                return unmodified || true;
            }
            return true;
        }

        private void ApplyResponseHeaders(HttpResponse _response, int statusCode, FileToServe file)
        {
            _response.StatusCode = statusCode;
            if (statusCode < 400)
            {
                // these headers are returned for 200, 206, and 304
                // they are not returned for 412 and 416

                _response.ContentType = "text/html";
                var _responseHeaders = _response.GetTypedHeaders();
                _responseHeaders.LastModified = file.LastModified;
                _responseHeaders.ETag = file.ETag;
                _responseHeaders.Headers[HeaderNames.AcceptRanges] = "bytes";
            }
            if (statusCode == 200)
            {
                // this header is only returned here for 200
                // it already set to the returned range for 206
                // it is not returned for 304, 412, and 416
                _response.ContentLength = file.Length;
            }
        }

    }
}
