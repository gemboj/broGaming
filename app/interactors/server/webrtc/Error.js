function Error(send){
    var that = this;

    this.do = function(receiver, id, hostId, error){
        return send(receiver, 'error', {error: error, id: id, hostId: hostId});
    }
}