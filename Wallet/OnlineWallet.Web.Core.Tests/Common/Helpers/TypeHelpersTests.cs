using System.Collections.Generic;
using FluentAssertions;
using Xunit;

namespace OnlineWallet.Web.Common.Helpers
{
    [Trait(nameof(TypeHelpers), nameof(TypeHelpers.GetGenericArgument))]
    public class TypeHelpersTests
    {
        #region  Public Methods

        [Fact(DisplayName = nameof(Returns_the_first_generic_arguments_type_by_default))]
        public void Returns_the_first_generic_arguments_type_by_default()
        {
            var type = TypeHelpers.GetGenericArgument(typeof(List<string>));

            type.Should().Be(typeof(string));
        }

        [Fact(DisplayName = nameof(Returns_the_generic_argument_type_by_index))]
        public void Returns_the_generic_argument_type_by_index()
        {
            var type = TypeHelpers.GetGenericArgument(typeof(Dummy2), 1);

            type.Should().Be(typeof(string));
        }

        [Fact(DisplayName = nameof(Returns_the_generic_argument_type_even_if_it_is_in_base_class))]
        public void Returns_the_generic_argument_type_even_if_it_is_in_base_class()
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