if("serviceWorker" in navigator){
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => {
          console.log("pendaftaran SeviceWorker berhasil")
        })
        .catch(() => {
          console.log('Pendaftaran ServiceWorker gagal')
        });
    });
} else {
    console.log('ServiceWorker belum didukung browser ini')
}
 
 // Meminta ijin menggunakan Notification API
 const requestPermission = () => {
  Notification.requestPermission().then( (result) => {
    if (result === "denied") {
      console.log("Fitur notifikasi tidak diijinkan.");
      return;
    } else if (result === "default") {
      console.error("Pengguna menutup kotak dialog permintaan ijin.");
      return;
    }
    console.log("Fitur notifikasi diijinkan.");
  });
}

// Periksa fitur Notification API
if ("Notification" in window) {
  requestPermission();
} else {
  console.error("Browser tidak mendukung notifikasi.");
}
const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
navigator.serviceWorker.ready.then( () => {
  if(('PushManager' in window)){
    navigator.serviceWorker.getRegistration().then((registration) => {
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BN7Vu060vFjdNzrbwf8dB1kH6X-iBjXxVapRezd1s_VSqGpj2j5k4trejQu1_uqWSWPbu8aH5nxMVReRnkn2nDU")
      }).then(function(subscribe) {
          console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
          console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('p256dh')))));
          console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('auth')))));
      }).catch(function(e) {
          console.error('Tidak dapat melakukan subscribe ', e.message);
      });
    });
  }
})

