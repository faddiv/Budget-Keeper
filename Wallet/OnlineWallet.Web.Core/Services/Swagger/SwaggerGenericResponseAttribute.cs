using System;
using System.Reflection;

namespace OnlineWallet.Web.Services.Swagger
{
    [AttributeUsage(AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public sealed class SwaggerGenericResponseAttribute : Attribute
    {
        #region  Constructors

        public SwaggerGenericResponseAttribute(int statusCode, Type wrapper = null)
        {
            StatusCode = statusCode;
            Wrapper = wrapper?.GetTypeInfo();
        }

        #endregion

        #region Properties

        public int StatusCode { get; set; }

        public TypeInfo Wrapper { get; set; }

        #endregion
    }
}