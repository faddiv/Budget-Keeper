using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OnlineWallet.Web.Modules.GeneralDataModule.Commands;
using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    public class ArticleUpdateOnBachSave : IBatchSaveEvent
    {
        #region Fields

        private readonly IArticleCommands _articleCommands;
        private List<string> _articles;

        #endregion

        #region  Constructors

        public ArticleUpdateOnBachSave(IArticleCommands articleCommands)
        {
            _articleCommands = articleCommands;
        }

        #endregion

        #region  Public Methods

        public Task AfterSave(TransactionEventArgs operations, CancellationToken token)
        {
            return _articleCommands.UpdateArticleStatuses(_articles, token);
        }

        public Task BeforeSave(TransactionEventArgs args, CancellationToken token)
        {
            _articles = args.Operations.Where(e => e.NewTransaction != null).Select(e => e.NewTransaction.Name)
                .Union(args.Operations.Where(e => e.OldTransaction != null).Select(e => e.OldTransaction.Name))
                .Distinct().ToList();
            return Task.CompletedTask;
        }

        #endregion
    }
}