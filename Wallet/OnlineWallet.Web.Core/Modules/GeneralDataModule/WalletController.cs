using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.GeneralDataModule.Commands;
using OnlineWallet.Web.Modules.GeneralDataModule.Queries;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    [Route("api/v1/[controller]")]
    public class WalletController : Controller
    {
        #region Fields

        private readonly IWalletCommands _walletCommands;
        private readonly IWalletQueries _walletQueries;

        #endregion

        #region  Constructors

        public WalletController(IWalletQueries walletQueries, IWalletCommands walletCommands)
        {
            _walletQueries = walletQueries;
            _walletCommands = walletCommands;
        }

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
                case DeleteResult.HasDependency:
                    ModelState.AddModelError("", "Wallet already used in transaction.");
                    return this.ValidationError();
                case DeleteResult.Success:
                    return new JsonResult(new {success = true})
                    {
                        StatusCode = (int) HttpStatusCode.OK
                    };
                default:
                    return new NotFoundResult();
            }
        }

        [HttpGet]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(List<Wallet>))]
        public virtual Task<List<Wallet>> GetAll(CancellationToken token = default(CancellationToken))
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
                case UpdateResult.Success:
                    return new JsonResult(value)
                    {
                        StatusCode = (int) HttpStatusCode.OK
                    };
                default:
                    return new NotFoundResult();
            }
        }

        #endregion
    }
}