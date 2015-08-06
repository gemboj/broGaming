(function(window){

if(window.chat !== undefined){
	throw('windows.chat is already defined!');
}
var chat = {};

chat.DataTransfer = function(output){
    this.output = output;

    this.do = function(data){
        this.output(data);
    }
};
window.chat = chat;

})(window);
