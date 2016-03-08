function ActivateAccount(getUserByActivationLink, markAsActiveUserByUsername){
    var that = this;
    
    this.do = function(link){
        return getUserByActivationLink(link)
            .then(function(user){
                if(user !== null){
                    return markAsActiveUserByUsername(user.username);
                }

                throw 'wrong link';
            })
    }
}