using System.Collections.Generic;
using FluentAssertions;
using OnlineWallet.Web.Common;
using Xunit;

namespace OnlineWallet.Web.Utils
{
    [Trait("TypeHelpers", null)]
    public class TypeHelpersTests
    {
        #region  Public Methods

        [Fact(DisplayName = "GetGenericArgument returns the first generic argument type by default")]
        public void GetGenericArgument_returns_the_first_generic_arguments_type_by_default()
        {
            var type = TypeHelpers.GetGenericArgument(typeof(List<string>));

            type.Should().Be(typeof(string));
        }

        [Fact(DisplayName = "GetGenericArgument returns the generic argument type by index")]
        public void GetGenericArgument_returns_the_generic_argument_type_by_index()
        {
            var type = TypeHelpers.GetGenericArgument(typeof(Dummy2), 1);

            type.Should().Be(typeof(string));
        }

        [Fact(DisplayName = "GetGenericArgument returns the generic argument type even if it is in base class")]
        public void GetGenericArgument_returns_the_generic_argument_type_even_if_it_is_in_base_class()
        {
            var type = TypeHelpers.GetGenericArgument(typeof(Dummy1));

            type.Should().Be(typeof(string));
        }

        #endregion

        public class Dummy1 : List<string>
        {
        }

        public class Dummy2 : Dictionary<int, string>
        {
        }
    }
}