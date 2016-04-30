describe('Communicator', function(){
    beforeEach(function(){

        this.dataChannel1 = {
            send: function(){},

            messageHandler: null,
            registerOnMessage: function(fun){
                this.messageHandler = fun;
            },
            registerOnConnect: function(fun){

            },
            registerOnDisconnect: function(fun){

            },
            registerOnError: function(fun){

            },
            receiveMessage: function(package){
                this.messageHandler(package)
            }
        };

        this.dataChannel2 = {
            send: function(){},

            messageHandler: null,
            registerOnMessage: function(fun){
                this.messageHandler = fun;
            },
            registerOnConnect: function(fun){

            },
            registerOnDisconnect: function(fun){

            },
            registerOnError: function(fun){

            },
            receiveMessage: function(package){
                this.messageHandler(package)
            }
        };

        this.messageHandler = {
            messageType: function(){}
        };

        var dataChannels = {
            receiverA: this.dataChannel1,
            receiverB: this.dataChannel2
        };

        spyOn(this.dataChannel1, "send");
        spyOn(this.dataChannel2, "send");

        spyOn(this.messageHandler, "messageType");

        this.communicator = new Communicator(dataChannels);
    });

    it('can broadcast messages', function(){
        var data = {};
        this.communicator.broadcast("messageType", data);

        expect(this.dataChannel1.send).toHaveBeenCalledWith({data: data, type: "messageType"});
        expect(this.dataChannel2.send).toHaveBeenCalledWith({data: data, type: "messageType"});
    });

    it('can broadcast messages with different data depending on receiver', function(){
        var dataFunction = function(receiver){
            return {id: receiver};
        };

        this.communicator.broadcast("messageType", dataFunction);

        expect(this.dataChannel1.send).toHaveBeenCalledWith({data: {id: "receiverA"}, type: "messageType"});
        expect(this.dataChannel2.send).toHaveBeenCalledWith({data: {id: "receiverB"}, type: "messageType"});
    });

    it('calls messageHandler function based on received message type', function(){
    	var that = this,
            data = {};

        this.communicator.registerMessageHandler(this.messageHandler);

    	this.dataChannel1.receiveMessage({
            type: "messageType",
            data: data
        });

        expect(this.messageHandler.messageType).toHaveBeenCalledWith("receiverA", data);
    });
    
    it('can broadcast data returning promise of it being delivered', function(done){
    	var that = this,
            data = {};

        this.communicator.registerMessageHandler(this.messageHandler);

        this.communicator.broadcastWithDeliverPromise("messageType", data)
            .then(function(){
                done();
            })
            .catch(function(err){
                done.fail(err);
            });

        this.dataChannel1.receiveMessage({
            type: "ack",
            ackType: "messageType",
        });

        this.dataChannel2.receiveMessage({
            type: "ack",
            ackType: "messageType",
        });
    });
});