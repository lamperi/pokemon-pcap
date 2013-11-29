function extend(obj) {
    var ret = {}
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            ret[key] = obj[key]
        }
    }
    return ret
}

// Helpers for Pokemon Stats ...
var helpers = {
    'Hp': function(object) {
        return object[0]
    },
    'Atk': function(object) {
        return object[1]
    },
    'Def': function(object) {
      return object[2]
    },
    'Spe': function(object) {
      return object[3]
    },
    'SpA': function(object) {
      return object[4]
    },
    'SpD': function(object) {
      return object[5]
    },
    'eachNatural': function(context, options) {
        var out = "", data
        if (Array.isArray(context)) {
            for (var i=0; i<context.length; ++i ) {
                if (options.data) {
                    data = extend(options.data)
                    data.index = i + 1
                }
                out += options.fn(context[i], { data: data })
            }
        }
        return out
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = helpers
} else {
    for (var k in helpers) {
        Handlebars.registerHelper(k, helpers[k]);
    }

}
