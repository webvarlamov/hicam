const deviceConnectionId = window.location.pathname
    .split("/")
    .reverse()
    [0];

const commandSocket = new WebSocket("ws://localhost:8080/command-socket?deviceConnectionType=REMOTE&deviceConnectionId=" + deviceConnectionId);

const iceConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'},
        { urls: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'}
    ]
}

function createOfferAndSetLocalDescription(rtcPeerConnection) {
    return rtcPeerConnection.createOffer().then(offer => {
        return rtcPeerConnection.setLocalDescription(offer).then(() => {
            return offer;
        })
    })
}

function setRemoteDescriptionAndCreateAnswer(rtcPeerConnection, offer) {
    return rtcPeerConnection.setRemoteDescription(offer).then(() => {
        return rtcPeerConnection.createAnswer().then(answer => {
            return rtcPeerConnection.setLocalDescription(answer).then(() => {
                return answer;
            })
        })
    })
}

function getNewPeerConnection() {
    return new RTCPeerConnection(iceConfig);
}

function getNavigatorUserMediaStream() {
    return navigator.mediaDevices.getUserMedia({audio: false, video: true});
}

function sentOfferToRemote(deviceConnectionId, offer) {
    commandSocket.send(JSON.stringify({
        type: "TRANSFER_OFFER_TO_ADMIN",
        offer: offer
    }));
}

function connectLocalStreamToRTCPeerConnection(stream, rtcPeerConnection) {
    stream.getTracks()
        .forEach(track => rtcPeerConnection.addTrack(track, stream));
}

function initConnection() {
    let rtcPeerConnection = getNewPeerConnection();
    getNavigatorUserMediaStream().then(stream => {
        connectLocalStreamToRTCPeerConnection(stream, rtcPeerConnection);
        createOfferAndSetLocalDescription(rtcPeerConnection).then(offer => {
            sentOfferToRemote(deviceConnectionId, offer)
        })
    })
}

initConnection();


