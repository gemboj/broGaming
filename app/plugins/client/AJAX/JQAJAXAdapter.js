function JQAJAXAdapter(jqAjax){
    var that = this;

    this.post = function(url, data){
        return new Promise(function(resolve, reject){
            jqAjax(url, {
                method: 'POST',
                data: data
            })
                .done(function(data){
                    resolve(data.data);
                })
        });
    }
}