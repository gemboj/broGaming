describe('JoinRoom', function(){
    beforeEach(function(){
        var that = this;
        this.users = [];


        this.loggedusernameJoinsRoomid = function(){
            return Promise.resolve();
        };

        this.getLoggedUsersInRoomid = function(){
            return Promise.resolve(that.users);
        };

        this.sendLoggedUsersList = function(users){

        };

        spyOn(this, 'loggedusernameJoinsRoomid').and.callThrough();
        spyOn(this, 'getLoggedUsersInRoomid').and.callThrough();
        spyOn(this, 'sendLoggedUsersList');

        this.joinRoom = new JoinRoom(this.loggedusernameJoinsRoomid, this.getLoggedUsersInRoomid, this.sendLoggedUsersList);
    });

    it('joins choosed room and sends users in that room', function(done){
        var that = this;

        this.joinRoom.do('username', 2)
            .then(function(){
                expect(that.loggedusernameJoinsRoomid).toHaveBeenCalledWith('username', 2);
                expect(that.sendLoggedUsersList).toHaveBeenCalled();
                done();
            })
            .catch(function(){
                done.fail();
            });
    })

    it('joins room 0 when roomId is undefined', function(done){
        var that = this;

        this.joinRoom.do('username')
            .then(function(){
                expect(that.loggedusernameJoinsRoomid).toHaveBeenCalledWith('username', 0);
                expect(that.sendLoggedUsersList).toHaveBeenCalled();
                done();
            })
            .catch(function(){
                done.fail();
            });
    })
});