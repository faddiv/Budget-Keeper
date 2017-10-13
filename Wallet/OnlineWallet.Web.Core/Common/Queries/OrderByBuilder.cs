using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using OnlineWallet.Web.QueryLanguage.Sortings;

namespace OnlineWallet.Web.Common.Queries
{
    public class OrderByBuilder<TModel>
    {
        #region  Constructors

        public OrderByBuilder()
        {
            OrderType = typeof(TModel);
        }

        #endregion

        #region Properties

        public Type OrderType { get; }

        #endregion

        #region  Public Methods

        public IQueryable<TModel> Build(IQueryable<TModel> query, List<Sorting> sortings)
        {
            if (sortings == null || sortings.Count == 0)
                return query;
            var properties = OrderType.GetProperties();
            string methodAsc = "OrderBy";
            string methodDesc = "OrderByDescending";
            var param = Expression.Parameter(query.ElementType);
            Expression queryExpr = query.Expression;
            foreach (var s in sortings)
            {
                var info = properties.FirstOrDefault(e =>
                    string.Equals(e.Name, s.Property, StringComparison.InvariantCultureIgnoreCase));

                var propertyGetter = Expression.MakeMemberAccess(param, info);
                queryExpr = Expression.Call(
                    typeof(Queryable), s.Direction == SortDirection.Ascending ? methodAsc : methodDesc,
                    new[] {query.ElementType, propertyGetter.Type},
                    queryExpr, Expression.Quote(Expression.Lambda(propertyGetter, param)));
                methodAsc = "ThenBy";
                methodDesc = "ThenByDescending";
            }
            return query.Provider.CreateQuery<TModel>(queryExpr);
        }

        #endregion
    }
}