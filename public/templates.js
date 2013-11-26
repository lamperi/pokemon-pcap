(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['pokemon'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n 	           <li>Move "
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<span class=\"value\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span></li>\n                   ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n 	           <li>Egg Move "
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<span class=\"value\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span></li>\n                   ";
  return buffer;
  }

  buffer += "        <div class=\"panel panel-default\">\n          <div class=\"panel-heading\">\n            Your Pokémon\n          </div>\n          <div class=\"panel-body\">\n             <div class=\"row\">\n               <div class=\"col-md-4\"><span class=\"title\">Species</span><span class=\"value\">";
  if (stack1 = helpers.species) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.species); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n               <div class=\"col-md-2\"><span class=\"title\">ID</span><span class=\"value\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.ot)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div>\n               <div class=\"col-md-2\"><span class=\"title\">SID</span><span class=\"value\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.ot)),stack1 == null || stack1 === false ? stack1 : stack1.secret_id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div>\n               <div class=\"col-md-4\"><span class=\"title\">Trainer Shiny Value</span><span class=\"value\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.ot)),stack1 == null || stack1 === false ? stack1 : stack1.shiny_value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div>\n             </div>\n             <div class=\"row\">\n               <div class=\"col-md-4\"><span class=\"title\">Nickname</span><span class=\"value\">";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.name); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n               <div class=\"col-md-4\"><span class=\"title\">OT Name</span><span class=\"value\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.ot)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div>\n               <div class=\"col-md-4\"><span class=\"title\">Pokémon Shiny Value</span><span class=\"value\">";
  if (stack2 = helpers.shiny_value) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.shiny_value); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n             </div>\n             <div class=\"row\">\n               <div class=\"col-md-4\"><span class=\"title\">Nature</span><span class=\"value\">";
  if (stack2 = helpers.nature_name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.nature_name); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n               <div class=\"col-md-4\"><span class=\"title\">Gender</span><span class=\"value\">";
  if (stack2 = helpers.gender_name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.gender_name); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n               <div class=\"col-md-4\"><span class=\"title\">PID</span><span class=\"value\">";
  if (stack2 = helpers.personality_value) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.personality_value); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n             </div>\n             <div class=\"row\">\n               <div class=\"col-md-4\"><span class=\"title\">Ability</span><span class=\"value\">";
  if (stack2 = helpers.ability_name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.ability_name); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n               <div class=\"col-md-4\"><span class=\"title\">Held Item</span><span class=\"value\">";
  if (stack2 = helpers.item_name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.item_name); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n               <div class=\"col-md-4\"><span class=\"title\">is Egg?</span><span class=\"value\">";
  if (stack2 = helpers.is_egg) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.is_egg); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n             </div>\n             <div class=\"row\">\n               <div class=\"col-md-4\">\n                  \n               </div>\n               <div class=\"col-md-4\">\n                 <ul>\n                   ";
  stack2 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.moves)),stack1 == null || stack1 === false ? stack1 : stack1.move_names), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                 </ul>\n               </div>\n               <div class=\"col-md-4\">\n                 <ul>\n                   ";
  stack2 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.moves)),stack1 == null || stack1 === false ? stack1 : stack1.egg_move_names), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                 </ul>\n               </div>\n             </div>\n          </div>\n        </div>\n\n\n";
  return buffer;
  });
})();