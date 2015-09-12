function MessageLogController(scope, messageLogService){
    Controller.call(this, scope);
    var that = this;

    scope.getMessageLog = messageLogService.getMessageLog;

    scope.showInfo = messageLogService.showInfo;
}