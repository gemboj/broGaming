describe('GameObject', function(){
    beforeEach(function(){
        this.positionSpy = {add: function(){}};

        spyOn(this.positionSpy, "add").and.callThrough();

        this.gameObject = new GameObject("someId", this.positionSpy);
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