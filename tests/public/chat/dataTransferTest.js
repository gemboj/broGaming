describe("dataTransferTest", function () {
    beforeEach(function () {
        this.useCase = new UseCase(function(data){return data});
    });

    it("should store added observers", function () {


        expect(this.useCase.do('blabla')).toBe('blabla');
    });
});