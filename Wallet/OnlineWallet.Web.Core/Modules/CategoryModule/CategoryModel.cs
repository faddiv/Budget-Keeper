using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.CategoryModule
{
    public class CategoryModel
    {
        public string Name { get; set; }
        public string NameHighlighted { get; set; }
        public int Occurence { get; set; }
    }
}
