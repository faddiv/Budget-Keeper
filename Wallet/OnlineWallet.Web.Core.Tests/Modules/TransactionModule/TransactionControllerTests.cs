﻿using System;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    public class TransactionControllerTests : CrudControllerTests<Transaction>
    {
        protected TransactionController Controller { get; }
        protected Transaction TestTransaction { get; }

        public TransactionControllerTests(DatabaseFixture fixture) : base(fixture)
        {
            Controller = new TransactionController(Fixture.DbContext);
        }
    }
}