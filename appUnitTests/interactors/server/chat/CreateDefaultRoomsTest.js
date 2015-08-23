describe('CreateDefaultRooms', function(){
    beforeEach(function(){
        this.insertRoom = function(room){
            if(room.deletable){
                return Promise.reject('room ' + room.id + ' is deletable');
            }

            return Promise.resolve();
        };

        this.getNextRoomId = function(){
            return Promise.resolve(0);
        };

        spyOn(this, 'insertRoom').and.callThrough();
        spyOn(this, 'getNextRoomId').and.callThrough();

        this.createRooms = new CreateDefaultRooms(this.insertRoom, this.getNextRoomId);
    });

    it('creates non deletable rooms, at least 1', function(done){
        var that = this;

        this.createRooms.do()
            .then(function(){
                expect(that.insertRoom.calls.count()).toBeGreaterThan(0);
                expect(that.getNextRoomId.calls.count()).toBe(that.insertRoom.calls.count());
                done();
            })
            .catch(function(err){
                done.fail(err);
            })


    });

    it('accepts array of room names', function(done){
        var that = this;

        this.createRooms.do(['Main1', 'Main2', 'Main3'])
            .then(function(){
                expect(that.insertRoom.calls.count()).toBeGreaterThan(2);
                expect(that.getNextRoomId.calls.count()).toBe(that.insertRoom.calls.count());
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    })
});