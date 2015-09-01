function Answer(send){
    var that = this;

    this.do = function(receiver, description, id, hostId){
        return send(receiver, 'answer', {sessionDescription: description, id: id, hostId: hostId});
    }
}