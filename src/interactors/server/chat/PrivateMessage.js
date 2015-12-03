function PrivateMessage(send, getUserByUsername){
    var that = this;

    this.do = function(sendersUsername, receiversUsername, message){
        return getUserByUsername(receiversUsername)
            .then(function(user){
                if(user === null){
                    return send(sendersUsername, 'error', 'user ' + receiversUsername +  ' does not exist')
                }

                if(!user.isLogged){
                    return send(sendersUsername, 'error', 'user ' + receiversUsername +  ' is not logged')
                }

                return send(receiversUsername, 'privateMessage', {sender: sendersUsername,  message: message});
            })

    }
}