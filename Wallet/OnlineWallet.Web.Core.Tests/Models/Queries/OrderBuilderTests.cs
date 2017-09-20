using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Castle.Components.DictionaryAdapter;
using FluentAssertions;
using OnlineWallet.Web.QueryLanguage.Sortings;
using OnlineWallet.Web.Utils;
using Xunit;

namespace OnlineWallet.Web.Models.Queries
{
    [Trait("OrderBuilder", null)]
    public class OrderBuilderTests
    {
        private readonly OrderByBuilder<Dummy1> _builder = new OrderByBuilder<Dummy1>();

        [Fact(DisplayName = "Null ordering passes through")]
        public void Null_ordering_passes_through()
        {
            var query = new[] { new Dummy1(), new Dummy1() }.AsQueryable();
            var result = _builder.Build(query, null);
            result.Should().BeSameAs(query);
        }

        [Fact(DisplayName = "Empty ordering passes through")]
        public void Empty_ordering_passes_through()
        {
            var query = new[] { new Dummy1(), new Dummy1() }.AsQueryable();
            var result = _builder.Build(query, new List<Sorting>());
            result.Should().BeSameAs(query);
        }

        [Fact(DisplayName = "Sorts by given properties")]
        public void Sorts_by_given_properties()
        {
            var query = new[]
            {
                new Dummy1 {Property1 = 2, Property2 = 2},
                new Dummy1 {Property1 = 2, Property2 = 1},
                new Dummy1 {Property1 = 1, Property2 = 2},
                new Dummy1 {Property1 = 1, Property2 = 1}
            };
            var result = _builder.Build(query.AsQueryable(), new List<Sorting>
            {
                new Sorting("Property1", SortDirection.Ascending),
                new Sorting("Property2", SortDirection.Ascending)
            });
            result.Should().Equal(query[3], query[2], query[1], query[0]);
        }

        public class Dummy1
        {
            public int Property1 { get; set; }
            public int Property2 { get; set; }
        }
    }
}
