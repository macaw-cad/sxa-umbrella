(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';var b="function"==typeof Object.create?Object.create:function(a){var c=function(){};c.prototype=a;return new c},d;if("function"==typeof Object.setPrototypeOf)d=Object.setPrototypeOf;else{var e;a:{var f={a:!0},g={};try{g.__proto__=f;e=g.a;break a}catch(a){}e=!1}d=e?function(a,c){a.__proto__=c;if(a.__proto__!==c)throw new TypeError(a+" is not extensible");return a}:null}var k=d;var l=function(a,c){var h=void 0===h?null:h;var m=document.createEvent("CustomEvent");m.initCustomEvent(a,!0,!0,h);c.dispatchEvent(m)};var n=function(){return HTMLElement.call(this)||this},p=HTMLElement;n.prototype=b(p.prototype);n.prototype.constructor=n;if(k)k(n,p);else for(var q in p)if("prototype"!=q)if(Object.defineProperties){var r=Object.getOwnPropertyDescriptor(p,q);r&&Object.defineProperty(n,q,r)}else n[q]=p[q];n.prototype.connectedCallback=function(){l("attached",this)};n.prototype.disconnectedCallback=function(){l("detached",this)};customElements.define("gwd-attached",n);}).call(this);
