using System;
using System.Reflection;

namespace OnlineWallet.Web.Services.Swagger
{
    [AttributeUsage(AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public sealed class SwaggerGenericResponseAttribute : Attribute
    {
        public SwaggerGenericResponseAttribute(int statusCode, Type wrapper = null)
        {
            StatusCode = statusCode;
            Wrapper = wrapper?.GetTypeInfo();
        }

        public TypeInfo Wrapper { get; set; }
        
        public int StatusCode { get; set; }
    }
}