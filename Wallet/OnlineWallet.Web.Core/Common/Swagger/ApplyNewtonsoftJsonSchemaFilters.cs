using System;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Common.Swagger
{
    public class ApplyNewtonsoftJsonSchemaFilters : ISchemaFilter
    {
        #region  Public Methods

        public void Apply(Schema schema, SchemaFilterContext context)
        {
            foreach (var propertyInfo in context.JsonContract.UnderlyingType.GetProperties())
            {
                if (Attribute.GetCustomAttribute(propertyInfo, typeof(JsonIgnoreAttribute)) != null)
                {
                    schema.Properties.Remove(propertyInfo.Name);
                    continue;
                }

                var jpa = (JsonPropertyAttribute) Attribute.GetCustomAttribute(propertyInfo,
                    typeof(JsonPropertyAttribute));
                if (jpa != null && jpa.PropertyName != propertyInfo.Name)
                {
                    var propertyData = schema.Properties[propertyInfo.Name];
                    schema.Properties.Remove(propertyInfo.Name);
                    schema.Properties.Add(jpa.PropertyName, propertyData);
                }
            }
        }

        #endregion
    }
}