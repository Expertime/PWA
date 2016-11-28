
# QR-PWA a qr-code generator progressive web app

This web app is made as an example of a Progressive Web App (PWA).
It generates qr-code on the fly.

It also allows to save and retrieve 'latest' qr-codes through an api (see [QR-API][1]).

Static files and external resources are store offline through a service worker and the Cache API.
In the same spirit, the latest available [QR-API][1] data are also stored offline. However, the 'save' option is not available offline.

[live demo](https://qr-pwa.azurewebsites.net/) here.

---

## Install
Prerequisites:
[node](https://nodejs.org) and [bower](https://bower.io/) installed

To run locally:
```
  bower intall | npm install | node express.js
```

the web.config file is here for proper functionning while deploying in IIS (like Windows Azure Web Apps)


You might want to change ```settings.qrService``` in ```scripts/app.js```

to target your local API (see [QR-API][1])

---
## About PWA
For more information about PWA: [Google Developers](https://developers.google.com/web/progressive-web-apps/)

For other examples of PWA: [PWA rocks](https://pwa.rocks/)

[1]: https://github.com/expertime/pwa/tree/master/QR-API
