using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.DataLayer;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.WalletModule
{
    [Route("api/v1/[controller]")]
    public class WalletController : Controller
    {
        #region  Constructors

        public WalletController(IWalletDbContext db)
        {
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
            var entity = await DbSet.FindAsync(new object[] {id}, token);
            if (entity == null)
            {
                return new NotFoundResult();
            }
            if (await Db.Transactions.AnyAsync(e => e.Wallet == entity))
            {
                ModelState.AddModelError("", "Wallet already used in transaction.");
            }
            if (!ModelState.IsValid)
            {
                return this.ValidationError();
            }
            DbSet.Remove(entity);
            await Db.SaveChangesAsync(token);
            return new JsonResult(new {success = true})
            {
                StatusCode = (int) HttpStatusCode.OK
            };
        }

        [HttpGet]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(List<Wallet>))]
        public virtual Task<List<Wallet>> GetAll(CancellationToken token)
        {
            return DbSet.ToListAsync(token);
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
            DbSet.Add(value);
            await Db.SaveChangesAsync(token);
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
            var entity = await DbSet.FindAsync(new object[] {id}, token);
            if (entity == null)
            {
                return new NotFoundResult();
            }
            Db.UpdateEntityValues(entity, value);
            await Db.SaveChangesAsync(token);
            return new JsonResult(value)
            {
                StatusCode = (int) HttpStatusCode.OK
            };
        }

        #endregion
    }
}