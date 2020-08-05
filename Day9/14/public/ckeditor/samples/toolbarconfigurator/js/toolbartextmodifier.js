﻿(function(){function e(a){k.call(this,a);this.hintContainer=this.codeContainer=null}var k=ToolbarConfigurator.AbstractToolbarModifier,h=ToolbarConfigurator.FullToolbarEditor;ToolbarConfigurator.ToolbarTextModifier=e;e.prototype=Object.create(k.prototype);e.prototype._onInit=function(a,c){k.prototype._onInit.call(this,void 0,c);this._createModifier(c?this.actualConfig:void 0);"function"===typeof a&&a(this.mainContainer)};e.prototype._createModifier=function(a){function c(a){var b=f(a),c=e.getUnusedButtonsArray(e.actualConfig.toolbar,
!0,b.charsBetween),g=a.getCursor(),b=CodeMirror.Pos(g.line,g.ch-b.charsBetween.length),n=a.getTokenAt(g);"{"===a.getTokenAt({line:g.line,ch:n.start}).string&&(c=["name"]);if(0!==c.length)return new d(b,g,c)}function d(a,b,c){this.from=a;this.to=b;this.list=c;this._handlers=[]}function b(a){return function(b){return g(b,function(){return f(b,a).closestSpecialChar!==a},a)}}function f(a,b){var c={};c.cur=a.getCursor();c.tok=a.getTokenAt(c.cur);c["char"]=b||c.tok.string.charAt(c.tok.string.length-1);
var d=a.getRange(CodeMirror.Pos(c.cur.line,0),c.cur),f=d.split("").reverse().join("").search(/"|'|\{|\}|\[|\]|,|\:/),f=-1==f?-1:d.length-1-f;c.closestSpecialChar=d.charAt(f);c.charsBetween=d.substring(f+1,c.cur.ch);return c}function g(a,b,d){("function"===typeof b?b(a,d):1)&&setTimeout(function(){a.state.completionActive||CodeMirror.showHint(a,c,{hintsClass:"toolbar-modifier",completeSingle:!1})},100);return CodeMirror.Pass}var e=this;this._createToolbar();this.toolbarContainer&&this.mainContainer.append(this.toolbarContainer);
k.prototype._createModifier.call(this);this._setupActualConfig(a);var a=this.actualConfig.toolbar,a=CKEDITOR.tools.isArray(a)?"\tconfig.toolbar = "+("[\n\t\t"+h.map(a,function(a){return k.stringifyJSONintoOneLine(a,{addSpaces:!0,noQuotesOnKey:!0,singleQuotes:!0})}).join(",\n\t\t")+"\n\t]")+";":"config.toolbar = [];",a=["CKEDITOR.editorConfig = function( config ) {\n",a,"\n};"].join(""),i=new CKEDITOR.dom.element("div");i.addClass("codemirror-wrapper");this.modifyContainer.append(i);this.codeContainer=
CodeMirror(i.$,{mode:{name:"javascript",json:!0},lineNumbers:!1,lineWrapping:!0,viewportMargin:Infinity,value:a,smartIndent:!1,indentWithTabs:!0,theme:"neo",extraKeys:{"Ctrl-Space":g,"'''":b("'"),"'\"'":b('"'),Backspace:b('"'),Delete:b('"'),Tab:!1,"Shift-Tab":!1}});this.codeContainer.on("endCompletion",function(a,b){var c=f(a);void 0!==b&&a.replaceSelection(c.closestSpecialChar)});this.codeContainer.on("change",function(){var a=e.codeContainer.getValue(),a=e._evaluateValue(a);null!==a?(e.actualConfig.toolbar=
a.toolbar?a.toolbar:e.actualConfig.toolbar,e._fillHintByUnusedElements(),e._refreshEditor(),e.mainContainer.removeClass("invalid")):e.mainContainer.addClass("invalid")});this.hintContainer=new CKEDITOR.dom.element("div");this.hintContainer.addClass("toolbarModifier-hints");this._fillHintByUnusedElements();this.hintContainer.insertBefore(i)};e.prototype._fillHintByUnusedElements=function(){var a=this.getUnusedButtonsArray(this.actualConfig.toolbar,!0),a=this.groupButtonNamesByGroup(a),c=h.map(a,function(a){var c=
h.map(a.buttons,function(a){return"<code>"+a+"</code> "}).join("");return["<dt><code>",a.name,"</code></dt><dd>",c,"</dd>"].join("")}).join(" "),d='<dt class="list-header">Toolbar group</dt><dd class="list-header">Unused items</dd>';a.length||(d="<p>All items are in use.</p>");this.codeContainer.refresh();this.hintContainer.setHtml("<h3>Unused toolbar items</h3><dl>"+d+c+"</dl>")};e.prototype.getToolbarGroupByButtonName=function(a){var c=this.fullToolbarEditor.buttonNamesByGroup,d;for(d in c)for(var b=
c[d],f=b.length;f--;)if(a===b[f])return d;return null};e.prototype.getUnusedButtonsArray=function(a,c,d){var c=!0===c?!0:!1,b=e.mapToolbarCfgToElementsList(a),a=Object.keys(this.fullToolbarEditor.editorInstance.ui.items),a=h.filter(a,function(a){var b="-"===a,a=void 0===d||0===a.toLowerCase().indexOf(d.toLowerCase());return!b&&a}),a=h.filter(a,function(a){return-1==CKEDITOR.tools.indexOf(b,a)});c&&a.sort();return a};e.prototype.groupButtonNamesByGroup=function(a){var c=[],d=JSON.parse(JSON.stringify(this.fullToolbarEditor.buttonNamesByGroup)),
b;for(b in d){var f=d[b],f=h.filter(f,function(b){return-1!==CKEDITOR.tools.indexOf(a,b)});f.length&&c.push({name:b,buttons:f})}return c};e.mapToolbarCfgToElementsList=function(a){function c(a){return"-"!==a}for(var d=[],b=a.length,f=0;f<b;f+=1)a[f]&&"string"!==typeof a[f]&&(d=d.concat(h.filter(a[f].items,c)));return d};e.prototype._setupActualConfig=function(a){a=a||this.editorInstance.config;CKEDITOR.tools.isArray(a.toolbar)||(a.toolbarGroups||(a.toolbarGroups=this.fullToolbarEditor.getFullToolbarGroupsConfig(!0)),
this._fixGroups(a),a.toolbar=this._mapToolbarGroupsToToolbar(a.toolbarGroups),this.actualConfig.toolbar=a.toolbar,this.actualConfig.removeButtons="")};e.prototype._mapToolbarGroupsToToolbar=function(a,c){for(var c=c||this.editorInstance.config.removedBtns,c="string"==typeof c?c.split(","):[],d=a.length;d--;){var b=this._mapToolbarSubgroup(a[d],c);"separator"===a[d].type?a[d]="/":CKEDITOR.tools.isArray(b)&&0===b.length?a.splice(d,1):a[d]="string"==typeof b?b:{name:a[d].name,items:b}}return a};e.prototype._mapToolbarSubgroup=
function(a,c){if("string"==typeof a)return a;for(var d=a.groups?a.groups.length:0,b=[],f=0;f<d;f+=1){var e=a.groups[f],e=this.fullToolbarEditor.buttonsByGroup["string"===typeof e?e:e.name]||[],e=this._mapButtonsToButtonsNames(e,c),h=e.length,b=b.concat(e);h&&b.push("-")}"-"==b[b.length-1]&&b.pop();return b};e.prototype._mapButtonsToButtonsNames=function(a,c){for(var d=a.length;d--;){var b=a[d],b="string"===typeof b?b:this.fullToolbarEditor.getCamelCasedButtonName(b.name);-1!==CKEDITOR.tools.indexOf(c,
b)?a.splice(d,1):a[d]=b}return a};e.prototype._evaluateValue=function(a){var c;try{var d={};Function("var CKEDITOR = {}; "+a+"; return CKEDITOR;")().editorConfig(d);c=d;for(var b=c.toolbar.length;b--;)c.toolbar[b]||c.toolbar.splice(b,1)}catch(e){c=null}return c};e.prototype.mapToolbarToToolbarGroups=function(a){function c(a,b){for(var a=a.slice(),c=b.length;c--;){var d=a.indexOf(b[c]);-1!==d&&a.splice(d,1)}return a}for(var d={},b=[],e=[],b=a.length,g=0;g<b;g++)if("/"===a[g])e.push("/");else{var h=
a[g].items,i={};i.name=a[g].name;i.groups=[];for(var k=h.length,m=0;m<k;m++){var l=h[m];if("-"!==l){var j=this.getToolbarGroupByButtonName(l);-1===i.groups.indexOf(j)&&i.groups.push(j);d[j]=d[j]||{};j=d[j].buttons=d[j].buttons||{};j[l]=j[l]||{used:0,origin:i.name};j[l].used++}}e.push(i)}b=function(a,b){var d=[],e;for(e in a)var f=a[e],g=b[e].slice(),d=d.concat(c(g,Object.keys(f.buttons)));return d}(d,this.fullToolbarEditor.buttonNamesByGroup);return{toolbarGroups:e,removeButtons:b.join(",")}};return e})();
