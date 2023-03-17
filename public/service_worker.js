if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');
    navigator.serviceWorker.register('/public/sw.js').then(swReg => {
        let swRegistration = swReg;
        console.log('Service Worker is registered', swReg);
        return Promise.resolve(swRegistration);
    }).then(swRegistration => {
        inititalUI(swRegistration);
        subscribeUser(swRegistration);
    }).catch(err => console.log('Service Worker register error.',err));
} else {
    console.log('Push is not supported');
}
function inititalUI(swRegistration) {
    swRegistration.pushManager.getSubscription().then(subscription => {
        let isSubscription = !(subscription === null);
        if (isSubscription) {
            console.log('User is subscribed.');
        } else {
            console.log('User is not subscribed.');
        }
    });
}

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
function subscribeUser(swRegistration) {
    const applicationServerPublicKey = 'BL_M-d34iWdqZn3gM8YkC1AWkWzuGwywuVicwMTXTEZJqjA5netZpBJQywrUwctnyBrWY6-QKp-2Rj2EGMfGEQo';
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
    }).then(subscription => {
        console.log('User is subscribe.');
    }).catch(err => console.log('Failed to subscribe the user: ', err));
}
