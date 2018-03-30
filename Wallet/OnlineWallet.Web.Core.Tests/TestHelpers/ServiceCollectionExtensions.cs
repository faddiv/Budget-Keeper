using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;

namespace OnlineWallet.Web.TestHelpers
{
    public static class ServiceCollectionExtensions
    {
        #region  Public Methods

        public static void RemoveAll(this ServiceCollection collection, Predicate<ServiceDescriptor> match)
        {
            var removable = collection.Where(e => match(e)).ToList();
            foreach (var serviceDescriptor in removable)
            {
                collection.Remove(serviceDescriptor);
            }
        }

        #endregion
    }
}