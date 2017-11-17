using System.Text;

namespace OnlineWallet.Web.QueryLanguage.Conditions
{
    public class FieldCondition : AtomicCondition
    {
        #region  Constructors

        public FieldCondition(string fieldName) : base(fieldName)
        {
        }

        #endregion

        #region Properties

        public string FieldName => Element;

        #endregion

    }

    public class SearchTermCondition : AtomicCondition
    {
        #region  Constructors

        public SearchTermCondition(string searchTerm) : base(searchTerm)
        {
        }

        #endregion

        #region Properties

        public string SearchTerm => Element;

        #endregion

    }
    public class AtomicCondition : CommonCondition
    {
        #region  Constructors

        public AtomicCondition(string element)
        {
            Element = element;
        }

        #endregion

        #region Properties

        protected string Element { get; }

        #endregion

        #region  Nonpublic Methods

        internal override void ToStringInternal(StringBuilder builder, bool topLevel)
        {
            builder.Append(Element);
        }

        #endregion
    }

    public class ComparisonCondition : CommonCondition
    {
        #region  Constructors

        public ComparisonCondition(AtomicCondition field, ComparisonOperator @operator, AtomicCondition literal)
        {
            Field = field;
            Operator = @operator;
            Literal = literal;
        }

        #endregion

        #region Properties

        public AtomicCondition Field { get; }
        public ComparisonOperator Operator { get; }
        public AtomicCondition Literal { get; }

        #endregion

        #region  Nonpublic Methods

        internal override void ToStringInternal(StringBuilder builder, bool topLevel)
        {
            Field.ToStringInternal(builder, false);
            builder.Append(' ');
            switch (Operator)
            {
                case ComparisonOperator.Equal:
                    builder.Append("==");
                    break;
                case ComparisonOperator.NotEqual:
                    builder.Append("!=");
                    break;
                case ComparisonOperator.GreaterThan:
                    builder.Append(">");
                    break;
                case ComparisonOperator.LessThan:
                    builder.Append("<");
                    break;
                case ComparisonOperator.GreaterOrEqual:
                    builder.Append(">=");
                    break;
                case ComparisonOperator.LessOrEqual:
                    builder.Append("<=");
                    break;
                default:
                    break;
            }
            builder.Append(' ');
            Literal.ToStringInternal(builder, false);
        }

        #endregion
    }
}