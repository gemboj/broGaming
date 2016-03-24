describe('GameObject', function(){
    beforeEach(function(){
        this.positionSpy = {add: function(){}, serialize: function(){return {x: 2, y: 0, z: 1}}, setPosition: function(){}};

        spyOn(this.positionSpy, "add").and.callThrough();
        spyOn(this.positionSpy, "setPosition");

        this.gameObject = new GameObject(this.positionSpy);
    });

    it('can be moved', function(){
        this.gameObject.move(1, 0, 0);

        expect(this.positionSpy.add).toHaveBeenCalledWith(1, 0, 0);
    });

    it('its position can be set', function(){
        this.gameObject.setPosition(1, 2, 0);

        expect(this.positionSpy.setPosition).toHaveBeenCalledWith(1, 2, 0);
    });

    it('can return JSON position', function(){
        var position = this.gameObject.getPosition();

        expect(position).toEqual({x: 2, y: 0, z: 1});
    });

    it('changes position every update based on time', function(){
        this.gameObject.update(100);
        expect(this.positionSpy.add).toHaveBeenCalled();

        var resultFor100ms = this.positionSpy.add.calls.mostRecent().args;

        this.gameObject.update(100);
        expect(this.positionSpy.add.calls.mostRecent().args).toEqual(resultFor100ms);

        this.gameObject.update(200);
        expect(this.positionSpy.add.calls.mostRecent().args).not.toEqual(resultFor100ms);

    })
});