describe('GameObject', function(){
    beforeEach(function(){
        this.position = {
            set: function(){}
        };

        spyOn(this.position, "set");

        this.gameObject = new GameObject(this.position);
    });

    it('sets position on update', function(){
        var position = {},
            data = {
                position: position
            };

        this.gameObject.deserialize(data);

        expect(this.position.set).toHaveBeenCalledWith(position);

    });
});