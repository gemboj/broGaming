function Register(post, url, showRegisterMessage){
    var that = this;
    
    this.do = function(username, password, email){
        return post(url, {username: username, password: password, email: email})
            .then(function(message){
                showRegisterMessage(message);
            })
    }
}