let commandSocket = null;
let peerConnections = {};
let currentDeviceId = null;
let currentDeviceSessionId = null;
let options = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};
let iceConfig = {
    iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'},
        {urls: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'}
    ]
}

function getDeviceId() {
    return fetch("/handshake_api/get_device_id?deviceType=REMOTE")
        .then(response => response.text())
}

function getDeviceSessionId() {
    return fetch("/handshake_api/get_device_session_id?deviceType=REMOTE")
        .then(response => response.text())
}

function createNewRTCPeerConnection() {
    return navigator.mediaDevices.getUserMedia({audio: false, video: true}).then(stream => {
        let peerConnection = new RTCPeerConnection(iceConfig);

        peerConnection.onicecandidateerror = (event) => {
            console.error(event)
        }

        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        peerConnection.addEventListener('icecandidate', (event) => {
            let emitter = event.currentTarget;

            let entry = Object.entries(peerConnections).find(entry => {
                return entry[1] === emitter;
            });

            let key = entry[0];
            let currentDeviceSessionId = key.split(":")[1];
            let remoteDeviceSessionId = key.split(":")[0];

            let commandSocketMessage = {
                id: null,
                mission: "PASS_RTC_PEER_CONNECTION_COMMAND",
                purpose: "ADD_ICE_CANDIDATE",
                from: currentDeviceSessionId,
                to: remoteDeviceSessionId,
                data: event
            }

            commandSocket.send(
                JSON.stringify(commandSocketMessage)
            )
        })

        return peerConnection;
    })
}

function onCommandSocketMessage(event) {
    const commandSocketMessage = JSON.parse(event.data);
    const transactionId = commandSocketMessage.id;
    const purpose = commandSocketMessage.purpose;
    const senderDeviceSessionId = commandSocketMessage.from;
    const data = commandSocketMessage.data;

    switch (purpose) {
        case "SET_REMOTE_DESCRIPTION": {
            onSetRemoteDescriptionMessage(transactionId, senderDeviceSessionId, currentDeviceSessionId, data);
            break;
        }
        case "CREATE_ANSWER": {
            onCreateAnswerMessage(transactionId, senderDeviceSessionId, currentDeviceSessionId, data);
            break;
        }
        case "SET_LOCAL_DESCRIPTION": {
            onSetLocalDescription(transactionId, senderDeviceSessionId, currentDeviceSessionId, data);
            break;
        }
        case "ADD_ICE_CANDIDATE": {
            onAddIceCandidate(transactionId, senderDeviceSessionId, currentDeviceSessionId, data);
            break;
        }
        //other
        case "SOME_WEB_SOCKET_SESSION_CONNECTION_CLOSED": {
            onSomeWebSocketSessionConnectionClosed(data)
            break;
        }
    }

    function onSomeWebSocketSessionConnectionClosed(data) {
        let key = data + ":" + currentDeviceSessionId;
        let peerConnection = peerConnections[key];

        if (peerConnection != null) {
            peerConnection.close();
            delete peerConnections[key]
        }
    }

    function onAddIceCandidate(transactionId, senderDeviceSessionId, currentDeviceSessionId, data) {
        let key = senderDeviceSessionId + ":" + currentDeviceSessionId;
        let peerConnection = peerConnections[key];

        let promise;

        if (peerConnection != null && data != null) {
            promise = peerConnection.addIceCandidate(data);
        } else {
            promise = new Promise(() => {
            })
        }

        promise.then(() => {
            let commandSocketMessage = {
                id: transactionId,
                mission: "PASS_RTC_PEER_CONNECTION_COMMAND",
                purpose: "ADD_ICE_CANDIDATE__SUCCESS",
                from: currentDeviceSessionId,
                to: senderDeviceSessionId,
                data: "{}"
            }
            commandSocket.send(
                JSON.stringify(commandSocketMessage)
            )
        })
    }

    function onSetLocalDescription(transactionId, senderDeviceSessionId, currentDeviceSessionId, data) {
        let key = senderDeviceSessionId + ":" + currentDeviceSessionId;
        let peerConnection = peerConnections[key];

        peerConnection.setLocalDescription(data).then(() => {
            let commandSocketMessage = {
                id: transactionId,
                mission: "PASS_RTC_PEER_CONNECTION_COMMAND",
                purpose: "SET_LOCAL_DESCRIPTION__SUCCESS",
                from: currentDeviceSessionId,
                to: senderDeviceSessionId,
                data: "{}"
            }
            commandSocket.send(
                JSON.stringify(commandSocketMessage)
            )
        })
    }

    function onCreateAnswerMessage(transactionId, senderDeviceSessionId, currentDeviceSessionId, data) {
        let key = senderDeviceSessionId + ":" + currentDeviceSessionId;
        let peerConnection = peerConnections[key];
        peerConnection.createAnswer(options).then(answer => {
            let commandSocketMessage = {
                id: transactionId,
                mission: "PASS_RTC_PEER_CONNECTION_COMMAND",
                purpose: "CREATE_ANSWER__SUCCESS",
                from: currentDeviceSessionId,
                to: senderDeviceSessionId,
                data: answer
            }
            commandSocket.send(
                JSON.stringify(commandSocketMessage)
            )
        })
    }

    function onSetRemoteDescriptionMessage(transactionId, senderDeviceSessionId, currentDeviceSessionId, data) {
        let key = senderDeviceSessionId + ":" + currentDeviceSessionId;
        createNewRTCPeerConnection().then(peerConnection => {
            peerConnections[key] = peerConnection;

            console.info("RTCPeerConnection created by key: " + key, peerConnection)

            peerConnection.setRemoteDescription(data).then((some) => {
                let commandSocketMessage = {
                    id: transactionId,
                    mission: "PASS_RTC_PEER_CONNECTION_COMMAND",
                    purpose: "SET_REMOTE_DESCRIPTION__SUCCESS",
                    from: currentDeviceSessionId,
                    to: senderDeviceSessionId,
                    data: "{}"
                }
                commandSocket.send(
                    JSON.stringify(commandSocketMessage)
                )
            })
        })
    }
}

Promise.all([
    getDeviceId(),
    getDeviceSessionId()
]).then(([deviceId, deviceSessionId]) => {
    console.info("New tab with deviceId=" + deviceId + "; deviceSessionId=" + deviceSessionId + ";");
    document.title = deviceSessionId;

    currentDeviceId = deviceId;
    currentDeviceSessionId = deviceSessionId;

    commandSocket = new WebSocket("ws://localhost:8080/command-socket?deviceType=REMOTE&deviceId=" + deviceId + "&deviceSessionId=" + deviceSessionId);
    commandSocket.onmessage = onCommandSocketMessage;
})
