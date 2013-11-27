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
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = helpers
} else {
    for (var k in helpers) {
        Handlebars.registerHelper(k, helpers[k]);
    }

}
