using Microsoft.WindowsAzure.Storage.Table;
using System;

namespace qr_api.Models
{
    public class QrCodeTableEntity : TableEntity
    {
        public DateTime ExpirationDate { get; set; }

        public string QrText { get; set; }

        public QrCodeTableEntity()
        {
            ExpirationDate = DateTime.UtcNow.AddDays(7);
        }

        public QrCodeTableEntity(Guid token)
        {
            ExpirationDate = DateTime.UtcNow.AddDays(7);
            SetKeys(token);
        }

        public QrCodeTableEntity(Guid token, string qrText)
        {
            QrText = qrText;
            ExpirationDate = DateTime.UtcNow.AddDays(7);
            SetKeys(token);
        }

        protected void SetKeys(Guid token)
        {
            PartitionKey = GetPartitionKey(token);
            RowKey = GetRowKey(token);
        }

        public static string GetPartitionKey(Guid token)
        {
            return token.ToString().Substring(0, 5);

        }

        public static string GetRowKey(Guid token)
        {
            return token.ToString().Substring(4);
        }
    }

}