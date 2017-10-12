using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Models.Queries;
using OnlineWallet.Web.QueryLanguage;
using OnlineWallet.Web.Services.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Controllers.Abstractions
{
    [Route("api/v1/[controller]")]
    public abstract class CrudController<TEntity, TKey> : Controller where TEntity : class
    {
        #region  Constructors

        protected CrudController(IWalletDbContext db)
        {
            Db = db;
        }

        #endregion

        #region Properties

        public IWalletDbContext Db { get; }

        protected abstract ConditionVisitorBase<TEntity> ConditionBuilder { get; }

        protected abstract DbSet<TEntity> DbSet { get; }

        #endregion

        #region  Public Methods

        [HttpDelete("{id}")]
        [SwaggerResponse((int) HttpStatusCode.OK)]
        [SwaggerResponse((int) HttpStatusCode.NotFound, description: "The object defined by id doesn't exists.")]
        public async Task<ActionResult> Delete(TKey id, CancellationToken token)
        {
            var entity = await DbSet.FindAsync(new object[] {id}, token);
            if (entity == null)
            {
                return new NotFoundResult();
            }
            DbSet.Remove(entity);
            await Db.SaveChangesAsync(token);
            return Ok(new {success = true});
        }

        [HttpGet]
        [SwaggerGenericResponse((int)HttpStatusCode.OK, typeof(List<>))]
        public virtual Task<List<TEntity>> GetAll(QueryRequest request, CancellationToken token)
        {
            var query = DbSet.AsQueryable();
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = GenericSearch(query, request.Search);
            }
            if (!string.IsNullOrEmpty(request.Sorting))
            {
                var sortings = QueryLanguageParser.ParseSortings(request.Sorting);
                OrderByBuilder<TEntity> builder = new OrderByBuilder<TEntity>();
                query = builder.Build(query, sortings);
            }
            if (request.Take.HasValue)
            {
                query = query.Take(request.Take.Value);
            }
            if (request.Skip.HasValue)
            {
                query = query.Skip(request.Skip.Value);
            }
            return query.ToAsyncEnumerable().ToList(token);
        }

        [HttpGet("{id}")]
        [SwaggerGenericResponse((int)HttpStatusCode.OK)]
        public virtual async Task<TEntity> GetById(TKey id, CancellationToken token)
        {
            var value = await DbSet.FindAsync(new object[] {id}, token);
            return value;
        }

        [HttpPost]
        [SwaggerGenericResponse((int) HttpStatusCode.Created)]
        [SwaggerResponse((int) HttpStatusCode.BadRequest, description: "There is a validation error")]
        public async Task<ActionResult> Post([FromBody] TEntity value, CancellationToken token)
        {
            if (!ModelState.IsValid)
            {
                return ValidationError();
            }
            DbSet.Add(value);
            await Db.SaveChangesAsync(token);
            return new JsonResult(value)
            {
                StatusCode = (int) HttpStatusCode.Created
            };
        }

        [HttpPut("{id}")]
        [SwaggerGenericResponse((int) HttpStatusCode.OK)]
        [SwaggerResponse((int) HttpStatusCode.BadRequest, description: "There is a validation error")]
        [SwaggerResponse((int) HttpStatusCode.NotFound, description: "The object defined by id doesn't exists.")]
        public async Task<ActionResult> Put(TKey id, [FromBody] TEntity value, CancellationToken token)
        {
            if (!ModelState.IsValid)
            {
                return ValidationError();
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

        #region  Nonpublic Methods

        protected virtual IQueryable<TEntity> GenericSearch(IQueryable<TEntity> query, string searchText)
        {
            var condition = QueryLanguageParser.ParseFilter(searchText);
            if (condition == null)
                return query;
            query = query.Where(ConditionBuilder.Visit(condition));
            return query;
        }

        private string GetFirstError()
        {
            return ModelState.Values.SelectMany(e => e.Errors).FirstOrDefault()?.ErrorMessage;
        }

        private ContentResult ValidationError()
        {
            return new ContentResult
            {
                Content = GetFirstError(),
                StatusCode = (int) HttpStatusCode.BadRequest
            };
        }

        #endregion
    }
}