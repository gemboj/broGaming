function ValidateError(fields){
    var that = this;
    for(var i = 0; i < fields.length; ++i){
        that[fields[i]] = {};
    }
}

ValidateError.prototype = {
    getError: function(field){
        if(field !== undefined){
            if(this.hasOwnProperty(field)){
                for(var error in this[field]){
                    return this[field][error];
                }
            }

        }
        else{
            for(var field in this){
                if(this.hasOwnProperty(field)){
                    for(var error in this[field]){
                        return this[field][error];
                    }
                }
            }
        }
        return '';
    },
    
    addProperty: function(prop){
        this[prop] = {};
    },

    addProperties: function(arrayOfProperties){
        for(var i = 0; i < arrayOfProperties.length; ++i){
            this.addProperty(arrayOfProperties[i]);
        }
    }
}