using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using qr_api.Models;
using System.Diagnostics;

namespace qr_api.Helpers
{
    public class CloudTableHelper
    {
        private readonly AppSettings _appSettings;

        private CloudStorageAccount _storageAccount { get; set; }

        private CloudTable Table { get; set; }

        private CloudStorageAccount StorageAccount
        {
            get
            {
                if (_storageAccount == null)
                {
                    _storageAccount = CloudStorageAccount.Parse(_appSettings?.StorageConnectionString);
                }
                return _storageAccount;
            }
        }

        private CloudTableClient _tableClient { get; set; }
        private CloudTableClient TableClient
        {
            get
            {
                if (_tableClient == null)
                {
                    _tableClient = StorageAccount.CreateCloudTableClient();
                }
                return _tableClient;
            }
        }

        public CloudTableHelper(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings?.Value;

        }

        public async Task SetTable(string tableName)
        {
            Table = TableClient.GetTableReference(tableName);
            await Table.CreateIfNotExistsAsync();
        }

        public async Task<IEnumerable<T>> RangeDateQuery<T>(string columnName, DateTime givenValue, string operation = QueryComparisons.LessThanOrEqual, string tableName = null)
            where T : ITableEntity, new()
        {
            TableQuery<T> rangeQuery = new TableQuery<T>().Where(TableQuery.GenerateFilterConditionForDate(columnName, operation, givenValue));
            CloudTable table = await GetTable(tableName);

            try
            {
                IEnumerable<T> result = table.ExecuteQuery<T>(rangeQuery);
                return result;
            }
            catch (StorageException ex)
            {
                Trace.Write(ex);
            }
            return null;
        }

        public async Task<T> InsertOrReplace<T>(T item, string tableName = null)
            where T : ITableEntity
        {
            TableOperation operation = TableOperation.InsertOrReplace(item);
            TableResult tableResult = await GetTableResult(operation, tableName);
            return (T)tableResult?.Result;
        }

        #region private functions
        private async Task<TableResult> GetTableResult(TableOperation operation, string tableName = null)
        {
            CloudTable table = await GetTable(tableName);
            try
            {
                TableResult tableResult = await table.ExecuteAsync(operation);
                return tableResult;
            }
            catch (StorageException ex)
            {
                Trace.Write(ex);
            }
            return null;
        }

        private async Task<CloudTable> GetTable(string tableName)
        {
            if (!string.IsNullOrWhiteSpace(tableName))
            {
                await SetTable(tableName);
            }
            return Table;
        }
        #endregion
    }
}