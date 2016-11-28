
# QR-API an api for [QR-PWA][1]'s 'latest' 

This api presents two methods : one to save a qr-code (```POST```), and one to retreive the latest qr-codes (```GET```).
Both are available at ```/api/values```

Theses data are stored in an AzureTable, which connection string is set in the ```appsettings.json``` file at ```AppSettings.StorageConnectionString```

More info and live demo of QR-PWA [here][1]

[1]: https://github.com/expertime/pwa/tree/master/QR-API