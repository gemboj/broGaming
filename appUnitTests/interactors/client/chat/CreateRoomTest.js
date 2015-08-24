describe('CreateRoom', function(){
    beforeEach(function(){
        this.room = {id: 0, name: 'roomName', users: []};
        var that = this;
        this.send = function(){
            return Promise.resolve(that.room);
        };

        this.addRoom = function(){

        };

        spyOn(this, 'send').and.callThrough();
        spyOn(this, 'addRoom').and.callThrough();

        this.createRoom = new CreateRoom(this.send, this.addRoom)
    });

    it('sends createRoom message', function(){
        this.createRoom.do('roomName');

        expect(this.send).toHaveBeenCalledWith('createRoom', {roomName: 'roomName'});
    });

    it('adds created room to display', function(done){
        var that = this;

        this.createRoom.do()
            .then(function(){
                expect(that.addRoom).toHaveBeenCalledWith(that.room);

                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    })
});