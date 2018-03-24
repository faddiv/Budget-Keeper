IF OBJECT_ID(N'__EFMigrationsHistory') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

GO

CREATE TABLE [Wallets] (
    [MoneyWalletId] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    CONSTRAINT [PK_Wallets] PRIMARY KEY ([MoneyWalletId])
);

GO

CREATE TABLE [Transactions] (
    [TransactionId] bigint NOT NULL IDENTITY,
    [Category] nvarchar(200) NULL,
    [Comment] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [Direction] smallint NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [Value] int NOT NULL,
    [WalletId] int NOT NULL,
    CONSTRAINT [PK_Transactions] PRIMARY KEY ([TransactionId]),
    CONSTRAINT [FK_Transactions_Wallets_WalletId] FOREIGN KEY ([WalletId]) REFERENCES [Wallets] ([MoneyWalletId]) ON DELETE CASCADE
);

GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'Wallets'))
    SET IDENTITY_INSERT [Wallets] ON;
INSERT INTO [Wallets] ([MoneyWalletId], [Name])
VALUES (1, N'Cash'),
       (2, N'BankAccount');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'Wallets'))
    SET IDENTITY_INSERT [Wallets] OFF;

GO

CREATE INDEX [IX_Transactions_WalletId] ON [Transactions] ([WalletId]);

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20170917115717_Initial', N'2.0.0-rtm-26452');

GO
