const SW = '[Service Worker]';
self.addEventListener('push', event => {
    console.log(`${SW} Push Received.`);
    console.log(`${SW} Push had this data: ${event.data.text()}`);
    const title = '推送提醒訊息';
    const options = {
        body: '提醒訊息'
        // icon: '',
        // badge: ''
    };
    setTimeout(() => {
        event.waitUntil(self.registration.showNotification(title, options));
    }, 500);
});

self.addEventListener('notificationclick', event => {
    console.log(`${SW} Notification click Received.`);
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/fundamentals/getting-   started/codelabs/push-notifications/')
    );
});