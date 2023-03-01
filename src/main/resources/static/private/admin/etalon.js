let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');
let localStream;

let configuration = {};
let offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};
let pc1 = new RTCPeerConnection(configuration);
let pc2 = new RTCPeerConnection(configuration);

pc1.addEventListener('icecandidate', (event) => {
    pc2.addIceCandidate(event.candidate).then()
});
pc2.addEventListener('icecandidate', (event) => {
    pc1.addIceCandidate(event.candidate).then()
});
pc2.addEventListener('track', (event) => {
    remoteVideo.srcObject = event.streams[0];
});

navigator.mediaDevices.getUserMedia({audio: false, video: true}).then(stream => {
    localVideo.srcObject = stream;
    localStream = stream;

    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream))
    pc1.createOffer(offerOptions).then(offer => {
        pc1.setLocalDescription(offer).then(_void => {
            pc2.setRemoteDescription(offer).then(_void => {
                pc2.createAnswer().then(answer => {
                    pc2.setLocalDescription(answer).then(_void => {
                        pc1.setRemoteDescription(answer).then(_void => {

                        })
                    })
                })
            })
        })
    })
})
