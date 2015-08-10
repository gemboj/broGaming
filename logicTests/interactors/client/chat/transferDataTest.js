xdescribe("Transfers data to useCase output", function () {
    beforeEach(function () {

        this.a = function(data){
            return data
        }

        spyOn(this, 'a');

        this.useCase = new TransferData(this.a);

        this.useCase.do('some data');
    });

    it("should call output function with given argument", function () {
        expect(this.a).toHaveBeenCalledWith('some data');
    });
});