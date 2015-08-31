function WebRTCAdapter(send, error){
    var that = this;

    var connectionsClient = {};
    var connectionsHost = {};

    that.constraints = {'optional' : [{'DtlsSrtpKeyAgreement' : true}]};

    if(navigator.mozGetUserMedia){
        that.detectedBrowser = "firefox";
        that.peerConnection = mozRTCPeerConnection;
        that.sessionDescription = mozRTCSessionDescription;
        that.iceCandidate = mozRTCIceCandidate;
        that.config = {'iceServers' : [{'url' : 'stun:23.21.150.121'}]};
    }
    else if(navigator.webkitGetUserMedia){
        that.detectedBrowser = "chrome";
        that.peerConnection = webkitRTCPeerConnection;
        that.sessionDescription = RTCSessionDescription;
        that.iceCandidate = RTCIceCandidate;
        that.config = {'iceServers' : [{'url' : 'stun:stun.l.google.com:19302'}]};
    }
    that.sdpConstraints = {};

    that.isCapable = function(){
        return !!that.detectedBrowser;
    };

    that.createDataChannelServer = function(receiver, id){//create connection with user
        if(that.detectedBrowser){
            var webRTCChannel = new WebRTCChannel();

            var peerConnection = new that.peerConnection(that.config, that.constraints);
            //hookConnectionEvents(peerConnection);

            peerConnection.onicecandidate = function(event){
                if(event.candidate){
                    var iceCandidate = {
                        label : event.candidate.sdpMLineIndex,
                        id : event.candidate.sdpMid,
                        candidate : event.candidate.candidate
                    };
                    send('iceCandidate', {iceCandidate : iceCandidate, id : id, receiver : receiver});
                }
            };

            peerConnection.ondatachannel = function(event){
                console.log('host received data channel');
            };

            var dataChannel = peerConnection.createDataChannel("sendDataChannel", {reliable : false});
            hookDataChannelEvents(dataChannel, webRTCChannel);

            if(connectionsHost[id] === undefined){
                var connection = {};

                o.internalId = 0;
                o.clients = {};

                connectionsHost[id] = connection;
            }

            var clientInfo = {};
            clientInfo.peerConnection = peerConnection;
            clientInfo.dataChannel = dataChannel;

            var internalId = connectionsHost[id].internalId++;
            connectionsHost[id].clients[internalId] = clientInfo;

            createOffer(peerConnection, receiver, id, internalId);

            return webRTCChannel;
        }
        else{
            throw "Cannot create peer connection";
        }
    };

    that.createDataChannelClient = function(id){
        if(that.detectedBrowser){
            var clientInfo = {};
            connectionsClient[id] = clientInfo;

            clientInfo.webRTCChannel = new WebRTCChannel();
            clientInfo.peerConnection = new that.peerConnection(that.config, that.constraints);

            return clientInfo.webRTCChannel;
        }
        else{
            //throw "Cannot create peer connection";
        }
    }

    function hookConnectionEvents(peerConnection){

    }

    function hookDataChannelEvents(dataChannel, webRTCChannel){
        dataChannel.onmessage = function(data){
            //that.onMessage.call(that.eventContext, data);
        };
        dataChannel.onopen = function(evt){
            //that.onOpen.call(that.eventContext);
        };
        dataChannel.onclose = function(evt){
            //that.onClose.call(that.eventContext);
        };
    }

    function createOffer(peerConnection, receiver, id, hostId){
        peerConnection.createOffer(function(sessionDescription){
            peerConnection.setLocalDescription(new that.sessionDescription(sessionDescription));
            send('offer', {receiver : receiver, description : sessionDescription, id : id, hostId : hostId});
        }, function(error){
            error(error);
        }, that.sdpConstraints);
    }

    function onOffer(data){
        var peerConnection = connectionsClient[data.id].peerConnection;
        peerConnection.setRemoteDescription(data.sessionDescription);

        createAnswer(peerConnection, data._sendersUsername, data.id, data.hostId);
    }

    function createAnswer(peerConnection, host, id, hostId){
        peerConnection.createAnswer(function(sessionDescription){
            peerConnection.setLocalDescription(new that.sessionDescription(sessionDescription));
            send('answer', {receiver : host, description : sessionDescription, id : id, hostId : hostId});
        }, function(error){

        }, that.sdpConstraints);
    }

    function onAnswer(data){
        var peerConnection = connectionsHost[dataid].clients[data.hostId].peerConnection;
        peerConnection.setRemoteDescription(data.sessionDescription);
    }

    function onIceCandidate(data){
        var peerConnection = null;

        if(data.hostId){
            peerConnection = connectionsHost[data.id].clients[data.hostId].peerConnection;
        }
        else {
            peerConnection = connectionsClient[data.id];
        }

        var candidate = new that.iceCandidate({sdpMLineIndex : data.iceCandidate.label, candidate : data.iceCandidate.candidate});
        peerConnection.addIceCandidate(candidate);
    }
}