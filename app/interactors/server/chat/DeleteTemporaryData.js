function DeleteTemporaryData(deleteAllRooms, logoutAllUsers){

    this.do = function(){
        return deleteAllRooms()
            .then(logoutAllUsers);
    };
}