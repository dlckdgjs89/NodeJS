﻿(function(){function d(a,c){j.call(this,a,c);this.actualConfig=this.originalConfig=this.removedButtons=null;this.emptyVisible=!1;this.state="edit";this.toolbarButtons=[{text:"Toggle visibility of empty elements",group:"edit",position:"left",cssClass:"button-a-soft",clickCallback:function(a){a[a.hasClass("button-a-background")?"removeClass":"addClass"]("button-a-background");this._toggleVisibilityEmptyElements()}},{text:"Add row separator",group:"edit",position:"left",cssClass:"button-a-soft",clickCallback:function(){this._addSeparator()}},
{text:"Select config",group:"config",position:"left",cssClass:"button-a-soft",clickCallback:function(){this.configContainer.findOne("textarea").$.select()}},{text:"Back to configurator",group:"config",position:"right",cssClass:"button-a-background",clickCallback:function(){if("paste"===this.state){var a=this.configContainer.findOne("textarea").getValue();(a=d.evaluateToolbarGroupsConfig(a))?this.setConfig(a):alert("Your pasted config is wrong.")}this.state="edit";this._showConfigurationTool();this.showToolbarBtnsByGroupName(this.state)}},
{text:'Get toolbar <span class="highlight">config</span>',group:"edit",position:"right",cssClass:"button-a-background icon-pos-left icon-download",clickCallback:function(){this.state="config";this._showConfig();this.showToolbarBtnsByGroupName(this.state)}}];this.cachedActiveElement=null}var j=ToolbarConfigurator.AbstractToolbarModifier;ToolbarConfigurator.ToolbarModifier=d;d.prototype=Object.create(ToolbarConfigurator.AbstractToolbarModifier.prototype);d.prototype.getActualConfig=function(){var a=
j.prototype.getActualConfig.call(this);if(a.toolbarGroups)for(var c=a.toolbarGroups.length,b=0;b<c;b+=1)a.toolbarGroups[b]=d.parseGroupToConfigValue(a.toolbarGroups[b]);return a};d.prototype._onInit=function(a,c,b){b=!0===b;j.prototype._onInit.call(this,void 0,c);this.removedButtons=[];b?this.removedButtons=this.actualConfig.removeButtons?this.actualConfig.removeButtons.split(","):[]:"removeButtons"in this.originalConfig?this.removedButtons=this.originalConfig.removeButtons?this.originalConfig.removeButtons.split(","):
[]:(this.originalConfig.removeButtons="",this.removedButtons=[]);this.actualConfig.toolbarGroups||(this.actualConfig.toolbarGroups=this.fullToolbarEditor.getFullToolbarGroupsConfig());this._fixGroups(this.actualConfig);this._calculateTotalBtns();this._createModifier();this._refreshMoveBtnsAvalibility();this._refreshBtnTabIndexes();"function"===typeof a&&a(this.mainContainer)};d.prototype._showConfigurationTool=function(){this.configContainer.addClass("hidden");this.modifyContainer.removeClass("hidden")};
d.prototype._showConfig=function(){var a=this.getActualConfig(),c,b;if(a.toolbarGroups){c=a.toolbarGroups;for(var e=this.cfg.trimEmptyGroups,f=[],g=c.length,k=0;k<g;k++){var h=c[k];if("/"===h)f.push("'/'");else{if(e)for(var i=h.groups.length;i--;)0===d.getTotalSubGroupButtonsNumber(h.groups[i],this.fullToolbarEditor)&&h.groups.splice(i,1);e&&0===h.groups.length||f.push(j.stringifyJSONintoOneLine(h,{addSpaces:!0,noQuotesOnKey:!0,singleQuotes:!0}))}}c="\n\t\t"+f.join(",\n\t\t")}a.removeButtons&&(b=
a.removeButtons);a=["<textarea readonly>CKEDITOR.editorConfig = function( config ) {\n",c?"\tconfig.toolbarGroups = ["+c+"\n\t];":"",b?"\n\n":"",b?"\tconfig.removeButtons = '"+b+"';":"","\n};</textarea>"].join("");this.modifyContainer.addClass("hidden");this.configContainer.removeClass("hidden");this.configContainer.setHtml(a)};d.prototype._toggleVisibilityEmptyElements=function(){this.modifyContainer.hasClass("empty-visible")?(this.modifyContainer.removeClass("empty-visible"),this.emptyVisible=!1):
(this.modifyContainer.addClass("empty-visible"),this.emptyVisible=!0);this._refreshMoveBtnsAvalibility()};d.prototype._createModifier=function(){function a(){c._highlightGroup(this.data("name"))}var c=this;j.prototype._createModifier.call(this);this.modifyContainer.setHtml(this._toolbarConfigToListString());var b=this.modifyContainer.find('li[data-type="group"]');this.modifyContainer.on("mouseleave",function(){this._dehighlightActiveToolGroup()},this);for(var e=b.count(),f=0;f<e;f+=1)b.getItem(f).on("mouseenter",
a);CKEDITOR.document.on("keypress",function(a){var a=a.data.$.keyCode,a=32===a||13===a,b=new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);b.getAscendant(function(a){return a.$===c.mainContainer.$})&&a&&"button"===b.data("type")&&b.findOne("input").$.click()});this.modifyContainer.on("click",function(a){var b=a.data.$,e=new CKEDITOR.dom.element(b.target||b.srcElement);if(a=d.getGroupOrSeparatorLiAncestor(e)){c.cachedActiveElement=document.activeElement;if(e.$ instanceof HTMLInputElement)c._handleCheckboxClicked(e);
else if(e.$ instanceof HTMLButtonElement&&(b.preventDefault?b.preventDefault():b.returnValue=!1,(b=c._handleAnchorClicked(e.$))&&"remove"==b.action))return;b=a.data("type");a=a.data("name");c._setActiveElement(b,a);c.cachedActiveElement&&c.cachedActiveElement.focus()}});this.toolbarContainer||(this._createToolbar(),this.toolbarContainer.insertBefore(this.mainContainer.getChildren().getItem(0)));this.showToolbarBtnsByGroupName("edit");this.configContainer||(this.configContainer=new CKEDITOR.dom.element("div"),
this.configContainer.addClass("configContainer"),this.configContainer.addClass("hidden"),this.mainContainer.append(this.configContainer));return this.mainContainer};d.prototype.showToolbarBtnsByGroupName=function(a){if(this.toolbarContainer)for(var c=this.toolbarContainer.find("button"),b=c.count(),e=0;e<b;e+=1){var d=c.getItem(e);d.data("group")==a?d.removeClass("hidden"):d.addClass("hidden")}};d.parseGroupToConfigValue=function(a){if("separator"==a.type)return"/";var c=a.groups,b=c.length;delete a.totalBtns;
for(var e=0;e<b;e+=1)c[e]=c[e].name;return a};d.getGroupOrSeparatorLiAncestor=function(a){return a.$ instanceof HTMLLIElement&&"group"==a.data("type")?a:d.getFirstAncestor(a,function(a){a=a.data("type");return"group"==a||"separator"==a})};d.prototype._setActiveElement=function(a,c){this.currentActive&&this.currentActive.elem.removeClass("active");if(null===a)this._dehighlightActiveToolGroup(),this.currentActive=null;else{var b=this.mainContainer.findOne('ul[data-type=table-body] li[data-type="'+a+
'"][data-name="'+c+'"]');b.addClass("active");this.currentActive={type:a,name:c,elem:b};"group"==a&&this._highlightGroup(c);"separator"==a&&this._dehighlightActiveToolGroup()}};d.prototype.getActiveToolGroup=function(){return this.editorInstance.container?this.editorInstance.container.findOne(".cke_toolgroup.active, .cke_toolbar.active"):null};d.prototype._dehighlightActiveToolGroup=function(){var a=this.getActiveToolGroup();a&&a.removeClass("active");this.editorInstance.container&&this.editorInstance.container.removeClass("some-toolbar-active")};
d.prototype._highlightGroup=function(a){this.editorInstance.container&&(a=this.getFirstEnabledButtonInGroup(a),a=this.editorInstance.container.findOne(".cke_button__"+a+", .cke_combo__"+a),this._dehighlightActiveToolGroup(),this.editorInstance.container&&this.editorInstance.container.addClass("some-toolbar-active"),a&&(a=d.getFirstAncestor(a,function(a){return a.hasClass("cke_toolbar")}))&&a.addClass("active"))};d.prototype.getFirstEnabledButtonInGroup=function(a){var c=this.actualConfig.toolbarGroups,
a=this.getGroupIndex(a),c=c[a];if(-1===a)return null;for(var a=c.groups?c.groups.length:0,b=0;b<a;b+=1){var e=this.getFirstEnabledButtonInSubgroup(c.groups[b].name);if(e)return e}return null};d.prototype.getFirstEnabledButtonInSubgroup=function(a){for(var c=(a=this.fullToolbarEditor.buttonsByGroup[a])?a.length:0,b=0;b<c;b+=1){var e=a[b].name;if(!this.isButtonRemoved(e))return e}return null};d.prototype._handleCheckboxClicked=function(a){var c=a.getAscendant("li").data("name");a.$.checked?this._removeButtonFromRemoved(c):
this._addButtonToRemoved(c)};d.prototype._handleAnchorClicked=function(a){var a=new CKEDITOR.dom.element(a),c=a.getAscendant("li"),b=c.getAscendant("ul"),e=c.data("type"),d=c.data("name"),g=a.data("direction"),k="up"===g?c.getPrevious():c.getNext(),h;if(a.hasClass("disabled"))return null;if(a.hasClass("remove"))return c.remove(),this._removeSeparator(c.data("name")),this._setActiveElement(null),{action:"remove"};if(!a.hasClass("move")||!k)return{action:null};if("group"===e||"separator"===e)h=this._moveGroup(g,
d);"subgroup"===e&&(h=c.getAscendant("li").data("name"),h=this._moveSubgroup(g,h,d));"up"===g&&c.insertBefore(b.getChild(h));"down"===g&&c.insertAfter(b.getChild(h));for(var i;c="up"===g?c.getPrevious():c.getNext();)if(this.emptyVisible||!c.hasClass("empty")){i=c;break}i||(this.cachedActiveElement=a.getParent().findOne('[data-direction="'+("up"===g?"down":"up")+'"]'));this._refreshMoveBtnsAvalibility();this._refreshBtnTabIndexes();return{action:"move"}};d.prototype._refreshMoveBtnsAvalibility=function(){function a(a){var b=
a.count();for(d=0;d<b;d+=1)c._disableElementsInList(a.getItem(d))}for(var c=this,b=this.mainContainer.find("ul[data-type=table-body] li > p > span > button.move.disabled"),e=b.count(),d=0;d<e;d+=1)b.getItem(d).removeClass("disabled");a(this.mainContainer.find("ul[data-type=table-body]"));a(this.mainContainer.find("ul[data-type=table-body] > li > ul"))};d.prototype._refreshBtnTabIndexes=function(){for(var a=this.mainContainer.find('[data-tab="true"]'),c=a.count(),b=0;b<c;b++){var e=a.getItem(b),d=
e.hasClass("disabled");e.setAttribute("tabindex",d?-1:b)}};d.prototype._disableElementsInList=function(a){function c(a){return!a.hasClass("empty")}if(a.getChildren().count()){var b;this.emptyVisible?(b=a.getFirst(),a=a.getLast()):(b=a.getFirst(c),a=a.getLast(c));if(b)var e=b.findOne('p button[data-direction="up"]');if(a)var d=a.findOne('p button[data-direction="down"]');e&&(e.addClass("disabled"),e.setAttribute("tabindex","-1"));d&&(d.addClass("disabled"),d.setAttribute("tabindex","-1"))}};d.prototype.getGroupIndex=
function(a){for(var c=this.actualConfig.toolbarGroups,b=c.length,d=0;d<b;d+=1)if(c[d].name===a)return d;return-1};d.prototype._addSeparator=function(){var a=this._determineSeparatorToAddIndex(),c=d.createSeparatorLiteral(),b=CKEDITOR.dom.element.createFromHtml(d.getToolbarSeparatorString(c));this.actualConfig.toolbarGroups.splice(a,0,c);b.insertBefore(this.modifyContainer.findOne("ul[data-type=table-body]").getChild(a));this._setActiveElement("separator",c.name);this._refreshMoveBtnsAvalibility();
this._refreshBtnTabIndexes();this._refreshEditor()};d.prototype._removeSeparator=function(a){this.actualConfig.toolbarGroups.splice(CKEDITOR.tools.indexOf(this.actualConfig.toolbarGroups,function(c){return"separator"==c.type&&c.name==a}),1);this._refreshMoveBtnsAvalibility();this._refreshBtnTabIndexes();this._refreshEditor()};d.prototype._determineSeparatorToAddIndex=function(){return!this.currentActive?0:("group"==this.currentActive.elem.data("type")||"separator"==this.currentActive.elem.data("type")?
this.currentActive.elem:this.currentActive.elem.getAscendant("li")).getIndex()};d.prototype._moveElement=function(a,c,b){function e(a){return a.totalBtns||"separator"==a.type}b=this.emptyVisible?"down"==b?c+1:c-1:d.getFirstElementIndexWith(a,c,b,e);return d.moveTo(b-c,a,c)};d.prototype._moveGroup=function(a,c){var b=this._moveElement(this.actualConfig.toolbarGroups,this.getGroupIndex(c),a);this._refreshMoveBtnsAvalibility();this._refreshBtnTabIndexes();this._refreshEditor();return b};d.prototype._moveSubgroup=
function(a,c,b){var c=this.actualConfig.toolbarGroups[this.getGroupIndex(c)],d=CKEDITOR.tools.indexOf(c.groups,function(a){return a.name==b}),a=this._moveElement(c.groups,d,a);this._refreshEditor();return a};d.prototype._calculateTotalBtns=function(){for(var a=this.actualConfig.toolbarGroups,c=a.length;c--;){var b=a[c],e=d.getTotalGroupButtonsNumber(b,this.fullToolbarEditor);"separator"!=b.type&&(b.totalBtns=e)}};d.prototype._addButtonToRemoved=function(a){if(-1!=CKEDITOR.tools.indexOf(this.removedButtons,
a))throw"Button already added to removed";this.removedButtons.push(a);this.actualConfig.removeButtons=this.removedButtons.join(",");this._refreshEditor()};d.prototype._removeButtonFromRemoved=function(a){a=CKEDITOR.tools.indexOf(this.removedButtons,a);if(-1===a)throw"Trying to remove button from removed, but not found";this.removedButtons.splice(a,1);this.actualConfig.removeButtons=this.removedButtons.join(",");this._refreshEditor()};d.parseGroupToConfigValue=function(a){if("separator"==a.type)return"/";
var c=a.groups,b=c.length;delete a.totalBtns;for(var d=0;d<b;d+=1)c[d]=c[d].name;return a};d.getGroupOrSeparatorLiAncestor=function(a){return a.$ instanceof HTMLLIElement&&"group"==a.data("type")?a:d.getFirstAncestor(a,function(a){a=a.data("type");return"group"==a||"separator"==a})};d.createSeparatorLiteral=function(){return{type:"separator",name:"separator"+CKEDITOR.tools.getNextNumber()}};d.prototype._toolbarConfigToListString=function(){for(var a=this.actualConfig.toolbarGroups||[],c='<ul data-type="table-body">',
b=a.length,e=0;e<b;e+=1)var f=a[e],c="separator"===f.type?c+d.getToolbarSeparatorString(f):c+this._getToolbarGroupString(f);return d.getToolbarHeaderString()+(c+"</ul>")};d.prototype._getToolbarGroupString=function(a){var c=a.groups,b;b=""+['<li data-type="group" data-name="',a.name,'" ',a.totalBtns?"":'class="empty"',">"].join("");b+=d.getToolbarElementPreString(a)+"<ul>";for(var a=c.length,e=0;e<a;e+=1){var f=c[e];b+=this._getToolbarSubgroupString(f,this.fullToolbarEditor.buttonsByGroup[f.name])}return b+
"</ul></li>"};d.getToolbarSeparatorString=function(a){return['<li data-type="',a.type,'" data-name="',a.name,'">',d.getToolbarElementPreString("row separator"),"</li>"].join("")};d.getToolbarHeaderString=function(){return'<ul data-type="table-header"><li data-type="header"><p>Toolbars</p><ul><li><p>Toolbar groups</p><p>Toolbar group items</p></li></ul></li></ul>'};d.getFirstAncestor=function(a,c){for(var b=a.getParents(),d=b.length;d--;)if(c(b[d]))return b[d];return null};d.getFirstElementIndexWith=
function(a,c,b,d){for(;"up"===b?c--:++c<a.length;)if(d(a[c]))return c;return-1};d.moveTo=function(a,c,b){var d;-1!==b&&(d=c.splice(b,1)[0]);a=b+a;c.splice(a,0,d);return a};d.getTotalSubGroupButtonsNumber=function(a,c){var b=c.buttonsByGroup["string"==typeof a?a:a.name];return b?b.length:0};d.getTotalGroupButtonsNumber=function(a,c){for(var b=0,e=a.groups,f=e?e.length:0,g=0;g<f;g+=1)b+=d.getTotalSubGroupButtonsNumber(e[g],c);return b};d.prototype._getToolbarSubgroupString=function(a,c){var b;b=""+
['<li data-type="subgroup" data-name="',a.name,'" ',a.totalBtns?"":'class="empty" ',">"].join("");b+=d.getToolbarElementPreString(a.name);b+="<ul>";for(var e=c?c.length:0,f=0;f<e;f+=1)b+=this.getButtonString(c[f]);return b+"</ul></li>"};d.prototype._getConfigButtonName=function(a){var c=this.fullToolbarEditor.editorInstance.ui.items,b;for(b in c)if(c[b].name==a)return b;return null};d.prototype.isButtonRemoved=function(a){return-1!=CKEDITOR.tools.indexOf(this.removedButtons,this._getConfigButtonName(a))};
d.prototype.getButtonString=function(a){var c=this.isButtonRemoved(a.name)?"":'checked="checked"';return['<li data-tab="true" data-type="button" data-name="',this._getConfigButtonName(a.name),'"><label title="',a.label,'" ><input tabindex="-1"type="checkbox"',c,"/>",a.$.getOuterHtml(),"</label></li>"].join("")};d.getToolbarElementPreString=function(a){a=a.name?a.name:a;return['<p><span><button title="Move element upward" data-tab="true" data-direction="up" class="move icon-up-big"></button><button title="Move element downward" data-tab="true" data-direction="down" class="move icon-down-big"></button>',
"row separator"==a?'<button title="Remove element" data-tab="true" class="remove icon-trash"></button>':"",a,"</span></p>"].join("")};d.evaluateToolbarGroupsConfig=function(a){return a=function(a){var b={},d;try{d=eval("("+a+")")}catch(f){try{d=eval(a)}catch(g){return null}}return b.toolbarGroups&&"number"===typeof b.toolbarGroups.length?JSON.stringify(b):d&&"number"===typeof d.length?JSON.stringify({toolbarGroups:d}):d&&d.toolbarGroups?JSON.stringify(d):null}(a)};return d})();
