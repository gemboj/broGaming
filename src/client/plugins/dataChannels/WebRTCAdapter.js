function WebRTCAdapter(send, showError){
    var that = this;

    var connectionsClient = {};
    var awaitingClientConnection = {};

    var connectionsHost = {};

    that.constraints = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    if(navigator.mozGetUserMedia){
        that.detectedBrowser = "mozilla";
        that.peerConnection = mozRTCPeerConnection;
        that.sessionDescription = mozRTCSessionDescription;
        that.iceCandidate = mozRTCIceCandidate;
        that.config = {'iceServers': [{'url': 'stun:23.21.150.121'}]};
    }
    else if(navigator.webkitGetUserMedia){
        that.detectedBrowser = "chrome";
        that.peerConnection = webkitRTCPeerConnection;
        that.sessionDescription = RTCSessionDescription;
        that.iceCandidate = RTCIceCandidate;
        that.config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
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
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    };
                    send('iceCandidate', {iceCandidate: iceCandidate, id: id, receiver: receiver});
                }
                else{
                    showError('onincecandidate error');
                }
            };

            var dataChannel = peerConnection.createDataChannel("sendDataChannel", {reliable: false});
            hookDataChannelEvents(dataChannel, webRTCChannel, id, peerConnection);

            //hookDataChannelEvents(dataChannel, webRTCChannel);

            if(connectionsHost[id] === undefined){
                var connection = {};

                connection.internalId = 0;
                connection.clients = {};

                connectionsHost[id] = connection;
            }

            var clientInfo = {};
            clientInfo.peerConnection = peerConnection;
            clientInfo.dataChannel = dataChannel;
            clientInfo.webRTCChannel = webRTCChannel;

            var internalId = connectionsHost[id].internalId++;
            connectionsHost[id].clients[internalId] = clientInfo;

            createOffer(peerConnection, receiver, id, internalId);

            return webRTCChannel;
        }
        else{
            showError("Cannot create peer connection");
        }
    };

    that.createDataChannelClient = function(id){
        if(that.detectedBrowser){
            var clientInfo = {};
            connectionsClient[id] = clientInfo;

            clientInfo.webRTCChannel = new WebRTCChannel();
            clientInfo.peerConnection = new that.peerConnection(that.config, that.constraints);

            clientInfo.peerConnection.ondatachannel = function(event){
                var channel = event.channel;
                hookDataChannelEvents(channel, clientInfo.webRTCChannel, id, clientInfo.peerConnection);
            };

            var events = awaitingClientConnection[id];
            if(events != undefined){
                for(var i = 0; i < events.length; i++){
                    events[i]();
                }

                delete awaitingClientConnection[id];
            }

            return clientInfo.webRTCChannel;
        }
        else{
            connectionsClient[id] = {error: 'Cannot create peer connection'};
            throw {error: "Cannot create peer connection", webRTCChannel: new WebRTCChannel()};
        }
    }

    function hookConnectionEvents(peerConnection){

    }

    function hookDataChannelEvents(dataChannel, webRTCChannel, id, peerConnection){
        dataChannel.onmessage = function(event){
            webRTCChannel.message(event.data);
        };
        dataChannel.onopen = function(event){
            webRTCChannel.connect(event.data);
        };
        dataChannel.onclose = function(event){
            if(connectionsClient[id]){
                if(peerConnection.signalingState != "closed"){
                    peerConnection.close();
                }
                delete connectionsClient[id];
            }
            if(connectionsHost[id]){
                for(var clientIndex in connectionsHost[id].clients){
                    var clientInfo = connectionsHost[id].clients[clientIndex];

                    if(clientInfo.webRTCChannel == webRTCChannel && clientInfo.peerConnection.signalingState != "closed"){
                        clientInfo.peerConnection.close();
                        delete connectionsHost[id].clients[clientIndex];

                        break;
                    }
                }

                delete connectionsClient[id];
            }
            webRTCChannel.disconnect(event.data);
        };

        webRTCChannel.createSendFunction(dataChannel.send.bind(dataChannel));
        webRTCChannel.createCloseFunction(function(){
            if(peerConnection.signalingState != "closed"){
                peerConnection.close();
            }
        });
    }

    function createOffer(peerConnection, receiver, id, hostId){
        peerConnection.createOffer(function(sessionDescription){
            peerConnection.setLocalDescription(new that.sessionDescription(sessionDescription));
            send('offer', {receiver: receiver, description: sessionDescription, id: id, hostId: hostId});
        }, function(error){
            showError(error)
        }, that.sdpConstraints);
    }

    that.onOffer = function(id, hostId, sender, sessionDescription){
        if(connectionsClient[id] == undefined){
            if(awaitingClientConnection[id] == undefined){
                awaitingClientConnection[id] = [];
            }

            awaitingClientConnection[id].push(that.onOffer.bind(that, id, hostId, sender, sessionDescription));
            return;
        }

        if(connectionsClient[id].error){
            send('error', {id: id, hostId: hostId, receiver: sender});
            return;
        }

        var peerConnection = connectionsClient[id].peerConnection;
        peerConnection.setRemoteDescription(new that.sessionDescription(sessionDescription));

        peerConnection.onicecandidate = function(event){
            if(event.candidate){
                var iceCandidate = {
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                };
                send('iceCandidate', {iceCandidate: iceCandidate, id: id, hostId: hostId, receiver: sender});
            }
        }

        createAnswer(peerConnection, sender, id, hostId);
    }

    function createAnswer(peerConnection, host, id, hostId){
        peerConnection.createAnswer(function(sessionDescription){
            peerConnection.setLocalDescription(new that.sessionDescription(sessionDescription));
            send('answer', {receiver: host, description: sessionDescription, id: id, hostId: hostId});
        }, function(error){
            showError(error)
        }, that.sdpConstraints);
    }

    that.onAnswer = function(id, hostId, sessionDescription){
        var peerConnection = connectionsHost[id].clients[hostId].peerConnection;
        peerConnection.setRemoteDescription(new that.sessionDescription(sessionDescription));
    }

    that.onIceCandidate = function(id, hostId, iceCandidate){
        if(connectionsClient[id] == undefined){
            if(awaitingClientConnection[id] == undefined){
                awaitingClientConnection[id] = [];
            }

            awaitingClientConnection[id].push(that.onIceCandidate.bind(that, id, hostId, iceCandidate));
            return;
        }

        var peerConnection = null;

        if(hostId){
            peerConnection = connectionsHost[id].clients[hostId].peerConnection;
        }
        else{
            if(connectionsClient[id].error){
                return;
            }
            peerConnection = connectionsClient[id].peerConnection;
        }

        var candidate = new that.iceCandidate({sdpMLineIndex: iceCandidate.label, candidate: iceCandidate.candidate});
        peerConnection.addIceCandidate(candidate);
    }

    that.onError = function(id, hostId, error){//errors are send only by client to host
        connectionsHost[id].clients[hostId].webRTCChannel.error(error);
    }
}