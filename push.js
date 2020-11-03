var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BN7Vu060vFjdNzrbwf8dB1kH6X-iBjXxVapRezd1s_VSqGpj2j5k4trejQu1_uqWSWPbu8aH5nxMVReRnkn2nDU",
   "privateKey": "ukOrj1UkOP2Q5RhqEyuhK4Pgl78HcWwmYqGxEOYMBoA"
};
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/fFqsyovZ6bc:APA91bGVRwg7gTZbm82q-nu8VC4WcrSHL9-jbvqO-768cX1R5pRPfonxfV6ExqBpxmKoHzzD3_yEZVu_8s-HXp5ybM-tjK5txlNtslpVhU3cO6cWc6WrmA-7dhTVjQsFKP2NV-BhfPOD",
    "keys": {
        "p256dh": "BGITWIVmqn3Y5Tm2eCloT34Iey5RvLVn+WVzMHmtEhZHDcyNodLSvdJKbSvjhxkzDa2uUV93uuwYM2bK7akGjJs=",
        "auth": "/CgedVwIl388ygpoKFAegA=="
    }
}
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '457890124774',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);