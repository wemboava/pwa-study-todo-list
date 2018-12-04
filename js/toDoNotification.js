const PUBLIC_KEY = "BBZejeSiAno7068TAxztOSUED83OOUO9N1BZIVjYeJ79sXbPvKUUA1sm0D2MzO4c4iii0ettoAkOjHgXwpvaa1w";

function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const ToDoNotification = {
    subscribeUserToNotification(){
        Notification.requestPermission().then(function(permission){
            if(permission === 'granted'){
                var subscribeOptions = {
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
                }

                navigator.serviceWorker.ready
                    .then(function(registration){
                        return registration.pushManager.subscribe(subscribeOptions);
                    })
                    .then(function(subscription){
                        return fetch('http://localhost:3006', {
                            'method': 'POST',
                            'Content-Type': 'application/json',
                            'body': JSON.stringify(subscription)
                        })
                    })
            }
        })
    }
}