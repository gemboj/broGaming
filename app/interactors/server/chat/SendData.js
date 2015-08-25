function SendData(getUserByUsername, send){
    var that = this;

    this.do = function(receiver, sender, data){
        return getUserByUsername(receiver).
            then(function(user){
                if(user === null){
                    send(sender, 'error', 'user: ' + receiver + ' does not exists');
                    return;
                }
                if(!user.isLogged){
                    send(sender, 'error', 'user: ' + receiver + ' is not logged in');
                    return;
                }

                send(receiver, data.type, data.data);
            });
    }
}