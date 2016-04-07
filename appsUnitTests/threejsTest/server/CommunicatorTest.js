describe('Communicator', function(){
    beforeEach(function(){

        this.dataChannel1 = {
            send: function(){}
        };

        this.dataChannel2 = {
            send: function(){}
        };

        this.messageHandler = {
            onConnect: function(){

            },
            onDisconnect: function(){

            }
        };

        var dataChannels = {
            receiverA: this.dataChannel1,
            receiverB: this.dataChannel2
        };

        spyOn(this.dataChannel1, "send");
        spyOn(this.dataChannel2, "send");

        this.communicator = new Communicator(dataChannels);
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
});