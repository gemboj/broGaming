var webrtcAdapter = (function(){
    webrtc = {};
    webrtc.constraints = { 'optional': [ {'DtlsSrtpKeyAgreement': true} ]};

    if(navigator.mozGetUserMedia){
        webrtc.detectedBrowser = "firefox";
        webrtc.peerConnection = mozRTCPeerConnection;
        webrtc.sessionDescription = mozRTCSessionDescription;
        webrtc.iceCandidate = mozRTCIceCandidate;
        webrtc.config = {'iceServers':[{'url':'stun:23.21.150.121'}]};
    }
    else if(navigator.webkitGetUserMedia){
        webrtc.detectedBrowser = "chrome";
        webrtc.peerConnection = webkitRTCPeerConnection;
        webrtc.sessionDescription = RTCSessionDescription;
        webrtc.iceCandidate = RTCIceCandidate;
        webrtc.config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
    }
    webrtc.sdpConstraints = {};

    webrtc.isCapable = function(){
        if(this.detectedBrowser){
            return true;
        }
        else{
            return false;
        }
    };

    webrtc.createConnection = function(userNick, roomId, asInitiator){//create connection with user
        if(this.detectedBrowser){
            var peerConnection = new WebrtcPeerConnection(new this.peerConnection(this.config, this.constraints), userNick, roomId);

            if(asInitiator){
                peerConnection.initiateConnection();
            }

            return peerConnection;
        }
        else{
            chatInterface.log.append("Error", "Cannot create peer connection");
            return 0;
        }
    };

    var events = {
        readyCheck: function(data){//roomId, sender
            var room = chatClient.findRoom(data.roomId);
            room.readyCheck(data.sender,
                function(){
                    socketHandler.emit("privateMessage", {messageContent: "clientReady",
                                                          clientNick: chatClient.getCurrentUser().getNick(),
                                                          roomId: data.roomId,
                                                          receiver: data.sender});
                }, function(){
                    socketHandler.emit("privateMessage", {messageContent: "clientIncapable",
                                                          clientNick: chatClient.getCurrentUser().getNick(),
                                                          roomId: data.roomId,
                                                          receiver: data.sender});
                });
        },

        clientReady: function(data){//roomId, clientNick
            var room = chatClient.findRoom(data.roomId);
            room.onClientReady(data.clientNick);
        },

        clientIncapable: function(data){
            var room = chatClient.findRoom(data.roomId);
            room.onClientIncapable(data.clientNick);
        },

        iceCandidate: function(data){//iceCandidate, roomId, sender, receiver
            var room = chatClient.findRoom(data.roomId);
            room.onIceCandidate(data);
        },

        signalingOffer: function(data){//sessionDescription, roomId
            var room = chatClient.findRoom(data.roomId);
            room.setRemoteDescription(data.sessionDescription);
        },

        signalingAnswer: function(data){//sessionDescription, roomId, sender
            var room = chatClient.findRoom(data.roomId);
            room.setRemoteDescription(data.sessionDescription, data.sender);
        }
    };

    socketHandler.addEvents(events);

    return webrtc;
})();

function WebrtcPeerConnection(connection, userNick, roomId){
    var that = this;
    this._peerConnection = connection;
    this._senderNick = chatClient.getCurrentUser().getNick();
    this._receiverNick = userNick;
    this._roomId = roomId;
    this._peerConnection.onicecandidate = function(event){
        that.handleIceCandidate(event);
    };
    this._peerConnection.ondatachannel = function(event){
        that.receivedDataChannel(event);
    };
    this.isReliableDataChannel = false;

    this.onMessage = function(event){};
    this.onOpen = function(event){chatInterface.log.append("webrtc", "Opened RTC connection")};
    this.onClose = function(event){chatInterface.log.append("webrtc", "Closed RTC connection")};
    this.eventContext = null;
};

