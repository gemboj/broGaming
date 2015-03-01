(function() {
    function DrawBoardServer(room) {
        this._room = room;
        //this.clientNickList.push(chatClient.getCurrentUser());
    }

    DrawBoardServer.prototype.startServer = function(){
        this.clientNickList = this._room.getUserNickList();
        this.clientsReady = 0;
        this._peerConnections = {};

        this.readyCheck();
    };

    DrawBoardServer.prototype.readyCheck = function () {
        for(var i = 0; i < this.clientNickList.length; i++){
            socketHandler.emit("privateMessage", {
                messageContent: "readyCheck",
                roomId: this._room.getId(),
                sender: chatClient.getCurrentUser().getNick(),
                receiver: this.clientNickList[i]
            })
        }
        /*socketHandler.emit("broadcastRoom", {
         messageContent: "readyCheck",
            roomId: this._room.getId(),
            broadcaster: chatClient.getCurrentUser().getNick,
        });*/
    };

    DrawBoardServer.prototype.onClientReady = function(clientNick){
        this.clientsReady++;
        if (this.clientsReady === this.clientNickList.length) {
            this.onAllClientsReady();
            //chatInterface.log.append("Server" + this._room.getName(), "User " + clientNick + " connected.");
        }
    };

    DrawBoardServer.prototype.onClientIncapable = function(clientNick){
        var indexOfClient = this.clientNickList.indexOf(clientNick);
        this.clientNickList = this.clientNickList.splice(indexOfClient, 1);
        delete this._peerConnections[clientNick];
        if (this.clientsReady === this.clientNickList.length) {
            this.onAllClientsReady();
            //chatInterface.log.append("Server" + this._room.getName(), "User " + clientNick + " connected.");
        }
    };

    DrawBoardServer.prototype.clientDisconnected = function(userNick){
        var indexOfClient = this.clientNickList.indexOf(userNick);
        this.clientNickList = this.clientNickList.splice(userNick, 1);
        delete this._peerConnections[clientNick];
        if (this.clientsReady === this.clientNickList.length) {
            this.onAllClientsReady();
            //chatInterface.log.append("Server" + this._room.getName(), "User " + clientNick + " connected.");
        }
    };

    DrawBoardServer.prototype.onAllClientsReady = function () {
        this.clientsReady = 0;
        for (var i = 0; i < this.clientNickList.length; i++) {
            var clientNick = this.clientNickList[i];
            var connection = webrtcAdapter.createConnection(clientNick, this._room.getId(), true);
            connection.setEventContext(this);
            connection.setOnMessage(this.onMessage);
            connection.setOnOpen(this.onOpen);
            this._peerConnections[clientNick] = connection;

        }
    };

    DrawBoardServer.prototype.onMessage = function(data){
        for(var i = 0; i < this.clientNickList.length; i++){
            this._peerConnections[this.clientNickList[i]].sendData(data.data);
        }
    };

    DrawBoardServer.prototype.onOpen = function(){
        this.clientsReady++;
        if(this.clientsReady === this.clientNickList.length){
            this.onAllOpen();
        }
    };

    DrawBoardServer.prototype.onAllOpen = function(){
        for(var i = 0; i < this.clientNickList.length; i++){
            this._peerConnections[this.clientNickList[i]].sendData("startApp");
        }
    };

    DrawBoardServer.prototype.onIceCandidate = function(iceCandidate, clientNick){
        var peerConnection = this._peerConnections[clientNick];
        peerConnection.addIceCandidate(iceCandidate);
    };

    DrawBoardServer.prototype.setRemoteDescription = function(sessionDescription, clientNick){
        var peerConnection = this._peerConnections[clientNick];
        peerConnection.setRemoteDescription(sessionDescription);
    };

    appLoader.addConstructor("drawBoardServer", DrawBoardServer);
})();