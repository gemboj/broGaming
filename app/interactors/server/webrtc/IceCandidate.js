function IceCandidate(send){
    var that = this;

    this.do = function(receiver, iceCandidate, id, hostId){
        return send(receiver, 'iceCandidate', {iceCandidate: iceCandidate, id: id, hostId: hostId});
    }
}