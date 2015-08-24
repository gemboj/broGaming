xdescribe('DeleteRoomData', function(){
    beforeEach(function(){

        this.deleteRooms  = function(){

        };

        spyOn(this, 'deleteRooms');

        this.deleteRoomData = new DeleteRoomData(this.deleteRooms);
    })

    it('deletes all rooms', function(){
        this.deleteRoomData.do();

        expect(this.deleteRooms).toHaveBeenCalled();
    })
});