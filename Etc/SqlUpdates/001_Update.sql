DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'Wallets') AND [c].[name] = N'Name');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Wallets] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Wallets] ALTER COLUMN [Name] nvarchar(200) NOT NULL;

GO

CREATE TABLE [Article] (
    [Name] nvarchar(200) NOT NULL,
    [Category] nvarchar(200) NULL,
    [LastPrice] int NOT NULL,
    [LastUpdate] datetime2 NOT NULL,
    [LastWalletId] int NOT NULL,
    [Occurence] int NOT NULL,
    CONSTRAINT [PK_Article] PRIMARY KEY ([Name]),
    CONSTRAINT [FK_Article_Wallets_LastWalletId] FOREIGN KEY ([LastWalletId]) REFERENCES [Wallets] ([MoneyWalletId]) ON DELETE CASCADE
);

GO

CREATE INDEX [IX_Article_LastWalletId] ON [Article] ([LastWalletId]);

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20180324144808_Update001', N'2.0.0-rtm-26452');

GO

