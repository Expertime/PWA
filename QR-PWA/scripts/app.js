(function () {
  'use strict';

  const settings = {
    qrService: 'https://qr-api.azurewebsites.net/api/values'
  }

  document.querySelector('#qr-text').oninput = function (e) {
    updateQrCode(e.target.value);
  };

  function updateQrCode(text) {
    if (text.length <= 0) {
      document.querySelector('#upload').setAttribute('disabled', 'disabled');
      document.querySelector('#download').setAttribute('disabled', 'disabled');
    } else {
      document.querySelector('#upload').removeAttribute('disabled');
      document.querySelector('#download').removeAttribute('disabled');
    }
    document.querySelector('qr-code').setAttribute('data', text);
  }

  window.getQrCodes = function (updateHash) {
    if ('caches' in window) {
      caches.match(settings.qrService).then(function (response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            console.info('json', json);
            showQrCodes(json);
          });
        }
      });
    }
    getNetworkQrCodes(updateHash);
  }

  function getNetworkQrCodes(updateHash) {
    const wrapper = document.querySelector('#saved-qr');
    wrapper.classList.add('loading');
    const req = new XMLHttpRequest;
    req.open('GET', settings.qrService, true);
    req.onload = () => {
      if (req.readyState == 4 && req.status == 200) {
        const res = JSON.parse(req.responseText);
        console.info('network json', res);
        showQrCodes(res);
        if (typeof (updateHash) == typeof (undefined) || updateHash) {
          location.hash = "";
          location.hash = "#saved-qr";
        }
      }
    };
    req.onerror = () => { toast('There was an error getting the Latest, please try again later...'); };
    req.send(null);
  }

  function showQrCodes(res) {
    const list = document.querySelector('#recentQrCodes');
    while (list.childNodes.length) {
      list.removeChild(list.childNodes[0]);
    }

    for (let item of res) {
      const qrcode = document.createElement('qr-code');
      qrcode.setAttribute('data', item);
      qrcode.setAttribute('margin', 1);
      qrcode.setAttribute('modulesize', 5);
      const newChild = document.createElement('li');
      newChild.setAttribute('class', 'mdl-list__item');

      const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
      const regex = new RegExp(expression);
      if (item.match(regex)) {
        const link = document.createElement('a');
        link.setAttribute('href', item);
        link.setAttribute('target', 'blank');
        link.innerHTML = qrcode.outerHTML;
        newChild.appendChild(link);
      } else {
        newChild.appendChild(qrcode);
        const label = document.createElement('span');
        label.innerText = item;
        newChild.appendChild(label);
      }
      list.appendChild(newChild);
    }
    const wrapper = document.querySelector('#saved-qr');
    wrapper.classList.remove('loading');
  }

  window.getQrCodes(false);

  window.saveQrCode = function () {
    const qrInput = document.querySelector('#qr-text');
    const qrText = qrInput.value;
    const req = new XMLHttpRequest;
    req.open('POST', settings.qrService, true);
    req.setRequestHeader('Content-Type', 'application/json');
    const reqData = JSON.stringify({
      'qrtext': qrText
    });
    req.onload = () => {
      if (req.readyState == 4 && req.status == 200) {
        toast('QR-code saved, refreshing Latest...');
        window.getQrCodes();
      }
    };
    req.onerror = () => { toast('There was an error saving your QR-code, sorry about that...'); };
    req.send(reqData);
  }

  window.download = function () {
    const dataUrl = document.querySelector('#qr-code').shadowRoot.childNodes[0].getAttribute('src');
    const link = document.createElement('a');
    const name = 'qrcode.png';
    link.download = name;
    link.href = dataUrl;
    link.click();
  }

  function toast(message) {
    const snackbarContainer = document.querySelector('#snackbar');
    const data = {
      message: message,
      timeout: 3000,
      actionHandler: () => { },
      actionText: '✕'
    }
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }

  window.closeToast = function () {
    const snackbarContainer = document.querySelector('#snackbar');
    snackbarContainer.classList.remove("mdl-snackbar--active");
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(function () {
        console.log('Service Worker Registered');
      });
  }

})();
