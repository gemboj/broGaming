describe("Data transfer simply transfers data to useCase output", function () {
    beforeEach(function () {

        this.a = function(data){
            return data
        }

        spyOn(this, 'a');

        this.useCase = new UseCase(this.a);

        this.useCase.do('some data');
    });

    it("should call output function with given parameter", function () {
        expect(this.a).toHaveBeenCalledWith('some data');
    });
});