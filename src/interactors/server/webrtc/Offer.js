function Offer(send){
    var that = this;

    this.do = function(sender, receiver, description, id, hostId){
        return send(receiver, 'offer', {sender: sender, sessionDescription: description, id: id, hostId: hostId});
    }
}