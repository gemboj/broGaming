describe('JoinRoom', function(){
    beforeEach(function(){
        var that = this;
        this.users = [new User('username', 'a', 0, 1), new User('username2', 'a', 0, 1), new User('username3', 'a', 0, 1)];
        this.roomName = 'Main';
        this.usersNicks = ['username', 'username2', 'username3'];

        var that = this;

        this.usernameJoinsRoomid = function(username, roomid, t){
            return Promise.resolve();
        };

        this.usernameJoinsRoomidReject = function(username, roomid, t){
            return Promise.reject();
        };

        this.getRoomWithUsersById = function(roomId, t){
            return Promise.resolve(new Room(roomId, that.roomName, 0, that.users, new User('username', '', true, true)));
        };

        this.send = function(users){

        };

        this.transaction = function(func){
            return func('t');
        }



        spyOn(this, 'usernameJoinsRoomid').and.callThrough();
        spyOn(this, 'getRoomWithUsersById').and.callThrough();
        spyOn(this, 'send');


    });

    it('sends error when joinning fails', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.usernameJoinsRoomidReject, this.getRoomWithUsersById, this.send, this.transaction);

        this.joinRoom.do('username')
            .then(function(){

                done.fail();
            })
            .catch(function(){
                expect(that.send).toHaveBeenCalledWith('username', 'error', 'could not join room');

                done();
            });
    })

    it('joins choosen room', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.usernameJoinsRoomid, this.getRoomWithUsersById, this.send, this.transaction);

        this.joinRoom.do('username', 2)
            .then(function(){
                expect(that.usernameJoinsRoomid).toHaveBeenCalledWith('username', 2, 't');
                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    });


    it('joins room 0 when roomId is undefined', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.usernameJoinsRoomid, this.getRoomWithUsersById, this.send, this.transaction);

        this.joinRoom.do('username')
            .then(function(){
                expect(that.usernameJoinsRoomid).toHaveBeenCalledWith('username', 0, 't');
                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    });

    it('gets users from joined room', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.usernameJoinsRoomid, this.getRoomWithUsersById, this.send, this.transaction);

        this.joinRoom.do('username', 2)
            .then(function(){
                expect(that.getRoomWithUsersById).toHaveBeenCalledWith(2, 't');
                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    });

    it('returns usernames from joined room', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.usernameJoinsRoomid, this.getRoomWithUsersById, this.send, this.transaction);

        this.joinRoom.do('username', 2)
            .then(function(data){
                expect(data.id).toBe(2);
                expect(data.name).toBe('Main');

                for(var i = 0; i < data.usernames.lenght; ++i){
                    expect(data.usernames[i]).toBe(that.usersNicks[i]);
                }

                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    });
    
    it('broadcasts join to OTHER users in room', function(done){
    	var that = this;

        this.joinRoom = new JoinRoom(this.usernameJoinsRoomid, this.getRoomWithUsersById, this.send, this.transaction);

    	this.joinRoom.do('username', 2)
                .then(function(){
                    expect(that.send.calls.count()).toBe(2);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});