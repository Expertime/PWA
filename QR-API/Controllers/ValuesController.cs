using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json.Linq;
using qr_api.Helpers;
using qr_api.Models;

namespace qr_api.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        #region properties, constructor
        private readonly AppSettings _appSettings;
        private CloudTableHelper tableHelper { get; set; }

        public ValuesController(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings?.Value;
            tableHelper = new CloudTableHelper(appSettings);
            tableHelper.SetTable(_appSettings?.QrTableName).Wait();
        }
        #endregion

        // GET api/values
        [HttpGet]
        public async Task<IEnumerable<string>> Get()
        {
            IEnumerable<QrCodeTableEntity> tableResult = await tableHelper.RangeDateQuery<QrCodeTableEntity>(nameof(QrCodeTableEntity.ExpirationDate), DateTime.UtcNow, QueryComparisons.GreaterThan, _appSettings?.QrTableName);
            string[] result = tableResult.OrderBy(t => t.Timestamp).Select(t => t.QrText).ToArray();
            return result; //new string[] { "value1", "value2" };
        }

        // POST api/values
        [HttpPost]
        public async Task<bool> Post([FromBody]JObject value)
        {
            QrCodeTableEntity item = new QrCodeTableEntity(Guid.NewGuid(), value["qrtext"].ToString());
            QrCodeTableEntity result = await tableHelper.InsertOrReplace(item);
            return result != null;
        }
    }
}
