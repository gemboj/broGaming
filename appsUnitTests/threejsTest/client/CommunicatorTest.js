describe('Communicator', function(){
    beforeEach(function(){

        this.dataChannel = {
            send: function(){},

            messageHandler: {},
            registerOnMessage: function(fun){
                this.messageHandler.onmessage = fun;
            },
            registerOnConnect: function(fun){
                this.messageHandler.onConnect = fun;
            },
            registerOnDisconnect: function(fun){
                this.messageHandler.onDisconnect = fun;
            },
            registerOnError: function(fun){
                this.messageHandler.onError = fun;
            },

            receiveMessage: function(package){
                this.messageHandler.onmessage(package);
            },
            receiveConnect: function(package){
                this.messageHandler.onConnect(package);
            },
            receiveDisconnect: function(package){
                this.messageHandler.onDisconnect(package);
            },
            receiveError: function(package){
                this.messageHandler.onError(package);
            }
        };

        this.messageHandler = {
            messageType: function(){

            },
            onConnect: function(){

            },
            onDisconnect: function(){

            },
            onError: function(){

            }
        };

        spyOn(this.dataChannel, "send");

        spyOn(this.messageHandler, "messageType");
        spyOn(this.messageHandler, "onConnect");
        spyOn(this.messageHandler, "onDisconnect");
        spyOn(this.messageHandler, "onError");

        this.communicator = new Communicator(this.dataChannel);
        this.communicator.registerMessageHandler(this.messageHandler);
    });

    it('can broadcast messages', function(){
        var data = {};
        this.communicator.send("messageType", data);

        expect(this.dataChannel.send).toHaveBeenCalledWith({data: data, type: "messageType"});
    });

    it('passes messages to messageHandler', function(){
        var data = {},
            packet = {type: "messageType", data: data};

        this.dataChannel.receiveMessage(packet);
        this.dataChannel.receiveConnect();
        this.dataChannel.receiveDisconnect();
        this.dataChannel.receiveError();

        expect(this.messageHandler.messageType).toHaveBeenCalledWith(data);
        expect(this.messageHandler.onConnect).toHaveBeenCalledWith();
        expect(this.messageHandler.onDisconnect).toHaveBeenCalledWith();
        expect(this.messageHandler.onError).toHaveBeenCalledWith();
    })

    it('responds with ack when needed before delivering message', function(){
        var data = {},
            packet = {
                type: "messageType",
                data: data,
                ack: true,
                id: 0
            };

        this.dataChannel.receiveMessage(packet);
        this.dataChannel.receiveMessage(packet);
        expect(this.messageHandler.messageType).toHaveBeenCalledWith(data);
        expect(this.dataChannel.send).toHaveBeenCalledWith({type: "ack", ackType: "messageType"});
        expect(this.dataChannel.send.calls.count()).toBe(1);
    })

});