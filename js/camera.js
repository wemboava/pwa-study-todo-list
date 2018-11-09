let videoElement,
    stream,
    videoDevices = [],
    selectedDeviceIndex = 0;

navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        devices.forEach(device => {
            if(device.kind === 'videoinput'){
                videoDevices.push(device.deviceId);
            }
        })
    })

export const Camera = {
    start(){
        this.stop();
        if(videoDevices.length){
            videoElement = document.getElementById('camera-tag');
            navigator.mediaDevices.getUserMedia(
                {
                    video: {
                        width: 230,
                        height: 200,
                        deviceIdId: { exact: videoDevices[selectedDeviceIndex] }
                    }
                }
            )
                .then((localMediaStream) => {
                    stream = localMediaStream;
                    videoElement.src = window.URL.createObjectURL(stream);
                    videoElement.play();
                })
        }
    },
    stop(){
        if(stream){
            videoElement = '';
            stream.getVideoTracks()[0].stop();
            stream = null;
        }
    },
    shoot(){
        if(stream){
            let canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = 230;
            canvas.height = 200;
            ctx.drawImage(videoElement, 0, 0, 230, 200);
            let image = canvas.toDataURL('image/webp');
            return image;
        }return false;
    },
    changeSource(){
        if(stream && videoDevices.length > 1){
            selectedDeviceIndex++;
            if(selectedDeviceIndex === videoDevices.length){
                selectedDeviceIndex = 0;
            }
            this.start();
        }
    }
}