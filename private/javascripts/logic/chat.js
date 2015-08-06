(function(window){

if(window.chat !== undefined){
	throw('windows.chat is already defined!');
}
var chat = {};

chat.EmptyUC = function(output){

};
window.chat = chat;

})(window);
