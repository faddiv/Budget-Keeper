using System;
using System.Reflection;

namespace OnlineWallet.Web.Common.Helpers
{
    public static class TypeHelpers
    {
        #region  Public Methods

        public static Type GetGenericArgument(Type typeInfo, int index = 0)
        {
            return GetGenericArgument(typeInfo.GetTypeInfo(), index);
        }

        public static Type GetGenericArgument(TypeInfo typeInfo, int index = 0)
        {
            while (true)
            {
                if (typeInfo == null)
                    return null;
                if (typeInfo.IsGenericType)
                {
                    return typeInfo.GenericTypeArguments[index];
                }
                if (typeInfo.BaseType == null)
                    return null;
                typeInfo = typeInfo.BaseType.GetTypeInfo();
            }
        }

        #endregion
    }
}