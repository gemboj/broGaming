xdescribe('creates data channel connection', function(){
    beforeEach(function(){
        this.dataChannel = {connect: function(){}};
        spyOn(this.dataChannel, 'connect');
        this.Connect = new Connect(this.dataChannel);
    });

    it('connects using given credentials', function(){
        this.Connect.do('username', 'password');
        expect(this.dataChannel.connect).toHaveBeenCalledWith('username', 'password')
    })
});