function VerifyConnection(authenticateUser, login){
    var that = this;
    
    that.do = function (input) {//username
        return authenticateUser(input)
            .then(function () {
                return login(input);
            })
    }
}