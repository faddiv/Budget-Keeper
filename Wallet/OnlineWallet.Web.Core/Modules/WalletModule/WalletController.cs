using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.WalletModule.Services;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.WalletModule
{
    [Route("api/v1/[controller]")]
    public class WalletController : Controller
    {
        #region Fields

        private readonly IWalletCommands _walletCommands;
        private readonly IWalletQueries _walletQueries;

        #endregion

        #region  Constructors

        public WalletController(IWalletDbContext db, IWalletQueries walletQueries, IWalletCommands walletCommands)
        {
            _walletQueries = walletQueries;
            _walletCommands = walletCommands;
            Db = db;
        }

        #endregion

        #region Properties

        public IWalletDbContext Db { get; }

        protected DbSet<Wallet> DbSet => Db.Wallets;

        #endregion

        #region  Public Methods

        [HttpDelete("{id}")]
        [SwaggerResponse((int) HttpStatusCode.OK)]
        [SwaggerResponse((int) HttpStatusCode.NotFound, description: "The object defined by id doesn't exists.")]
        public async Task<ActionResult> Delete(int id, CancellationToken token)
        {
            var result = await _walletCommands.DeleteWalletById(id, token);
            switch (result)
            {
                case DeleteResult.NotFound:
                    return new NotFoundResult();
                case DeleteResult.HasDependency:
                    ModelState.AddModelError("", "Wallet already used in transaction.");
                    return this.ValidationError();
                case DeleteResult.Success:
                    return new JsonResult(new {success = true})
                    {
                        StatusCode = (int) HttpStatusCode.OK
                    };
                default:
                    return StatusCode(500, $"unknown result: {result}");
            }
        }

        [HttpGet]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(List<Wallet>))]
        public virtual Task<List<Wallet>> GetAll(CancellationToken token)
        {
            return _walletQueries.GetAll(token);
        }

        [HttpPost]
        [SwaggerResponse((int) HttpStatusCode.Created)]
        [SwaggerResponse((int) HttpStatusCode.BadRequest, description: "There is a validation error")]
        public async Task<ActionResult> Post([FromBody] Wallet value, CancellationToken token)
        {
            if (!ModelState.IsValid)
            {
                return this.ValidationError();
            }

            await _walletCommands.InsertWallet(value, token);
            return new JsonResult(value)
            {
                StatusCode = (int) HttpStatusCode.Created
            };
        }

        [HttpPut("{id}")]
        [SwaggerResponse((int) HttpStatusCode.OK)]
        [SwaggerResponse((int) HttpStatusCode.BadRequest, description: "There is a validation error")]
        [SwaggerResponse((int) HttpStatusCode.NotFound, description: "The object defined by id doesn't exists.")]
        public async Task<ActionResult> Put(int id, [FromBody] Wallet value, CancellationToken token)
        {
            if (!ModelState.IsValid)
            {
                return this.ValidationError();
            }

            value.MoneyWalletId = id;
            var result = await _walletCommands.UpdateWallet(value, token);
            switch (result)
            {
                case UpdateResult.NotFound:
                    return new NotFoundResult();
                case UpdateResult.Success:
                    return new JsonResult(value)
                    {
                        StatusCode = (int) HttpStatusCode.OK
                    };
                default:
                    return StatusCode(500, $"unknown result: {result}");
            }
        }

        #endregion
    }
}