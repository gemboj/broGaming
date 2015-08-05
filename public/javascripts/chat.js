(function(window){

if(window.chat !== undefined){
	throw('windows.chat is already defined!');
}
var chat = {};

chat.useCase = function(dep1){
    this.dep1 = dep1;

    this.do = function(){
        console.log('sdfsdfsdf');
    }
}
chat.useCase2 = function(dep1){
    this.dep1 = dep1;

    this.do = function(){

    }
}
window.chat = chat;

})(window);
