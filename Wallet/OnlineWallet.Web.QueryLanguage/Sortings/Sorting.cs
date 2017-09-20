using System;

namespace OnlineWallet.Web.QueryLanguage.Sortings
{
    public class Sorting : IEquatable<Sorting>
    {
        #region  Constructors

        public Sorting(string property, SortDirection direction)
        {
            Property = property;
            Direction = direction;
        }

        #endregion

        #region Properties

        public SortDirection Direction { get; }
        public string Property { get; }

        #endregion

        #region  Public Methods

        public bool Equals(Sorting other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Direction == other.Direction && string.Equals(Property, other.Property);
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as Sorting);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return ((int) Direction * 397) ^ (Property != null ? Property.GetHashCode() : 0);
            }
        }

        #endregion
    }
}