describe('Communicator', function(){
    beforeEach(function(){

        this.dataChannel1 = {
            send: function(){},

            messageHandler: null,
            registerOnMessage: function(fun){
                this.messageHandler = fun;
            },
            receiveMessage: function(package){
                this.messageHandler(package)
            }
        };

        this.dataChannel2 = {
            send: function(){},
            registerOnMessage: function(fun){}
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

        this.communicator = new Communicator(dataChannels, this.messageHandler);
    });

    it('can broadcast messages', function(){
        var data = {};
        this.communicator.broadcast(data, "messageType");

        expect(this.dataChannel1.send).toHaveBeenCalledWith({data: data, messageType: "messageType"});
        expect(this.dataChannel2.send).toHaveBeenCalledWith({data: data, messageType: "messageType"});
    });

    it('can broadcast messages with different data depending on receiver', function(){
        var dataFunction = function(receiver){
            return {id: receiver};
        };

        this.communicator.broadcast(dataFunction, "messageType");

        expect(this.dataChannel1.send).toHaveBeenCalledWith({data: {id: "receiverA"}, messageType: "messageType"});
        expect(this.dataChannel2.send).toHaveBeenCalledWith({data: {id: "receiverB"}, messageType: "messageType"});
    });

    it('calls messageHandler function based on received message type', function(){
    	var that = this,
            data = {};

    	this.dataChannel1.receiveMessage({
            messageType: "messageType",
            data: data
        })

        expect(this.messageHandler.messageType).toHaveBeenCalledWith("receiverA", data);
    });
});