(function(window){

if(window.chat !== undefined){
	throw('windows.chat is already defined!');
}
var chat = {};

chat.UseCase = function(output){
    this.output = output;

    this.do = function(data){
        //this.output(data);
        return 'blabla';
    }
}
window.chat = chat;

})(window);