WebrtcPeerConnection.prototype.addIceCandidate = function(iceCandidate){
    var candidate = new webrtcAdapter.iceCandidate({sdpMLineIndex:iceCandidate.label, candidate:iceCandidate.candidate});
    this._peerConnection.addIceCandidate(candidate);
};

WebrtcPeerConnection.prototype.handleIceCandidate = function(event){
    if (event.candidate) {
        var iceCandidate = {label: event.candidate.sdpMLineIndex, id: event.candidate.sdpMid, candidate: event.candidate.candidate};
        socketHandler.emit("privateMessage", {messageContent: 'iceCandidate', iceCandidate: iceCandidate, sender: this._senderNick, receiver: this._receiverNick, roomId: this._roomId});
    }
};

WebrtcPeerConnection.prototype.setDataChannel = function(dataChannel){
    this._dataChannel = dataChannel;
    var that = this;
    dataChannel.onmessage = function(data){
        that.onMessage.call(that.eventContext, data);
    };
    dataChannel.onopen = function(evt){
        that.onOpen.call(that.eventContext);
    };
    dataChannel.onclose = function(evt){
        that.onClose.call(that.eventContext);
    }
};

WebrtcPeerConnection.prototype.initiateConnection = function(){
    this.setDataChannel(this._peerConnection.createDataChannel("sendDataChannel", {reliable: this.isReliableDataChannel}));
    this.createOffer();
};

WebrtcPeerConnection.prototype.receivedDataChannel = function(event){
    this.setDataChannel(event.channel);
};

WebrtcPeerConnection.prototype.createOffer = function(){
    var that = this;
    this._peerConnection.createOffer(function(sessionDescription){
        that.onLocalDescriptionOffer(sessionDescription);
    }, this.onSignalingError, webrtcAdapter.sdpConstraints);
};

WebrtcPeerConnection.prototype.createAnswer = function(){
    var that = this;
    this._peerConnection.createAnswer(function(sessionDescription){
        that.onLocalDescriptionAnswer(sessionDescription);
    }, this.onSignalingError, webrtcAdapter.sdpConstraints);
};

WebrtcPeerConnection.prototype.onLocalDescriptionOffer = function(sessionDescription){
    this._peerConnection.setLocalDescription(sessionDescription);
    socketHandler.emit("privateMessage", {messageContent: 'signalingOffer',
                                          sessionDescription: sessionDescription,
                                          sender: this._senderNick,
                                          receiver: this._receiverNick,
                                          roomId: this._roomId});

};

WebrtcPeerConnection.prototype.onLocalDescriptionAnswer = function(sessionDescription){
    this._peerConnection.setLocalDescription(sessionDescription);
    socketHandler.emit("privateMessage", {messageContent: 'signalingAnswer',
                                          sessionDescription: sessionDescription,
                                          sender: this._senderNick,
                                          receiver: this._receiverNick,
                                          roomId: this._roomId});

};

WebrtcPeerConnection.prototype.setRemoteDescription = function(sessionDescription){
    this._peerConnection.setRemoteDescription(new webrtc.sessionDescription(sessionDescription));
};

WebrtcPeerConnection.prototype.setLocalDescription = function(sessionDescription){
    this._peerConnection.setLocalDescription(new webrtc.sessionDescription(sessionDescription));
};

WebrtcPeerConnection.prototype.onSignalingError = function(error){
    chatInterface.log.append("Error", 'Failed to create signaling message : ' + error.name);
};


WebrtcPeerConnection.prototype.sendData = function(data){
    this._dataChannel.send(data);
};

WebrtcPeerConnection.prototype.setOnOpen = function(fun){
    this.onOpen = fun;
};

WebrtcPeerConnection.prototype.setOnClose = function(fun){
    this.onClose = fun;
};

WebrtcPeerConnection.prototype.setOnMessage = function(fun){
    this.onMessage = fun;
};

WebrtcPeerConnection.prototype.setEventContext = function(context){
    this.eventContext = context;
};


