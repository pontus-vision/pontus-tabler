function oh(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const o in r)if(o!=="default"&&!(o in e)){const a=Object.getOwnPropertyDescriptor(r,o);a&&Object.defineProperty(e,o,a.get?a:{enumerable:!0,get:()=>r[o]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();function ah(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Jo={},ih={get exports(){return Jo},set exports(e){Jo=e}},Aa={},j={},sh={get exports(){return j},set exports(e){j=e}},A={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var io=Symbol.for("react.element"),uh=Symbol.for("react.portal"),lh=Symbol.for("react.fragment"),ch=Symbol.for("react.strict_mode"),dh=Symbol.for("react.profiler"),fh=Symbol.for("react.provider"),ph=Symbol.for("react.context"),mh=Symbol.for("react.forward_ref"),hh=Symbol.for("react.suspense"),gh=Symbol.for("react.memo"),vh=Symbol.for("react.lazy"),zl=Symbol.iterator;function yh(e){return e===null||typeof e!="object"?null:(e=zl&&e[zl]||e["@@iterator"],typeof e=="function"?e:null)}var af={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},sf=Object.assign,uf={};function ur(e,t,n){this.props=e,this.context=t,this.refs=uf,this.updater=n||af}ur.prototype.isReactComponent={};ur.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};ur.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function lf(){}lf.prototype=ur.prototype;function Eu(e,t,n){this.props=e,this.context=t,this.refs=uf,this.updater=n||af}var Du=Eu.prototype=new lf;Du.constructor=Eu;sf(Du,ur.prototype);Du.isPureReactComponent=!0;var ql=Array.isArray,cf=Object.prototype.hasOwnProperty,wu={current:null},df={key:!0,ref:!0,__self:!0,__source:!0};function ff(e,t,n){var r,o={},a=null,i=null;if(t!=null)for(r in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(a=""+t.key),t)cf.call(t,r)&&!df.hasOwnProperty(r)&&(o[r]=t[r]);var s=arguments.length-2;if(s===1)o.children=n;else if(1<s){for(var u=Array(s),l=0;l<s;l++)u[l]=arguments[l+2];o.children=u}if(e&&e.defaultProps)for(r in s=e.defaultProps,s)o[r]===void 0&&(o[r]=s[r]);return{$$typeof:io,type:e,key:a,ref:i,props:o,_owner:wu.current}}function Ph(e,t){return{$$typeof:io,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Cu(e){return typeof e=="object"&&e!==null&&e.$$typeof===io}function Sh(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Hl=/\/+/g;function Ni(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Sh(""+e.key):t.toString(36)}function xo(e,t,n,r,o){var a=typeof e;(a==="undefined"||a==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(a){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case io:case uh:i=!0}}if(i)return i=e,o=o(i),e=r===""?"."+Ni(i,0):r,ql(o)?(n="",e!=null&&(n=e.replace(Hl,"$&/")+"/"),xo(o,t,n,"",function(l){return l})):o!=null&&(Cu(o)&&(o=Ph(o,n+(!o.key||i&&i.key===o.key?"":(""+o.key).replace(Hl,"$&/")+"/")+e)),t.push(o)),1;if(i=0,r=r===""?".":r+":",ql(e))for(var s=0;s<e.length;s++){a=e[s];var u=r+Ni(a,s);i+=xo(a,t,n,u,o)}else if(u=yh(e),typeof u=="function")for(e=u.call(e),s=0;!(a=e.next()).done;)a=a.value,u=r+Ni(a,s++),i+=xo(a,t,n,u,o);else if(a==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function go(e,t,n){if(e==null)return e;var r=[],o=0;return xo(e,r,"","",function(a){return t.call(n,a,o++)}),r}function Oh(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Pe={current:null},ko={transition:null},bh={ReactCurrentDispatcher:Pe,ReactCurrentBatchConfig:ko,ReactCurrentOwner:wu};A.Children={map:go,forEach:function(e,t,n){go(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return go(e,function(){t++}),t},toArray:function(e){return go(e,function(t){return t})||[]},only:function(e){if(!Cu(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};A.Component=ur;A.Fragment=lh;A.Profiler=dh;A.PureComponent=Eu;A.StrictMode=ch;A.Suspense=hh;A.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=bh;A.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=sf({},e.props),o=e.key,a=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(a=t.ref,i=wu.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(u in t)cf.call(t,u)&&!df.hasOwnProperty(u)&&(r[u]=t[u]===void 0&&s!==void 0?s[u]:t[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){s=Array(u);for(var l=0;l<u;l++)s[l]=arguments[l+2];r.children=s}return{$$typeof:io,type:e.type,key:o,ref:a,props:r,_owner:i}};A.createContext=function(e){return e={$$typeof:ph,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:fh,_context:e},e.Consumer=e};A.createElement=ff;A.createFactory=function(e){var t=ff.bind(null,e);return t.type=e,t};A.createRef=function(){return{current:null}};A.forwardRef=function(e){return{$$typeof:mh,render:e}};A.isValidElement=Cu;A.lazy=function(e){return{$$typeof:vh,_payload:{_status:-1,_result:e},_init:Oh}};A.memo=function(e,t){return{$$typeof:gh,type:e,compare:t===void 0?null:t}};A.startTransition=function(e){var t=ko.transition;ko.transition={};try{e()}finally{ko.transition=t}};A.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")};A.useCallback=function(e,t){return Pe.current.useCallback(e,t)};A.useContext=function(e){return Pe.current.useContext(e)};A.useDebugValue=function(){};A.useDeferredValue=function(e){return Pe.current.useDeferredValue(e)};A.useEffect=function(e,t){return Pe.current.useEffect(e,t)};A.useId=function(){return Pe.current.useId()};A.useImperativeHandle=function(e,t,n){return Pe.current.useImperativeHandle(e,t,n)};A.useInsertionEffect=function(e,t){return Pe.current.useInsertionEffect(e,t)};A.useLayoutEffect=function(e,t){return Pe.current.useLayoutEffect(e,t)};A.useMemo=function(e,t){return Pe.current.useMemo(e,t)};A.useReducer=function(e,t,n){return Pe.current.useReducer(e,t,n)};A.useRef=function(e){return Pe.current.useRef(e)};A.useState=function(e){return Pe.current.useState(e)};A.useSyncExternalStore=function(e,t,n){return Pe.current.useSyncExternalStore(e,t,n)};A.useTransition=function(){return Pe.current.useTransition()};A.version="18.2.0";(function(e){e.exports=A})(sh);const Nu=ah(j),ms=oh({__proto__:null,default:Nu},[j]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Eh=j,Dh=Symbol.for("react.element"),wh=Symbol.for("react.fragment"),Ch=Object.prototype.hasOwnProperty,Nh=Eh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ih={key:!0,ref:!0,__self:!0,__source:!0};function pf(e,t,n){var r,o={},a=null,i=null;n!==void 0&&(a=""+n),t.key!==void 0&&(a=""+t.key),t.ref!==void 0&&(i=t.ref);for(r in t)Ch.call(t,r)&&!Ih.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)o[r]===void 0&&(o[r]=t[r]);return{$$typeof:Dh,type:e,key:a,ref:i,props:o,_owner:Nh.current}}Aa.Fragment=wh;Aa.jsx=pf;Aa.jsxs=pf;(function(e){e.exports=Aa})(ih);const H=Jo.jsx,ht=Jo.jsxs;var hs={},Xo={},_h={get exports(){return Xo},set exports(e){Xo=e}},Ae={},gs={},Rh={get exports(){return gs},set exports(e){gs=e}},mf={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(C,R){var T=C.length;C.push(R);e:for(;0<T;){var U=T-1>>>1,Z=C[U];if(0<o(Z,R))C[U]=R,C[T]=Z,T=U;else break e}}function n(C){return C.length===0?null:C[0]}function r(C){if(C.length===0)return null;var R=C[0],T=C.pop();if(T!==R){C[0]=T;e:for(var U=0,Z=C.length,Cn=Z>>>1;U<Cn;){var Ce=2*(U+1)-1,Nn=C[Ce],Ne=Ce+1,mt=C[Ne];if(0>o(Nn,T))Ne<Z&&0>o(mt,Nn)?(C[U]=mt,C[Ne]=T,U=Ne):(C[U]=Nn,C[Ce]=T,U=Ce);else if(Ne<Z&&0>o(mt,T))C[U]=mt,C[Ne]=T,U=Ne;else break e}}return R}function o(C,R){var T=C.sortIndex-R.sortIndex;return T!==0?T:C.id-R.id}if(typeof performance=="object"&&typeof performance.now=="function"){var a=performance;e.unstable_now=function(){return a.now()}}else{var i=Date,s=i.now();e.unstable_now=function(){return i.now()-s}}var u=[],l=[],d=1,c=null,p=3,h=!1,g=!1,y=!1,S=typeof setTimeout=="function"?setTimeout:null,m=typeof clearTimeout=="function"?clearTimeout:null,f=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function v(C){for(var R=n(l);R!==null;){if(R.callback===null)r(l);else if(R.startTime<=C)r(l),R.sortIndex=R.expirationTime,t(u,R);else break;R=n(l)}}function P(C){if(y=!1,v(C),!g)if(n(u)!==null)g=!0,Rt(E);else{var R=n(l);R!==null&&pt(P,R.startTime-C)}}function E(C,R){g=!1,y&&(y=!1,m(I),I=-1),h=!0;var T=p;try{for(v(R),c=n(u);c!==null&&(!(c.expirationTime>R)||C&&!X());){var U=c.callback;if(typeof U=="function"){c.callback=null,p=c.priorityLevel;var Z=U(c.expirationTime<=R);R=e.unstable_now(),typeof Z=="function"?c.callback=Z:c===n(u)&&r(u),v(R)}else r(u);c=n(u)}if(c!==null)var Cn=!0;else{var Ce=n(l);Ce!==null&&pt(P,Ce.startTime-R),Cn=!1}return Cn}finally{c=null,p=T,h=!1}}var D=!1,w=null,I=-1,L=5,_=-1;function X(){return!(e.unstable_now()-_<L)}function Ze(){if(w!==null){var C=e.unstable_now();_=C;var R=!0;try{R=w(!0,C)}finally{R?sn():(D=!1,w=null)}}else D=!1}var sn;if(typeof f=="function")sn=function(){f(Ze)};else if(typeof MessageChannel<"u"){var ft=new MessageChannel,ho=ft.port2;ft.port1.onmessage=Ze,sn=function(){ho.postMessage(null)}}else sn=function(){S(Ze,0)};function Rt(C){w=C,D||(D=!0,sn())}function pt(C,R){I=S(function(){C(e.unstable_now())},R)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(C){C.callback=null},e.unstable_continueExecution=function(){g||h||(g=!0,Rt(E))},e.unstable_forceFrameRate=function(C){0>C||125<C?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):L=0<C?Math.floor(1e3/C):5},e.unstable_getCurrentPriorityLevel=function(){return p},e.unstable_getFirstCallbackNode=function(){return n(u)},e.unstable_next=function(C){switch(p){case 1:case 2:case 3:var R=3;break;default:R=p}var T=p;p=R;try{return C()}finally{p=T}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(C,R){switch(C){case 1:case 2:case 3:case 4:case 5:break;default:C=3}var T=p;p=C;try{return R()}finally{p=T}},e.unstable_scheduleCallback=function(C,R,T){var U=e.unstable_now();switch(typeof T=="object"&&T!==null?(T=T.delay,T=typeof T=="number"&&0<T?U+T:U):T=U,C){case 1:var Z=-1;break;case 2:Z=250;break;case 5:Z=1073741823;break;case 4:Z=1e4;break;default:Z=5e3}return Z=T+Z,C={id:d++,callback:R,priorityLevel:C,startTime:T,expirationTime:Z,sortIndex:-1},T>U?(C.sortIndex=T,t(l,C),n(u)===null&&C===n(l)&&(y?(m(I),I=-1):y=!0,pt(P,T-U))):(C.sortIndex=Z,t(u,C),g||h||(g=!0,Rt(E))),C},e.unstable_shouldYield=X,e.unstable_wrapCallback=function(C){var R=p;return function(){var T=p;p=R;try{return C.apply(this,arguments)}finally{p=T}}}})(mf);(function(e){e.exports=mf})(Rh);/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var hf=j,je=gs;function b(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var gf=new Set,Mr={};function Dn(e,t){Xn(e,t),Xn(e+"Capture",t)}function Xn(e,t){for(Mr[e]=t,e=0;e<t.length;e++)gf.add(t[e])}var Et=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),vs=Object.prototype.hasOwnProperty,jh=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Gl={},Kl={};function Th(e){return vs.call(Kl,e)?!0:vs.call(Gl,e)?!1:jh.test(e)?Kl[e]=!0:(Gl[e]=!0,!1)}function Ah(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Lh(e,t,n,r){if(t===null||typeof t>"u"||Ah(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Se(e,t,n,r,o,a,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=i}var le={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){le[e]=new Se(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];le[t]=new Se(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){le[e]=new Se(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){le[e]=new Se(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){le[e]=new Se(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){le[e]=new Se(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){le[e]=new Se(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){le[e]=new Se(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){le[e]=new Se(e,5,!1,e.toLowerCase(),null,!1,!1)});var Iu=/[\-:]([a-z])/g;function _u(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Iu,_u);le[t]=new Se(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Iu,_u);le[t]=new Se(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Iu,_u);le[t]=new Se(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){le[e]=new Se(e,1,!1,e.toLowerCase(),null,!1,!1)});le.xlinkHref=new Se("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){le[e]=new Se(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ru(e,t,n,r){var o=le.hasOwnProperty(t)?le[t]:null;(o!==null?o.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Lh(t,n,o,r)&&(n=null),r||o===null?Th(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=n===null?o.type===3?!1:"":n:(t=o.attributeName,r=o.attributeNamespace,n===null?e.removeAttribute(t):(o=o.type,n=o===3||o===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var It=hf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,vo=Symbol.for("react.element"),Tn=Symbol.for("react.portal"),An=Symbol.for("react.fragment"),ju=Symbol.for("react.strict_mode"),ys=Symbol.for("react.profiler"),vf=Symbol.for("react.provider"),yf=Symbol.for("react.context"),Tu=Symbol.for("react.forward_ref"),Ps=Symbol.for("react.suspense"),Ss=Symbol.for("react.suspense_list"),Au=Symbol.for("react.memo"),At=Symbol.for("react.lazy"),Pf=Symbol.for("react.offscreen"),Ql=Symbol.iterator;function pr(e){return e===null||typeof e!="object"?null:(e=Ql&&e[Ql]||e["@@iterator"],typeof e=="function"?e:null)}var Q=Object.assign,Ii;function Er(e){if(Ii===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ii=t&&t[1]||""}return`
`+Ii+e}var _i=!1;function Ri(e,t){if(!e||_i)return"";_i=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(l){var r=l}Reflect.construct(e,[],t)}else{try{t.call()}catch(l){r=l}e.call(t.prototype)}else{try{throw Error()}catch(l){r=l}e()}}catch(l){if(l&&r&&typeof l.stack=="string"){for(var o=l.stack.split(`
`),a=r.stack.split(`
`),i=o.length-1,s=a.length-1;1<=i&&0<=s&&o[i]!==a[s];)s--;for(;1<=i&&0<=s;i--,s--)if(o[i]!==a[s]){if(i!==1||s!==1)do if(i--,s--,0>s||o[i]!==a[s]){var u=`
`+o[i].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=i&&0<=s);break}}}finally{_i=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Er(e):""}function xh(e){switch(e.tag){case 5:return Er(e.type);case 16:return Er("Lazy");case 13:return Er("Suspense");case 19:return Er("SuspenseList");case 0:case 2:case 15:return e=Ri(e.type,!1),e;case 11:return e=Ri(e.type.render,!1),e;case 1:return e=Ri(e.type,!0),e;default:return""}}function Os(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case An:return"Fragment";case Tn:return"Portal";case ys:return"Profiler";case ju:return"StrictMode";case Ps:return"Suspense";case Ss:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case yf:return(e.displayName||"Context")+".Consumer";case vf:return(e._context.displayName||"Context")+".Provider";case Tu:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Au:return t=e.displayName||null,t!==null?t:Os(e.type)||"Memo";case At:t=e._payload,e=e._init;try{return Os(e(t))}catch{}}return null}function kh(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Os(t);case 8:return t===ju?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Jt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Sf(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Mh(e){var t=Sf(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var o=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(i){r=""+i,a.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function yo(e){e._valueTracker||(e._valueTracker=Mh(e))}function Of(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Sf(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Zo(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function bs(e,t){var n=t.checked;return Q({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Yl(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Jt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function bf(e,t){t=t.checked,t!=null&&Ru(e,"checked",t,!1)}function Es(e,t){bf(e,t);var n=Jt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Ds(e,t.type,n):t.hasOwnProperty("defaultValue")&&Ds(e,t.type,Jt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Jl(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Ds(e,t,n){(t!=="number"||Zo(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Dr=Array.isArray;function zn(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Jt(n),t=null,o=0;o<e.length;o++){if(e[o].value===n){e[o].selected=!0,r&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function ws(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(b(91));return Q({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Xl(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(b(92));if(Dr(n)){if(1<n.length)throw Error(b(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Jt(n)}}function Ef(e,t){var n=Jt(t.value),r=Jt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Zl(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Df(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Cs(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Df(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Po,wf=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,o)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Po=Po||document.createElement("div"),Po.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Po.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Fr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Ir={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Fh=["Webkit","ms","Moz","O"];Object.keys(Ir).forEach(function(e){Fh.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Ir[t]=Ir[e]})});function Cf(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Ir.hasOwnProperty(e)&&Ir[e]?(""+t).trim():t+"px"}function Nf(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,o=Cf(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}var Vh=Q({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ns(e,t){if(t){if(Vh[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(b(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(b(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(b(61))}if(t.style!=null&&typeof t.style!="object")throw Error(b(62))}}function Is(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var _s=null;function Lu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Rs=null,qn=null,Hn=null;function ec(e){if(e=lo(e)){if(typeof Rs!="function")throw Error(b(280));var t=e.stateNode;t&&(t=Fa(t),Rs(e.stateNode,e.type,t))}}function If(e){qn?Hn?Hn.push(e):Hn=[e]:qn=e}function _f(){if(qn){var e=qn,t=Hn;if(Hn=qn=null,ec(e),t)for(e=0;e<t.length;e++)ec(t[e])}}function Rf(e,t){return e(t)}function jf(){}var ji=!1;function Tf(e,t,n){if(ji)return e(t,n);ji=!0;try{return Rf(e,t,n)}finally{ji=!1,(qn!==null||Hn!==null)&&(jf(),_f())}}function Vr(e,t){var n=e.stateNode;if(n===null)return null;var r=Fa(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(b(231,t,typeof n));return n}var js=!1;if(Et)try{var mr={};Object.defineProperty(mr,"passive",{get:function(){js=!0}}),window.addEventListener("test",mr,mr),window.removeEventListener("test",mr,mr)}catch{js=!1}function Uh(e,t,n,r,o,a,i,s,u){var l=Array.prototype.slice.call(arguments,3);try{t.apply(n,l)}catch(d){this.onError(d)}}var _r=!1,ea=null,ta=!1,Ts=null,Bh={onError:function(e){_r=!0,ea=e}};function $h(e,t,n,r,o,a,i,s,u){_r=!1,ea=null,Uh.apply(Bh,arguments)}function Wh(e,t,n,r,o,a,i,s,u){if($h.apply(this,arguments),_r){if(_r){var l=ea;_r=!1,ea=null}else throw Error(b(198));ta||(ta=!0,Ts=l)}}function wn(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Af(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function tc(e){if(wn(e)!==e)throw Error(b(188))}function zh(e){var t=e.alternate;if(!t){if(t=wn(e),t===null)throw Error(b(188));return t!==e?null:e}for(var n=e,r=t;;){var o=n.return;if(o===null)break;var a=o.alternate;if(a===null){if(r=o.return,r!==null){n=r;continue}break}if(o.child===a.child){for(a=o.child;a;){if(a===n)return tc(o),e;if(a===r)return tc(o),t;a=a.sibling}throw Error(b(188))}if(n.return!==r.return)n=o,r=a;else{for(var i=!1,s=o.child;s;){if(s===n){i=!0,n=o,r=a;break}if(s===r){i=!0,r=o,n=a;break}s=s.sibling}if(!i){for(s=a.child;s;){if(s===n){i=!0,n=a,r=o;break}if(s===r){i=!0,r=a,n=o;break}s=s.sibling}if(!i)throw Error(b(189))}}if(n.alternate!==r)throw Error(b(190))}if(n.tag!==3)throw Error(b(188));return n.stateNode.current===n?e:t}function Lf(e){return e=zh(e),e!==null?xf(e):null}function xf(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=xf(e);if(t!==null)return t;e=e.sibling}return null}var kf=je.unstable_scheduleCallback,nc=je.unstable_cancelCallback,qh=je.unstable_shouldYield,Hh=je.unstable_requestPaint,J=je.unstable_now,Gh=je.unstable_getCurrentPriorityLevel,xu=je.unstable_ImmediatePriority,Mf=je.unstable_UserBlockingPriority,na=je.unstable_NormalPriority,Kh=je.unstable_LowPriority,Ff=je.unstable_IdlePriority,La=null,it=null;function Qh(e){if(it&&typeof it.onCommitFiberRoot=="function")try{it.onCommitFiberRoot(La,e,void 0,(e.current.flags&128)===128)}catch{}}var Ye=Math.clz32?Math.clz32:Xh,Yh=Math.log,Jh=Math.LN2;function Xh(e){return e>>>=0,e===0?32:31-(Yh(e)/Jh|0)|0}var So=64,Oo=4194304;function wr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function ra(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,o=e.suspendedLanes,a=e.pingedLanes,i=n&268435455;if(i!==0){var s=i&~o;s!==0?r=wr(s):(a&=i,a!==0&&(r=wr(a)))}else i=n&~o,i!==0?r=wr(i):a!==0&&(r=wr(a));if(r===0)return 0;if(t!==0&&t!==r&&!(t&o)&&(o=r&-r,a=t&-t,o>=a||o===16&&(a&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Ye(t),o=1<<n,r|=e[n],t&=~o;return r}function Zh(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function eg(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,o=e.expirationTimes,a=e.pendingLanes;0<a;){var i=31-Ye(a),s=1<<i,u=o[i];u===-1?(!(s&n)||s&r)&&(o[i]=Zh(s,t)):u<=t&&(e.expiredLanes|=s),a&=~s}}function As(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Vf(){var e=So;return So<<=1,!(So&4194240)&&(So=64),e}function Ti(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function so(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Ye(t),e[t]=n}function tg(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var o=31-Ye(n),a=1<<o;t[o]=0,r[o]=-1,e[o]=-1,n&=~a}}function ku(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Ye(n),o=1<<r;o&t|e[r]&t&&(e[r]|=t),n&=~o}}var M=0;function Uf(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Bf,Mu,$f,Wf,zf,Ls=!1,bo=[],Ut=null,Bt=null,$t=null,Ur=new Map,Br=new Map,xt=[],ng="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function rc(e,t){switch(e){case"focusin":case"focusout":Ut=null;break;case"dragenter":case"dragleave":Bt=null;break;case"mouseover":case"mouseout":$t=null;break;case"pointerover":case"pointerout":Ur.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Br.delete(t.pointerId)}}function hr(e,t,n,r,o,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[o]},t!==null&&(t=lo(t),t!==null&&Mu(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function rg(e,t,n,r,o){switch(t){case"focusin":return Ut=hr(Ut,e,t,n,r,o),!0;case"dragenter":return Bt=hr(Bt,e,t,n,r,o),!0;case"mouseover":return $t=hr($t,e,t,n,r,o),!0;case"pointerover":var a=o.pointerId;return Ur.set(a,hr(Ur.get(a)||null,e,t,n,r,o)),!0;case"gotpointercapture":return a=o.pointerId,Br.set(a,hr(Br.get(a)||null,e,t,n,r,o)),!0}return!1}function qf(e){var t=dn(e.target);if(t!==null){var n=wn(t);if(n!==null){if(t=n.tag,t===13){if(t=Af(n),t!==null){e.blockedOn=t,zf(e.priority,function(){$f(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Mo(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=xs(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);_s=r,n.target.dispatchEvent(r),_s=null}else return t=lo(n),t!==null&&Mu(t),e.blockedOn=n,!1;t.shift()}return!0}function oc(e,t,n){Mo(e)&&n.delete(t)}function og(){Ls=!1,Ut!==null&&Mo(Ut)&&(Ut=null),Bt!==null&&Mo(Bt)&&(Bt=null),$t!==null&&Mo($t)&&($t=null),Ur.forEach(oc),Br.forEach(oc)}function gr(e,t){e.blockedOn===t&&(e.blockedOn=null,Ls||(Ls=!0,je.unstable_scheduleCallback(je.unstable_NormalPriority,og)))}function $r(e){function t(o){return gr(o,e)}if(0<bo.length){gr(bo[0],e);for(var n=1;n<bo.length;n++){var r=bo[n];r.blockedOn===e&&(r.blockedOn=null)}}for(Ut!==null&&gr(Ut,e),Bt!==null&&gr(Bt,e),$t!==null&&gr($t,e),Ur.forEach(t),Br.forEach(t),n=0;n<xt.length;n++)r=xt[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<xt.length&&(n=xt[0],n.blockedOn===null);)qf(n),n.blockedOn===null&&xt.shift()}var Gn=It.ReactCurrentBatchConfig,oa=!0;function ag(e,t,n,r){var o=M,a=Gn.transition;Gn.transition=null;try{M=1,Fu(e,t,n,r)}finally{M=o,Gn.transition=a}}function ig(e,t,n,r){var o=M,a=Gn.transition;Gn.transition=null;try{M=4,Fu(e,t,n,r)}finally{M=o,Gn.transition=a}}function Fu(e,t,n,r){if(oa){var o=xs(e,t,n,r);if(o===null)$i(e,t,r,aa,n),rc(e,r);else if(rg(o,e,t,n,r))r.stopPropagation();else if(rc(e,r),t&4&&-1<ng.indexOf(e)){for(;o!==null;){var a=lo(o);if(a!==null&&Bf(a),a=xs(e,t,n,r),a===null&&$i(e,t,r,aa,n),a===o)break;o=a}o!==null&&r.stopPropagation()}else $i(e,t,r,null,n)}}var aa=null;function xs(e,t,n,r){if(aa=null,e=Lu(r),e=dn(e),e!==null)if(t=wn(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Af(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return aa=e,null}function Hf(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Gh()){case xu:return 1;case Mf:return 4;case na:case Kh:return 16;case Ff:return 536870912;default:return 16}default:return 16}}var Ft=null,Vu=null,Fo=null;function Gf(){if(Fo)return Fo;var e,t=Vu,n=t.length,r,o="value"in Ft?Ft.value:Ft.textContent,a=o.length;for(e=0;e<n&&t[e]===o[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===o[a-r];r++);return Fo=o.slice(e,1<r?1-r:void 0)}function Vo(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Eo(){return!0}function ac(){return!1}function Le(e){function t(n,r,o,a,i){this._reactName=n,this._targetInst=o,this.type=r,this.nativeEvent=a,this.target=i,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(n=e[s],this[s]=n?n(a):a[s]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Eo:ac,this.isPropagationStopped=ac,this}return Q(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Eo)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Eo)},persist:function(){},isPersistent:Eo}),t}var lr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Uu=Le(lr),uo=Q({},lr,{view:0,detail:0}),sg=Le(uo),Ai,Li,vr,xa=Q({},uo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Bu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==vr&&(vr&&e.type==="mousemove"?(Ai=e.screenX-vr.screenX,Li=e.screenY-vr.screenY):Li=Ai=0,vr=e),Ai)},movementY:function(e){return"movementY"in e?e.movementY:Li}}),ic=Le(xa),ug=Q({},xa,{dataTransfer:0}),lg=Le(ug),cg=Q({},uo,{relatedTarget:0}),xi=Le(cg),dg=Q({},lr,{animationName:0,elapsedTime:0,pseudoElement:0}),fg=Le(dg),pg=Q({},lr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),mg=Le(pg),hg=Q({},lr,{data:0}),sc=Le(hg),gg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},vg={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},yg={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pg(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=yg[e])?!!t[e]:!1}function Bu(){return Pg}var Sg=Q({},uo,{key:function(e){if(e.key){var t=gg[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Vo(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?vg[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Bu,charCode:function(e){return e.type==="keypress"?Vo(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Vo(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Og=Le(Sg),bg=Q({},xa,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),uc=Le(bg),Eg=Q({},uo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Bu}),Dg=Le(Eg),wg=Q({},lr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Cg=Le(wg),Ng=Q({},xa,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Ig=Le(Ng),_g=[9,13,27,32],$u=Et&&"CompositionEvent"in window,Rr=null;Et&&"documentMode"in document&&(Rr=document.documentMode);var Rg=Et&&"TextEvent"in window&&!Rr,Kf=Et&&(!$u||Rr&&8<Rr&&11>=Rr),lc=String.fromCharCode(32),cc=!1;function Qf(e,t){switch(e){case"keyup":return _g.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Yf(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Ln=!1;function jg(e,t){switch(e){case"compositionend":return Yf(t);case"keypress":return t.which!==32?null:(cc=!0,lc);case"textInput":return e=t.data,e===lc&&cc?null:e;default:return null}}function Tg(e,t){if(Ln)return e==="compositionend"||!$u&&Qf(e,t)?(e=Gf(),Fo=Vu=Ft=null,Ln=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Kf&&t.locale!=="ko"?null:t.data;default:return null}}var Ag={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function dc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Ag[e.type]:t==="textarea"}function Jf(e,t,n,r){If(r),t=ia(t,"onChange"),0<t.length&&(n=new Uu("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var jr=null,Wr=null;function Lg(e){up(e,0)}function ka(e){var t=Mn(e);if(Of(t))return e}function xg(e,t){if(e==="change")return t}var Xf=!1;if(Et){var ki;if(Et){var Mi="oninput"in document;if(!Mi){var fc=document.createElement("div");fc.setAttribute("oninput","return;"),Mi=typeof fc.oninput=="function"}ki=Mi}else ki=!1;Xf=ki&&(!document.documentMode||9<document.documentMode)}function pc(){jr&&(jr.detachEvent("onpropertychange",Zf),Wr=jr=null)}function Zf(e){if(e.propertyName==="value"&&ka(Wr)){var t=[];Jf(t,Wr,e,Lu(e)),Tf(Lg,t)}}function kg(e,t,n){e==="focusin"?(pc(),jr=t,Wr=n,jr.attachEvent("onpropertychange",Zf)):e==="focusout"&&pc()}function Mg(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ka(Wr)}function Fg(e,t){if(e==="click")return ka(t)}function Vg(e,t){if(e==="input"||e==="change")return ka(t)}function Ug(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Xe=typeof Object.is=="function"?Object.is:Ug;function zr(e,t){if(Xe(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var o=n[r];if(!vs.call(t,o)||!Xe(e[o],t[o]))return!1}return!0}function mc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function hc(e,t){var n=mc(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=mc(n)}}function ep(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?ep(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function tp(){for(var e=window,t=Zo();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Zo(e.document)}return t}function Wu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Bg(e){var t=tp(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&ep(n.ownerDocument.documentElement,n)){if(r!==null&&Wu(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=n.textContent.length,a=Math.min(r.start,o);r=r.end===void 0?a:Math.min(r.end,o),!e.extend&&a>r&&(o=r,r=a,a=o),o=hc(n,a);var i=hc(n,r);o&&i&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var $g=Et&&"documentMode"in document&&11>=document.documentMode,xn=null,ks=null,Tr=null,Ms=!1;function gc(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ms||xn==null||xn!==Zo(r)||(r=xn,"selectionStart"in r&&Wu(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Tr&&zr(Tr,r)||(Tr=r,r=ia(ks,"onSelect"),0<r.length&&(t=new Uu("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=xn)))}function Do(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var kn={animationend:Do("Animation","AnimationEnd"),animationiteration:Do("Animation","AnimationIteration"),animationstart:Do("Animation","AnimationStart"),transitionend:Do("Transition","TransitionEnd")},Fi={},np={};Et&&(np=document.createElement("div").style,"AnimationEvent"in window||(delete kn.animationend.animation,delete kn.animationiteration.animation,delete kn.animationstart.animation),"TransitionEvent"in window||delete kn.transitionend.transition);function Ma(e){if(Fi[e])return Fi[e];if(!kn[e])return e;var t=kn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in np)return Fi[e]=t[n];return e}var rp=Ma("animationend"),op=Ma("animationiteration"),ap=Ma("animationstart"),ip=Ma("transitionend"),sp=new Map,vc="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function nn(e,t){sp.set(e,t),Dn(t,[e])}for(var Vi=0;Vi<vc.length;Vi++){var Ui=vc[Vi],Wg=Ui.toLowerCase(),zg=Ui[0].toUpperCase()+Ui.slice(1);nn(Wg,"on"+zg)}nn(rp,"onAnimationEnd");nn(op,"onAnimationIteration");nn(ap,"onAnimationStart");nn("dblclick","onDoubleClick");nn("focusin","onFocus");nn("focusout","onBlur");nn(ip,"onTransitionEnd");Xn("onMouseEnter",["mouseout","mouseover"]);Xn("onMouseLeave",["mouseout","mouseover"]);Xn("onPointerEnter",["pointerout","pointerover"]);Xn("onPointerLeave",["pointerout","pointerover"]);Dn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Dn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Dn("onBeforeInput",["compositionend","keypress","textInput","paste"]);Dn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Dn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Dn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Cr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),qg=new Set("cancel close invalid load scroll toggle".split(" ").concat(Cr));function yc(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Wh(r,t,void 0,e),e.currentTarget=null}function up(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],o=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var i=r.length-1;0<=i;i--){var s=r[i],u=s.instance,l=s.currentTarget;if(s=s.listener,u!==a&&o.isPropagationStopped())break e;yc(o,s,l),a=u}else for(i=0;i<r.length;i++){if(s=r[i],u=s.instance,l=s.currentTarget,s=s.listener,u!==a&&o.isPropagationStopped())break e;yc(o,s,l),a=u}}}if(ta)throw e=Ts,ta=!1,Ts=null,e}function $(e,t){var n=t[$s];n===void 0&&(n=t[$s]=new Set);var r=e+"__bubble";n.has(r)||(lp(t,e,2,!1),n.add(r))}function Bi(e,t,n){var r=0;t&&(r|=4),lp(n,e,r,t)}var wo="_reactListening"+Math.random().toString(36).slice(2);function qr(e){if(!e[wo]){e[wo]=!0,gf.forEach(function(n){n!=="selectionchange"&&(qg.has(n)||Bi(n,!1,e),Bi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[wo]||(t[wo]=!0,Bi("selectionchange",!1,t))}}function lp(e,t,n,r){switch(Hf(t)){case 1:var o=ag;break;case 4:o=ig;break;default:o=Fu}n=o.bind(null,t,n,e),o=void 0,!js||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),r?o!==void 0?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):o!==void 0?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function $i(e,t,n,r,o){var a=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var s=r.stateNode.containerInfo;if(s===o||s.nodeType===8&&s.parentNode===o)break;if(i===4)for(i=r.return;i!==null;){var u=i.tag;if((u===3||u===4)&&(u=i.stateNode.containerInfo,u===o||u.nodeType===8&&u.parentNode===o))return;i=i.return}for(;s!==null;){if(i=dn(s),i===null)return;if(u=i.tag,u===5||u===6){r=a=i;continue e}s=s.parentNode}}r=r.return}Tf(function(){var l=a,d=Lu(n),c=[];e:{var p=sp.get(e);if(p!==void 0){var h=Uu,g=e;switch(e){case"keypress":if(Vo(n)===0)break e;case"keydown":case"keyup":h=Og;break;case"focusin":g="focus",h=xi;break;case"focusout":g="blur",h=xi;break;case"beforeblur":case"afterblur":h=xi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":h=ic;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":h=lg;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":h=Dg;break;case rp:case op:case ap:h=fg;break;case ip:h=Cg;break;case"scroll":h=sg;break;case"wheel":h=Ig;break;case"copy":case"cut":case"paste":h=mg;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":h=uc}var y=(t&4)!==0,S=!y&&e==="scroll",m=y?p!==null?p+"Capture":null:p;y=[];for(var f=l,v;f!==null;){v=f;var P=v.stateNode;if(v.tag===5&&P!==null&&(v=P,m!==null&&(P=Vr(f,m),P!=null&&y.push(Hr(f,P,v)))),S)break;f=f.return}0<y.length&&(p=new h(p,g,null,n,d),c.push({event:p,listeners:y}))}}if(!(t&7)){e:{if(p=e==="mouseover"||e==="pointerover",h=e==="mouseout"||e==="pointerout",p&&n!==_s&&(g=n.relatedTarget||n.fromElement)&&(dn(g)||g[Dt]))break e;if((h||p)&&(p=d.window===d?d:(p=d.ownerDocument)?p.defaultView||p.parentWindow:window,h?(g=n.relatedTarget||n.toElement,h=l,g=g?dn(g):null,g!==null&&(S=wn(g),g!==S||g.tag!==5&&g.tag!==6)&&(g=null)):(h=null,g=l),h!==g)){if(y=ic,P="onMouseLeave",m="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(y=uc,P="onPointerLeave",m="onPointerEnter",f="pointer"),S=h==null?p:Mn(h),v=g==null?p:Mn(g),p=new y(P,f+"leave",h,n,d),p.target=S,p.relatedTarget=v,P=null,dn(d)===l&&(y=new y(m,f+"enter",g,n,d),y.target=v,y.relatedTarget=S,P=y),S=P,h&&g)t:{for(y=h,m=g,f=0,v=y;v;v=_n(v))f++;for(v=0,P=m;P;P=_n(P))v++;for(;0<f-v;)y=_n(y),f--;for(;0<v-f;)m=_n(m),v--;for(;f--;){if(y===m||m!==null&&y===m.alternate)break t;y=_n(y),m=_n(m)}y=null}else y=null;h!==null&&Pc(c,p,h,y,!1),g!==null&&S!==null&&Pc(c,S,g,y,!0)}}e:{if(p=l?Mn(l):window,h=p.nodeName&&p.nodeName.toLowerCase(),h==="select"||h==="input"&&p.type==="file")var E=xg;else if(dc(p))if(Xf)E=Vg;else{E=Mg;var D=kg}else(h=p.nodeName)&&h.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(E=Fg);if(E&&(E=E(e,l))){Jf(c,E,n,d);break e}D&&D(e,p,l),e==="focusout"&&(D=p._wrapperState)&&D.controlled&&p.type==="number"&&Ds(p,"number",p.value)}switch(D=l?Mn(l):window,e){case"focusin":(dc(D)||D.contentEditable==="true")&&(xn=D,ks=l,Tr=null);break;case"focusout":Tr=ks=xn=null;break;case"mousedown":Ms=!0;break;case"contextmenu":case"mouseup":case"dragend":Ms=!1,gc(c,n,d);break;case"selectionchange":if($g)break;case"keydown":case"keyup":gc(c,n,d)}var w;if($u)e:{switch(e){case"compositionstart":var I="onCompositionStart";break e;case"compositionend":I="onCompositionEnd";break e;case"compositionupdate":I="onCompositionUpdate";break e}I=void 0}else Ln?Qf(e,n)&&(I="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(I="onCompositionStart");I&&(Kf&&n.locale!=="ko"&&(Ln||I!=="onCompositionStart"?I==="onCompositionEnd"&&Ln&&(w=Gf()):(Ft=d,Vu="value"in Ft?Ft.value:Ft.textContent,Ln=!0)),D=ia(l,I),0<D.length&&(I=new sc(I,e,null,n,d),c.push({event:I,listeners:D}),w?I.data=w:(w=Yf(n),w!==null&&(I.data=w)))),(w=Rg?jg(e,n):Tg(e,n))&&(l=ia(l,"onBeforeInput"),0<l.length&&(d=new sc("onBeforeInput","beforeinput",null,n,d),c.push({event:d,listeners:l}),d.data=w))}up(c,t)})}function Hr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ia(e,t){for(var n=t+"Capture",r=[];e!==null;){var o=e,a=o.stateNode;o.tag===5&&a!==null&&(o=a,a=Vr(e,n),a!=null&&r.unshift(Hr(e,a,o)),a=Vr(e,t),a!=null&&r.push(Hr(e,a,o))),e=e.return}return r}function _n(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Pc(e,t,n,r,o){for(var a=t._reactName,i=[];n!==null&&n!==r;){var s=n,u=s.alternate,l=s.stateNode;if(u!==null&&u===r)break;s.tag===5&&l!==null&&(s=l,o?(u=Vr(n,a),u!=null&&i.unshift(Hr(n,u,s))):o||(u=Vr(n,a),u!=null&&i.push(Hr(n,u,s)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var Hg=/\r\n?/g,Gg=/\u0000|\uFFFD/g;function Sc(e){return(typeof e=="string"?e:""+e).replace(Hg,`
`).replace(Gg,"")}function Co(e,t,n){if(t=Sc(t),Sc(e)!==t&&n)throw Error(b(425))}function sa(){}var Fs=null,Vs=null;function Us(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Bs=typeof setTimeout=="function"?setTimeout:void 0,Kg=typeof clearTimeout=="function"?clearTimeout:void 0,Oc=typeof Promise=="function"?Promise:void 0,Qg=typeof queueMicrotask=="function"?queueMicrotask:typeof Oc<"u"?function(e){return Oc.resolve(null).then(e).catch(Yg)}:Bs;function Yg(e){setTimeout(function(){throw e})}function Wi(e,t){var n=t,r=0;do{var o=n.nextSibling;if(e.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(r===0){e.removeChild(o),$r(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=o}while(n);$r(t)}function Wt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function bc(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var cr=Math.random().toString(36).slice(2),rt="__reactFiber$"+cr,Gr="__reactProps$"+cr,Dt="__reactContainer$"+cr,$s="__reactEvents$"+cr,Jg="__reactListeners$"+cr,Xg="__reactHandles$"+cr;function dn(e){var t=e[rt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Dt]||n[rt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=bc(e);e!==null;){if(n=e[rt])return n;e=bc(e)}return t}e=n,n=e.parentNode}return null}function lo(e){return e=e[rt]||e[Dt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Mn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(b(33))}function Fa(e){return e[Gr]||null}var Ws=[],Fn=-1;function rn(e){return{current:e}}function W(e){0>Fn||(e.current=Ws[Fn],Ws[Fn]=null,Fn--)}function B(e,t){Fn++,Ws[Fn]=e.current,e.current=t}var Xt={},he=rn(Xt),Ee=rn(!1),yn=Xt;function Zn(e,t){var n=e.type.contextTypes;if(!n)return Xt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o={},a;for(a in n)o[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function De(e){return e=e.childContextTypes,e!=null}function ua(){W(Ee),W(he)}function Ec(e,t,n){if(he.current!==Xt)throw Error(b(168));B(he,t),B(Ee,n)}function cp(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var o in r)if(!(o in t))throw Error(b(108,kh(e)||"Unknown",o));return Q({},n,r)}function la(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Xt,yn=he.current,B(he,e),B(Ee,Ee.current),!0}function Dc(e,t,n){var r=e.stateNode;if(!r)throw Error(b(169));n?(e=cp(e,t,yn),r.__reactInternalMemoizedMergedChildContext=e,W(Ee),W(he),B(he,e)):W(Ee),B(Ee,n)}var yt=null,Va=!1,zi=!1;function dp(e){yt===null?yt=[e]:yt.push(e)}function Zg(e){Va=!0,dp(e)}function on(){if(!zi&&yt!==null){zi=!0;var e=0,t=M;try{var n=yt;for(M=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}yt=null,Va=!1}catch(o){throw yt!==null&&(yt=yt.slice(e+1)),kf(xu,on),o}finally{M=t,zi=!1}}return null}var Vn=[],Un=0,ca=null,da=0,ke=[],Me=0,Pn=null,Pt=1,St="";function un(e,t){Vn[Un++]=da,Vn[Un++]=ca,ca=e,da=t}function fp(e,t,n){ke[Me++]=Pt,ke[Me++]=St,ke[Me++]=Pn,Pn=e;var r=Pt;e=St;var o=32-Ye(r)-1;r&=~(1<<o),n+=1;var a=32-Ye(t)+o;if(30<a){var i=o-o%5;a=(r&(1<<i)-1).toString(32),r>>=i,o-=i,Pt=1<<32-Ye(t)+o|n<<o|r,St=a+e}else Pt=1<<a|n<<o|r,St=e}function zu(e){e.return!==null&&(un(e,1),fp(e,1,0))}function qu(e){for(;e===ca;)ca=Vn[--Un],Vn[Un]=null,da=Vn[--Un],Vn[Un]=null;for(;e===Pn;)Pn=ke[--Me],ke[Me]=null,St=ke[--Me],ke[Me]=null,Pt=ke[--Me],ke[Me]=null}var Re=null,_e=null,q=!1,Ke=null;function pp(e,t){var n=Fe(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function wc(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Re=e,_e=Wt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Re=e,_e=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Pn!==null?{id:Pt,overflow:St}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Fe(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Re=e,_e=null,!0):!1;default:return!1}}function zs(e){return(e.mode&1)!==0&&(e.flags&128)===0}function qs(e){if(q){var t=_e;if(t){var n=t;if(!wc(e,t)){if(zs(e))throw Error(b(418));t=Wt(n.nextSibling);var r=Re;t&&wc(e,t)?pp(r,n):(e.flags=e.flags&-4097|2,q=!1,Re=e)}}else{if(zs(e))throw Error(b(418));e.flags=e.flags&-4097|2,q=!1,Re=e}}}function Cc(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Re=e}function No(e){if(e!==Re)return!1;if(!q)return Cc(e),q=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Us(e.type,e.memoizedProps)),t&&(t=_e)){if(zs(e))throw mp(),Error(b(418));for(;t;)pp(e,t),t=Wt(t.nextSibling)}if(Cc(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(b(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){_e=Wt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}_e=null}}else _e=Re?Wt(e.stateNode.nextSibling):null;return!0}function mp(){for(var e=_e;e;)e=Wt(e.nextSibling)}function er(){_e=Re=null,q=!1}function Hu(e){Ke===null?Ke=[e]:Ke.push(e)}var ev=It.ReactCurrentBatchConfig;function He(e,t){if(e&&e.defaultProps){t=Q({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}var fa=rn(null),pa=null,Bn=null,Gu=null;function Ku(){Gu=Bn=pa=null}function Qu(e){var t=fa.current;W(fa),e._currentValue=t}function Hs(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Kn(e,t){pa=e,Gu=Bn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(be=!0),e.firstContext=null)}function Be(e){var t=e._currentValue;if(Gu!==e)if(e={context:e,memoizedValue:t,next:null},Bn===null){if(pa===null)throw Error(b(308));Bn=e,pa.dependencies={lanes:0,firstContext:e}}else Bn=Bn.next=e;return t}var fn=null;function Yu(e){fn===null?fn=[e]:fn.push(e)}function hp(e,t,n,r){var o=t.interleaved;return o===null?(n.next=n,Yu(t)):(n.next=o.next,o.next=n),t.interleaved=n,wt(e,r)}function wt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Lt=!1;function Ju(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function gp(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Ot(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function zt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,k&2){var o=r.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),r.pending=t,wt(e,n)}return o=r.interleaved,o===null?(t.next=t,Yu(r)):(t.next=o.next,o.next=t),r.interleaved=t,wt(e,n)}function Uo(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ku(e,n)}}function Nc(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var o=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?o=a=i:a=a.next=i,n=n.next}while(n!==null);a===null?o=a=t:a=a.next=t}else o=a=t;n={baseState:r.baseState,firstBaseUpdate:o,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function ma(e,t,n,r){var o=e.updateQueue;Lt=!1;var a=o.firstBaseUpdate,i=o.lastBaseUpdate,s=o.shared.pending;if(s!==null){o.shared.pending=null;var u=s,l=u.next;u.next=null,i===null?a=l:i.next=l,i=u;var d=e.alternate;d!==null&&(d=d.updateQueue,s=d.lastBaseUpdate,s!==i&&(s===null?d.firstBaseUpdate=l:s.next=l,d.lastBaseUpdate=u))}if(a!==null){var c=o.baseState;i=0,d=l=u=null,s=a;do{var p=s.lane,h=s.eventTime;if((r&p)===p){d!==null&&(d=d.next={eventTime:h,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var g=e,y=s;switch(p=t,h=n,y.tag){case 1:if(g=y.payload,typeof g=="function"){c=g.call(h,c,p);break e}c=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=y.payload,p=typeof g=="function"?g.call(h,c,p):g,p==null)break e;c=Q({},c,p);break e;case 2:Lt=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,p=o.effects,p===null?o.effects=[s]:p.push(s))}else h={eventTime:h,lane:p,tag:s.tag,payload:s.payload,callback:s.callback,next:null},d===null?(l=d=h,u=c):d=d.next=h,i|=p;if(s=s.next,s===null){if(s=o.shared.pending,s===null)break;p=s,s=p.next,p.next=null,o.lastBaseUpdate=p,o.shared.pending=null}}while(1);if(d===null&&(u=c),o.baseState=u,o.firstBaseUpdate=l,o.lastBaseUpdate=d,t=o.shared.interleaved,t!==null){o=t;do i|=o.lane,o=o.next;while(o!==t)}else a===null&&(o.shared.lanes=0);On|=i,e.lanes=i,e.memoizedState=c}}function Ic(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],o=r.callback;if(o!==null){if(r.callback=null,r=n,typeof o!="function")throw Error(b(191,o));o.call(r)}}}var vp=new hf.Component().refs;function Gs(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:Q({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ua={isMounted:function(e){return(e=e._reactInternals)?wn(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=ye(),o=Ht(e),a=Ot(r,o);a.payload=t,n!=null&&(a.callback=n),t=zt(e,a,o),t!==null&&(Je(t,e,o,r),Uo(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=ye(),o=Ht(e),a=Ot(r,o);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=zt(e,a,o),t!==null&&(Je(t,e,o,r),Uo(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ye(),r=Ht(e),o=Ot(n,r);o.tag=2,t!=null&&(o.callback=t),t=zt(e,o,r),t!==null&&(Je(t,e,r,n),Uo(t,e,r))}};function _c(e,t,n,r,o,a,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,i):t.prototype&&t.prototype.isPureReactComponent?!zr(n,r)||!zr(o,a):!0}function yp(e,t,n){var r=!1,o=Xt,a=t.contextType;return typeof a=="object"&&a!==null?a=Be(a):(o=De(t)?yn:he.current,r=t.contextTypes,a=(r=r!=null)?Zn(e,o):Xt),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ua,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=a),t}function Rc(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Ua.enqueueReplaceState(t,t.state,null)}function Ks(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs=vp,Ju(e);var a=t.contextType;typeof a=="object"&&a!==null?o.context=Be(a):(a=De(t)?yn:he.current,o.context=Zn(e,a)),o.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(Gs(e,t,a,n),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&Ua.enqueueReplaceState(o,o.state,null),ma(e,n,o,r),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function yr(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(b(309));var r=n.stateNode}if(!r)throw Error(b(147,e));var o=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(i){var s=o.refs;s===vp&&(s=o.refs={}),i===null?delete s[a]:s[a]=i},t._stringRef=a,t)}if(typeof e!="string")throw Error(b(284));if(!n._owner)throw Error(b(290,e))}return e}function Io(e,t){throw e=Object.prototype.toString.call(t),Error(b(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function jc(e){var t=e._init;return t(e._payload)}function Pp(e){function t(m,f){if(e){var v=m.deletions;v===null?(m.deletions=[f],m.flags|=16):v.push(f)}}function n(m,f){if(!e)return null;for(;f!==null;)t(m,f),f=f.sibling;return null}function r(m,f){for(m=new Map;f!==null;)f.key!==null?m.set(f.key,f):m.set(f.index,f),f=f.sibling;return m}function o(m,f){return m=Gt(m,f),m.index=0,m.sibling=null,m}function a(m,f,v){return m.index=v,e?(v=m.alternate,v!==null?(v=v.index,v<f?(m.flags|=2,f):v):(m.flags|=2,f)):(m.flags|=1048576,f)}function i(m){return e&&m.alternate===null&&(m.flags|=2),m}function s(m,f,v,P){return f===null||f.tag!==6?(f=Ji(v,m.mode,P),f.return=m,f):(f=o(f,v),f.return=m,f)}function u(m,f,v,P){var E=v.type;return E===An?d(m,f,v.props.children,P,v.key):f!==null&&(f.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===At&&jc(E)===f.type)?(P=o(f,v.props),P.ref=yr(m,f,v),P.return=m,P):(P=Ho(v.type,v.key,v.props,null,m.mode,P),P.ref=yr(m,f,v),P.return=m,P)}function l(m,f,v,P){return f===null||f.tag!==4||f.stateNode.containerInfo!==v.containerInfo||f.stateNode.implementation!==v.implementation?(f=Xi(v,m.mode,P),f.return=m,f):(f=o(f,v.children||[]),f.return=m,f)}function d(m,f,v,P,E){return f===null||f.tag!==7?(f=gn(v,m.mode,P,E),f.return=m,f):(f=o(f,v),f.return=m,f)}function c(m,f,v){if(typeof f=="string"&&f!==""||typeof f=="number")return f=Ji(""+f,m.mode,v),f.return=m,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case vo:return v=Ho(f.type,f.key,f.props,null,m.mode,v),v.ref=yr(m,null,f),v.return=m,v;case Tn:return f=Xi(f,m.mode,v),f.return=m,f;case At:var P=f._init;return c(m,P(f._payload),v)}if(Dr(f)||pr(f))return f=gn(f,m.mode,v,null),f.return=m,f;Io(m,f)}return null}function p(m,f,v,P){var E=f!==null?f.key:null;if(typeof v=="string"&&v!==""||typeof v=="number")return E!==null?null:s(m,f,""+v,P);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case vo:return v.key===E?u(m,f,v,P):null;case Tn:return v.key===E?l(m,f,v,P):null;case At:return E=v._init,p(m,f,E(v._payload),P)}if(Dr(v)||pr(v))return E!==null?null:d(m,f,v,P,null);Io(m,v)}return null}function h(m,f,v,P,E){if(typeof P=="string"&&P!==""||typeof P=="number")return m=m.get(v)||null,s(f,m,""+P,E);if(typeof P=="object"&&P!==null){switch(P.$$typeof){case vo:return m=m.get(P.key===null?v:P.key)||null,u(f,m,P,E);case Tn:return m=m.get(P.key===null?v:P.key)||null,l(f,m,P,E);case At:var D=P._init;return h(m,f,v,D(P._payload),E)}if(Dr(P)||pr(P))return m=m.get(v)||null,d(f,m,P,E,null);Io(f,P)}return null}function g(m,f,v,P){for(var E=null,D=null,w=f,I=f=0,L=null;w!==null&&I<v.length;I++){w.index>I?(L=w,w=null):L=w.sibling;var _=p(m,w,v[I],P);if(_===null){w===null&&(w=L);break}e&&w&&_.alternate===null&&t(m,w),f=a(_,f,I),D===null?E=_:D.sibling=_,D=_,w=L}if(I===v.length)return n(m,w),q&&un(m,I),E;if(w===null){for(;I<v.length;I++)w=c(m,v[I],P),w!==null&&(f=a(w,f,I),D===null?E=w:D.sibling=w,D=w);return q&&un(m,I),E}for(w=r(m,w);I<v.length;I++)L=h(w,m,I,v[I],P),L!==null&&(e&&L.alternate!==null&&w.delete(L.key===null?I:L.key),f=a(L,f,I),D===null?E=L:D.sibling=L,D=L);return e&&w.forEach(function(X){return t(m,X)}),q&&un(m,I),E}function y(m,f,v,P){var E=pr(v);if(typeof E!="function")throw Error(b(150));if(v=E.call(v),v==null)throw Error(b(151));for(var D=E=null,w=f,I=f=0,L=null,_=v.next();w!==null&&!_.done;I++,_=v.next()){w.index>I?(L=w,w=null):L=w.sibling;var X=p(m,w,_.value,P);if(X===null){w===null&&(w=L);break}e&&w&&X.alternate===null&&t(m,w),f=a(X,f,I),D===null?E=X:D.sibling=X,D=X,w=L}if(_.done)return n(m,w),q&&un(m,I),E;if(w===null){for(;!_.done;I++,_=v.next())_=c(m,_.value,P),_!==null&&(f=a(_,f,I),D===null?E=_:D.sibling=_,D=_);return q&&un(m,I),E}for(w=r(m,w);!_.done;I++,_=v.next())_=h(w,m,I,_.value,P),_!==null&&(e&&_.alternate!==null&&w.delete(_.key===null?I:_.key),f=a(_,f,I),D===null?E=_:D.sibling=_,D=_);return e&&w.forEach(function(Ze){return t(m,Ze)}),q&&un(m,I),E}function S(m,f,v,P){if(typeof v=="object"&&v!==null&&v.type===An&&v.key===null&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case vo:e:{for(var E=v.key,D=f;D!==null;){if(D.key===E){if(E=v.type,E===An){if(D.tag===7){n(m,D.sibling),f=o(D,v.props.children),f.return=m,m=f;break e}}else if(D.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===At&&jc(E)===D.type){n(m,D.sibling),f=o(D,v.props),f.ref=yr(m,D,v),f.return=m,m=f;break e}n(m,D);break}else t(m,D);D=D.sibling}v.type===An?(f=gn(v.props.children,m.mode,P,v.key),f.return=m,m=f):(P=Ho(v.type,v.key,v.props,null,m.mode,P),P.ref=yr(m,f,v),P.return=m,m=P)}return i(m);case Tn:e:{for(D=v.key;f!==null;){if(f.key===D)if(f.tag===4&&f.stateNode.containerInfo===v.containerInfo&&f.stateNode.implementation===v.implementation){n(m,f.sibling),f=o(f,v.children||[]),f.return=m,m=f;break e}else{n(m,f);break}else t(m,f);f=f.sibling}f=Xi(v,m.mode,P),f.return=m,m=f}return i(m);case At:return D=v._init,S(m,f,D(v._payload),P)}if(Dr(v))return g(m,f,v,P);if(pr(v))return y(m,f,v,P);Io(m,v)}return typeof v=="string"&&v!==""||typeof v=="number"?(v=""+v,f!==null&&f.tag===6?(n(m,f.sibling),f=o(f,v),f.return=m,m=f):(n(m,f),f=Ji(v,m.mode,P),f.return=m,m=f),i(m)):n(m,f)}return S}var tr=Pp(!0),Sp=Pp(!1),co={},st=rn(co),Kr=rn(co),Qr=rn(co);function pn(e){if(e===co)throw Error(b(174));return e}function Xu(e,t){switch(B(Qr,t),B(Kr,e),B(st,co),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Cs(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Cs(t,e)}W(st),B(st,t)}function nr(){W(st),W(Kr),W(Qr)}function Op(e){pn(Qr.current);var t=pn(st.current),n=Cs(t,e.type);t!==n&&(B(Kr,e),B(st,n))}function Zu(e){Kr.current===e&&(W(st),W(Kr))}var G=rn(0);function ha(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var qi=[];function el(){for(var e=0;e<qi.length;e++)qi[e]._workInProgressVersionPrimary=null;qi.length=0}var Bo=It.ReactCurrentDispatcher,Hi=It.ReactCurrentBatchConfig,Sn=0,K=null,te=null,oe=null,ga=!1,Ar=!1,Yr=0,tv=0;function ce(){throw Error(b(321))}function tl(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Xe(e[n],t[n]))return!1;return!0}function nl(e,t,n,r,o,a){if(Sn=a,K=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Bo.current=e===null||e.memoizedState===null?av:iv,e=n(r,o),Ar){a=0;do{if(Ar=!1,Yr=0,25<=a)throw Error(b(301));a+=1,oe=te=null,t.updateQueue=null,Bo.current=sv,e=n(r,o)}while(Ar)}if(Bo.current=va,t=te!==null&&te.next!==null,Sn=0,oe=te=K=null,ga=!1,t)throw Error(b(300));return e}function rl(){var e=Yr!==0;return Yr=0,e}function nt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return oe===null?K.memoizedState=oe=e:oe=oe.next=e,oe}function $e(){if(te===null){var e=K.alternate;e=e!==null?e.memoizedState:null}else e=te.next;var t=oe===null?K.memoizedState:oe.next;if(t!==null)oe=t,te=e;else{if(e===null)throw Error(b(310));te=e,e={memoizedState:te.memoizedState,baseState:te.baseState,baseQueue:te.baseQueue,queue:te.queue,next:null},oe===null?K.memoizedState=oe=e:oe=oe.next=e}return oe}function Jr(e,t){return typeof t=="function"?t(e):t}function Gi(e){var t=$e(),n=t.queue;if(n===null)throw Error(b(311));n.lastRenderedReducer=e;var r=te,o=r.baseQueue,a=n.pending;if(a!==null){if(o!==null){var i=o.next;o.next=a.next,a.next=i}r.baseQueue=o=a,n.pending=null}if(o!==null){a=o.next,r=r.baseState;var s=i=null,u=null,l=a;do{var d=l.lane;if((Sn&d)===d)u!==null&&(u=u.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),r=l.hasEagerState?l.eagerState:e(r,l.action);else{var c={lane:d,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null};u===null?(s=u=c,i=r):u=u.next=c,K.lanes|=d,On|=d}l=l.next}while(l!==null&&l!==a);u===null?i=r:u.next=s,Xe(r,t.memoizedState)||(be=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=u,n.lastRenderedState=r}if(e=n.interleaved,e!==null){o=e;do a=o.lane,K.lanes|=a,On|=a,o=o.next;while(o!==e)}else o===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Ki(e){var t=$e(),n=t.queue;if(n===null)throw Error(b(311));n.lastRenderedReducer=e;var r=n.dispatch,o=n.pending,a=t.memoizedState;if(o!==null){n.pending=null;var i=o=o.next;do a=e(a,i.action),i=i.next;while(i!==o);Xe(a,t.memoizedState)||(be=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function bp(){}function Ep(e,t){var n=K,r=$e(),o=t(),a=!Xe(r.memoizedState,o);if(a&&(r.memoizedState=o,be=!0),r=r.queue,ol(Cp.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||oe!==null&&oe.memoizedState.tag&1){if(n.flags|=2048,Xr(9,wp.bind(null,n,r,o,t),void 0,null),ae===null)throw Error(b(349));Sn&30||Dp(n,t,o)}return o}function Dp(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=K.updateQueue,t===null?(t={lastEffect:null,stores:null},K.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function wp(e,t,n,r){t.value=n,t.getSnapshot=r,Np(t)&&Ip(e)}function Cp(e,t,n){return n(function(){Np(t)&&Ip(e)})}function Np(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Xe(e,n)}catch{return!0}}function Ip(e){var t=wt(e,1);t!==null&&Je(t,e,1,-1)}function Tc(e){var t=nt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Jr,lastRenderedState:e},t.queue=e,e=e.dispatch=ov.bind(null,K,e),[t.memoizedState,e]}function Xr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=K.updateQueue,t===null?(t={lastEffect:null,stores:null},K.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function _p(){return $e().memoizedState}function $o(e,t,n,r){var o=nt();K.flags|=e,o.memoizedState=Xr(1|t,n,void 0,r===void 0?null:r)}function Ba(e,t,n,r){var o=$e();r=r===void 0?null:r;var a=void 0;if(te!==null){var i=te.memoizedState;if(a=i.destroy,r!==null&&tl(r,i.deps)){o.memoizedState=Xr(t,n,a,r);return}}K.flags|=e,o.memoizedState=Xr(1|t,n,a,r)}function Ac(e,t){return $o(8390656,8,e,t)}function ol(e,t){return Ba(2048,8,e,t)}function Rp(e,t){return Ba(4,2,e,t)}function jp(e,t){return Ba(4,4,e,t)}function Tp(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ap(e,t,n){return n=n!=null?n.concat([e]):null,Ba(4,4,Tp.bind(null,t,e),n)}function al(){}function Lp(e,t){var n=$e();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&tl(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function xp(e,t){var n=$e();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&tl(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function kp(e,t,n){return Sn&21?(Xe(n,t)||(n=Vf(),K.lanes|=n,On|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,be=!0),e.memoizedState=n)}function nv(e,t){var n=M;M=n!==0&&4>n?n:4,e(!0);var r=Hi.transition;Hi.transition={};try{e(!1),t()}finally{M=n,Hi.transition=r}}function Mp(){return $e().memoizedState}function rv(e,t,n){var r=Ht(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Fp(e))Vp(t,n);else if(n=hp(e,t,n,r),n!==null){var o=ye();Je(n,e,r,o),Up(n,t,r)}}function ov(e,t,n){var r=Ht(e),o={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Fp(e))Vp(t,o);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var i=t.lastRenderedState,s=a(i,n);if(o.hasEagerState=!0,o.eagerState=s,Xe(s,i)){var u=t.interleaved;u===null?(o.next=o,Yu(t)):(o.next=u.next,u.next=o),t.interleaved=o;return}}catch{}finally{}n=hp(e,t,o,r),n!==null&&(o=ye(),Je(n,e,r,o),Up(n,t,r))}}function Fp(e){var t=e.alternate;return e===K||t!==null&&t===K}function Vp(e,t){Ar=ga=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Up(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ku(e,n)}}var va={readContext:Be,useCallback:ce,useContext:ce,useEffect:ce,useImperativeHandle:ce,useInsertionEffect:ce,useLayoutEffect:ce,useMemo:ce,useReducer:ce,useRef:ce,useState:ce,useDebugValue:ce,useDeferredValue:ce,useTransition:ce,useMutableSource:ce,useSyncExternalStore:ce,useId:ce,unstable_isNewReconciler:!1},av={readContext:Be,useCallback:function(e,t){return nt().memoizedState=[e,t===void 0?null:t],e},useContext:Be,useEffect:Ac,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,$o(4194308,4,Tp.bind(null,t,e),n)},useLayoutEffect:function(e,t){return $o(4194308,4,e,t)},useInsertionEffect:function(e,t){return $o(4,2,e,t)},useMemo:function(e,t){var n=nt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=nt();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=rv.bind(null,K,e),[r.memoizedState,e]},useRef:function(e){var t=nt();return e={current:e},t.memoizedState=e},useState:Tc,useDebugValue:al,useDeferredValue:function(e){return nt().memoizedState=e},useTransition:function(){var e=Tc(!1),t=e[0];return e=nv.bind(null,e[1]),nt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=K,o=nt();if(q){if(n===void 0)throw Error(b(407));n=n()}else{if(n=t(),ae===null)throw Error(b(349));Sn&30||Dp(r,t,n)}o.memoizedState=n;var a={value:n,getSnapshot:t};return o.queue=a,Ac(Cp.bind(null,r,a,e),[e]),r.flags|=2048,Xr(9,wp.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=nt(),t=ae.identifierPrefix;if(q){var n=St,r=Pt;n=(r&~(1<<32-Ye(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Yr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=tv++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},iv={readContext:Be,useCallback:Lp,useContext:Be,useEffect:ol,useImperativeHandle:Ap,useInsertionEffect:Rp,useLayoutEffect:jp,useMemo:xp,useReducer:Gi,useRef:_p,useState:function(){return Gi(Jr)},useDebugValue:al,useDeferredValue:function(e){var t=$e();return kp(t,te.memoizedState,e)},useTransition:function(){var e=Gi(Jr)[0],t=$e().memoizedState;return[e,t]},useMutableSource:bp,useSyncExternalStore:Ep,useId:Mp,unstable_isNewReconciler:!1},sv={readContext:Be,useCallback:Lp,useContext:Be,useEffect:ol,useImperativeHandle:Ap,useInsertionEffect:Rp,useLayoutEffect:jp,useMemo:xp,useReducer:Ki,useRef:_p,useState:function(){return Ki(Jr)},useDebugValue:al,useDeferredValue:function(e){var t=$e();return te===null?t.memoizedState=e:kp(t,te.memoizedState,e)},useTransition:function(){var e=Ki(Jr)[0],t=$e().memoizedState;return[e,t]},useMutableSource:bp,useSyncExternalStore:Ep,useId:Mp,unstable_isNewReconciler:!1};function rr(e,t){try{var n="",r=t;do n+=xh(r),r=r.return;while(r);var o=n}catch(a){o=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:o,digest:null}}function Qi(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Qs(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var uv=typeof WeakMap=="function"?WeakMap:Map;function Bp(e,t,n){n=Ot(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Pa||(Pa=!0,au=r),Qs(e,t)},n}function $p(e,t,n){n=Ot(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var o=t.value;n.payload=function(){return r(o)},n.callback=function(){Qs(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){Qs(e,t),typeof r!="function"&&(qt===null?qt=new Set([this]):qt.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function Lc(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new uv;var o=new Set;r.set(t,o)}else o=r.get(t),o===void 0&&(o=new Set,r.set(t,o));o.has(n)||(o.add(n),e=bv.bind(null,e,t,n),t.then(e,e))}function xc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function kc(e,t,n,r,o){return e.mode&1?(e.flags|=65536,e.lanes=o,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Ot(-1,1),t.tag=2,zt(n,t,1))),n.lanes|=1),e)}var lv=It.ReactCurrentOwner,be=!1;function ve(e,t,n,r){t.child=e===null?Sp(t,null,n,r):tr(t,e.child,n,r)}function Mc(e,t,n,r,o){n=n.render;var a=t.ref;return Kn(t,o),r=nl(e,t,n,r,a,o),n=rl(),e!==null&&!be?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Ct(e,t,o)):(q&&n&&zu(t),t.flags|=1,ve(e,t,r,o),t.child)}function Fc(e,t,n,r,o){if(e===null){var a=n.type;return typeof a=="function"&&!pl(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,Wp(e,t,a,r,o)):(e=Ho(n.type,null,r,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!(e.lanes&o)){var i=a.memoizedProps;if(n=n.compare,n=n!==null?n:zr,n(i,r)&&e.ref===t.ref)return Ct(e,t,o)}return t.flags|=1,e=Gt(a,r),e.ref=t.ref,e.return=t,t.child=e}function Wp(e,t,n,r,o){if(e!==null){var a=e.memoizedProps;if(zr(a,r)&&e.ref===t.ref)if(be=!1,t.pendingProps=r=a,(e.lanes&o)!==0)e.flags&131072&&(be=!0);else return t.lanes=e.lanes,Ct(e,t,o)}return Ys(e,t,n,r,o)}function zp(e,t,n){var r=t.pendingProps,o=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},B(Wn,Ie),Ie|=n;else{if(!(n&1073741824))return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,B(Wn,Ie),Ie|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,B(Wn,Ie),Ie|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,B(Wn,Ie),Ie|=r;return ve(e,t,o,n),t.child}function qp(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Ys(e,t,n,r,o){var a=De(n)?yn:he.current;return a=Zn(t,a),Kn(t,o),n=nl(e,t,n,r,a,o),r=rl(),e!==null&&!be?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Ct(e,t,o)):(q&&r&&zu(t),t.flags|=1,ve(e,t,n,o),t.child)}function Vc(e,t,n,r,o){if(De(n)){var a=!0;la(t)}else a=!1;if(Kn(t,o),t.stateNode===null)Wo(e,t),yp(t,n,r),Ks(t,n,r,o),r=!0;else if(e===null){var i=t.stateNode,s=t.memoizedProps;i.props=s;var u=i.context,l=n.contextType;typeof l=="object"&&l!==null?l=Be(l):(l=De(n)?yn:he.current,l=Zn(t,l));var d=n.getDerivedStateFromProps,c=typeof d=="function"||typeof i.getSnapshotBeforeUpdate=="function";c||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(s!==r||u!==l)&&Rc(t,i,r,l),Lt=!1;var p=t.memoizedState;i.state=p,ma(t,r,i,o),u=t.memoizedState,s!==r||p!==u||Ee.current||Lt?(typeof d=="function"&&(Gs(t,n,d,r),u=t.memoizedState),(s=Lt||_c(t,n,s,r,p,u,l))?(c||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=u),i.props=r,i.state=u,i.context=l,r=s):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,gp(e,t),s=t.memoizedProps,l=t.type===t.elementType?s:He(t.type,s),i.props=l,c=t.pendingProps,p=i.context,u=n.contextType,typeof u=="object"&&u!==null?u=Be(u):(u=De(n)?yn:he.current,u=Zn(t,u));var h=n.getDerivedStateFromProps;(d=typeof h=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(s!==c||p!==u)&&Rc(t,i,r,u),Lt=!1,p=t.memoizedState,i.state=p,ma(t,r,i,o);var g=t.memoizedState;s!==c||p!==g||Ee.current||Lt?(typeof h=="function"&&(Gs(t,n,h,r),g=t.memoizedState),(l=Lt||_c(t,n,l,r,p,g,u)||!1)?(d||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,g,u),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,g,u)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||s===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&p===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=g),i.props=r,i.state=g,i.context=u,r=l):(typeof i.componentDidUpdate!="function"||s===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&p===e.memoizedState||(t.flags|=1024),r=!1)}return Js(e,t,n,r,a,o)}function Js(e,t,n,r,o,a){qp(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return o&&Dc(t,n,!1),Ct(e,t,a);r=t.stateNode,lv.current=t;var s=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=tr(t,e.child,null,a),t.child=tr(t,null,s,a)):ve(e,t,s,a),t.memoizedState=r.state,o&&Dc(t,n,!0),t.child}function Hp(e){var t=e.stateNode;t.pendingContext?Ec(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Ec(e,t.context,!1),Xu(e,t.containerInfo)}function Uc(e,t,n,r,o){return er(),Hu(o),t.flags|=256,ve(e,t,n,r),t.child}var Xs={dehydrated:null,treeContext:null,retryLane:0};function Zs(e){return{baseLanes:e,cachePool:null,transitions:null}}function Gp(e,t,n){var r=t.pendingProps,o=G.current,a=!1,i=(t.flags&128)!==0,s;if((s=i)||(s=e!==null&&e.memoizedState===null?!1:(o&2)!==0),s?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),B(G,o&1),e===null)return qs(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(i=r.children,e=r.fallback,a?(r=t.mode,a=t.child,i={mode:"hidden",children:i},!(r&1)&&a!==null?(a.childLanes=0,a.pendingProps=i):a=za(i,r,0,null),e=gn(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=Zs(n),t.memoizedState=Xs,e):il(t,i));if(o=e.memoizedState,o!==null&&(s=o.dehydrated,s!==null))return cv(e,t,i,r,s,o,n);if(a){a=r.fallback,i=t.mode,o=e.child,s=o.sibling;var u={mode:"hidden",children:r.children};return!(i&1)&&t.child!==o?(r=t.child,r.childLanes=0,r.pendingProps=u,t.deletions=null):(r=Gt(o,u),r.subtreeFlags=o.subtreeFlags&14680064),s!==null?a=Gt(s,a):(a=gn(a,i,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,i=e.child.memoizedState,i=i===null?Zs(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},a.memoizedState=i,a.childLanes=e.childLanes&~n,t.memoizedState=Xs,r}return a=e.child,e=a.sibling,r=Gt(a,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function il(e,t){return t=za({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function _o(e,t,n,r){return r!==null&&Hu(r),tr(t,e.child,null,n),e=il(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function cv(e,t,n,r,o,a,i){if(n)return t.flags&256?(t.flags&=-257,r=Qi(Error(b(422))),_o(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,o=t.mode,r=za({mode:"visible",children:r.children},o,0,null),a=gn(a,o,i,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,t.mode&1&&tr(t,e.child,null,i),t.child.memoizedState=Zs(i),t.memoizedState=Xs,a);if(!(t.mode&1))return _o(e,t,i,null);if(o.data==="$!"){if(r=o.nextSibling&&o.nextSibling.dataset,r)var s=r.dgst;return r=s,a=Error(b(419)),r=Qi(a,r,void 0),_o(e,t,i,r)}if(s=(i&e.childLanes)!==0,be||s){if(r=ae,r!==null){switch(i&-i){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=o&(r.suspendedLanes|i)?0:o,o!==0&&o!==a.retryLane&&(a.retryLane=o,wt(e,o),Je(r,e,o,-1))}return fl(),r=Qi(Error(b(421))),_o(e,t,i,r)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=Ev.bind(null,e),o._reactRetry=t,null):(e=a.treeContext,_e=Wt(o.nextSibling),Re=t,q=!0,Ke=null,e!==null&&(ke[Me++]=Pt,ke[Me++]=St,ke[Me++]=Pn,Pt=e.id,St=e.overflow,Pn=t),t=il(t,r.children),t.flags|=4096,t)}function Bc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Hs(e.return,t,n)}function Yi(e,t,n,r,o){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:o}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=o)}function Kp(e,t,n){var r=t.pendingProps,o=r.revealOrder,a=r.tail;if(ve(e,t,r.children,n),r=G.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Bc(e,n,t);else if(e.tag===19)Bc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(B(G,r),!(t.mode&1))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;n!==null;)e=n.alternate,e!==null&&ha(e)===null&&(o=n),n=n.sibling;n=o,n===null?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Yi(t,!1,o,n,a);break;case"backwards":for(n=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&ha(e)===null){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}Yi(t,!0,n,null,a);break;case"together":Yi(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Wo(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Ct(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),On|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(b(153));if(t.child!==null){for(e=t.child,n=Gt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Gt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function dv(e,t,n){switch(t.tag){case 3:Hp(t),er();break;case 5:Op(t);break;case 1:De(t.type)&&la(t);break;case 4:Xu(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,o=t.memoizedProps.value;B(fa,r._currentValue),r._currentValue=o;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(B(G,G.current&1),t.flags|=128,null):n&t.child.childLanes?Gp(e,t,n):(B(G,G.current&1),e=Ct(e,t,n),e!==null?e.sibling:null);B(G,G.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Kp(e,t,n);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),B(G,G.current),r)break;return null;case 22:case 23:return t.lanes=0,zp(e,t,n)}return Ct(e,t,n)}var Qp,eu,Yp,Jp;Qp=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};eu=function(){};Yp=function(e,t,n,r){var o=e.memoizedProps;if(o!==r){e=t.stateNode,pn(st.current);var a=null;switch(n){case"input":o=bs(e,o),r=bs(e,r),a=[];break;case"select":o=Q({},o,{value:void 0}),r=Q({},r,{value:void 0}),a=[];break;case"textarea":o=ws(e,o),r=ws(e,r),a=[];break;default:typeof o.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=sa)}Ns(n,r);var i;n=null;for(l in o)if(!r.hasOwnProperty(l)&&o.hasOwnProperty(l)&&o[l]!=null)if(l==="style"){var s=o[l];for(i in s)s.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else l!=="dangerouslySetInnerHTML"&&l!=="children"&&l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(Mr.hasOwnProperty(l)?a||(a=[]):(a=a||[]).push(l,null));for(l in r){var u=r[l];if(s=o!=null?o[l]:void 0,r.hasOwnProperty(l)&&u!==s&&(u!=null||s!=null))if(l==="style")if(s){for(i in s)!s.hasOwnProperty(i)||u&&u.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in u)u.hasOwnProperty(i)&&s[i]!==u[i]&&(n||(n={}),n[i]=u[i])}else n||(a||(a=[]),a.push(l,n)),n=u;else l==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,s=s?s.__html:void 0,u!=null&&s!==u&&(a=a||[]).push(l,u)):l==="children"?typeof u!="string"&&typeof u!="number"||(a=a||[]).push(l,""+u):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&(Mr.hasOwnProperty(l)?(u!=null&&l==="onScroll"&&$("scroll",e),a||s===u||(a=[])):(a=a||[]).push(l,u))}n&&(a=a||[]).push("style",n);var l=a;(t.updateQueue=l)&&(t.flags|=4)}};Jp=function(e,t,n,r){n!==r&&(t.flags|=4)};function Pr(e,t){if(!q)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function de(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags&14680064,r|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags,r|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function fv(e,t,n){var r=t.pendingProps;switch(qu(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return de(t),null;case 1:return De(t.type)&&ua(),de(t),null;case 3:return r=t.stateNode,nr(),W(Ee),W(he),el(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(No(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Ke!==null&&(uu(Ke),Ke=null))),eu(e,t),de(t),null;case 5:Zu(t);var o=pn(Qr.current);if(n=t.type,e!==null&&t.stateNode!=null)Yp(e,t,n,r,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(b(166));return de(t),null}if(e=pn(st.current),No(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[rt]=t,r[Gr]=a,e=(t.mode&1)!==0,n){case"dialog":$("cancel",r),$("close",r);break;case"iframe":case"object":case"embed":$("load",r);break;case"video":case"audio":for(o=0;o<Cr.length;o++)$(Cr[o],r);break;case"source":$("error",r);break;case"img":case"image":case"link":$("error",r),$("load",r);break;case"details":$("toggle",r);break;case"input":Yl(r,a),$("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},$("invalid",r);break;case"textarea":Xl(r,a),$("invalid",r)}Ns(n,a),o=null;for(var i in a)if(a.hasOwnProperty(i)){var s=a[i];i==="children"?typeof s=="string"?r.textContent!==s&&(a.suppressHydrationWarning!==!0&&Co(r.textContent,s,e),o=["children",s]):typeof s=="number"&&r.textContent!==""+s&&(a.suppressHydrationWarning!==!0&&Co(r.textContent,s,e),o=["children",""+s]):Mr.hasOwnProperty(i)&&s!=null&&i==="onScroll"&&$("scroll",r)}switch(n){case"input":yo(r),Jl(r,a,!0);break;case"textarea":yo(r),Zl(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=sa)}r=o,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Df(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[rt]=t,e[Gr]=r,Qp(e,t,!1,!1),t.stateNode=e;e:{switch(i=Is(n,r),n){case"dialog":$("cancel",e),$("close",e),o=r;break;case"iframe":case"object":case"embed":$("load",e),o=r;break;case"video":case"audio":for(o=0;o<Cr.length;o++)$(Cr[o],e);o=r;break;case"source":$("error",e),o=r;break;case"img":case"image":case"link":$("error",e),$("load",e),o=r;break;case"details":$("toggle",e),o=r;break;case"input":Yl(e,r),o=bs(e,r),$("invalid",e);break;case"option":o=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},o=Q({},r,{value:void 0}),$("invalid",e);break;case"textarea":Xl(e,r),o=ws(e,r),$("invalid",e);break;default:o=r}Ns(n,o),s=o;for(a in s)if(s.hasOwnProperty(a)){var u=s[a];a==="style"?Nf(e,u):a==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&wf(e,u)):a==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&Fr(e,u):typeof u=="number"&&Fr(e,""+u):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(Mr.hasOwnProperty(a)?u!=null&&a==="onScroll"&&$("scroll",e):u!=null&&Ru(e,a,u,i))}switch(n){case"input":yo(e),Jl(e,r,!1);break;case"textarea":yo(e),Zl(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Jt(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?zn(e,!!r.multiple,a,!1):r.defaultValue!=null&&zn(e,!!r.multiple,r.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=sa)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return de(t),null;case 6:if(e&&t.stateNode!=null)Jp(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(b(166));if(n=pn(Qr.current),pn(st.current),No(t)){if(r=t.stateNode,n=t.memoizedProps,r[rt]=t,(a=r.nodeValue!==n)&&(e=Re,e!==null))switch(e.tag){case 3:Co(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Co(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[rt]=t,t.stateNode=r}return de(t),null;case 13:if(W(G),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(q&&_e!==null&&t.mode&1&&!(t.flags&128))mp(),er(),t.flags|=98560,a=!1;else if(a=No(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(b(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(b(317));a[rt]=t}else er(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;de(t),a=!1}else Ke!==null&&(uu(Ke),Ke=null),a=!0;if(!a)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||G.current&1?ne===0&&(ne=3):fl())),t.updateQueue!==null&&(t.flags|=4),de(t),null);case 4:return nr(),eu(e,t),e===null&&qr(t.stateNode.containerInfo),de(t),null;case 10:return Qu(t.type._context),de(t),null;case 17:return De(t.type)&&ua(),de(t),null;case 19:if(W(G),a=t.memoizedState,a===null)return de(t),null;if(r=(t.flags&128)!==0,i=a.rendering,i===null)if(r)Pr(a,!1);else{if(ne!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(i=ha(e),i!==null){for(t.flags|=128,Pr(a,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,i=a.alternate,i===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=i.childLanes,a.lanes=i.lanes,a.child=i.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=i.memoizedProps,a.memoizedState=i.memoizedState,a.updateQueue=i.updateQueue,a.type=i.type,e=i.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return B(G,G.current&1|2),t.child}e=e.sibling}a.tail!==null&&J()>or&&(t.flags|=128,r=!0,Pr(a,!1),t.lanes=4194304)}else{if(!r)if(e=ha(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Pr(a,!0),a.tail===null&&a.tailMode==="hidden"&&!i.alternate&&!q)return de(t),null}else 2*J()-a.renderingStartTime>or&&n!==1073741824&&(t.flags|=128,r=!0,Pr(a,!1),t.lanes=4194304);a.isBackwards?(i.sibling=t.child,t.child=i):(n=a.last,n!==null?n.sibling=i:t.child=i,a.last=i)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=J(),t.sibling=null,n=G.current,B(G,r?n&1|2:n&1),t):(de(t),null);case 22:case 23:return dl(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?Ie&1073741824&&(de(t),t.subtreeFlags&6&&(t.flags|=8192)):de(t),null;case 24:return null;case 25:return null}throw Error(b(156,t.tag))}function pv(e,t){switch(qu(t),t.tag){case 1:return De(t.type)&&ua(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return nr(),W(Ee),W(he),el(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Zu(t),null;case 13:if(W(G),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(b(340));er()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return W(G),null;case 4:return nr(),null;case 10:return Qu(t.type._context),null;case 22:case 23:return dl(),null;case 24:return null;default:return null}}var Ro=!1,me=!1,mv=typeof WeakSet=="function"?WeakSet:Set,N=null;function $n(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Y(e,t,r)}else n.current=null}function tu(e,t,n){try{n()}catch(r){Y(e,t,r)}}var $c=!1;function hv(e,t){if(Fs=oa,e=tp(),Wu(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var o=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break e}var i=0,s=-1,u=-1,l=0,d=0,c=e,p=null;t:for(;;){for(var h;c!==n||o!==0&&c.nodeType!==3||(s=i+o),c!==a||r!==0&&c.nodeType!==3||(u=i+r),c.nodeType===3&&(i+=c.nodeValue.length),(h=c.firstChild)!==null;)p=c,c=h;for(;;){if(c===e)break t;if(p===n&&++l===o&&(s=i),p===a&&++d===r&&(u=i),(h=c.nextSibling)!==null)break;c=p,p=c.parentNode}c=h}n=s===-1||u===-1?null:{start:s,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(Vs={focusedElem:e,selectionRange:n},oa=!1,N=t;N!==null;)if(t=N,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,N=e;else for(;N!==null;){t=N;try{var g=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var y=g.memoizedProps,S=g.memoizedState,m=t.stateNode,f=m.getSnapshotBeforeUpdate(t.elementType===t.type?y:He(t.type,y),S);m.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var v=t.stateNode.containerInfo;v.nodeType===1?v.textContent="":v.nodeType===9&&v.documentElement&&v.removeChild(v.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(b(163))}}catch(P){Y(t,t.return,P)}if(e=t.sibling,e!==null){e.return=t.return,N=e;break}N=t.return}return g=$c,$c=!1,g}function Lr(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var o=r=r.next;do{if((o.tag&e)===e){var a=o.destroy;o.destroy=void 0,a!==void 0&&tu(t,n,a)}o=o.next}while(o!==r)}}function $a(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function nu(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Xp(e){var t=e.alternate;t!==null&&(e.alternate=null,Xp(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[rt],delete t[Gr],delete t[$s],delete t[Jg],delete t[Xg])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Zp(e){return e.tag===5||e.tag===3||e.tag===4}function Wc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Zp(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ru(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=sa));else if(r!==4&&(e=e.child,e!==null))for(ru(e,t,n),e=e.sibling;e!==null;)ru(e,t,n),e=e.sibling}function ou(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(ou(e,t,n),e=e.sibling;e!==null;)ou(e,t,n),e=e.sibling}var se=null,Ge=!1;function jt(e,t,n){for(n=n.child;n!==null;)em(e,t,n),n=n.sibling}function em(e,t,n){if(it&&typeof it.onCommitFiberUnmount=="function")try{it.onCommitFiberUnmount(La,n)}catch{}switch(n.tag){case 5:me||$n(n,t);case 6:var r=se,o=Ge;se=null,jt(e,t,n),se=r,Ge=o,se!==null&&(Ge?(e=se,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):se.removeChild(n.stateNode));break;case 18:se!==null&&(Ge?(e=se,n=n.stateNode,e.nodeType===8?Wi(e.parentNode,n):e.nodeType===1&&Wi(e,n),$r(e)):Wi(se,n.stateNode));break;case 4:r=se,o=Ge,se=n.stateNode.containerInfo,Ge=!0,jt(e,t,n),se=r,Ge=o;break;case 0:case 11:case 14:case 15:if(!me&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){o=r=r.next;do{var a=o,i=a.destroy;a=a.tag,i!==void 0&&(a&2||a&4)&&tu(n,t,i),o=o.next}while(o!==r)}jt(e,t,n);break;case 1:if(!me&&($n(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(s){Y(n,t,s)}jt(e,t,n);break;case 21:jt(e,t,n);break;case 22:n.mode&1?(me=(r=me)||n.memoizedState!==null,jt(e,t,n),me=r):jt(e,t,n);break;default:jt(e,t,n)}}function zc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new mv),t.forEach(function(r){var o=Dv.bind(null,e,r);n.has(r)||(n.add(r),r.then(o,o))})}}function ze(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var o=n[r];try{var a=e,i=t,s=i;e:for(;s!==null;){switch(s.tag){case 5:se=s.stateNode,Ge=!1;break e;case 3:se=s.stateNode.containerInfo,Ge=!0;break e;case 4:se=s.stateNode.containerInfo,Ge=!0;break e}s=s.return}if(se===null)throw Error(b(160));em(a,i,o),se=null,Ge=!1;var u=o.alternate;u!==null&&(u.return=null),o.return=null}catch(l){Y(o,t,l)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)tm(t,e),t=t.sibling}function tm(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(ze(t,e),et(e),r&4){try{Lr(3,e,e.return),$a(3,e)}catch(y){Y(e,e.return,y)}try{Lr(5,e,e.return)}catch(y){Y(e,e.return,y)}}break;case 1:ze(t,e),et(e),r&512&&n!==null&&$n(n,n.return);break;case 5:if(ze(t,e),et(e),r&512&&n!==null&&$n(n,n.return),e.flags&32){var o=e.stateNode;try{Fr(o,"")}catch(y){Y(e,e.return,y)}}if(r&4&&(o=e.stateNode,o!=null)){var a=e.memoizedProps,i=n!==null?n.memoizedProps:a,s=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{s==="input"&&a.type==="radio"&&a.name!=null&&bf(o,a),Is(s,i);var l=Is(s,a);for(i=0;i<u.length;i+=2){var d=u[i],c=u[i+1];d==="style"?Nf(o,c):d==="dangerouslySetInnerHTML"?wf(o,c):d==="children"?Fr(o,c):Ru(o,d,c,l)}switch(s){case"input":Es(o,a);break;case"textarea":Ef(o,a);break;case"select":var p=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!a.multiple;var h=a.value;h!=null?zn(o,!!a.multiple,h,!1):p!==!!a.multiple&&(a.defaultValue!=null?zn(o,!!a.multiple,a.defaultValue,!0):zn(o,!!a.multiple,a.multiple?[]:"",!1))}o[Gr]=a}catch(y){Y(e,e.return,y)}}break;case 6:if(ze(t,e),et(e),r&4){if(e.stateNode===null)throw Error(b(162));o=e.stateNode,a=e.memoizedProps;try{o.nodeValue=a}catch(y){Y(e,e.return,y)}}break;case 3:if(ze(t,e),et(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{$r(t.containerInfo)}catch(y){Y(e,e.return,y)}break;case 4:ze(t,e),et(e);break;case 13:ze(t,e),et(e),o=e.child,o.flags&8192&&(a=o.memoizedState!==null,o.stateNode.isHidden=a,!a||o.alternate!==null&&o.alternate.memoizedState!==null||(ll=J())),r&4&&zc(e);break;case 22:if(d=n!==null&&n.memoizedState!==null,e.mode&1?(me=(l=me)||d,ze(t,e),me=l):ze(t,e),et(e),r&8192){if(l=e.memoizedState!==null,(e.stateNode.isHidden=l)&&!d&&e.mode&1)for(N=e,d=e.child;d!==null;){for(c=N=d;N!==null;){switch(p=N,h=p.child,p.tag){case 0:case 11:case 14:case 15:Lr(4,p,p.return);break;case 1:$n(p,p.return);var g=p.stateNode;if(typeof g.componentWillUnmount=="function"){r=p,n=p.return;try{t=r,g.props=t.memoizedProps,g.state=t.memoizedState,g.componentWillUnmount()}catch(y){Y(r,n,y)}}break;case 5:$n(p,p.return);break;case 22:if(p.memoizedState!==null){Hc(c);continue}}h!==null?(h.return=p,N=h):Hc(c)}d=d.sibling}e:for(d=null,c=e;;){if(c.tag===5){if(d===null){d=c;try{o=c.stateNode,l?(a=o.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(s=c.stateNode,u=c.memoizedProps.style,i=u!=null&&u.hasOwnProperty("display")?u.display:null,s.style.display=Cf("display",i))}catch(y){Y(e,e.return,y)}}}else if(c.tag===6){if(d===null)try{c.stateNode.nodeValue=l?"":c.memoizedProps}catch(y){Y(e,e.return,y)}}else if((c.tag!==22&&c.tag!==23||c.memoizedState===null||c===e)&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===e)break e;for(;c.sibling===null;){if(c.return===null||c.return===e)break e;d===c&&(d=null),c=c.return}d===c&&(d=null),c.sibling.return=c.return,c=c.sibling}}break;case 19:ze(t,e),et(e),r&4&&zc(e);break;case 21:break;default:ze(t,e),et(e)}}function et(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Zp(n)){var r=n;break e}n=n.return}throw Error(b(160))}switch(r.tag){case 5:var o=r.stateNode;r.flags&32&&(Fr(o,""),r.flags&=-33);var a=Wc(e);ou(e,a,o);break;case 3:case 4:var i=r.stateNode.containerInfo,s=Wc(e);ru(e,s,i);break;default:throw Error(b(161))}}catch(u){Y(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function gv(e,t,n){N=e,nm(e)}function nm(e,t,n){for(var r=(e.mode&1)!==0;N!==null;){var o=N,a=o.child;if(o.tag===22&&r){var i=o.memoizedState!==null||Ro;if(!i){var s=o.alternate,u=s!==null&&s.memoizedState!==null||me;s=Ro;var l=me;if(Ro=i,(me=u)&&!l)for(N=o;N!==null;)i=N,u=i.child,i.tag===22&&i.memoizedState!==null?Gc(o):u!==null?(u.return=i,N=u):Gc(o);for(;a!==null;)N=a,nm(a),a=a.sibling;N=o,Ro=s,me=l}qc(e)}else o.subtreeFlags&8772&&a!==null?(a.return=o,N=a):qc(e)}}function qc(e){for(;N!==null;){var t=N;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:me||$a(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!me)if(n===null)r.componentDidMount();else{var o=t.elementType===t.type?n.memoizedProps:He(t.type,n.memoizedProps);r.componentDidUpdate(o,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&Ic(t,a,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Ic(t,i,n)}break;case 5:var s=t.stateNode;if(n===null&&t.flags&4){n=s;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var l=t.alternate;if(l!==null){var d=l.memoizedState;if(d!==null){var c=d.dehydrated;c!==null&&$r(c)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(b(163))}me||t.flags&512&&nu(t)}catch(p){Y(t,t.return,p)}}if(t===e){N=null;break}if(n=t.sibling,n!==null){n.return=t.return,N=n;break}N=t.return}}function Hc(e){for(;N!==null;){var t=N;if(t===e){N=null;break}var n=t.sibling;if(n!==null){n.return=t.return,N=n;break}N=t.return}}function Gc(e){for(;N!==null;){var t=N;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{$a(4,t)}catch(u){Y(t,n,u)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var o=t.return;try{r.componentDidMount()}catch(u){Y(t,o,u)}}var a=t.return;try{nu(t)}catch(u){Y(t,a,u)}break;case 5:var i=t.return;try{nu(t)}catch(u){Y(t,i,u)}}}catch(u){Y(t,t.return,u)}if(t===e){N=null;break}var s=t.sibling;if(s!==null){s.return=t.return,N=s;break}N=t.return}}var vv=Math.ceil,ya=It.ReactCurrentDispatcher,sl=It.ReactCurrentOwner,Ve=It.ReactCurrentBatchConfig,k=0,ae=null,ee=null,ue=0,Ie=0,Wn=rn(0),ne=0,Zr=null,On=0,Wa=0,ul=0,xr=null,Oe=null,ll=0,or=1/0,vt=null,Pa=!1,au=null,qt=null,jo=!1,Vt=null,Sa=0,kr=0,iu=null,zo=-1,qo=0;function ye(){return k&6?J():zo!==-1?zo:zo=J()}function Ht(e){return e.mode&1?k&2&&ue!==0?ue&-ue:ev.transition!==null?(qo===0&&(qo=Vf()),qo):(e=M,e!==0||(e=window.event,e=e===void 0?16:Hf(e.type)),e):1}function Je(e,t,n,r){if(50<kr)throw kr=0,iu=null,Error(b(185));so(e,n,r),(!(k&2)||e!==ae)&&(e===ae&&(!(k&2)&&(Wa|=n),ne===4&&kt(e,ue)),we(e,r),n===1&&k===0&&!(t.mode&1)&&(or=J()+500,Va&&on()))}function we(e,t){var n=e.callbackNode;eg(e,t);var r=ra(e,e===ae?ue:0);if(r===0)n!==null&&nc(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&nc(n),t===1)e.tag===0?Zg(Kc.bind(null,e)):dp(Kc.bind(null,e)),Qg(function(){!(k&6)&&on()}),n=null;else{switch(Uf(r)){case 1:n=xu;break;case 4:n=Mf;break;case 16:n=na;break;case 536870912:n=Ff;break;default:n=na}n=cm(n,rm.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function rm(e,t){if(zo=-1,qo=0,k&6)throw Error(b(327));var n=e.callbackNode;if(Qn()&&e.callbackNode!==n)return null;var r=ra(e,e===ae?ue:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=Oa(e,r);else{t=r;var o=k;k|=2;var a=am();(ae!==e||ue!==t)&&(vt=null,or=J()+500,hn(e,t));do try{Sv();break}catch(s){om(e,s)}while(1);Ku(),ya.current=a,k=o,ee!==null?t=0:(ae=null,ue=0,t=ne)}if(t!==0){if(t===2&&(o=As(e),o!==0&&(r=o,t=su(e,o))),t===1)throw n=Zr,hn(e,0),kt(e,r),we(e,J()),n;if(t===6)kt(e,r);else{if(o=e.current.alternate,!(r&30)&&!yv(o)&&(t=Oa(e,r),t===2&&(a=As(e),a!==0&&(r=a,t=su(e,a))),t===1))throw n=Zr,hn(e,0),kt(e,r),we(e,J()),n;switch(e.finishedWork=o,e.finishedLanes=r,t){case 0:case 1:throw Error(b(345));case 2:ln(e,Oe,vt);break;case 3:if(kt(e,r),(r&130023424)===r&&(t=ll+500-J(),10<t)){if(ra(e,0)!==0)break;if(o=e.suspendedLanes,(o&r)!==r){ye(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Bs(ln.bind(null,e,Oe,vt),t);break}ln(e,Oe,vt);break;case 4:if(kt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,o=-1;0<r;){var i=31-Ye(r);a=1<<i,i=t[i],i>o&&(o=i),r&=~a}if(r=o,r=J()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*vv(r/1960))-r,10<r){e.timeoutHandle=Bs(ln.bind(null,e,Oe,vt),r);break}ln(e,Oe,vt);break;case 5:ln(e,Oe,vt);break;default:throw Error(b(329))}}}return we(e,J()),e.callbackNode===n?rm.bind(null,e):null}function su(e,t){var n=xr;return e.current.memoizedState.isDehydrated&&(hn(e,t).flags|=256),e=Oa(e,t),e!==2&&(t=Oe,Oe=n,t!==null&&uu(t)),e}function uu(e){Oe===null?Oe=e:Oe.push.apply(Oe,e)}function yv(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var o=n[r],a=o.getSnapshot;o=o.value;try{if(!Xe(a(),o))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function kt(e,t){for(t&=~ul,t&=~Wa,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Ye(t),r=1<<n;e[n]=-1,t&=~r}}function Kc(e){if(k&6)throw Error(b(327));Qn();var t=ra(e,0);if(!(t&1))return we(e,J()),null;var n=Oa(e,t);if(e.tag!==0&&n===2){var r=As(e);r!==0&&(t=r,n=su(e,r))}if(n===1)throw n=Zr,hn(e,0),kt(e,t),we(e,J()),n;if(n===6)throw Error(b(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,ln(e,Oe,vt),we(e,J()),null}function cl(e,t){var n=k;k|=1;try{return e(t)}finally{k=n,k===0&&(or=J()+500,Va&&on())}}function bn(e){Vt!==null&&Vt.tag===0&&!(k&6)&&Qn();var t=k;k|=1;var n=Ve.transition,r=M;try{if(Ve.transition=null,M=1,e)return e()}finally{M=r,Ve.transition=n,k=t,!(k&6)&&on()}}function dl(){Ie=Wn.current,W(Wn)}function hn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Kg(n)),ee!==null)for(n=ee.return;n!==null;){var r=n;switch(qu(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&ua();break;case 3:nr(),W(Ee),W(he),el();break;case 5:Zu(r);break;case 4:nr();break;case 13:W(G);break;case 19:W(G);break;case 10:Qu(r.type._context);break;case 22:case 23:dl()}n=n.return}if(ae=e,ee=e=Gt(e.current,null),ue=Ie=t,ne=0,Zr=null,ul=Wa=On=0,Oe=xr=null,fn!==null){for(t=0;t<fn.length;t++)if(n=fn[t],r=n.interleaved,r!==null){n.interleaved=null;var o=r.next,a=n.pending;if(a!==null){var i=a.next;a.next=o,r.next=i}n.pending=r}fn=null}return e}function om(e,t){do{var n=ee;try{if(Ku(),Bo.current=va,ga){for(var r=K.memoizedState;r!==null;){var o=r.queue;o!==null&&(o.pending=null),r=r.next}ga=!1}if(Sn=0,oe=te=K=null,Ar=!1,Yr=0,sl.current=null,n===null||n.return===null){ne=1,Zr=t,ee=null;break}e:{var a=e,i=n.return,s=n,u=t;if(t=ue,s.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var l=u,d=s,c=d.tag;if(!(d.mode&1)&&(c===0||c===11||c===15)){var p=d.alternate;p?(d.updateQueue=p.updateQueue,d.memoizedState=p.memoizedState,d.lanes=p.lanes):(d.updateQueue=null,d.memoizedState=null)}var h=xc(i);if(h!==null){h.flags&=-257,kc(h,i,s,a,t),h.mode&1&&Lc(a,l,t),t=h,u=l;var g=t.updateQueue;if(g===null){var y=new Set;y.add(u),t.updateQueue=y}else g.add(u);break e}else{if(!(t&1)){Lc(a,l,t),fl();break e}u=Error(b(426))}}else if(q&&s.mode&1){var S=xc(i);if(S!==null){!(S.flags&65536)&&(S.flags|=256),kc(S,i,s,a,t),Hu(rr(u,s));break e}}a=u=rr(u,s),ne!==4&&(ne=2),xr===null?xr=[a]:xr.push(a),a=i;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var m=Bp(a,u,t);Nc(a,m);break e;case 1:s=u;var f=a.type,v=a.stateNode;if(!(a.flags&128)&&(typeof f.getDerivedStateFromError=="function"||v!==null&&typeof v.componentDidCatch=="function"&&(qt===null||!qt.has(v)))){a.flags|=65536,t&=-t,a.lanes|=t;var P=$p(a,s,t);Nc(a,P);break e}}a=a.return}while(a!==null)}sm(n)}catch(E){t=E,ee===n&&n!==null&&(ee=n=n.return);continue}break}while(1)}function am(){var e=ya.current;return ya.current=va,e===null?va:e}function fl(){(ne===0||ne===3||ne===2)&&(ne=4),ae===null||!(On&268435455)&&!(Wa&268435455)||kt(ae,ue)}function Oa(e,t){var n=k;k|=2;var r=am();(ae!==e||ue!==t)&&(vt=null,hn(e,t));do try{Pv();break}catch(o){om(e,o)}while(1);if(Ku(),k=n,ya.current=r,ee!==null)throw Error(b(261));return ae=null,ue=0,ne}function Pv(){for(;ee!==null;)im(ee)}function Sv(){for(;ee!==null&&!qh();)im(ee)}function im(e){var t=lm(e.alternate,e,Ie);e.memoizedProps=e.pendingProps,t===null?sm(e):ee=t,sl.current=null}function sm(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=pv(n,t),n!==null){n.flags&=32767,ee=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{ne=6,ee=null;return}}else if(n=fv(n,t,Ie),n!==null){ee=n;return}if(t=t.sibling,t!==null){ee=t;return}ee=t=e}while(t!==null);ne===0&&(ne=5)}function ln(e,t,n){var r=M,o=Ve.transition;try{Ve.transition=null,M=1,Ov(e,t,n,r)}finally{Ve.transition=o,M=r}return null}function Ov(e,t,n,r){do Qn();while(Vt!==null);if(k&6)throw Error(b(327));n=e.finishedWork;var o=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(b(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(tg(e,a),e===ae&&(ee=ae=null,ue=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||jo||(jo=!0,cm(na,function(){return Qn(),null})),a=(n.flags&15990)!==0,n.subtreeFlags&15990||a){a=Ve.transition,Ve.transition=null;var i=M;M=1;var s=k;k|=4,sl.current=null,hv(e,n),tm(n,e),Bg(Vs),oa=!!Fs,Vs=Fs=null,e.current=n,gv(n),Hh(),k=s,M=i,Ve.transition=a}else e.current=n;if(jo&&(jo=!1,Vt=e,Sa=o),a=e.pendingLanes,a===0&&(qt=null),Qh(n.stateNode),we(e,J()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)o=t[n],r(o.value,{componentStack:o.stack,digest:o.digest});if(Pa)throw Pa=!1,e=au,au=null,e;return Sa&1&&e.tag!==0&&Qn(),a=e.pendingLanes,a&1?e===iu?kr++:(kr=0,iu=e):kr=0,on(),null}function Qn(){if(Vt!==null){var e=Uf(Sa),t=Ve.transition,n=M;try{if(Ve.transition=null,M=16>e?16:e,Vt===null)var r=!1;else{if(e=Vt,Vt=null,Sa=0,k&6)throw Error(b(331));var o=k;for(k|=4,N=e.current;N!==null;){var a=N,i=a.child;if(N.flags&16){var s=a.deletions;if(s!==null){for(var u=0;u<s.length;u++){var l=s[u];for(N=l;N!==null;){var d=N;switch(d.tag){case 0:case 11:case 15:Lr(8,d,a)}var c=d.child;if(c!==null)c.return=d,N=c;else for(;N!==null;){d=N;var p=d.sibling,h=d.return;if(Xp(d),d===l){N=null;break}if(p!==null){p.return=h,N=p;break}N=h}}}var g=a.alternate;if(g!==null){var y=g.child;if(y!==null){g.child=null;do{var S=y.sibling;y.sibling=null,y=S}while(y!==null)}}N=a}}if(a.subtreeFlags&2064&&i!==null)i.return=a,N=i;else e:for(;N!==null;){if(a=N,a.flags&2048)switch(a.tag){case 0:case 11:case 15:Lr(9,a,a.return)}var m=a.sibling;if(m!==null){m.return=a.return,N=m;break e}N=a.return}}var f=e.current;for(N=f;N!==null;){i=N;var v=i.child;if(i.subtreeFlags&2064&&v!==null)v.return=i,N=v;else e:for(i=f;N!==null;){if(s=N,s.flags&2048)try{switch(s.tag){case 0:case 11:case 15:$a(9,s)}}catch(E){Y(s,s.return,E)}if(s===i){N=null;break e}var P=s.sibling;if(P!==null){P.return=s.return,N=P;break e}N=s.return}}if(k=o,on(),it&&typeof it.onPostCommitFiberRoot=="function")try{it.onPostCommitFiberRoot(La,e)}catch{}r=!0}return r}finally{M=n,Ve.transition=t}}return!1}function Qc(e,t,n){t=rr(n,t),t=Bp(e,t,1),e=zt(e,t,1),t=ye(),e!==null&&(so(e,1,t),we(e,t))}function Y(e,t,n){if(e.tag===3)Qc(e,e,n);else for(;t!==null;){if(t.tag===3){Qc(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(qt===null||!qt.has(r))){e=rr(n,e),e=$p(t,e,1),t=zt(t,e,1),e=ye(),t!==null&&(so(t,1,e),we(t,e));break}}t=t.return}}function bv(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=ye(),e.pingedLanes|=e.suspendedLanes&n,ae===e&&(ue&n)===n&&(ne===4||ne===3&&(ue&130023424)===ue&&500>J()-ll?hn(e,0):ul|=n),we(e,t)}function um(e,t){t===0&&(e.mode&1?(t=Oo,Oo<<=1,!(Oo&130023424)&&(Oo=4194304)):t=1);var n=ye();e=wt(e,t),e!==null&&(so(e,t,n),we(e,n))}function Ev(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),um(e,n)}function Dv(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,o=e.memoizedState;o!==null&&(n=o.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(b(314))}r!==null&&r.delete(t),um(e,n)}var lm;lm=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Ee.current)be=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return be=!1,dv(e,t,n);be=!!(e.flags&131072)}else be=!1,q&&t.flags&1048576&&fp(t,da,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Wo(e,t),e=t.pendingProps;var o=Zn(t,he.current);Kn(t,n),o=nl(null,t,r,e,o,n);var a=rl();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,De(r)?(a=!0,la(t)):a=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,Ju(t),o.updater=Ua,t.stateNode=o,o._reactInternals=t,Ks(t,r,e,n),t=Js(null,t,r,!0,a,n)):(t.tag=0,q&&a&&zu(t),ve(null,t,o,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Wo(e,t),e=t.pendingProps,o=r._init,r=o(r._payload),t.type=r,o=t.tag=Cv(r),e=He(r,e),o){case 0:t=Ys(null,t,r,e,n);break e;case 1:t=Vc(null,t,r,e,n);break e;case 11:t=Mc(null,t,r,e,n);break e;case 14:t=Fc(null,t,r,He(r.type,e),n);break e}throw Error(b(306,r,""))}return t;case 0:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:He(r,o),Ys(e,t,r,o,n);case 1:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:He(r,o),Vc(e,t,r,o,n);case 3:e:{if(Hp(t),e===null)throw Error(b(387));r=t.pendingProps,a=t.memoizedState,o=a.element,gp(e,t),ma(t,r,null,n);var i=t.memoizedState;if(r=i.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){o=rr(Error(b(423)),t),t=Uc(e,t,r,n,o);break e}else if(r!==o){o=rr(Error(b(424)),t),t=Uc(e,t,r,n,o);break e}else for(_e=Wt(t.stateNode.containerInfo.firstChild),Re=t,q=!0,Ke=null,n=Sp(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(er(),r===o){t=Ct(e,t,n);break e}ve(e,t,r,n)}t=t.child}return t;case 5:return Op(t),e===null&&qs(t),r=t.type,o=t.pendingProps,a=e!==null?e.memoizedProps:null,i=o.children,Us(r,o)?i=null:a!==null&&Us(r,a)&&(t.flags|=32),qp(e,t),ve(e,t,i,n),t.child;case 6:return e===null&&qs(t),null;case 13:return Gp(e,t,n);case 4:return Xu(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=tr(t,null,r,n):ve(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:He(r,o),Mc(e,t,r,o,n);case 7:return ve(e,t,t.pendingProps,n),t.child;case 8:return ve(e,t,t.pendingProps.children,n),t.child;case 12:return ve(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,o=t.pendingProps,a=t.memoizedProps,i=o.value,B(fa,r._currentValue),r._currentValue=i,a!==null)if(Xe(a.value,i)){if(a.children===o.children&&!Ee.current){t=Ct(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var s=a.dependencies;if(s!==null){i=a.child;for(var u=s.firstContext;u!==null;){if(u.context===r){if(a.tag===1){u=Ot(-1,n&-n),u.tag=2;var l=a.updateQueue;if(l!==null){l=l.shared;var d=l.pending;d===null?u.next=u:(u.next=d.next,d.next=u),l.pending=u}}a.lanes|=n,u=a.alternate,u!==null&&(u.lanes|=n),Hs(a.return,n,t),s.lanes|=n;break}u=u.next}}else if(a.tag===10)i=a.type===t.type?null:a.child;else if(a.tag===18){if(i=a.return,i===null)throw Error(b(341));i.lanes|=n,s=i.alternate,s!==null&&(s.lanes|=n),Hs(i,n,t),i=a.sibling}else i=a.child;if(i!==null)i.return=a;else for(i=a;i!==null;){if(i===t){i=null;break}if(a=i.sibling,a!==null){a.return=i.return,i=a;break}i=i.return}a=i}ve(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=t.pendingProps.children,Kn(t,n),o=Be(o),r=r(o),t.flags|=1,ve(e,t,r,n),t.child;case 14:return r=t.type,o=He(r,t.pendingProps),o=He(r.type,o),Fc(e,t,r,o,n);case 15:return Wp(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:He(r,o),Wo(e,t),t.tag=1,De(r)?(e=!0,la(t)):e=!1,Kn(t,n),yp(t,r,o),Ks(t,r,o,n),Js(null,t,r,!0,e,n);case 19:return Kp(e,t,n);case 22:return zp(e,t,n)}throw Error(b(156,t.tag))};function cm(e,t){return kf(e,t)}function wv(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Fe(e,t,n,r){return new wv(e,t,n,r)}function pl(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Cv(e){if(typeof e=="function")return pl(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Tu)return 11;if(e===Au)return 14}return 2}function Gt(e,t){var n=e.alternate;return n===null?(n=Fe(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Ho(e,t,n,r,o,a){var i=2;if(r=e,typeof e=="function")pl(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case An:return gn(n.children,o,a,t);case ju:i=8,o|=8;break;case ys:return e=Fe(12,n,t,o|2),e.elementType=ys,e.lanes=a,e;case Ps:return e=Fe(13,n,t,o),e.elementType=Ps,e.lanes=a,e;case Ss:return e=Fe(19,n,t,o),e.elementType=Ss,e.lanes=a,e;case Pf:return za(n,o,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case vf:i=10;break e;case yf:i=9;break e;case Tu:i=11;break e;case Au:i=14;break e;case At:i=16,r=null;break e}throw Error(b(130,e==null?e:typeof e,""))}return t=Fe(i,n,t,o),t.elementType=e,t.type=r,t.lanes=a,t}function gn(e,t,n,r){return e=Fe(7,e,r,t),e.lanes=n,e}function za(e,t,n,r){return e=Fe(22,e,r,t),e.elementType=Pf,e.lanes=n,e.stateNode={isHidden:!1},e}function Ji(e,t,n){return e=Fe(6,e,null,t),e.lanes=n,e}function Xi(e,t,n){return t=Fe(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Nv(e,t,n,r,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ti(0),this.expirationTimes=Ti(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ti(0),this.identifierPrefix=r,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function ml(e,t,n,r,o,a,i,s,u){return e=new Nv(e,t,n,s,u),t===1?(t=1,a===!0&&(t|=8)):t=0,a=Fe(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ju(a),e}function Iv(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Tn,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function dm(e){if(!e)return Xt;e=e._reactInternals;e:{if(wn(e)!==e||e.tag!==1)throw Error(b(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(De(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(b(171))}if(e.tag===1){var n=e.type;if(De(n))return cp(e,n,t)}return t}function fm(e,t,n,r,o,a,i,s,u){return e=ml(n,r,!0,e,o,a,i,s,u),e.context=dm(null),n=e.current,r=ye(),o=Ht(n),a=Ot(r,o),a.callback=t??null,zt(n,a,o),e.current.lanes=o,so(e,o,r),we(e,r),e}function qa(e,t,n,r){var o=t.current,a=ye(),i=Ht(o);return n=dm(n),t.context===null?t.context=n:t.pendingContext=n,t=Ot(a,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=zt(o,t,i),e!==null&&(Je(e,o,i,a),Uo(e,o,i)),i}function ba(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Yc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function hl(e,t){Yc(e,t),(e=e.alternate)&&Yc(e,t)}function _v(){return null}var pm=typeof reportError=="function"?reportError:function(e){console.error(e)};function gl(e){this._internalRoot=e}Ha.prototype.render=gl.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(b(409));qa(e,t,null,null)};Ha.prototype.unmount=gl.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;bn(function(){qa(null,e,null,null)}),t[Dt]=null}};function Ha(e){this._internalRoot=e}Ha.prototype.unstable_scheduleHydration=function(e){if(e){var t=Wf();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xt.length&&t!==0&&t<xt[n].priority;n++);xt.splice(n,0,e),n===0&&qf(e)}};function vl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ga(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Jc(){}function Rv(e,t,n,r,o){if(o){if(typeof r=="function"){var a=r;r=function(){var l=ba(i);a.call(l)}}var i=fm(t,r,e,0,null,!1,!1,"",Jc);return e._reactRootContainer=i,e[Dt]=i.current,qr(e.nodeType===8?e.parentNode:e),bn(),i}for(;o=e.lastChild;)e.removeChild(o);if(typeof r=="function"){var s=r;r=function(){var l=ba(u);s.call(l)}}var u=ml(e,0,!1,null,null,!1,!1,"",Jc);return e._reactRootContainer=u,e[Dt]=u.current,qr(e.nodeType===8?e.parentNode:e),bn(function(){qa(t,u,n,r)}),u}function Ka(e,t,n,r,o){var a=n._reactRootContainer;if(a){var i=a;if(typeof o=="function"){var s=o;o=function(){var u=ba(i);s.call(u)}}qa(t,i,e,o)}else i=Rv(n,t,e,o,r);return ba(i)}Bf=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=wr(t.pendingLanes);n!==0&&(ku(t,n|1),we(t,J()),!(k&6)&&(or=J()+500,on()))}break;case 13:bn(function(){var r=wt(e,1);if(r!==null){var o=ye();Je(r,e,1,o)}}),hl(e,1)}};Mu=function(e){if(e.tag===13){var t=wt(e,134217728);if(t!==null){var n=ye();Je(t,e,134217728,n)}hl(e,134217728)}};$f=function(e){if(e.tag===13){var t=Ht(e),n=wt(e,t);if(n!==null){var r=ye();Je(n,e,t,r)}hl(e,t)}};Wf=function(){return M};zf=function(e,t){var n=M;try{return M=e,t()}finally{M=n}};Rs=function(e,t,n){switch(t){case"input":if(Es(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=Fa(r);if(!o)throw Error(b(90));Of(r),Es(r,o)}}}break;case"textarea":Ef(e,n);break;case"select":t=n.value,t!=null&&zn(e,!!n.multiple,t,!1)}};Rf=cl;jf=bn;var jv={usingClientEntryPoint:!1,Events:[lo,Mn,Fa,If,_f,cl]},Sr={findFiberByHostInstance:dn,bundleType:0,version:"18.2.0",rendererPackageName:"react-dom"},Tv={bundleType:Sr.bundleType,version:Sr.version,rendererPackageName:Sr.rendererPackageName,rendererConfig:Sr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:It.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Lf(e),e===null?null:e.stateNode},findFiberByHostInstance:Sr.findFiberByHostInstance||_v,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.2.0-next-9e3b772b8-20220608"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var To=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!To.isDisabled&&To.supportsFiber)try{La=To.inject(Tv),it=To}catch{}}Ae.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=jv;Ae.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!vl(t))throw Error(b(200));return Iv(e,t,null,n)};Ae.createRoot=function(e,t){if(!vl(e))throw Error(b(299));var n=!1,r="",o=pm;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=ml(e,1,!1,null,null,n,!1,r,o),e[Dt]=t.current,qr(e.nodeType===8?e.parentNode:e),new gl(t)};Ae.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(b(188)):(e=Object.keys(e).join(","),Error(b(268,e)));return e=Lf(t),e=e===null?null:e.stateNode,e};Ae.flushSync=function(e){return bn(e)};Ae.hydrate=function(e,t,n){if(!Ga(t))throw Error(b(200));return Ka(null,e,t,!0,n)};Ae.hydrateRoot=function(e,t,n){if(!vl(e))throw Error(b(405));var r=n!=null&&n.hydratedSources||null,o=!1,a="",i=pm;if(n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=fm(t,null,e,1,n??null,o,!1,a,i),e[Dt]=t.current,qr(e),r)for(e=0;e<r.length;e++)n=r[e],o=n._getVersion,o=o(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,o]:t.mutableSourceEagerHydrationData.push(n,o);return new Ha(t)};Ae.render=function(e,t,n){if(!Ga(t))throw Error(b(200));return Ka(null,e,t,!1,n)};Ae.unmountComponentAtNode=function(e){if(!Ga(e))throw Error(b(40));return e._reactRootContainer?(bn(function(){Ka(null,null,e,!1,function(){e._reactRootContainer=null,e[Dt]=null})}),!0):!1};Ae.unstable_batchedUpdates=cl;Ae.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Ga(n))throw Error(b(200));if(e==null||e._reactInternals===void 0)throw Error(b(38));return Ka(e,t,n,!1,r)};Ae.version="18.2.0-next-9e3b772b8-20220608";(function(e){function t(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t)}catch(n){console.error(n)}}t(),e.exports=Ae})(_h);var Xc=Xo;hs.createRoot=Xc.createRoot,hs.hydrateRoot=Xc.hydrateRoot;/**
 * @remix-run/router v1.4.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function eo(){return eo=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},eo.apply(this,arguments)}var mn;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(mn||(mn={}));const Zc="popstate";function Av(e){e===void 0&&(e={});function t(r,o){let{pathname:a,search:i,hash:s}=r.location;return lu("",{pathname:a,search:i,hash:s},o.state&&o.state.usr||null,o.state&&o.state.key||"default")}function n(r,o){return typeof o=="string"?o:mm(o)}return xv(t,n,null,e)}function vn(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function Lv(){return Math.random().toString(36).substr(2,8)}function ed(e,t){return{usr:e.state,key:e.key,idx:t}}function lu(e,t,n,r){return n===void 0&&(n=null),eo({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?Qa(t):t,{state:n,key:t&&t.key||r||Lv()})}function mm(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(t+=r.charAt(0)==="#"?r:"#"+r),t}function Qa(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}function xv(e,t,n,r){r===void 0&&(r={});let{window:o=document.defaultView,v5Compat:a=!1}=r,i=o.history,s=mn.Pop,u=null,l=d();l==null&&(l=0,i.replaceState(eo({},i.state,{idx:l}),""));function d(){return(i.state||{idx:null}).idx}function c(){s=mn.Pop;let S=d(),m=S==null?null:S-l;l=S,u&&u({action:s,location:y.location,delta:m})}function p(S,m){s=mn.Push;let f=lu(y.location,S,m);n&&n(f,S),l=d()+1;let v=ed(f,l),P=y.createHref(f);try{i.pushState(v,"",P)}catch{o.location.assign(P)}a&&u&&u({action:s,location:y.location,delta:1})}function h(S,m){s=mn.Replace;let f=lu(y.location,S,m);n&&n(f,S),l=d();let v=ed(f,l),P=y.createHref(f);i.replaceState(v,"",P),a&&u&&u({action:s,location:y.location,delta:0})}function g(S){let m=o.location.origin!=="null"?o.location.origin:o.location.href,f=typeof S=="string"?S:mm(S);return vn(m,"No window.location.(origin|href) available to create URL for href: "+f),new URL(f,m)}let y={get action(){return s},get location(){return e(o,i)},listen(S){if(u)throw new Error("A history only accepts one active listener");return o.addEventListener(Zc,c),u=S,()=>{o.removeEventListener(Zc,c),u=null}},createHref(S){return t(o,S)},createURL:g,encodeLocation(S){let m=g(S);return{pathname:m.pathname,search:m.search,hash:m.hash}},push:p,replace:h,go(S){return i.go(S)}};return y}var td;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(td||(td={}));function kv(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&r!=="/"?null:e.slice(n)||"/"}function Mv(e,t){t===void 0&&(t="/");let{pathname:n,search:r="",hash:o=""}=typeof e=="string"?Qa(e):e;return{pathname:n?n.startsWith("/")?n:Fv(n,t):t,search:$v(r),hash:Wv(o)}}function Fv(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(o=>{o===".."?n.length>1&&n.pop():o!=="."&&n.push(o)}),n.length>1?n.join("/"):"/"}function Zi(e,t,n,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function Vv(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function Uv(e,t,n,r){r===void 0&&(r=!1);let o;typeof e=="string"?o=Qa(e):(o=eo({},e),vn(!o.pathname||!o.pathname.includes("?"),Zi("?","pathname","search",o)),vn(!o.pathname||!o.pathname.includes("#"),Zi("#","pathname","hash",o)),vn(!o.search||!o.search.includes("#"),Zi("#","search","hash",o)));let a=e===""||o.pathname==="",i=a?"/":o.pathname,s;if(r||i==null)s=n;else{let c=t.length-1;if(i.startsWith("..")){let p=i.split("/");for(;p[0]==="..";)p.shift(),c-=1;o.pathname=p.join("/")}s=c>=0?t[c]:"/"}let u=Mv(o,s),l=i&&i!=="/"&&i.endsWith("/"),d=(a||i===".")&&n.endsWith("/");return!u.pathname.endsWith("/")&&(l||d)&&(u.pathname+="/"),u}const Bv=e=>e.join("/").replace(/\/\/+/g,"/"),$v=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Wv=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;/**
 * React Router v6.9.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function zv(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}const qv=typeof Object.is=="function"?Object.is:zv,{useState:Hv,useEffect:Gv,useLayoutEffect:Kv,useDebugValue:Qv}=ms;function Yv(e,t,n){const r=t(),[{inst:o},a]=Hv({inst:{value:r,getSnapshot:t}});return Kv(()=>{o.value=r,o.getSnapshot=t,es(o)&&a({inst:o})},[e,r,t]),Gv(()=>(es(o)&&a({inst:o}),e(()=>{es(o)&&a({inst:o})})),[e]),Qv(r),r}function es(e){const t=e.getSnapshot,n=e.value;try{const r=t();return!qv(n,r)}catch{return!0}}function Jv(e,t,n){return t()}const Xv=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",Zv=!Xv,ey=Zv?Jv:Yv;"useSyncExternalStore"in ms&&(e=>e.useSyncExternalStore)(ms);const hm=j.createContext(null),yl=j.createContext(null),ty=j.createContext({outlet:null,matches:[]});function Pl(){return j.useContext(yl)!=null}function gm(){return Pl()||vn(!1),j.useContext(yl).location}function ny(){Pl()||vn(!1);let{basename:e,navigator:t}=j.useContext(hm),{matches:n}=j.useContext(ty),{pathname:r}=gm(),o=JSON.stringify(Vv(n).map(s=>s.pathnameBase)),a=j.useRef(!1);return j.useEffect(()=>{a.current=!0}),j.useCallback(function(s,u){if(u===void 0&&(u={}),!a.current)return;if(typeof s=="number"){t.go(s);return}let l=Uv(s,JSON.parse(o),r,u.relative==="path");e!=="/"&&(l.pathname=l.pathname==="/"?e:Bv([e,l.pathname])),(u.replace?t.replace:t.push)(l,u.state,u)},[e,t,o,r])}var nd;(function(e){e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator"})(nd||(nd={}));var rd;(function(e){e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator"})(rd||(rd={}));function ry(e){let{basename:t="/",children:n=null,location:r,navigationType:o=mn.Pop,navigator:a,static:i=!1}=e;Pl()&&vn(!1);let s=t.replace(/^\/*/,"/"),u=j.useMemo(()=>({basename:s,navigator:a,static:i}),[s,a,i]);typeof r=="string"&&(r=Qa(r));let{pathname:l="/",search:d="",hash:c="",state:p=null,key:h="default"}=r,g=j.useMemo(()=>{let y=kv(l,s);return y==null?null:{location:{pathname:y,search:d,hash:c,state:p,key:h},navigationType:o}},[s,l,d,c,p,h,o]);return g==null?null:j.createElement(hm.Provider,{value:u},j.createElement(yl.Provider,{children:n,value:g}))}var od;(function(e){e[e.pending=0]="pending",e[e.success=1]="success",e[e.error=2]="error"})(od||(od={}));new Promise(()=>{});/**
 * React Router DOM v6.9.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function oy(e){let{basename:t,children:n,window:r}=e,o=j.useRef();o.current==null&&(o.current=Av({window:r,v5Compat:!0}));let a=o.current,[i,s]=j.useState({action:a.action,location:a.location});return j.useLayoutEffect(()=>a.listen(s),[a]),j.createElement(ry,{basename:t,children:n,location:i.location,navigationType:i.action,navigator:a})}var ad;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmitImpl="useSubmitImpl",e.UseFetcher="useFetcher"})(ad||(ad={}));var id;(function(e){e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(id||(id={}));const vm=j.createContext({isAuthenticated:!1,userRole:null,login:()=>{},logout:()=>{}}),ay=()=>j.useContext(vm);var cu={},iy={get exports(){return cu},set exports(e){cu=e}},ym={};/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ar=j;function sy(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var uy=typeof Object.is=="function"?Object.is:sy,ly=ar.useState,cy=ar.useEffect,dy=ar.useLayoutEffect,fy=ar.useDebugValue;function py(e,t){var n=t(),r=ly({inst:{value:n,getSnapshot:t}}),o=r[0].inst,a=r[1];return dy(function(){o.value=n,o.getSnapshot=t,ts(o)&&a({inst:o})},[e,n,t]),cy(function(){return ts(o)&&a({inst:o}),e(function(){ts(o)&&a({inst:o})})},[e]),fy(n),n}function ts(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!uy(e,n)}catch{return!0}}function my(e,t){return t()}var hy=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?my:py;ym.useSyncExternalStore=ar.useSyncExternalStore!==void 0?ar.useSyncExternalStore:hy;(function(e){e.exports=ym})(iy);var sd={},gy={get exports(){return sd},set exports(e){sd=e}},Pm={};/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ya=j,vy=cu;function yy(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Py=typeof Object.is=="function"?Object.is:yy,Sy=vy.useSyncExternalStore,Oy=Ya.useRef,by=Ya.useEffect,Ey=Ya.useMemo,Dy=Ya.useDebugValue;Pm.useSyncExternalStoreWithSelector=function(e,t,n,r,o){var a=Oy(null);if(a.current===null){var i={hasValue:!1,value:null};a.current=i}else i=a.current;a=Ey(function(){function u(h){if(!l){if(l=!0,d=h,h=r(h),o!==void 0&&i.hasValue){var g=i.value;if(o(g,h))return c=g}return c=h}if(g=c,Py(d,h))return g;var y=r(h);return o!==void 0&&o(g,y)?g:(d=h,c=y)}var l=!1,d,c,p=n===void 0?null:n;return[function(){return u(t())},p===null?void 0:function(){return u(p())}]},[t,n,r,o]);var s=Sy(e,a[0],a[1]);return by(function(){i.hasValue=!0,i.value=s},[s]),Dy(s),s};(function(e){e.exports=Pm})(gy);function wy(e){e()}let Sm=wy;const Cy=e=>Sm=e,Ny=()=>Sm,ir=j.createContext(null);function Iy(){return j.useContext(ir)}var du={},_y={get exports(){return du},set exports(e){du=e}},F={};/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ie=typeof Symbol=="function"&&Symbol.for,Sl=ie?Symbol.for("react.element"):60103,Ol=ie?Symbol.for("react.portal"):60106,Ja=ie?Symbol.for("react.fragment"):60107,Xa=ie?Symbol.for("react.strict_mode"):60108,Za=ie?Symbol.for("react.profiler"):60114,ei=ie?Symbol.for("react.provider"):60109,ti=ie?Symbol.for("react.context"):60110,bl=ie?Symbol.for("react.async_mode"):60111,ni=ie?Symbol.for("react.concurrent_mode"):60111,ri=ie?Symbol.for("react.forward_ref"):60112,oi=ie?Symbol.for("react.suspense"):60113,Ry=ie?Symbol.for("react.suspense_list"):60120,ai=ie?Symbol.for("react.memo"):60115,ii=ie?Symbol.for("react.lazy"):60116,jy=ie?Symbol.for("react.block"):60121,Ty=ie?Symbol.for("react.fundamental"):60117,Ay=ie?Symbol.for("react.responder"):60118,Ly=ie?Symbol.for("react.scope"):60119;function xe(e){if(typeof e=="object"&&e!==null){var t=e.$$typeof;switch(t){case Sl:switch(e=e.type,e){case bl:case ni:case Ja:case Za:case Xa:case oi:return e;default:switch(e=e&&e.$$typeof,e){case ti:case ri:case ii:case ai:case ei:return e;default:return t}}case Ol:return t}}}function Om(e){return xe(e)===ni}F.AsyncMode=bl;F.ConcurrentMode=ni;F.ContextConsumer=ti;F.ContextProvider=ei;F.Element=Sl;F.ForwardRef=ri;F.Fragment=Ja;F.Lazy=ii;F.Memo=ai;F.Portal=Ol;F.Profiler=Za;F.StrictMode=Xa;F.Suspense=oi;F.isAsyncMode=function(e){return Om(e)||xe(e)===bl};F.isConcurrentMode=Om;F.isContextConsumer=function(e){return xe(e)===ti};F.isContextProvider=function(e){return xe(e)===ei};F.isElement=function(e){return typeof e=="object"&&e!==null&&e.$$typeof===Sl};F.isForwardRef=function(e){return xe(e)===ri};F.isFragment=function(e){return xe(e)===Ja};F.isLazy=function(e){return xe(e)===ii};F.isMemo=function(e){return xe(e)===ai};F.isPortal=function(e){return xe(e)===Ol};F.isProfiler=function(e){return xe(e)===Za};F.isStrictMode=function(e){return xe(e)===Xa};F.isSuspense=function(e){return xe(e)===oi};F.isValidElementType=function(e){return typeof e=="string"||typeof e=="function"||e===Ja||e===ni||e===Za||e===Xa||e===oi||e===Ry||typeof e=="object"&&e!==null&&(e.$$typeof===ii||e.$$typeof===ai||e.$$typeof===ei||e.$$typeof===ti||e.$$typeof===ri||e.$$typeof===Ty||e.$$typeof===Ay||e.$$typeof===Ly||e.$$typeof===jy)};F.typeOf=xe;(function(e){e.exports=F})(_y);var bm=du,xy={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},ky={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},Em={};Em[bm.ForwardRef]=xy;Em[bm.Memo]=ky;var ud={},My={get exports(){return ud},set exports(e){ud=e}},V={};/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var El=Symbol.for("react.element"),Dl=Symbol.for("react.portal"),si=Symbol.for("react.fragment"),ui=Symbol.for("react.strict_mode"),li=Symbol.for("react.profiler"),ci=Symbol.for("react.provider"),di=Symbol.for("react.context"),Fy=Symbol.for("react.server_context"),fi=Symbol.for("react.forward_ref"),pi=Symbol.for("react.suspense"),mi=Symbol.for("react.suspense_list"),hi=Symbol.for("react.memo"),gi=Symbol.for("react.lazy"),Vy=Symbol.for("react.offscreen"),Dm;Dm=Symbol.for("react.module.reference");function We(e){if(typeof e=="object"&&e!==null){var t=e.$$typeof;switch(t){case El:switch(e=e.type,e){case si:case li:case ui:case pi:case mi:return e;default:switch(e=e&&e.$$typeof,e){case Fy:case di:case fi:case gi:case hi:case ci:return e;default:return t}}case Dl:return t}}}V.ContextConsumer=di;V.ContextProvider=ci;V.Element=El;V.ForwardRef=fi;V.Fragment=si;V.Lazy=gi;V.Memo=hi;V.Portal=Dl;V.Profiler=li;V.StrictMode=ui;V.Suspense=pi;V.SuspenseList=mi;V.isAsyncMode=function(){return!1};V.isConcurrentMode=function(){return!1};V.isContextConsumer=function(e){return We(e)===di};V.isContextProvider=function(e){return We(e)===ci};V.isElement=function(e){return typeof e=="object"&&e!==null&&e.$$typeof===El};V.isForwardRef=function(e){return We(e)===fi};V.isFragment=function(e){return We(e)===si};V.isLazy=function(e){return We(e)===gi};V.isMemo=function(e){return We(e)===hi};V.isPortal=function(e){return We(e)===Dl};V.isProfiler=function(e){return We(e)===li};V.isStrictMode=function(e){return We(e)===ui};V.isSuspense=function(e){return We(e)===pi};V.isSuspenseList=function(e){return We(e)===mi};V.isValidElementType=function(e){return typeof e=="string"||typeof e=="function"||e===si||e===li||e===ui||e===pi||e===mi||e===Vy||typeof e=="object"&&e!==null&&(e.$$typeof===gi||e.$$typeof===hi||e.$$typeof===ci||e.$$typeof===di||e.$$typeof===fi||e.$$typeof===Dm||e.getModuleId!==void 0)};V.typeOf=We;(function(e){e.exports=V})(My);function Uy(){const e=Ny();let t=null,n=null;return{clear(){t=null,n=null},notify(){e(()=>{let r=t;for(;r;)r.callback(),r=r.next})},get(){let r=[],o=t;for(;o;)r.push(o),o=o.next;return r},subscribe(r){let o=!0,a=n={callback:r,next:null,prev:n};return a.prev?a.prev.next=a:t=a,function(){!o||t===null||(o=!1,a.next?a.next.prev=a.prev:n=a.prev,a.prev?a.prev.next=a.next:t=a.next)}}}}const ld={notify(){},get:()=>[]};function By(e,t){let n,r=ld;function o(c){return u(),r.subscribe(c)}function a(){r.notify()}function i(){d.onStateChange&&d.onStateChange()}function s(){return Boolean(n)}function u(){n||(n=t?t.addNestedSub(i):e.subscribe(i),r=Uy())}function l(){n&&(n(),n=void 0,r.clear(),r=ld)}const d={addNestedSub:o,notifyNestedSubs:a,handleChangeWrapper:i,isSubscribed:s,trySubscribe:u,tryUnsubscribe:l,getListeners:()=>r};return d}const $y=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",Wy=$y?j.useLayoutEffect:j.useEffect;function zy({store:e,context:t,children:n,serverState:r}){const o=j.useMemo(()=>{const s=By(e);return{store:e,subscription:s,getServerState:r?()=>r:void 0}},[e,r]),a=j.useMemo(()=>e.getState(),[e]);Wy(()=>{const{subscription:s}=o;return s.onStateChange=s.notifyNestedSubs,s.trySubscribe(),a!==e.getState()&&s.notifyNestedSubs(),()=>{s.tryUnsubscribe(),s.onStateChange=void 0}},[o,a]);const i=t||ir;return Nu.createElement(i.Provider,{value:o},n)}function wm(e=ir){const t=e===ir?Iy:()=>j.useContext(e);return function(){const{store:r}=t();return r}}const qy=wm();function Hy(e=ir){const t=e===ir?qy:wm(e);return function(){return t().dispatch}}const Gy=Hy();Cy(Xo.unstable_batchedUpdates);function Cm(e,t){return function(){return e.apply(t,arguments)}}const{toString:Nm}=Object.prototype,{getPrototypeOf:wl}=Object,Cl=(e=>t=>{const n=Nm.call(t);return e[n]||(e[n]=n.slice(8,-1).toLowerCase())})(Object.create(null)),_t=e=>(e=e.toLowerCase(),t=>Cl(t)===e),vi=e=>t=>typeof t===e,{isArray:dr}=Array,to=vi("undefined");function Ky(e){return e!==null&&!to(e)&&e.constructor!==null&&!to(e.constructor)&&Zt(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}const Im=_t("ArrayBuffer");function Qy(e){let t;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?t=ArrayBuffer.isView(e):t=e&&e.buffer&&Im(e.buffer),t}const Yy=vi("string"),Zt=vi("function"),_m=vi("number"),Nl=e=>e!==null&&typeof e=="object",Jy=e=>e===!0||e===!1,Go=e=>{if(Cl(e)!=="object")return!1;const t=wl(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)},Xy=_t("Date"),Zy=_t("File"),e0=_t("Blob"),t0=_t("FileList"),n0=e=>Nl(e)&&Zt(e.pipe),r0=e=>{const t="[object FormData]";return e&&(typeof FormData=="function"&&e instanceof FormData||Nm.call(e)===t||Zt(e.toString)&&e.toString()===t)},o0=_t("URLSearchParams"),a0=e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");function fo(e,t,{allOwnKeys:n=!1}={}){if(e===null||typeof e>"u")return;let r,o;if(typeof e!="object"&&(e=[e]),dr(e))for(r=0,o=e.length;r<o;r++)t.call(null,e[r],r,e);else{const a=n?Object.getOwnPropertyNames(e):Object.keys(e),i=a.length;let s;for(r=0;r<i;r++)s=a[r],t.call(null,e[s],s,e)}}function Rm(e,t){t=t.toLowerCase();const n=Object.keys(e);let r=n.length,o;for(;r-- >0;)if(o=n[r],t===o.toLowerCase())return o;return null}const jm=(()=>typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global)(),Tm=e=>!to(e)&&e!==jm;function fu(){const{caseless:e}=Tm(this)&&this||{},t={},n=(r,o)=>{const a=e&&Rm(t,o)||o;Go(t[a])&&Go(r)?t[a]=fu(t[a],r):Go(r)?t[a]=fu({},r):dr(r)?t[a]=r.slice():t[a]=r};for(let r=0,o=arguments.length;r<o;r++)arguments[r]&&fo(arguments[r],n);return t}const i0=(e,t,n,{allOwnKeys:r}={})=>(fo(t,(o,a)=>{n&&Zt(o)?e[a]=Cm(o,n):e[a]=o},{allOwnKeys:r}),e),s0=e=>(e.charCodeAt(0)===65279&&(e=e.slice(1)),e),u0=(e,t,n,r)=>{e.prototype=Object.create(t.prototype,r),e.prototype.constructor=e,Object.defineProperty(e,"super",{value:t.prototype}),n&&Object.assign(e.prototype,n)},l0=(e,t,n,r)=>{let o,a,i;const s={};if(t=t||{},e==null)return t;do{for(o=Object.getOwnPropertyNames(e),a=o.length;a-- >0;)i=o[a],(!r||r(i,e,t))&&!s[i]&&(t[i]=e[i],s[i]=!0);e=n!==!1&&wl(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},c0=(e,t,n)=>{e=String(e),(n===void 0||n>e.length)&&(n=e.length),n-=t.length;const r=e.indexOf(t,n);return r!==-1&&r===n},d0=e=>{if(!e)return null;if(dr(e))return e;let t=e.length;if(!_m(t))return null;const n=new Array(t);for(;t-- >0;)n[t]=e[t];return n},f0=(e=>t=>e&&t instanceof e)(typeof Uint8Array<"u"&&wl(Uint8Array)),p0=(e,t)=>{const r=(e&&e[Symbol.iterator]).call(e);let o;for(;(o=r.next())&&!o.done;){const a=o.value;t.call(e,a[0],a[1])}},m0=(e,t)=>{let n;const r=[];for(;(n=e.exec(t))!==null;)r.push(n);return r},h0=_t("HTMLFormElement"),g0=e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(n,r,o){return r.toUpperCase()+o}),cd=(({hasOwnProperty:e})=>(t,n)=>e.call(t,n))(Object.prototype),v0=_t("RegExp"),Am=(e,t)=>{const n=Object.getOwnPropertyDescriptors(e),r={};fo(n,(o,a)=>{t(o,a,e)!==!1&&(r[a]=o)}),Object.defineProperties(e,r)},y0=e=>{Am(e,(t,n)=>{if(Zt(e)&&["arguments","caller","callee"].indexOf(n)!==-1)return!1;const r=e[n];if(Zt(r)){if(t.enumerable=!1,"writable"in t){t.writable=!1;return}t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+n+"'")})}})},P0=(e,t)=>{const n={},r=o=>{o.forEach(a=>{n[a]=!0})};return dr(e)?r(e):r(String(e).split(t)),n},S0=()=>{},O0=(e,t)=>(e=+e,Number.isFinite(e)?e:t),ns="abcdefghijklmnopqrstuvwxyz",dd="0123456789",Lm={DIGIT:dd,ALPHA:ns,ALPHA_DIGIT:ns+ns.toUpperCase()+dd},b0=(e=16,t=Lm.ALPHA_DIGIT)=>{let n="";const{length:r}=t;for(;e--;)n+=t[Math.random()*r|0];return n};function E0(e){return!!(e&&Zt(e.append)&&e[Symbol.toStringTag]==="FormData"&&e[Symbol.iterator])}const D0=e=>{const t=new Array(10),n=(r,o)=>{if(Nl(r)){if(t.indexOf(r)>=0)return;if(!("toJSON"in r)){t[o]=r;const a=dr(r)?[]:{};return fo(r,(i,s)=>{const u=n(i,o+1);!to(u)&&(a[s]=u)}),t[o]=void 0,a}}return r};return n(e,0)},O={isArray:dr,isArrayBuffer:Im,isBuffer:Ky,isFormData:r0,isArrayBufferView:Qy,isString:Yy,isNumber:_m,isBoolean:Jy,isObject:Nl,isPlainObject:Go,isUndefined:to,isDate:Xy,isFile:Zy,isBlob:e0,isRegExp:v0,isFunction:Zt,isStream:n0,isURLSearchParams:o0,isTypedArray:f0,isFileList:t0,forEach:fo,merge:fu,extend:i0,trim:a0,stripBOM:s0,inherits:u0,toFlatObject:l0,kindOf:Cl,kindOfTest:_t,endsWith:c0,toArray:d0,forEachEntry:p0,matchAll:m0,isHTMLForm:h0,hasOwnProperty:cd,hasOwnProp:cd,reduceDescriptors:Am,freezeMethods:y0,toObjectSet:P0,toCamelCase:g0,noop:S0,toFiniteNumber:O0,findKey:Rm,global:jm,isContextDefined:Tm,ALPHABET:Lm,generateString:b0,isSpecCompliantForm:E0,toJSONObject:D0};function x(e,t,n,r,o){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack,this.message=e,this.name="AxiosError",t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),o&&(this.response=o)}O.inherits(x,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:O.toJSONObject(this.config),code:this.code,status:this.response&&this.response.status?this.response.status:null}}});const xm=x.prototype,km={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach(e=>{km[e]={value:e}});Object.defineProperties(x,km);Object.defineProperty(xm,"isAxiosError",{value:!0});x.from=(e,t,n,r,o,a)=>{const i=Object.create(xm);return O.toFlatObject(e,i,function(u){return u!==Error.prototype},s=>s!=="isAxiosError"),x.call(i,e.message,t,n,r,o),i.cause=e,i.name=e.name,a&&Object.assign(i,a),i};const w0=null;function pu(e){return O.isPlainObject(e)||O.isArray(e)}function Mm(e){return O.endsWith(e,"[]")?e.slice(0,-2):e}function fd(e,t,n){return e?e.concat(t).map(function(o,a){return o=Mm(o),!n&&a?"["+o+"]":o}).join(n?".":""):t}function C0(e){return O.isArray(e)&&!e.some(pu)}const N0=O.toFlatObject(O,{},null,function(t){return/^is[A-Z]/.test(t)});function yi(e,t,n){if(!O.isObject(e))throw new TypeError("target must be an object");t=t||new FormData,n=O.toFlatObject(n,{metaTokens:!0,dots:!1,indexes:!1},!1,function(y,S){return!O.isUndefined(S[y])});const r=n.metaTokens,o=n.visitor||d,a=n.dots,i=n.indexes,u=(n.Blob||typeof Blob<"u"&&Blob)&&O.isSpecCompliantForm(t);if(!O.isFunction(o))throw new TypeError("visitor must be a function");function l(g){if(g===null)return"";if(O.isDate(g))return g.toISOString();if(!u&&O.isBlob(g))throw new x("Blob is not supported. Use a Buffer instead.");return O.isArrayBuffer(g)||O.isTypedArray(g)?u&&typeof Blob=="function"?new Blob([g]):Buffer.from(g):g}function d(g,y,S){let m=g;if(g&&!S&&typeof g=="object"){if(O.endsWith(y,"{}"))y=r?y:y.slice(0,-2),g=JSON.stringify(g);else if(O.isArray(g)&&C0(g)||(O.isFileList(g)||O.endsWith(y,"[]"))&&(m=O.toArray(g)))return y=Mm(y),m.forEach(function(v,P){!(O.isUndefined(v)||v===null)&&t.append(i===!0?fd([y],P,a):i===null?y:y+"[]",l(v))}),!1}return pu(g)?!0:(t.append(fd(S,y,a),l(g)),!1)}const c=[],p=Object.assign(N0,{defaultVisitor:d,convertValue:l,isVisitable:pu});function h(g,y){if(!O.isUndefined(g)){if(c.indexOf(g)!==-1)throw Error("Circular reference detected in "+y.join("."));c.push(g),O.forEach(g,function(m,f){(!(O.isUndefined(m)||m===null)&&o.call(t,m,O.isString(f)?f.trim():f,y,p))===!0&&h(m,y?y.concat(f):[f])}),c.pop()}}if(!O.isObject(e))throw new TypeError("data must be an object");return h(e),t}function pd(e){const t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,function(r){return t[r]})}function Il(e,t){this._pairs=[],e&&yi(e,this,t)}const Fm=Il.prototype;Fm.append=function(t,n){this._pairs.push([t,n])};Fm.toString=function(t){const n=t?function(r){return t.call(this,r,pd)}:pd;return this._pairs.map(function(o){return n(o[0])+"="+n(o[1])},"").join("&")};function I0(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}function Vm(e,t,n){if(!t)return e;const r=n&&n.encode||I0,o=n&&n.serialize;let a;if(o?a=o(t,n):a=O.isURLSearchParams(t)?t.toString():new Il(t,n).toString(r),a){const i=e.indexOf("#");i!==-1&&(e=e.slice(0,i)),e+=(e.indexOf("?")===-1?"?":"&")+a}return e}class _0{constructor(){this.handlers=[]}use(t,n,r){return this.handlers.push({fulfilled:t,rejected:n,synchronous:r?r.synchronous:!1,runWhen:r?r.runWhen:null}),this.handlers.length-1}eject(t){this.handlers[t]&&(this.handlers[t]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(t){O.forEach(this.handlers,function(r){r!==null&&t(r)})}}const md=_0,Um={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},R0=typeof URLSearchParams<"u"?URLSearchParams:Il,j0=typeof FormData<"u"?FormData:null,T0=typeof Blob<"u"?Blob:null,A0=(()=>{let e;return typeof navigator<"u"&&((e=navigator.product)==="ReactNative"||e==="NativeScript"||e==="NS")?!1:typeof window<"u"&&typeof document<"u"})(),L0=(()=>typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&typeof self.importScripts=="function")(),ot={isBrowser:!0,classes:{URLSearchParams:R0,FormData:j0,Blob:T0},isStandardBrowserEnv:A0,isStandardBrowserWebWorkerEnv:L0,protocols:["http","https","file","blob","url","data"]};function x0(e,t){return yi(e,new ot.classes.URLSearchParams,Object.assign({visitor:function(n,r,o,a){return ot.isNode&&O.isBuffer(n)?(this.append(r,n.toString("base64")),!1):a.defaultVisitor.apply(this,arguments)}},t))}function k0(e){return O.matchAll(/\w+|\[(\w*)]/g,e).map(t=>t[0]==="[]"?"":t[1]||t[0])}function M0(e){const t={},n=Object.keys(e);let r;const o=n.length;let a;for(r=0;r<o;r++)a=n[r],t[a]=e[a];return t}function Bm(e){function t(n,r,o,a){let i=n[a++];const s=Number.isFinite(+i),u=a>=n.length;return i=!i&&O.isArray(o)?o.length:i,u?(O.hasOwnProp(o,i)?o[i]=[o[i],r]:o[i]=r,!s):((!o[i]||!O.isObject(o[i]))&&(o[i]=[]),t(n,r,o[i],a)&&O.isArray(o[i])&&(o[i]=M0(o[i])),!s)}if(O.isFormData(e)&&O.isFunction(e.entries)){const n={};return O.forEachEntry(e,(r,o)=>{t(k0(r),o,n,0)}),n}return null}const F0={"Content-Type":void 0};function V0(e,t,n){if(O.isString(e))try{return(t||JSON.parse)(e),O.trim(e)}catch(r){if(r.name!=="SyntaxError")throw r}return(n||JSON.stringify)(e)}const Pi={transitional:Um,adapter:["xhr","http"],transformRequest:[function(t,n){const r=n.getContentType()||"",o=r.indexOf("application/json")>-1,a=O.isObject(t);if(a&&O.isHTMLForm(t)&&(t=new FormData(t)),O.isFormData(t))return o&&o?JSON.stringify(Bm(t)):t;if(O.isArrayBuffer(t)||O.isBuffer(t)||O.isStream(t)||O.isFile(t)||O.isBlob(t))return t;if(O.isArrayBufferView(t))return t.buffer;if(O.isURLSearchParams(t))return n.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),t.toString();let s;if(a){if(r.indexOf("application/x-www-form-urlencoded")>-1)return x0(t,this.formSerializer).toString();if((s=O.isFileList(t))||r.indexOf("multipart/form-data")>-1){const u=this.env&&this.env.FormData;return yi(s?{"files[]":t}:t,u&&new u,this.formSerializer)}}return a||o?(n.setContentType("application/json",!1),V0(t)):t}],transformResponse:[function(t){const n=this.transitional||Pi.transitional,r=n&&n.forcedJSONParsing,o=this.responseType==="json";if(t&&O.isString(t)&&(r&&!this.responseType||o)){const i=!(n&&n.silentJSONParsing)&&o;try{return JSON.parse(t)}catch(s){if(i)throw s.name==="SyntaxError"?x.from(s,x.ERR_BAD_RESPONSE,this,null,this.response):s}}return t}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:ot.classes.FormData,Blob:ot.classes.Blob},validateStatus:function(t){return t>=200&&t<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};O.forEach(["delete","get","head"],function(t){Pi.headers[t]={}});O.forEach(["post","put","patch"],function(t){Pi.headers[t]=O.merge(F0)});const _l=Pi,U0=O.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),B0=e=>{const t={};let n,r,o;return e&&e.split(`
`).forEach(function(i){o=i.indexOf(":"),n=i.substring(0,o).trim().toLowerCase(),r=i.substring(o+1).trim(),!(!n||t[n]&&U0[n])&&(n==="set-cookie"?t[n]?t[n].push(r):t[n]=[r]:t[n]=t[n]?t[n]+", "+r:r)}),t},hd=Symbol("internals");function Or(e){return e&&String(e).trim().toLowerCase()}function Ko(e){return e===!1||e==null?e:O.isArray(e)?e.map(Ko):String(e)}function $0(e){const t=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let r;for(;r=n.exec(e);)t[r[1]]=r[2];return t}function W0(e){return/^[-_a-zA-Z]+$/.test(e.trim())}function rs(e,t,n,r,o){if(O.isFunction(r))return r.call(this,t,n);if(o&&(t=n),!!O.isString(t)){if(O.isString(r))return t.indexOf(r)!==-1;if(O.isRegExp(r))return r.test(t)}}function z0(e){return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(t,n,r)=>n.toUpperCase()+r)}function q0(e,t){const n=O.toCamelCase(" "+t);["get","set","has"].forEach(r=>{Object.defineProperty(e,r+n,{value:function(o,a,i){return this[r].call(this,t,o,a,i)},configurable:!0})})}class Si{constructor(t){t&&this.set(t)}set(t,n,r){const o=this;function a(s,u,l){const d=Or(u);if(!d)throw new Error("header name must be a non-empty string");const c=O.findKey(o,d);(!c||o[c]===void 0||l===!0||l===void 0&&o[c]!==!1)&&(o[c||u]=Ko(s))}const i=(s,u)=>O.forEach(s,(l,d)=>a(l,d,u));return O.isPlainObject(t)||t instanceof this.constructor?i(t,n):O.isString(t)&&(t=t.trim())&&!W0(t)?i(B0(t),n):t!=null&&a(n,t,r),this}get(t,n){if(t=Or(t),t){const r=O.findKey(this,t);if(r){const o=this[r];if(!n)return o;if(n===!0)return $0(o);if(O.isFunction(n))return n.call(this,o,r);if(O.isRegExp(n))return n.exec(o);throw new TypeError("parser must be boolean|regexp|function")}}}has(t,n){if(t=Or(t),t){const r=O.findKey(this,t);return!!(r&&this[r]!==void 0&&(!n||rs(this,this[r],r,n)))}return!1}delete(t,n){const r=this;let o=!1;function a(i){if(i=Or(i),i){const s=O.findKey(r,i);s&&(!n||rs(r,r[s],s,n))&&(delete r[s],o=!0)}}return O.isArray(t)?t.forEach(a):a(t),o}clear(t){const n=Object.keys(this);let r=n.length,o=!1;for(;r--;){const a=n[r];(!t||rs(this,this[a],a,t,!0))&&(delete this[a],o=!0)}return o}normalize(t){const n=this,r={};return O.forEach(this,(o,a)=>{const i=O.findKey(r,a);if(i){n[i]=Ko(o),delete n[a];return}const s=t?z0(a):String(a).trim();s!==a&&delete n[a],n[s]=Ko(o),r[s]=!0}),this}concat(...t){return this.constructor.concat(this,...t)}toJSON(t){const n=Object.create(null);return O.forEach(this,(r,o)=>{r!=null&&r!==!1&&(n[o]=t&&O.isArray(r)?r.join(", "):r)}),n}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([t,n])=>t+": "+n).join(`
`)}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(t){return t instanceof this?t:new this(t)}static concat(t,...n){const r=new this(t);return n.forEach(o=>r.set(o)),r}static accessor(t){const r=(this[hd]=this[hd]={accessors:{}}).accessors,o=this.prototype;function a(i){const s=Or(i);r[s]||(q0(o,i),r[s]=!0)}return O.isArray(t)?t.forEach(a):a(t),this}}Si.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);O.freezeMethods(Si.prototype);O.freezeMethods(Si);const bt=Si;function os(e,t){const n=this||_l,r=t||n,o=bt.from(r.headers);let a=r.data;return O.forEach(e,function(s){a=s.call(n,a,o.normalize(),t?t.status:void 0)}),o.normalize(),a}function $m(e){return!!(e&&e.__CANCEL__)}function po(e,t,n){x.call(this,e??"canceled",x.ERR_CANCELED,t,n),this.name="CanceledError"}O.inherits(po,x,{__CANCEL__:!0});function H0(e,t,n){const r=n.config.validateStatus;!n.status||!r||r(n.status)?e(n):t(new x("Request failed with status code "+n.status,[x.ERR_BAD_REQUEST,x.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n))}const G0=ot.isStandardBrowserEnv?function(){return{write:function(n,r,o,a,i,s){const u=[];u.push(n+"="+encodeURIComponent(r)),O.isNumber(o)&&u.push("expires="+new Date(o).toGMTString()),O.isString(a)&&u.push("path="+a),O.isString(i)&&u.push("domain="+i),s===!0&&u.push("secure"),document.cookie=u.join("; ")},read:function(n){const r=document.cookie.match(new RegExp("(^|;\\s*)("+n+")=([^;]*)"));return r?decodeURIComponent(r[3]):null},remove:function(n){this.write(n,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}();function K0(e){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)}function Q0(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}function Wm(e,t){return e&&!K0(t)?Q0(e,t):t}const Y0=ot.isStandardBrowserEnv?function(){const t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");let r;function o(a){let i=a;return t&&(n.setAttribute("href",i),i=n.href),n.setAttribute("href",i),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:n.pathname.charAt(0)==="/"?n.pathname:"/"+n.pathname}}return r=o(window.location.href),function(i){const s=O.isString(i)?o(i):i;return s.protocol===r.protocol&&s.host===r.host}}():function(){return function(){return!0}}();function J0(e){const t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return t&&t[1]||""}function X0(e,t){e=e||10;const n=new Array(e),r=new Array(e);let o=0,a=0,i;return t=t!==void 0?t:1e3,function(u){const l=Date.now(),d=r[a];i||(i=l),n[o]=u,r[o]=l;let c=a,p=0;for(;c!==o;)p+=n[c++],c=c%e;if(o=(o+1)%e,o===a&&(a=(a+1)%e),l-i<t)return;const h=d&&l-d;return h?Math.round(p*1e3/h):void 0}}function gd(e,t){let n=0;const r=X0(50,250);return o=>{const a=o.loaded,i=o.lengthComputable?o.total:void 0,s=a-n,u=r(s),l=a<=i;n=a;const d={loaded:a,total:i,progress:i?a/i:void 0,bytes:s,rate:u||void 0,estimated:u&&i&&l?(i-a)/u:void 0,event:o};d[t?"download":"upload"]=!0,e(d)}}const Z0=typeof XMLHttpRequest<"u",eP=Z0&&function(e){return new Promise(function(n,r){let o=e.data;const a=bt.from(e.headers).normalize(),i=e.responseType;let s;function u(){e.cancelToken&&e.cancelToken.unsubscribe(s),e.signal&&e.signal.removeEventListener("abort",s)}O.isFormData(o)&&(ot.isStandardBrowserEnv||ot.isStandardBrowserWebWorkerEnv)&&a.setContentType(!1);let l=new XMLHttpRequest;if(e.auth){const h=e.auth.username||"",g=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";a.set("Authorization","Basic "+btoa(h+":"+g))}const d=Wm(e.baseURL,e.url);l.open(e.method.toUpperCase(),Vm(d,e.params,e.paramsSerializer),!0),l.timeout=e.timeout;function c(){if(!l)return;const h=bt.from("getAllResponseHeaders"in l&&l.getAllResponseHeaders()),y={data:!i||i==="text"||i==="json"?l.responseText:l.response,status:l.status,statusText:l.statusText,headers:h,config:e,request:l};H0(function(m){n(m),u()},function(m){r(m),u()},y),l=null}if("onloadend"in l?l.onloadend=c:l.onreadystatechange=function(){!l||l.readyState!==4||l.status===0&&!(l.responseURL&&l.responseURL.indexOf("file:")===0)||setTimeout(c)},l.onabort=function(){l&&(r(new x("Request aborted",x.ECONNABORTED,e,l)),l=null)},l.onerror=function(){r(new x("Network Error",x.ERR_NETWORK,e,l)),l=null},l.ontimeout=function(){let g=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded";const y=e.transitional||Um;e.timeoutErrorMessage&&(g=e.timeoutErrorMessage),r(new x(g,y.clarifyTimeoutError?x.ETIMEDOUT:x.ECONNABORTED,e,l)),l=null},ot.isStandardBrowserEnv){const h=(e.withCredentials||Y0(d))&&e.xsrfCookieName&&G0.read(e.xsrfCookieName);h&&a.set(e.xsrfHeaderName,h)}o===void 0&&a.setContentType(null),"setRequestHeader"in l&&O.forEach(a.toJSON(),function(g,y){l.setRequestHeader(y,g)}),O.isUndefined(e.withCredentials)||(l.withCredentials=!!e.withCredentials),i&&i!=="json"&&(l.responseType=e.responseType),typeof e.onDownloadProgress=="function"&&l.addEventListener("progress",gd(e.onDownloadProgress,!0)),typeof e.onUploadProgress=="function"&&l.upload&&l.upload.addEventListener("progress",gd(e.onUploadProgress)),(e.cancelToken||e.signal)&&(s=h=>{l&&(r(!h||h.type?new po(null,e,l):h),l.abort(),l=null)},e.cancelToken&&e.cancelToken.subscribe(s),e.signal&&(e.signal.aborted?s():e.signal.addEventListener("abort",s)));const p=J0(d);if(p&&ot.protocols.indexOf(p)===-1){r(new x("Unsupported protocol "+p+":",x.ERR_BAD_REQUEST,e));return}l.send(o||null)})},Qo={http:w0,xhr:eP};O.forEach(Qo,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch{}Object.defineProperty(e,"adapterName",{value:t})}});const tP={getAdapter:e=>{e=O.isArray(e)?e:[e];const{length:t}=e;let n,r;for(let o=0;o<t&&(n=e[o],!(r=O.isString(n)?Qo[n.toLowerCase()]:n));o++);if(!r)throw r===!1?new x(`Adapter ${n} is not supported by the environment`,"ERR_NOT_SUPPORT"):new Error(O.hasOwnProp(Qo,n)?`Adapter '${n}' is not available in the build`:`Unknown adapter '${n}'`);if(!O.isFunction(r))throw new TypeError("adapter is not a function");return r},adapters:Qo};function as(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new po(null,e)}function vd(e){return as(e),e.headers=bt.from(e.headers),e.data=os.call(e,e.transformRequest),["post","put","patch"].indexOf(e.method)!==-1&&e.headers.setContentType("application/x-www-form-urlencoded",!1),tP.getAdapter(e.adapter||_l.adapter)(e).then(function(r){return as(e),r.data=os.call(e,e.transformResponse,r),r.headers=bt.from(r.headers),r},function(r){return $m(r)||(as(e),r&&r.response&&(r.response.data=os.call(e,e.transformResponse,r.response),r.response.headers=bt.from(r.response.headers))),Promise.reject(r)})}const yd=e=>e instanceof bt?e.toJSON():e;function sr(e,t){t=t||{};const n={};function r(l,d,c){return O.isPlainObject(l)&&O.isPlainObject(d)?O.merge.call({caseless:c},l,d):O.isPlainObject(d)?O.merge({},d):O.isArray(d)?d.slice():d}function o(l,d,c){if(O.isUndefined(d)){if(!O.isUndefined(l))return r(void 0,l,c)}else return r(l,d,c)}function a(l,d){if(!O.isUndefined(d))return r(void 0,d)}function i(l,d){if(O.isUndefined(d)){if(!O.isUndefined(l))return r(void 0,l)}else return r(void 0,d)}function s(l,d,c){if(c in t)return r(l,d);if(c in e)return r(void 0,l)}const u={url:a,method:a,data:a,baseURL:i,transformRequest:i,transformResponse:i,paramsSerializer:i,timeout:i,timeoutMessage:i,withCredentials:i,adapter:i,responseType:i,xsrfCookieName:i,xsrfHeaderName:i,onUploadProgress:i,onDownloadProgress:i,decompress:i,maxContentLength:i,maxBodyLength:i,beforeRedirect:i,transport:i,httpAgent:i,httpsAgent:i,cancelToken:i,socketPath:i,responseEncoding:i,validateStatus:s,headers:(l,d)=>o(yd(l),yd(d),!0)};return O.forEach(Object.keys(e).concat(Object.keys(t)),function(d){const c=u[d]||o,p=c(e[d],t[d],d);O.isUndefined(p)&&c!==s||(n[d]=p)}),n}const zm="1.3.4",Rl={};["object","boolean","number","function","string","symbol"].forEach((e,t)=>{Rl[e]=function(r){return typeof r===e||"a"+(t<1?"n ":" ")+e}});const Pd={};Rl.transitional=function(t,n,r){function o(a,i){return"[Axios v"+zm+"] Transitional option '"+a+"'"+i+(r?". "+r:"")}return(a,i,s)=>{if(t===!1)throw new x(o(i," has been removed"+(n?" in "+n:"")),x.ERR_DEPRECATED);return n&&!Pd[i]&&(Pd[i]=!0,console.warn(o(i," has been deprecated since v"+n+" and will be removed in the near future"))),t?t(a,i,s):!0}};function nP(e,t,n){if(typeof e!="object")throw new x("options must be an object",x.ERR_BAD_OPTION_VALUE);const r=Object.keys(e);let o=r.length;for(;o-- >0;){const a=r[o],i=t[a];if(i){const s=e[a],u=s===void 0||i(s,a,e);if(u!==!0)throw new x("option "+a+" must be "+u,x.ERR_BAD_OPTION_VALUE);continue}if(n!==!0)throw new x("Unknown option "+a,x.ERR_BAD_OPTION)}}const mu={assertOptions:nP,validators:Rl},Tt=mu.validators;class Ea{constructor(t){this.defaults=t,this.interceptors={request:new md,response:new md}}request(t,n){typeof t=="string"?(n=n||{},n.url=t):n=t||{},n=sr(this.defaults,n);const{transitional:r,paramsSerializer:o,headers:a}=n;r!==void 0&&mu.assertOptions(r,{silentJSONParsing:Tt.transitional(Tt.boolean),forcedJSONParsing:Tt.transitional(Tt.boolean),clarifyTimeoutError:Tt.transitional(Tt.boolean)},!1),o!==void 0&&mu.assertOptions(o,{encode:Tt.function,serialize:Tt.function},!0),n.method=(n.method||this.defaults.method||"get").toLowerCase();let i;i=a&&O.merge(a.common,a[n.method]),i&&O.forEach(["delete","get","head","post","put","patch","common"],g=>{delete a[g]}),n.headers=bt.concat(i,a);const s=[];let u=!0;this.interceptors.request.forEach(function(y){typeof y.runWhen=="function"&&y.runWhen(n)===!1||(u=u&&y.synchronous,s.unshift(y.fulfilled,y.rejected))});const l=[];this.interceptors.response.forEach(function(y){l.push(y.fulfilled,y.rejected)});let d,c=0,p;if(!u){const g=[vd.bind(this),void 0];for(g.unshift.apply(g,s),g.push.apply(g,l),p=g.length,d=Promise.resolve(n);c<p;)d=d.then(g[c++],g[c++]);return d}p=s.length;let h=n;for(c=0;c<p;){const g=s[c++],y=s[c++];try{h=g(h)}catch(S){y.call(this,S);break}}try{d=vd.call(this,h)}catch(g){return Promise.reject(g)}for(c=0,p=l.length;c<p;)d=d.then(l[c++],l[c++]);return d}getUri(t){t=sr(this.defaults,t);const n=Wm(t.baseURL,t.url);return Vm(n,t.params,t.paramsSerializer)}}O.forEach(["delete","get","head","options"],function(t){Ea.prototype[t]=function(n,r){return this.request(sr(r||{},{method:t,url:n,data:(r||{}).data}))}});O.forEach(["post","put","patch"],function(t){function n(r){return function(a,i,s){return this.request(sr(s||{},{method:t,headers:r?{"Content-Type":"multipart/form-data"}:{},url:a,data:i}))}}Ea.prototype[t]=n(),Ea.prototype[t+"Form"]=n(!0)});const Yo=Ea;class jl{constructor(t){if(typeof t!="function")throw new TypeError("executor must be a function.");let n;this.promise=new Promise(function(a){n=a});const r=this;this.promise.then(o=>{if(!r._listeners)return;let a=r._listeners.length;for(;a-- >0;)r._listeners[a](o);r._listeners=null}),this.promise.then=o=>{let a;const i=new Promise(s=>{r.subscribe(s),a=s}).then(o);return i.cancel=function(){r.unsubscribe(a)},i},t(function(a,i,s){r.reason||(r.reason=new po(a,i,s),n(r.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(t){if(this.reason){t(this.reason);return}this._listeners?this._listeners.push(t):this._listeners=[t]}unsubscribe(t){if(!this._listeners)return;const n=this._listeners.indexOf(t);n!==-1&&this._listeners.splice(n,1)}static source(){let t;return{token:new jl(function(o){t=o}),cancel:t}}}const rP=jl;function oP(e){return function(n){return e.apply(null,n)}}function aP(e){return O.isObject(e)&&e.isAxiosError===!0}const hu={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(hu).forEach(([e,t])=>{hu[t]=e});const iP=hu;function qm(e){const t=new Yo(e),n=Cm(Yo.prototype.request,t);return O.extend(n,Yo.prototype,t,{allOwnKeys:!0}),O.extend(n,t,null,{allOwnKeys:!0}),n.create=function(o){return qm(sr(e,o))},n}const re=qm(_l);re.Axios=Yo;re.CanceledError=po;re.CancelToken=rP;re.isCancel=$m;re.VERSION=zm;re.toFormData=yi;re.AxiosError=x;re.Cancel=re.CanceledError;re.all=function(t){return Promise.all(t)};re.spread=oP;re.isAxiosError=aP;re.mergeConfig=sr;re.AxiosHeaders=bt;re.formToJSON=e=>Bm(O.isHTMLForm(e)?new FormData(e):e);re.HttpStatusCode=iP;re.default=re;const Tl=re;Tl.create({baseURL:"https://d2ekewy9aiz800.cloudfront.net/",headers:{Authorization:"Bearer a97cf7b2e7bb0526eb1fa0b7be266d7139a4b2111462388f"}});const sP=`
Bearer eyJraWQiOiJKYjZsaXpRaEtOZlpYbndIUU9IbDRMSnlHMEp6dzNQRTBtNDhDQjRkU3I4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4ZTlmN2JkNS1jMzQ3LTQ5YTAtOThjMC1kZGI1YzFlMzMzMzMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnNhLWVhc3QtMS5hbWF6b25hd3MuY29tXC9zYS1lYXN0LTFfZW04WW9EQnQ0IiwiY29nbml0bzp1c2VybmFtZSI6ImFkbWluQHBvbnR1c3Zpc2lvbi5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbkBwb250dXN2aXNpb24uY29tIiwiZ2l2ZW5fbmFtZSI6ImFkbWluIiwib3JpZ2luX2p0aSI6Ijg0Y2Q0NzNkLTgwYTItNDM1OC04MjYxLTBiMTdlODk1Mzc4NyIsImF1ZCI6IjVlajFoODh0cWxyOTFpMWU1cHZtM2M1ZGV2IiwiZXZlbnRfaWQiOiJiMGQxOGYyZC0wZGZiLTRmZTQtYTY1Ni0xNTkxZjlmMmRjMWMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY4OTI4Njk2MSwiZXhwIjoxNjg5MzU4MTMwLCJpYXQiOjE2ODkzNTQ1MzAsImZhbWlseV9uYW1lIjoiYWRtaW4iLCJqdGkiOiJhZWE1OGQxOC03OGMxLTQ3NGEtYjg2NC1iMjgwYTJhY2NlNmUiLCJlbWFpbCI6ImFkbWluQHBvbnR1c3Zpc2lvbi5jb20ifQ.K39ZZrP4pE1fn-XcOFg7xbt458_NgfBNN57C3BFzP_xL_UKihgbkpHYVK-K_vj3d43Fsx8tzwgMYixDRQQgAUnnCm1oPzGnZv-XPvmU9MaD3a-ZcIG41PqMwFUExkKcPzXHFujYGcxF7sedWJX5jrIZ3-KFW6lHBGNqwIPVOmMHe1h64C5570sCFdViW2mod-tI8EG9oF4oUy10rsv3Zf0A_9YZS9zkshVBl2ZmLhsQBwmb8sljkUMkQEM80ZIHTTEBQ0LqALfQku5fwLqEaKT6FE6j8pW0GYRoLu0xSmCkBV6QM8iAC_11UVu7IREndJaaYmaMJEQ_pD8F6_2UKeg`,uP=Tl.create({baseURL:"https://d2ekewy9aiz800.cloudfront.net/graphql"}),lP=async()=>{const e=`query ListApiKeys {
    security {
      apiKeys: listApiKeys {
        data {
          id
          name
          description
          token
          permissions
          createdOn
          __typename
        }
        __typename
      }
      __typename
    }
  }
  `;return(await uP.post("",{query:e},{headers:{Authorization:sP}})).data.data.security.apiKeys},cP=Tl.create({baseURL:"http://localhost:8080/PontusTest/1.0.0/",headers:{Authorization:"Bearer 123456",Accept:"application/json","Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});(async()=>console.log(await cP.post("/table/data/read",{})))();const dP=async()=>await lP(),fP=()=>{const{login:e}=ay(),[t,n]=j.useState("Admin"),[r,o]=j.useState();Gy(),ny(),gm();const a=s=>{s.preventDefault(),console.log("click"),e(t)};j.useEffect(()=>{(async()=>{const{data:u}=await dP();console.log({data:u}),o(u)})()},[]);const i=s=>{s=JSON.parse(s),n(s.name),s.token,console.log("a97cf7b2e7bb0526eb1fa0b7be266d7139a4b2111462388f")};return j.useEffect(()=>{console.log(t)},[t]),H("div",{className:"login-page",children:ht("div",{className:"login-form",children:[ht("section",{className:"welcome-msg",children:[H("img",{src:"/src/assets/pontus-logo.png",alt:""}),H("h1",{children:"Welcome to the Pontus Vision Platform!"}),H("p",{children:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus ratione eius vel molestiae sit autem ipsa facere vitae quod commodi?"})]}),ht("section",{className:"form",children:[ht("select",{onChange:s=>i(s.target.value),children:[r&&r.map(s=>H("option",{value:JSON.stringify(s),children:s.name})),H("option",{value:"Admin",children:"Admin"}),H("option",{value:"User",children:"User"})]}),ht("form",{onSubmit:a,children:[H("h3",{children:"Sign In"}),ht("div",{className:"mb-3",children:[H("label",{children:"Email address"}),H("input",{type:"email",className:"form-control",placeholder:"Enter email"})]}),ht("div",{className:"mb-3",children:[H("label",{children:"Password"}),H("input",{type:"password",className:"form-control",placeholder:"Enter password"})]}),H("div",{className:"mb-3",children:ht("div",{className:"custom-control custom-checkbox",children:[H("input",{type:"checkbox",className:"custom-control-input",id:"customCheck1"}),H("label",{className:"custom-control-label",htmlFor:"customCheck1",children:"Remember me"})]})}),H("div",{className:"d-grid",children:H("button",{type:"submit",className:"btn btn-primary",children:"Submit"})}),ht("p",{className:"forgot-password text-right",children:["Forgot ",H("a",{href:"#",children:"password?"})]})]})]})]})})};function pP(){return j.useState(0),j.useContext(vm),j.useState(),H(fP,{})}function Qe(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];throw Error("[Immer] minified error nr: "+e+(n.length?" "+n.map(function(o){return"'"+o+"'"}).join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function en(e){return!!e&&!!e[z]}function Nt(e){var t;return!!e&&(function(n){if(!n||typeof n!="object")return!1;var r=Object.getPrototypeOf(n);if(r===null)return!0;var o=Object.hasOwnProperty.call(r,"constructor")&&r.constructor;return o===Object||typeof o=="function"&&Function.toString.call(o)===bP}(e)||Array.isArray(e)||!!e[Cd]||!!(!((t=e.constructor)===null||t===void 0)&&t[Cd])||Al(e)||Ll(e))}function En(e,t,n){n===void 0&&(n=!1),fr(e)===0?(n?Object.keys:Jn)(e).forEach(function(r){n&&typeof r=="symbol"||t(r,e[r],e)}):e.forEach(function(r,o){return t(o,r,e)})}function fr(e){var t=e[z];return t?t.i>3?t.i-4:t.i:Array.isArray(e)?1:Al(e)?2:Ll(e)?3:0}function Yn(e,t){return fr(e)===2?e.has(t):Object.prototype.hasOwnProperty.call(e,t)}function mP(e,t){return fr(e)===2?e.get(t):e[t]}function Hm(e,t,n){var r=fr(e);r===2?e.set(t,n):r===3?e.add(n):e[t]=n}function Gm(e,t){return e===t?e!==0||1/e==1/t:e!=e&&t!=t}function Al(e){return SP&&e instanceof Map}function Ll(e){return OP&&e instanceof Set}function cn(e){return e.o||e.t}function xl(e){if(Array.isArray(e))return Array.prototype.slice.call(e);var t=Qm(e);delete t[z];for(var n=Jn(t),r=0;r<n.length;r++){var o=n[r],a=t[o];a.writable===!1&&(a.writable=!0,a.configurable=!0),(a.get||a.set)&&(t[o]={configurable:!0,writable:!0,enumerable:a.enumerable,value:e[o]})}return Object.create(Object.getPrototypeOf(e),t)}function kl(e,t){return t===void 0&&(t=!1),Ml(e)||en(e)||!Nt(e)||(fr(e)>1&&(e.set=e.add=e.clear=e.delete=hP),Object.freeze(e),t&&En(e,function(n,r){return kl(r,!0)},!0)),e}function hP(){Qe(2)}function Ml(e){return e==null||typeof e!="object"||Object.isFrozen(e)}function ut(e){var t=Pu[e];return t||Qe(18,e),t}function gP(e,t){Pu[e]||(Pu[e]=t)}function gu(){return no}function is(e,t){t&&(ut("Patches"),e.u=[],e.s=[],e.v=t)}function Da(e){vu(e),e.p.forEach(vP),e.p=null}function vu(e){e===no&&(no=e.l)}function Sd(e){return no={p:[],l:no,h:e,m:!0,_:0}}function vP(e){var t=e[z];t.i===0||t.i===1?t.j():t.O=!0}function ss(e,t){t._=t.p.length;var n=t.p[0],r=e!==void 0&&e!==n;return t.h.g||ut("ES5").S(t,e,r),r?(n[z].P&&(Da(t),Qe(4)),Nt(e)&&(e=wa(t,e),t.l||Ca(t,e)),t.u&&ut("Patches").M(n[z].t,e,t.u,t.s)):e=wa(t,n,[]),Da(t),t.u&&t.v(t.u,t.s),e!==Km?e:void 0}function wa(e,t,n){if(Ml(t))return t;var r=t[z];if(!r)return En(t,function(s,u){return Od(e,r,t,s,u,n)},!0),t;if(r.A!==e)return t;if(!r.P)return Ca(e,r.t,!0),r.t;if(!r.I){r.I=!0,r.A._--;var o=r.i===4||r.i===5?r.o=xl(r.k):r.o,a=o,i=!1;r.i===3&&(a=new Set(o),o.clear(),i=!0),En(a,function(s,u){return Od(e,r,o,s,u,n,i)}),Ca(e,o,!1),n&&e.u&&ut("Patches").N(r,n,e.u,e.s)}return r.o}function Od(e,t,n,r,o,a,i){if(en(o)){var s=wa(e,o,a&&t&&t.i!==3&&!Yn(t.R,r)?a.concat(r):void 0);if(Hm(n,r,s),!en(s))return;e.m=!1}else i&&n.add(o);if(Nt(o)&&!Ml(o)){if(!e.h.D&&e._<1)return;wa(e,o),t&&t.A.l||Ca(e,o)}}function Ca(e,t,n){n===void 0&&(n=!1),!e.l&&e.h.D&&e.m&&kl(t,n)}function us(e,t){var n=e[z];return(n?cn(n):e)[t]}function bd(e,t){if(t in e)for(var n=Object.getPrototypeOf(e);n;){var r=Object.getOwnPropertyDescriptor(n,t);if(r)return r;n=Object.getPrototypeOf(n)}}function Mt(e){e.P||(e.P=!0,e.l&&Mt(e.l))}function ls(e){e.o||(e.o=xl(e.t))}function yu(e,t,n){var r=Al(t)?ut("MapSet").F(t,n):Ll(t)?ut("MapSet").T(t,n):e.g?function(o,a){var i=Array.isArray(o),s={i:i?1:0,A:a?a.A:gu(),P:!1,I:!1,R:{},l:a,t:o,k:null,o:null,j:null,C:!1},u=s,l=ro;i&&(u=[s],l=Nr);var d=Proxy.revocable(u,l),c=d.revoke,p=d.proxy;return s.k=p,s.j=c,p}(t,n):ut("ES5").J(t,n);return(n?n.A:gu()).p.push(r),r}function yP(e){return en(e)||Qe(22,e),function t(n){if(!Nt(n))return n;var r,o=n[z],a=fr(n);if(o){if(!o.P&&(o.i<4||!ut("ES5").K(o)))return o.t;o.I=!0,r=Ed(n,a),o.I=!1}else r=Ed(n,a);return En(r,function(i,s){o&&mP(o.t,i)===s||Hm(r,i,t(s))}),a===3?new Set(r):r}(e)}function Ed(e,t){switch(t){case 2:return new Map(e);case 3:return Array.from(e)}return xl(e)}function PP(){function e(a,i){var s=o[a];return s?s.enumerable=i:o[a]=s={configurable:!0,enumerable:i,get:function(){var u=this[z];return ro.get(u,a)},set:function(u){var l=this[z];ro.set(l,a,u)}},s}function t(a){for(var i=a.length-1;i>=0;i--){var s=a[i][z];if(!s.P)switch(s.i){case 5:r(s)&&Mt(s);break;case 4:n(s)&&Mt(s)}}}function n(a){for(var i=a.t,s=a.k,u=Jn(s),l=u.length-1;l>=0;l--){var d=u[l];if(d!==z){var c=i[d];if(c===void 0&&!Yn(i,d))return!0;var p=s[d],h=p&&p[z];if(h?h.t!==c:!Gm(p,c))return!0}}var g=!!i[z];return u.length!==Jn(i).length+(g?0:1)}function r(a){var i=a.k;if(i.length!==a.t.length)return!0;var s=Object.getOwnPropertyDescriptor(i,i.length-1);if(s&&!s.get)return!0;for(var u=0;u<i.length;u++)if(!i.hasOwnProperty(u))return!0;return!1}var o={};gP("ES5",{J:function(a,i){var s=Array.isArray(a),u=function(d,c){if(d){for(var p=Array(c.length),h=0;h<c.length;h++)Object.defineProperty(p,""+h,e(h,!0));return p}var g=Qm(c);delete g[z];for(var y=Jn(g),S=0;S<y.length;S++){var m=y[S];g[m]=e(m,d||!!g[m].enumerable)}return Object.create(Object.getPrototypeOf(c),g)}(s,a),l={i:s?5:4,A:i?i.A:gu(),P:!1,I:!1,R:{},l:i,t:a,k:u,o:null,O:!1,C:!1};return Object.defineProperty(u,z,{value:l,writable:!0}),u},S:function(a,i,s){s?en(i)&&i[z].A===a&&t(a.p):(a.u&&function u(l){if(l&&typeof l=="object"){var d=l[z];if(d){var c=d.t,p=d.k,h=d.R,g=d.i;if(g===4)En(p,function(v){v!==z&&(c[v]!==void 0||Yn(c,v)?h[v]||u(p[v]):(h[v]=!0,Mt(d)))}),En(c,function(v){p[v]!==void 0||Yn(p,v)||(h[v]=!1,Mt(d))});else if(g===5){if(r(d)&&(Mt(d),h.length=!0),p.length<c.length)for(var y=p.length;y<c.length;y++)h[y]=!1;else for(var S=c.length;S<p.length;S++)h[S]=!0;for(var m=Math.min(p.length,c.length),f=0;f<m;f++)p.hasOwnProperty(f)||(h[f]=!0),h[f]===void 0&&u(p[f])}}}}(a.p[0]),t(a.p))},K:function(a){return a.i===4?n(a):r(a)}})}var Dd,no,Fl=typeof Symbol<"u"&&typeof Symbol("x")=="symbol",SP=typeof Map<"u",OP=typeof Set<"u",wd=typeof Proxy<"u"&&Proxy.revocable!==void 0&&typeof Reflect<"u",Km=Fl?Symbol.for("immer-nothing"):((Dd={})["immer-nothing"]=!0,Dd),Cd=Fl?Symbol.for("immer-draftable"):"__$immer_draftable",z=Fl?Symbol.for("immer-state"):"__$immer_state",bP=""+Object.prototype.constructor,Jn=typeof Reflect<"u"&&Reflect.ownKeys?Reflect.ownKeys:Object.getOwnPropertySymbols!==void 0?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:Object.getOwnPropertyNames,Qm=Object.getOwnPropertyDescriptors||function(e){var t={};return Jn(e).forEach(function(n){t[n]=Object.getOwnPropertyDescriptor(e,n)}),t},Pu={},ro={get:function(e,t){if(t===z)return e;var n=cn(e);if(!Yn(n,t))return function(o,a,i){var s,u=bd(a,i);return u?"value"in u?u.value:(s=u.get)===null||s===void 0?void 0:s.call(o.k):void 0}(e,n,t);var r=n[t];return e.I||!Nt(r)?r:r===us(e.t,t)?(ls(e),e.o[t]=yu(e.A.h,r,e)):r},has:function(e,t){return t in cn(e)},ownKeys:function(e){return Reflect.ownKeys(cn(e))},set:function(e,t,n){var r=bd(cn(e),t);if(r!=null&&r.set)return r.set.call(e.k,n),!0;if(!e.P){var o=us(cn(e),t),a=o==null?void 0:o[z];if(a&&a.t===n)return e.o[t]=n,e.R[t]=!1,!0;if(Gm(n,o)&&(n!==void 0||Yn(e.t,t)))return!0;ls(e),Mt(e)}return e.o[t]===n&&(n!==void 0||t in e.o)||Number.isNaN(n)&&Number.isNaN(e.o[t])||(e.o[t]=n,e.R[t]=!0),!0},deleteProperty:function(e,t){return us(e.t,t)!==void 0||t in e.t?(e.R[t]=!1,ls(e),Mt(e)):delete e.R[t],e.o&&delete e.o[t],!0},getOwnPropertyDescriptor:function(e,t){var n=cn(e),r=Reflect.getOwnPropertyDescriptor(n,t);return r&&{writable:!0,configurable:e.i!==1||t!=="length",enumerable:r.enumerable,value:n[t]}},defineProperty:function(){Qe(11)},getPrototypeOf:function(e){return Object.getPrototypeOf(e.t)},setPrototypeOf:function(){Qe(12)}},Nr={};En(ro,function(e,t){Nr[e]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)}}),Nr.deleteProperty=function(e,t){return Nr.set.call(this,e,t,void 0)},Nr.set=function(e,t,n){return ro.set.call(this,e[0],t,n,e[0])};var EP=function(){function e(n){var r=this;this.g=wd,this.D=!0,this.produce=function(o,a,i){if(typeof o=="function"&&typeof a!="function"){var s=a;a=o;var u=r;return function(y){var S=this;y===void 0&&(y=s);for(var m=arguments.length,f=Array(m>1?m-1:0),v=1;v<m;v++)f[v-1]=arguments[v];return u.produce(y,function(P){var E;return(E=a).call.apply(E,[S,P].concat(f))})}}var l;if(typeof a!="function"&&Qe(6),i!==void 0&&typeof i!="function"&&Qe(7),Nt(o)){var d=Sd(r),c=yu(r,o,void 0),p=!0;try{l=a(c),p=!1}finally{p?Da(d):vu(d)}return typeof Promise<"u"&&l instanceof Promise?l.then(function(y){return is(d,i),ss(y,d)},function(y){throw Da(d),y}):(is(d,i),ss(l,d))}if(!o||typeof o!="object"){if((l=a(o))===void 0&&(l=o),l===Km&&(l=void 0),r.D&&kl(l,!0),i){var h=[],g=[];ut("Patches").M(o,l,h,g),i(h,g)}return l}Qe(21,o)},this.produceWithPatches=function(o,a){if(typeof o=="function")return function(l){for(var d=arguments.length,c=Array(d>1?d-1:0),p=1;p<d;p++)c[p-1]=arguments[p];return r.produceWithPatches(l,function(h){return o.apply(void 0,[h].concat(c))})};var i,s,u=r.produce(o,a,function(l,d){i=l,s=d});return typeof Promise<"u"&&u instanceof Promise?u.then(function(l){return[l,i,s]}):[u,i,s]},typeof(n==null?void 0:n.useProxies)=="boolean"&&this.setUseProxies(n.useProxies),typeof(n==null?void 0:n.autoFreeze)=="boolean"&&this.setAutoFreeze(n.autoFreeze)}var t=e.prototype;return t.createDraft=function(n){Nt(n)||Qe(8),en(n)&&(n=yP(n));var r=Sd(this),o=yu(this,n,void 0);return o[z].C=!0,vu(r),o},t.finishDraft=function(n,r){var o=n&&n[z],a=o.A;return is(a,r),ss(void 0,a)},t.setAutoFreeze=function(n){this.D=n},t.setUseProxies=function(n){n&&!wd&&Qe(20),this.g=n},t.applyPatches=function(n,r){var o;for(o=r.length-1;o>=0;o--){var a=r[o];if(a.path.length===0&&a.op==="replace"){n=a.value;break}}o>-1&&(r=r.slice(o+1));var i=ut("Patches").$;return en(n)?i(n,r):this.produce(n,function(s){return i(s,r)})},e}(),Te=new EP,Ym=Te.produce;Te.produceWithPatches.bind(Te);Te.setAutoFreeze.bind(Te);Te.setUseProxies.bind(Te);Te.applyPatches.bind(Te);Te.createDraft.bind(Te);Te.finishDraft.bind(Te);function oo(e){return oo=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},oo(e)}function DP(e,t){if(oo(e)!=="object"||e===null)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||"default");if(oo(r)!=="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function wP(e){var t=DP(e,"string");return oo(t)==="symbol"?t:String(t)}function CP(e,t,n){return t=wP(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Nd(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function Id(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?Nd(Object(n),!0).forEach(function(r){CP(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Nd(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function pe(e){return"Minified Redux error #"+e+"; visit https://redux.js.org/Errors?code="+e+" for the full message or use the non-minified dev environment for full errors. "}var _d=function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"}(),cs=function(){return Math.random().toString(36).substring(7).split("").join(".")},Na={INIT:"@@redux/INIT"+cs(),REPLACE:"@@redux/REPLACE"+cs(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+cs()}};function NP(e){if(typeof e!="object"||e===null)return!1;for(var t=e;Object.getPrototypeOf(t)!==null;)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function Jm(e,t,n){var r;if(typeof t=="function"&&typeof n=="function"||typeof n=="function"&&typeof arguments[3]=="function")throw new Error(pe(0));if(typeof t=="function"&&typeof n>"u"&&(n=t,t=void 0),typeof n<"u"){if(typeof n!="function")throw new Error(pe(1));return n(Jm)(e,t)}if(typeof e!="function")throw new Error(pe(2));var o=e,a=t,i=[],s=i,u=!1;function l(){s===i&&(s=i.slice())}function d(){if(u)throw new Error(pe(3));return a}function c(y){if(typeof y!="function")throw new Error(pe(4));if(u)throw new Error(pe(5));var S=!0;return l(),s.push(y),function(){if(S){if(u)throw new Error(pe(6));S=!1,l();var f=s.indexOf(y);s.splice(f,1),i=null}}}function p(y){if(!NP(y))throw new Error(pe(7));if(typeof y.type>"u")throw new Error(pe(8));if(u)throw new Error(pe(9));try{u=!0,a=o(a,y)}finally{u=!1}for(var S=i=s,m=0;m<S.length;m++){var f=S[m];f()}return y}function h(y){if(typeof y!="function")throw new Error(pe(10));o=y,p({type:Na.REPLACE})}function g(){var y,S=c;return y={subscribe:function(f){if(typeof f!="object"||f===null)throw new Error(pe(11));function v(){f.next&&f.next(d())}v();var P=S(v);return{unsubscribe:P}}},y[_d]=function(){return this},y}return p({type:Na.INIT}),r={dispatch:p,subscribe:c,getState:d,replaceReducer:h},r[_d]=g,r}function IP(e){Object.keys(e).forEach(function(t){var n=e[t],r=n(void 0,{type:Na.INIT});if(typeof r>"u")throw new Error(pe(12));if(typeof n(void 0,{type:Na.PROBE_UNKNOWN_ACTION()})>"u")throw new Error(pe(13))})}function _P(e){for(var t=Object.keys(e),n={},r=0;r<t.length;r++){var o=t[r];typeof e[o]=="function"&&(n[o]=e[o])}var a=Object.keys(n),i;try{IP(n)}catch(s){i=s}return function(u,l){if(u===void 0&&(u={}),i)throw i;for(var d=!1,c={},p=0;p<a.length;p++){var h=a[p],g=n[h],y=u[h],S=g(y,l);if(typeof S>"u")throw l&&l.type,new Error(pe(14));c[h]=S,d=d||S!==y}return d=d||a.length!==Object.keys(u).length,d?c:u}}function Ia(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.length===0?function(r){return r}:t.length===1?t[0]:t.reduce(function(r,o){return function(){return r(o.apply(void 0,arguments))}})}function RP(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(r){return function(){var o=r.apply(void 0,arguments),a=function(){throw new Error(pe(15))},i={getState:o.getState,dispatch:function(){return a.apply(void 0,arguments)}},s=t.map(function(u){return u(i)});return a=Ia.apply(void 0,s)(o.dispatch),Id(Id({},o),{},{dispatch:a})}}}function Xm(e){var t=function(r){var o=r.dispatch,a=r.getState;return function(i){return function(s){return typeof s=="function"?s(o,a,e):i(s)}}};return t}var Zm=Xm();Zm.withExtraArgument=Xm;const Rd=Zm;var jP=globalThis&&globalThis.__extends||function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,o){r.__proto__=o}||function(r,o){for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(r[a]=o[a])},e(t,n)};return function(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");e(t,n);function r(){this.constructor=t}t.prototype=n===null?Object.create(n):(r.prototype=n.prototype,new r)}}(),TP=globalThis&&globalThis.__generator||function(e,t){var n={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},r,o,a,i;return i={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(i[Symbol.iterator]=function(){return this}),i;function s(l){return function(d){return u([l,d])}}function u(l){if(r)throw new TypeError("Generator is already executing.");for(;n;)try{if(r=1,o&&(a=l[0]&2?o.return:l[0]?o.throw||((a=o.return)&&a.call(o),0):o.next)&&!(a=a.call(o,l[1])).done)return a;switch(o=0,a&&(l=[l[0]&2,a.value]),l[0]){case 0:case 1:a=l;break;case 4:return n.label++,{value:l[1],done:!1};case 5:n.label++,o=l[1],l=[0];continue;case 7:l=n.ops.pop(),n.trys.pop();continue;default:if(a=n.trys,!(a=a.length>0&&a[a.length-1])&&(l[0]===6||l[0]===2)){n=0;continue}if(l[0]===3&&(!a||l[1]>a[0]&&l[1]<a[3])){n.label=l[1];break}if(l[0]===6&&n.label<a[1]){n.label=a[1],a=l;break}if(a&&n.label<a[2]){n.label=a[2],n.ops.push(l);break}a[2]&&n.ops.pop(),n.trys.pop();continue}l=t.call(e,n)}catch(d){l=[6,d],o=0}finally{r=a=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}},_a=globalThis&&globalThis.__spreadArray||function(e,t){for(var n=0,r=t.length,o=e.length;n<r;n++,o++)e[o]=t[n];return e},AP=Object.defineProperty,LP=Object.defineProperties,xP=Object.getOwnPropertyDescriptors,jd=Object.getOwnPropertySymbols,kP=Object.prototype.hasOwnProperty,MP=Object.prototype.propertyIsEnumerable,Td=function(e,t,n){return t in e?AP(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n},Kt=function(e,t){for(var n in t||(t={}))kP.call(t,n)&&Td(e,n,t[n]);if(jd)for(var r=0,o=jd(t);r<o.length;r++){var n=o[r];MP.call(t,n)&&Td(e,n,t[n])}return e},ds=function(e,t){return LP(e,xP(t))},FP=function(e,t,n){return new Promise(function(r,o){var a=function(u){try{s(n.next(u))}catch(l){o(l)}},i=function(u){try{s(n.throw(u))}catch(l){o(l)}},s=function(u){return u.done?r(u.value):Promise.resolve(u.value).then(a,i)};s((n=n.apply(e,t)).next())})},VP=typeof window<"u"&&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__:function(){if(arguments.length!==0)return typeof arguments[0]=="object"?Ia:Ia.apply(null,arguments)};function UP(e){if(typeof e!="object"||e===null)return!1;var t=Object.getPrototypeOf(e);if(t===null)return!0;for(var n=t;Object.getPrototypeOf(n)!==null;)n=Object.getPrototypeOf(n);return t===n}var BP=function(e){jP(t,e);function t(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];var o=e.apply(this,n)||this;return Object.setPrototypeOf(o,t.prototype),o}return Object.defineProperty(t,Symbol.species,{get:function(){return t},enumerable:!1,configurable:!0}),t.prototype.concat=function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];return e.prototype.concat.apply(this,n)},t.prototype.prepend=function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];return n.length===1&&Array.isArray(n[0])?new(t.bind.apply(t,_a([void 0],n[0].concat(this)))):new(t.bind.apply(t,_a([void 0],n.concat(this))))},t}(Array);function Su(e){return Nt(e)?Ym(e,function(){}):e}function $P(e){return typeof e=="boolean"}function WP(){return function(t){return zP(t)}}function zP(e){e===void 0&&(e={});var t=e.thunk,n=t===void 0?!0:t;e.immutableCheck,e.serializableCheck;var r=new BP;return n&&($P(n)?r.push(Rd):r.push(Rd.withExtraArgument(n.extraArgument))),r}var qP=!0;function HP(e){var t=WP(),n=e||{},r=n.reducer,o=r===void 0?void 0:r,a=n.middleware,i=a===void 0?t():a,s=n.devTools,u=s===void 0?!0:s,l=n.preloadedState,d=l===void 0?void 0:l,c=n.enhancers,p=c===void 0?void 0:c,h;if(typeof o=="function")h=o;else if(UP(o))h=_P(o);else throw new Error('"reducer" is a required argument, and must be a function or an object of functions that can be passed to combineReducers');var g=i;typeof g=="function"&&(g=g(t));var y=RP.apply(void 0,g),S=Ia;u&&(S=VP(Kt({trace:!qP},typeof u=="object"&&u)));var m=[y];Array.isArray(p)?m=_a([y],p):typeof p=="function"&&(m=p(m));var f=S.apply(void 0,m);return Jm(h,d,f)}function Qt(e,t){function n(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];if(t){var a=t.apply(void 0,r);if(!a)throw new Error("prepareAction did not return an object");return Kt(Kt({type:e,payload:a.payload},"meta"in a&&{meta:a.meta}),"error"in a&&{error:a.error})}return{type:e,payload:r[0]}}return n.toString=function(){return""+e},n.type=e,n.match=function(r){return r.type===e},n}function eh(e){var t={},n=[],r,o={addCase:function(a,i){var s=typeof a=="string"?a:a.type;if(s in t)throw new Error("addCase cannot be called with two reducers for the same action type");return t[s]=i,o},addMatcher:function(a,i){return n.push({matcher:a,reducer:i}),o},addDefaultCase:function(a){return r=a,o}};return e(o),[t,n,r]}function GP(e){return typeof e=="function"}function KP(e,t,n,r){n===void 0&&(n=[]);var o=typeof t=="function"?eh(t):[t,n,r],a=o[0],i=o[1],s=o[2],u;if(GP(e))u=function(){return Su(e())};else{var l=Su(e);u=function(){return l}}function d(c,p){c===void 0&&(c=u());var h=_a([a[p.type]],i.filter(function(g){var y=g.matcher;return y(p)}).map(function(g){var y=g.reducer;return y}));return h.filter(function(g){return!!g}).length===0&&(h=[s]),h.reduce(function(g,y){if(y)if(en(g)){var S=g,m=y(S,p);return m===void 0?g:m}else{if(Nt(g))return Ym(g,function(f){return y(f,p)});var m=y(g,p);if(m===void 0){if(g===null)return g;throw Error("A case reducer on a non-draftable value must not return undefined")}return m}return g},c)}return d.getInitialState=u,d}function QP(e,t){return e+"/"+t}function Oi(e){var t=e.name;if(!t)throw new Error("`name` is a required option for createSlice");typeof process<"u";var n=typeof e.initialState=="function"?e.initialState:Su(e.initialState),r=e.reducers||{},o=Object.keys(r),a={},i={},s={};o.forEach(function(d){var c=r[d],p=QP(t,d),h,g;"reducer"in c?(h=c.reducer,g=c.prepare):h=c,a[d]=h,i[p]=h,s[d]=g?Qt(p,g):Qt(p)});function u(){var d=typeof e.extraReducers=="function"?eh(e.extraReducers):[e.extraReducers],c=d[0],p=c===void 0?{}:c,h=d[1],g=h===void 0?[]:h,y=d[2],S=y===void 0?void 0:y,m=Kt(Kt({},p),i);return KP(n,function(f){for(var v in m)f.addCase(v,m[v]);for(var P=0,E=g;P<E.length;P++){var D=E[P];f.addMatcher(D.matcher,D.reducer)}S&&f.addDefaultCase(S)})}var l;return{name:t,reducer:function(d,c){return l||(l=u()),l(d,c)},actions:s,caseReducers:a,getInitialState:function(){return l||(l=u()),l.getInitialState()}}}var YP="ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW",JP=function(e){e===void 0&&(e=21);for(var t="",n=e;n--;)t+=YP[Math.random()*64|0];return t},XP=["name","message","stack","code"],fs=function(){function e(t,n){this.payload=t,this.meta=n}return e}(),Ad=function(){function e(t,n){this.payload=t,this.meta=n}return e}(),ZP=function(e){if(typeof e=="object"&&e!==null){for(var t={},n=0,r=XP;n<r.length;n++){var o=r[n];typeof e[o]=="string"&&(t[o]=e[o])}return t}return{message:String(e)}};(function(){function e(t,n,r){var o=Qt(t+"/fulfilled",function(l,d,c,p){return{payload:l,meta:ds(Kt({},p||{}),{arg:c,requestId:d,requestStatus:"fulfilled"})}}),a=Qt(t+"/pending",function(l,d,c){return{payload:void 0,meta:ds(Kt({},c||{}),{arg:d,requestId:l,requestStatus:"pending"})}}),i=Qt(t+"/rejected",function(l,d,c,p,h){return{payload:p,error:(r&&r.serializeError||ZP)(l||"Rejected"),meta:ds(Kt({},h||{}),{arg:c,requestId:d,rejectedWithValue:!!p,requestStatus:"rejected",aborted:(l==null?void 0:l.name)==="AbortError",condition:(l==null?void 0:l.name)==="ConditionError"})}}),s=typeof AbortController<"u"?AbortController:function(){function l(){this.signal={aborted:!1,addEventListener:function(){},dispatchEvent:function(){return!1},onabort:function(){},removeEventListener:function(){},reason:void 0,throwIfAborted:function(){}}}return l.prototype.abort=function(){},l}();function u(l){return function(d,c,p){var h=r!=null&&r.idGenerator?r.idGenerator(l):JP(),g=new s,y;function S(f){y=f,g.abort()}var m=function(){return FP(this,null,function(){var f,v,P,E,D,w,I;return TP(this,function(L){switch(L.label){case 0:return L.trys.push([0,4,,5]),E=(f=r==null?void 0:r.condition)==null?void 0:f.call(r,l,{getState:c,extra:p}),tS(E)?[4,E]:[3,2];case 1:E=L.sent(),L.label=2;case 2:if(E===!1||g.signal.aborted)throw{name:"ConditionError",message:"Aborted due to condition callback returning false."};return D=new Promise(function(_,X){return g.signal.addEventListener("abort",function(){return X({name:"AbortError",message:y||"Aborted"})})}),d(a(h,l,(v=r==null?void 0:r.getPendingMeta)==null?void 0:v.call(r,{requestId:h,arg:l},{getState:c,extra:p}))),[4,Promise.race([D,Promise.resolve(n(l,{dispatch:d,getState:c,extra:p,requestId:h,signal:g.signal,abort:S,rejectWithValue:function(_,X){return new fs(_,X)},fulfillWithValue:function(_,X){return new Ad(_,X)}})).then(function(_){if(_ instanceof fs)throw _;return _ instanceof Ad?o(_.payload,h,l,_.meta):o(_,h,l)})])];case 3:return P=L.sent(),[3,5];case 4:return w=L.sent(),P=w instanceof fs?i(null,h,l,w.payload,w.meta):i(w,h,l),[3,5];case 5:return I=r&&!r.dispatchConditionRejection&&i.match(P)&&P.meta.condition,I||d(P),[2,P]}})})}();return Object.assign(m,{abort:S,requestId:h,arg:l,unwrap:function(){return m.then(eS)}})}}return Object.assign(u,{pending:a,rejected:i,fulfilled:o,typePrefix:t})}return e.withTypes=function(){return e},e})();function eS(e){if(e.meta&&e.meta.rejectedWithValue)throw e.payload;if(e.error)throw e.error;return e.payload}function tS(e){return e!==null&&typeof e=="object"&&typeof e.then=="function"}var Vl="listenerMiddleware";Qt(Vl+"/add");Qt(Vl+"/removeAll");Qt(Vl+"/remove");var Ld;typeof queueMicrotask=="function"&&queueMicrotask.bind(typeof window<"u"?window:typeof global<"u"?global:globalThis);PP();const nS={model:{},models:[]},rS=Oi({name:"model",initialState:nS,reducers:{setModel:(e,t)=>{e.model=t.payload}}}),oS=rS.reducer,aS={value:[],dashboardId:void 0},iS=Oi({name:"dashboard",initialState:aS,reducers:{setDashboards:(e,t)=>{e.value=[...e.value,t.payload],localStorage.setItem("dashboards",JSON.stringify(e.value)),console.log(e.value)},updateDashboard:(e,t)=>{e.value=e.value.map(n=>n.id===t.payload.id?{...n,gridState:t.payload.item}:n)},deleteDashboard:(e,t)=>{const n=e.value.findIndex(r=>r.id===t.payload.id);n!==-1&&e.value.splice(n,1),console.log({index:n})},setDashboardId:(e,t)=>{e.dashboardId=t.payload.id}}}),sS=iS.reducer,uS={modelId:void 0,rowId:void 0,rowState:{}},lS=Oi({name:"gridUpdate",initialState:uS,reducers:{newRowState:(e,t)=>{e.modelId=t.payload.modelId,e.rowId=t.payload.rowId,e.rowState=t.payload.rowState}}}),cS=lS.reducer,dS={value:void 0},fS=Oi({name:"token",initialState:dS,reducers:{setToken:(e,t)=>{e.value=t.payload.token}}}),pS=fS.reducer,xd=localStorage.getItem("dashboards");xd&&JSON.parse(xd);const Ou=HP({reducer:{model:oS,dashboards:sS,updateRow:cS,token:pS}});Ou.subscribe(()=>{const e=Ou.getState();localStorage.setItem("dashboards",JSON.stringify(e.dashboards.value))});function Ue(e){return Ue=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Ue(e)}function ct(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function mS(e,t){if(Ue(e)!=="object"||e===null)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||"default");if(Ue(r)!=="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function th(e){var t=mS(e,"string");return Ue(t)==="symbol"?t:String(t)}function kd(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,th(r.key),r)}}function dt(e,t,n){return t&&kd(e.prototype,t),n&&kd(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function Yt(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function bu(e,t){return bu=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,o){return r.__proto__=o,r},bu(e,t)}function bi(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&bu(e,t)}function mo(e,t){if(t&&(Ue(t)==="object"||typeof t=="function"))return t;if(t!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return Yt(e)}function lt(e){return lt=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(n){return n.__proto__||Object.getPrototypeOf(n)},lt(e)}function an(e,t,n){return t=th(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function hS(e){if(Array.isArray(e))return e}function gS(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Md(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function vS(e,t){if(e){if(typeof e=="string")return Md(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Md(e,t)}}function yS(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function PS(e){return hS(e)||gS(e)||vS(e)||yS()}function Fd(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function Vd(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?Fd(Object(n),!0).forEach(function(r){an(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Fd(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}var SS={type:"logger",log:function(t){this.output("log",t)},warn:function(t){this.output("warn",t)},error:function(t){this.output("error",t)},output:function(t,n){console&&console[t]&&console[t].apply(console,n)}},OS=function(){function e(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};ct(this,e),this.init(t,n)}return dt(e,[{key:"init",value:function(n){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};this.prefix=r.prefix||"i18next:",this.logger=n||SS,this.options=r,this.debug=r.debug}},{key:"setDebug",value:function(n){this.debug=n}},{key:"log",value:function(){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return this.forward(r,"log","",!0)}},{key:"warn",value:function(){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return this.forward(r,"warn","",!0)}},{key:"error",value:function(){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return this.forward(r,"error","")}},{key:"deprecate",value:function(){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return this.forward(r,"warn","WARNING DEPRECATED: ",!0)}},{key:"forward",value:function(n,r,o,a){return a&&!this.debug?null:(typeof n[0]=="string"&&(n[0]="".concat(o).concat(this.prefix," ").concat(n[0])),this.logger[r](n))}},{key:"create",value:function(n){return new e(this.logger,Vd(Vd({},{prefix:"".concat(this.prefix,":").concat(n,":")}),this.options))}},{key:"clone",value:function(n){return n=n||this.options,n.prefix=n.prefix||this.prefix,new e(this.logger,n)}}]),e}(),at=new OS,tn=function(){function e(){ct(this,e),this.observers={}}return dt(e,[{key:"on",value:function(n,r){var o=this;return n.split(" ").forEach(function(a){o.observers[a]=o.observers[a]||[],o.observers[a].push(r)}),this}},{key:"off",value:function(n,r){if(this.observers[n]){if(!r){delete this.observers[n];return}this.observers[n]=this.observers[n].filter(function(o){return o!==r})}}},{key:"emit",value:function(n){for(var r=arguments.length,o=new Array(r>1?r-1:0),a=1;a<r;a++)o[a-1]=arguments[a];if(this.observers[n]){var i=[].concat(this.observers[n]);i.forEach(function(u){u.apply(void 0,o)})}if(this.observers["*"]){var s=[].concat(this.observers["*"]);s.forEach(function(u){u.apply(u,[n].concat(o))})}}}]),e}();function br(){var e,t,n=new Promise(function(r,o){e=r,t=o});return n.resolve=e,n.reject=t,n}function Ud(e){return e==null?"":""+e}function bS(e,t,n){e.forEach(function(r){t[r]&&(n[r]=t[r])})}function Ul(e,t,n){function r(s){return s&&s.indexOf("###")>-1?s.replace(/###/g,"."):s}function o(){return!e||typeof e=="string"}for(var a=typeof t!="string"?[].concat(t):t.split(".");a.length>1;){if(o())return{};var i=r(a.shift());!e[i]&&n&&(e[i]=new n),Object.prototype.hasOwnProperty.call(e,i)?e=e[i]:e={}}return o()?{}:{obj:e,k:r(a.shift())}}function Bd(e,t,n){var r=Ul(e,t,Object),o=r.obj,a=r.k;o[a]=n}function ES(e,t,n,r){var o=Ul(e,t,Object),a=o.obj,i=o.k;a[i]=a[i]||[],r&&(a[i]=a[i].concat(n)),r||a[i].push(n)}function Ra(e,t){var n=Ul(e,t),r=n.obj,o=n.k;if(r)return r[o]}function DS(e,t,n){var r=Ra(e,n);return r!==void 0?r:Ra(t,n)}function nh(e,t,n){for(var r in t)r!=="__proto__"&&r!=="constructor"&&(r in e?typeof e[r]=="string"||e[r]instanceof String||typeof t[r]=="string"||t[r]instanceof String?n&&(e[r]=t[r]):nh(e[r],t[r],n):e[r]=t[r]);return e}function Rn(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}var wS={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};function CS(e){return typeof e=="string"?e.replace(/[&<>"'\/]/g,function(t){return wS[t]}):e}var Ei=typeof window<"u"&&window.navigator&&typeof window.navigator.userAgentData>"u"&&window.navigator.userAgent&&window.navigator.userAgent.indexOf("MSIE")>-1,NS=[" ",",","?","!",";"];function IS(e,t,n){t=t||"",n=n||"";var r=NS.filter(function(s){return t.indexOf(s)<0&&n.indexOf(s)<0});if(r.length===0)return!0;var o=new RegExp("(".concat(r.map(function(s){return s==="?"?"\\?":s}).join("|"),")")),a=!o.test(e);if(!a){var i=e.indexOf(n);i>0&&!o.test(e.substring(0,i))&&(a=!0)}return a}function ja(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:".";if(e){if(e[t])return e[t];for(var r=t.split(n),o=e,a=0;a<r.length;++a){if(!o||typeof o[r[a]]=="string"&&a+1<r.length)return;if(o[r[a]]===void 0){for(var i=2,s=r.slice(a,a+i).join(n),u=o[s];u===void 0&&r.length>a+i;)i++,s=r.slice(a,a+i).join(n),u=o[s];if(u===void 0)return;if(u===null)return null;if(t.endsWith(s)){if(typeof u=="string")return u;if(s&&typeof u[s]=="string")return u[s]}var l=r.slice(a+i).join(n);return l?ja(u,l,n):void 0}o=o[r[a]]}return o}}function $d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function Ao(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?$d(Object(n),!0).forEach(function(r){an(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):$d(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function _S(e){var t=RS();return function(){var r=lt(e),o;if(t){var a=lt(this).constructor;o=Reflect.construct(r,arguments,a)}else o=r.apply(this,arguments);return mo(this,o)}}function RS(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}var jS=function(e){bi(n,e);var t=_S(n);function n(r){var o,a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{ns:["translation"],defaultNS:"translation"};return ct(this,n),o=t.call(this),Ei&&tn.call(Yt(o)),o.data=r||{},o.options=a,o.options.keySeparator===void 0&&(o.options.keySeparator="."),o.options.ignoreJSONStructure===void 0&&(o.options.ignoreJSONStructure=!0),o}return dt(n,[{key:"addNamespaces",value:function(o){this.options.ns.indexOf(o)<0&&this.options.ns.push(o)}},{key:"removeNamespaces",value:function(o){var a=this.options.ns.indexOf(o);a>-1&&this.options.ns.splice(a,1)}},{key:"getResource",value:function(o,a,i){var s=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},u=s.keySeparator!==void 0?s.keySeparator:this.options.keySeparator,l=s.ignoreJSONStructure!==void 0?s.ignoreJSONStructure:this.options.ignoreJSONStructure,d=[o,a];i&&typeof i!="string"&&(d=d.concat(i)),i&&typeof i=="string"&&(d=d.concat(u?i.split(u):i)),o.indexOf(".")>-1&&(d=o.split("."));var c=Ra(this.data,d);return c||!l||typeof i!="string"?c:ja(this.data&&this.data[o]&&this.data[o][a],i,u)}},{key:"addResource",value:function(o,a,i,s){var u=arguments.length>4&&arguments[4]!==void 0?arguments[4]:{silent:!1},l=this.options.keySeparator;l===void 0&&(l=".");var d=[o,a];i&&(d=d.concat(l?i.split(l):i)),o.indexOf(".")>-1&&(d=o.split("."),s=a,a=d[1]),this.addNamespaces(a),Bd(this.data,d,s),u.silent||this.emit("added",o,a,i,s)}},{key:"addResources",value:function(o,a,i){var s=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{silent:!1};for(var u in i)(typeof i[u]=="string"||Object.prototype.toString.apply(i[u])==="[object Array]")&&this.addResource(o,a,u,i[u],{silent:!0});s.silent||this.emit("added",o,a,i)}},{key:"addResourceBundle",value:function(o,a,i,s,u){var l=arguments.length>5&&arguments[5]!==void 0?arguments[5]:{silent:!1},d=[o,a];o.indexOf(".")>-1&&(d=o.split("."),s=i,i=a,a=d[1]),this.addNamespaces(a);var c=Ra(this.data,d)||{};s?nh(c,i,u):c=Ao(Ao({},c),i),Bd(this.data,d,c),l.silent||this.emit("added",o,a,i)}},{key:"removeResourceBundle",value:function(o,a){this.hasResourceBundle(o,a)&&delete this.data[o][a],this.removeNamespaces(a),this.emit("removed",o,a)}},{key:"hasResourceBundle",value:function(o,a){return this.getResource(o,a)!==void 0}},{key:"getResourceBundle",value:function(o,a){return a||(a=this.options.defaultNS),this.options.compatibilityAPI==="v1"?Ao(Ao({},{}),this.getResource(o,a)):this.getResource(o,a)}},{key:"getDataByLanguage",value:function(o){return this.data[o]}},{key:"hasLanguageSomeTranslations",value:function(o){var a=this.getDataByLanguage(o),i=a&&Object.keys(a)||[];return!!i.find(function(s){return a[s]&&Object.keys(a[s]).length>0})}},{key:"toJSON",value:function(){return this.data}}]),n}(tn),rh={processors:{},addPostProcessor:function(t){this.processors[t.name]=t},handle:function(t,n,r,o,a){var i=this;return t.forEach(function(s){i.processors[s]&&(n=i.processors[s].process(n,r,o,a))}),n}};function Wd(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function fe(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?Wd(Object(n),!0).forEach(function(r){an(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Wd(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function TS(e){var t=AS();return function(){var r=lt(e),o;if(t){var a=lt(this).constructor;o=Reflect.construct(r,arguments,a)}else o=r.apply(this,arguments);return mo(this,o)}}function AS(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}var zd={},qd=function(e){bi(n,e);var t=TS(n);function n(r){var o,a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return ct(this,n),o=t.call(this),Ei&&tn.call(Yt(o)),bS(["resourceStore","languageUtils","pluralResolver","interpolator","backendConnector","i18nFormat","utils"],r,Yt(o)),o.options=a,o.options.keySeparator===void 0&&(o.options.keySeparator="."),o.logger=at.create("translator"),o}return dt(n,[{key:"changeLanguage",value:function(o){o&&(this.language=o)}},{key:"exists",value:function(o){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{interpolation:{}};if(o==null)return!1;var i=this.resolve(o,a);return i&&i.res!==void 0}},{key:"extractFromKey",value:function(o,a){var i=a.nsSeparator!==void 0?a.nsSeparator:this.options.nsSeparator;i===void 0&&(i=":");var s=a.keySeparator!==void 0?a.keySeparator:this.options.keySeparator,u=a.ns||this.options.defaultNS||[],l=i&&o.indexOf(i)>-1,d=!this.options.userDefinedKeySeparator&&!a.keySeparator&&!this.options.userDefinedNsSeparator&&!a.nsSeparator&&!IS(o,i,s);if(l&&!d){var c=o.match(this.interpolator.nestingRegexp);if(c&&c.length>0)return{key:o,namespaces:u};var p=o.split(i);(i!==s||i===s&&this.options.ns.indexOf(p[0])>-1)&&(u=p.shift()),o=p.join(s)}return typeof u=="string"&&(u=[u]),{key:o,namespaces:u}}},{key:"translate",value:function(o,a,i){var s=this;if(Ue(a)!=="object"&&this.options.overloadTranslationOptionHandler&&(a=this.options.overloadTranslationOptionHandler(arguments)),Ue(a)==="object"&&(a=fe({},a)),a||(a={}),o==null)return"";Array.isArray(o)||(o=[String(o)]);var u=a.returnDetails!==void 0?a.returnDetails:this.options.returnDetails,l=a.keySeparator!==void 0?a.keySeparator:this.options.keySeparator,d=this.extractFromKey(o[o.length-1],a),c=d.key,p=d.namespaces,h=p[p.length-1],g=a.lng||this.language,y=a.appendNamespaceToCIMode||this.options.appendNamespaceToCIMode;if(g&&g.toLowerCase()==="cimode"){if(y){var S=a.nsSeparator||this.options.nsSeparator;return u?{res:"".concat(h).concat(S).concat(c),usedKey:c,exactUsedKey:c,usedLng:g,usedNS:h}:"".concat(h).concat(S).concat(c)}return u?{res:c,usedKey:c,exactUsedKey:c,usedLng:g,usedNS:h}:c}var m=this.resolve(o,a),f=m&&m.res,v=m&&m.usedKey||c,P=m&&m.exactUsedKey||c,E=Object.prototype.toString.apply(f),D=["[object Number]","[object Function]","[object RegExp]"],w=a.joinArrays!==void 0?a.joinArrays:this.options.joinArrays,I=!this.i18nFormat||this.i18nFormat.handleAsObject,L=typeof f!="string"&&typeof f!="boolean"&&typeof f!="number";if(I&&f&&L&&D.indexOf(E)<0&&!(typeof w=="string"&&E==="[object Array]")){if(!a.returnObjects&&!this.options.returnObjects){this.options.returnedObjectHandler||this.logger.warn("accessing an object - but returnObjects options is not enabled!");var _=this.options.returnedObjectHandler?this.options.returnedObjectHandler(v,f,fe(fe({},a),{},{ns:p})):"key '".concat(c," (").concat(this.language,")' returned an object instead of string.");return u?(m.res=_,m):_}if(l){var X=E==="[object Array]",Ze=X?[]:{},sn=X?P:v;for(var ft in f)if(Object.prototype.hasOwnProperty.call(f,ft)){var ho="".concat(sn).concat(l).concat(ft);Ze[ft]=this.translate(ho,fe(fe({},a),{joinArrays:!1,ns:p})),Ze[ft]===ho&&(Ze[ft]=f[ft])}f=Ze}}else if(I&&typeof w=="string"&&E==="[object Array]")f=f.join(w),f&&(f=this.extendTranslation(f,o,a,i));else{var Rt=!1,pt=!1,C=a.count!==void 0&&typeof a.count!="string",R=n.hasDefaultValue(a),T=C?this.pluralResolver.getSuffix(g,a.count,a):"",U=a["defaultValue".concat(T)]||a.defaultValue;!this.isValidLookup(f)&&R&&(Rt=!0,f=U),this.isValidLookup(f)||(pt=!0,f=c);var Z=a.missingKeyNoValueFallbackToKey||this.options.missingKeyNoValueFallbackToKey,Cn=Z&&pt?void 0:f,Ce=R&&U!==f&&this.options.updateMissing;if(pt||Rt||Ce){if(this.logger.log(Ce?"updateKey":"missingKey",g,h,c,Ce?U:f),l){var Nn=this.resolve(c,fe(fe({},a),{},{keySeparator:!1}));Nn&&Nn.res&&this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.")}var Ne=[],mt=this.languageUtils.getFallbackCodes(this.options.fallbackLng,a.lng||this.language);if(this.options.saveMissingTo==="fallback"&&mt&&mt[0])for(var Di=0;Di<mt.length;Di++)Ne.push(mt[Di]);else this.options.saveMissingTo==="all"?Ne=this.languageUtils.toResolveHierarchy(a.lng||this.language):Ne.push(a.lng||this.language);var Bl=function(In,Ci,$l){var Wl=R&&$l!==f?$l:Cn;s.options.missingKeyHandler?s.options.missingKeyHandler(In,h,Ci,Wl,Ce,a):s.backendConnector&&s.backendConnector.saveMissing&&s.backendConnector.saveMissing(In,h,Ci,Wl,Ce,a),s.emit("missingKey",In,h,Ci,f)};this.options.saveMissing&&(this.options.saveMissingPlurals&&C?Ne.forEach(function(wi){s.pluralResolver.getSuffixes(wi,a).forEach(function(In){Bl([wi],c+In,a["defaultValue".concat(In)]||U)})}):Bl(Ne,c,U))}f=this.extendTranslation(f,o,a,m,i),pt&&f===c&&this.options.appendNamespaceToMissingKey&&(f="".concat(h,":").concat(c)),(pt||Rt)&&this.options.parseMissingKeyHandler&&(this.options.compatibilityAPI!=="v1"?f=this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey?"".concat(h,":").concat(c):c,Rt?f:void 0):f=this.options.parseMissingKeyHandler(f))}return u?(m.res=f,m):f}},{key:"extendTranslation",value:function(o,a,i,s,u){var l=this;if(this.i18nFormat&&this.i18nFormat.parse)o=this.i18nFormat.parse(o,fe(fe({},this.options.interpolation.defaultVariables),i),s.usedLng,s.usedNS,s.usedKey,{resolved:s});else if(!i.skipInterpolation){i.interpolation&&this.interpolator.init(fe(fe({},i),{interpolation:fe(fe({},this.options.interpolation),i.interpolation)}));var d=typeof o=="string"&&(i&&i.interpolation&&i.interpolation.skipOnVariables!==void 0?i.interpolation.skipOnVariables:this.options.interpolation.skipOnVariables),c;if(d){var p=o.match(this.interpolator.nestingRegexp);c=p&&p.length}var h=i.replace&&typeof i.replace!="string"?i.replace:i;if(this.options.interpolation.defaultVariables&&(h=fe(fe({},this.options.interpolation.defaultVariables),h)),o=this.interpolator.interpolate(o,h,i.lng||this.language,i),d){var g=o.match(this.interpolator.nestingRegexp),y=g&&g.length;c<y&&(i.nest=!1)}!i.lng&&this.options.compatibilityAPI!=="v1"&&s&&s.res&&(i.lng=s.usedLng),i.nest!==!1&&(o=this.interpolator.nest(o,function(){for(var f=arguments.length,v=new Array(f),P=0;P<f;P++)v[P]=arguments[P];return u&&u[0]===v[0]&&!i.context?(l.logger.warn("It seems you are nesting recursively key: ".concat(v[0]," in key: ").concat(a[0])),null):l.translate.apply(l,v.concat([a]))},i)),i.interpolation&&this.interpolator.reset()}var S=i.postProcess||this.options.postProcess,m=typeof S=="string"?[S]:S;return o!=null&&m&&m.length&&i.applyPostProcessor!==!1&&(o=rh.handle(m,o,a,this.options&&this.options.postProcessPassResolved?fe({i18nResolved:s},i):i,this)),o}},{key:"resolve",value:function(o){var a=this,i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s,u,l,d,c;return typeof o=="string"&&(o=[o]),o.forEach(function(p){if(!a.isValidLookup(s)){var h=a.extractFromKey(p,i),g=h.key;u=g;var y=h.namespaces;a.options.fallbackNS&&(y=y.concat(a.options.fallbackNS));var S=i.count!==void 0&&typeof i.count!="string",m=S&&!i.ordinal&&i.count===0&&a.pluralResolver.shouldUseIntlApi(),f=i.context!==void 0&&(typeof i.context=="string"||typeof i.context=="number")&&i.context!=="",v=i.lngs?i.lngs:a.languageUtils.toResolveHierarchy(i.lng||a.language,i.fallbackLng);y.forEach(function(P){a.isValidLookup(s)||(c=P,!zd["".concat(v[0],"-").concat(P)]&&a.utils&&a.utils.hasLoadedNamespace&&!a.utils.hasLoadedNamespace(c)&&(zd["".concat(v[0],"-").concat(P)]=!0,a.logger.warn('key "'.concat(u,'" for languages "').concat(v.join(", "),`" won't get resolved as namespace "`).concat(c,'" was not yet loaded'),"This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")),v.forEach(function(E){if(!a.isValidLookup(s)){d=E;var D=[g];if(a.i18nFormat&&a.i18nFormat.addLookupKeys)a.i18nFormat.addLookupKeys(D,g,E,P,i);else{var w;S&&(w=a.pluralResolver.getSuffix(E,i.count,i));var I="".concat(a.options.pluralSeparator,"zero");if(S&&(D.push(g+w),m&&D.push(g+I)),f){var L="".concat(g).concat(a.options.contextSeparator).concat(i.context);D.push(L),S&&(D.push(L+w),m&&D.push(L+I))}}for(var _;_=D.pop();)a.isValidLookup(s)||(l=_,s=a.getResource(E,P,_,i))}}))})}}),{res:s,usedKey:u,exactUsedKey:l,usedLng:d,usedNS:c}}},{key:"isValidLookup",value:function(o){return o!==void 0&&!(!this.options.returnNull&&o===null)&&!(!this.options.returnEmptyString&&o==="")}},{key:"getResource",value:function(o,a,i){var s=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{};return this.i18nFormat&&this.i18nFormat.getResource?this.i18nFormat.getResource(o,a,i,s):this.resourceStore.getResource(o,a,i,s)}}],[{key:"hasDefaultValue",value:function(o){var a="defaultValue";for(var i in o)if(Object.prototype.hasOwnProperty.call(o,i)&&a===i.substring(0,a.length)&&o[i]!==void 0)return!0;return!1}}]),n}(tn);function ps(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Hd=function(){function e(t){ct(this,e),this.options=t,this.supportedLngs=this.options.supportedLngs||!1,this.logger=at.create("languageUtils")}return dt(e,[{key:"getScriptPartFromCode",value:function(n){if(!n||n.indexOf("-")<0)return null;var r=n.split("-");return r.length===2||(r.pop(),r[r.length-1].toLowerCase()==="x")?null:this.formatLanguageCode(r.join("-"))}},{key:"getLanguagePartFromCode",value:function(n){if(!n||n.indexOf("-")<0)return n;var r=n.split("-");return this.formatLanguageCode(r[0])}},{key:"formatLanguageCode",value:function(n){if(typeof n=="string"&&n.indexOf("-")>-1){var r=["hans","hant","latn","cyrl","cans","mong","arab"],o=n.split("-");return this.options.lowerCaseLng?o=o.map(function(a){return a.toLowerCase()}):o.length===2?(o[0]=o[0].toLowerCase(),o[1]=o[1].toUpperCase(),r.indexOf(o[1].toLowerCase())>-1&&(o[1]=ps(o[1].toLowerCase()))):o.length===3&&(o[0]=o[0].toLowerCase(),o[1].length===2&&(o[1]=o[1].toUpperCase()),o[0]!=="sgn"&&o[2].length===2&&(o[2]=o[2].toUpperCase()),r.indexOf(o[1].toLowerCase())>-1&&(o[1]=ps(o[1].toLowerCase())),r.indexOf(o[2].toLowerCase())>-1&&(o[2]=ps(o[2].toLowerCase()))),o.join("-")}return this.options.cleanCode||this.options.lowerCaseLng?n.toLowerCase():n}},{key:"isSupportedCode",value:function(n){return(this.options.load==="languageOnly"||this.options.nonExplicitSupportedLngs)&&(n=this.getLanguagePartFromCode(n)),!this.supportedLngs||!this.supportedLngs.length||this.supportedLngs.indexOf(n)>-1}},{key:"getBestMatchFromCodes",value:function(n){var r=this;if(!n)return null;var o;return n.forEach(function(a){if(!o){var i=r.formatLanguageCode(a);(!r.options.supportedLngs||r.isSupportedCode(i))&&(o=i)}}),!o&&this.options.supportedLngs&&n.forEach(function(a){if(!o){var i=r.getLanguagePartFromCode(a);if(r.isSupportedCode(i))return o=i;o=r.options.supportedLngs.find(function(s){if(s===i)return s;if(!(s.indexOf("-")<0&&i.indexOf("-")<0)&&s.indexOf(i)===0)return s})}}),o||(o=this.getFallbackCodes(this.options.fallbackLng)[0]),o}},{key:"getFallbackCodes",value:function(n,r){if(!n)return[];if(typeof n=="function"&&(n=n(r)),typeof n=="string"&&(n=[n]),Object.prototype.toString.apply(n)==="[object Array]")return n;if(!r)return n.default||[];var o=n[r];return o||(o=n[this.getScriptPartFromCode(r)]),o||(o=n[this.formatLanguageCode(r)]),o||(o=n[this.getLanguagePartFromCode(r)]),o||(o=n.default),o||[]}},{key:"toResolveHierarchy",value:function(n,r){var o=this,a=this.getFallbackCodes(r||this.options.fallbackLng||[],n),i=[],s=function(l){l&&(o.isSupportedCode(l)?i.push(l):o.logger.warn("rejecting language code not found in supportedLngs: ".concat(l)))};return typeof n=="string"&&n.indexOf("-")>-1?(this.options.load!=="languageOnly"&&s(this.formatLanguageCode(n)),this.options.load!=="languageOnly"&&this.options.load!=="currentOnly"&&s(this.getScriptPartFromCode(n)),this.options.load!=="currentOnly"&&s(this.getLanguagePartFromCode(n))):typeof n=="string"&&s(this.formatLanguageCode(n)),a.forEach(function(u){i.indexOf(u)<0&&s(o.formatLanguageCode(u))}),i}}]),e}(),LS=[{lngs:["ach","ak","am","arn","br","fil","gun","ln","mfe","mg","mi","oc","pt","pt-BR","tg","tl","ti","tr","uz","wa"],nr:[1,2],fc:1},{lngs:["af","an","ast","az","bg","bn","ca","da","de","dev","el","en","eo","es","et","eu","fi","fo","fur","fy","gl","gu","ha","hi","hu","hy","ia","it","kk","kn","ku","lb","mai","ml","mn","mr","nah","nap","nb","ne","nl","nn","no","nso","pa","pap","pms","ps","pt-PT","rm","sco","se","si","so","son","sq","sv","sw","ta","te","tk","ur","yo"],nr:[1,2],fc:2},{lngs:["ay","bo","cgg","fa","ht","id","ja","jbo","ka","km","ko","ky","lo","ms","sah","su","th","tt","ug","vi","wo","zh"],nr:[1],fc:3},{lngs:["be","bs","cnr","dz","hr","ru","sr","uk"],nr:[1,2,5],fc:4},{lngs:["ar"],nr:[0,1,2,3,11,100],fc:5},{lngs:["cs","sk"],nr:[1,2,5],fc:6},{lngs:["csb","pl"],nr:[1,2,5],fc:7},{lngs:["cy"],nr:[1,2,3,8],fc:8},{lngs:["fr"],nr:[1,2],fc:9},{lngs:["ga"],nr:[1,2,3,7,11],fc:10},{lngs:["gd"],nr:[1,2,3,20],fc:11},{lngs:["is"],nr:[1,2],fc:12},{lngs:["jv"],nr:[0,1],fc:13},{lngs:["kw"],nr:[1,2,3,4],fc:14},{lngs:["lt"],nr:[1,2,10],fc:15},{lngs:["lv"],nr:[1,2,0],fc:16},{lngs:["mk"],nr:[1,2],fc:17},{lngs:["mnk"],nr:[0,1,2],fc:18},{lngs:["mt"],nr:[1,2,11,20],fc:19},{lngs:["or"],nr:[2,1],fc:2},{lngs:["ro"],nr:[1,2,20],fc:20},{lngs:["sl"],nr:[5,1,2,3],fc:21},{lngs:["he","iw"],nr:[1,2,20,21],fc:22}],xS={1:function(t){return Number(t>1)},2:function(t){return Number(t!=1)},3:function(t){return 0},4:function(t){return Number(t%10==1&&t%100!=11?0:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?1:2)},5:function(t){return Number(t==0?0:t==1?1:t==2?2:t%100>=3&&t%100<=10?3:t%100>=11?4:5)},6:function(t){return Number(t==1?0:t>=2&&t<=4?1:2)},7:function(t){return Number(t==1?0:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?1:2)},8:function(t){return Number(t==1?0:t==2?1:t!=8&&t!=11?2:3)},9:function(t){return Number(t>=2)},10:function(t){return Number(t==1?0:t==2?1:t<7?2:t<11?3:4)},11:function(t){return Number(t==1||t==11?0:t==2||t==12?1:t>2&&t<20?2:3)},12:function(t){return Number(t%10!=1||t%100==11)},13:function(t){return Number(t!==0)},14:function(t){return Number(t==1?0:t==2?1:t==3?2:3)},15:function(t){return Number(t%10==1&&t%100!=11?0:t%10>=2&&(t%100<10||t%100>=20)?1:2)},16:function(t){return Number(t%10==1&&t%100!=11?0:t!==0?1:2)},17:function(t){return Number(t==1||t%10==1&&t%100!=11?0:1)},18:function(t){return Number(t==0?0:t==1?1:2)},19:function(t){return Number(t==1?0:t==0||t%100>1&&t%100<11?1:t%100>10&&t%100<20?2:3)},20:function(t){return Number(t==1?0:t==0||t%100>0&&t%100<20?1:2)},21:function(t){return Number(t%100==1?1:t%100==2?2:t%100==3||t%100==4?3:0)},22:function(t){return Number(t==1?0:t==2?1:(t<0||t>10)&&t%10==0?2:3)}},kS=["v1","v2","v3"],Gd={zero:0,one:1,two:2,few:3,many:4,other:5};function MS(){var e={};return LS.forEach(function(t){t.lngs.forEach(function(n){e[n]={numbers:t.nr,plurals:xS[t.fc]}})}),e}var FS=function(){function e(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};ct(this,e),this.languageUtils=t,this.options=n,this.logger=at.create("pluralResolver"),(!this.options.compatibilityJSON||this.options.compatibilityJSON==="v4")&&(typeof Intl>"u"||!Intl.PluralRules)&&(this.options.compatibilityJSON="v3",this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.")),this.rules=MS()}return dt(e,[{key:"addRule",value:function(n,r){this.rules[n]=r}},{key:"getRule",value:function(n){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(this.shouldUseIntlApi())try{return new Intl.PluralRules(n,{type:r.ordinal?"ordinal":"cardinal"})}catch{return}return this.rules[n]||this.rules[this.languageUtils.getLanguagePartFromCode(n)]}},{key:"needsPlural",value:function(n){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},o=this.getRule(n,r);return this.shouldUseIntlApi()?o&&o.resolvedOptions().pluralCategories.length>1:o&&o.numbers.length>1}},{key:"getPluralFormsOfKey",value:function(n,r){var o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return this.getSuffixes(n,o).map(function(a){return"".concat(r).concat(a)})}},{key:"getSuffixes",value:function(n){var r=this,o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=this.getRule(n,o);return a?this.shouldUseIntlApi()?a.resolvedOptions().pluralCategories.sort(function(i,s){return Gd[i]-Gd[s]}).map(function(i){return"".concat(r.options.prepend).concat(i)}):a.numbers.map(function(i){return r.getSuffix(n,i,o)}):[]}},{key:"getSuffix",value:function(n,r){var o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},a=this.getRule(n,o);return a?this.shouldUseIntlApi()?"".concat(this.options.prepend).concat(a.select(r)):this.getSuffixRetroCompatible(a,r):(this.logger.warn("no plural rule found for: ".concat(n)),"")}},{key:"getSuffixRetroCompatible",value:function(n,r){var o=this,a=n.noAbs?n.plurals(r):n.plurals(Math.abs(r)),i=n.numbers[a];this.options.simplifyPluralSuffix&&n.numbers.length===2&&n.numbers[0]===1&&(i===2?i="plural":i===1&&(i=""));var s=function(){return o.options.prepend&&i.toString()?o.options.prepend+i.toString():i.toString()};return this.options.compatibilityJSON==="v1"?i===1?"":typeof i=="number"?"_plural_".concat(i.toString()):s():this.options.compatibilityJSON==="v2"||this.options.simplifyPluralSuffix&&n.numbers.length===2&&n.numbers[0]===1?s():this.options.prepend&&a.toString()?this.options.prepend+a.toString():a.toString()}},{key:"shouldUseIntlApi",value:function(){return!kS.includes(this.options.compatibilityJSON)}}]),e}();function Kd(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function qe(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?Kd(Object(n),!0).forEach(function(r){an(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Kd(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function Qd(e,t,n){var r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:".",o=arguments.length>4&&arguments[4]!==void 0?arguments[4]:!0,a=DS(e,t,n);return!a&&o&&typeof n=="string"&&(a=ja(e,n,r),a===void 0&&(a=ja(t,n,r))),a}var VS=function(){function e(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};ct(this,e),this.logger=at.create("interpolator"),this.options=t,this.format=t.interpolation&&t.interpolation.format||function(n){return n},this.init(t)}return dt(e,[{key:"init",value:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};n.interpolation||(n.interpolation={escapeValue:!0});var r=n.interpolation;this.escape=r.escape!==void 0?r.escape:CS,this.escapeValue=r.escapeValue!==void 0?r.escapeValue:!0,this.useRawValueToEscape=r.useRawValueToEscape!==void 0?r.useRawValueToEscape:!1,this.prefix=r.prefix?Rn(r.prefix):r.prefixEscaped||"{{",this.suffix=r.suffix?Rn(r.suffix):r.suffixEscaped||"}}",this.formatSeparator=r.formatSeparator?r.formatSeparator:r.formatSeparator||",",this.unescapePrefix=r.unescapeSuffix?"":r.unescapePrefix||"-",this.unescapeSuffix=this.unescapePrefix?"":r.unescapeSuffix||"",this.nestingPrefix=r.nestingPrefix?Rn(r.nestingPrefix):r.nestingPrefixEscaped||Rn("$t("),this.nestingSuffix=r.nestingSuffix?Rn(r.nestingSuffix):r.nestingSuffixEscaped||Rn(")"),this.nestingOptionsSeparator=r.nestingOptionsSeparator?r.nestingOptionsSeparator:r.nestingOptionsSeparator||",",this.maxReplaces=r.maxReplaces?r.maxReplaces:1e3,this.alwaysFormat=r.alwaysFormat!==void 0?r.alwaysFormat:!1,this.resetRegExp()}},{key:"reset",value:function(){this.options&&this.init(this.options)}},{key:"resetRegExp",value:function(){var n="".concat(this.prefix,"(.+?)").concat(this.suffix);this.regexp=new RegExp(n,"g");var r="".concat(this.prefix).concat(this.unescapePrefix,"(.+?)").concat(this.unescapeSuffix).concat(this.suffix);this.regexpUnescape=new RegExp(r,"g");var o="".concat(this.nestingPrefix,"(.+?)").concat(this.nestingSuffix);this.nestingRegexp=new RegExp(o,"g")}},{key:"interpolate",value:function(n,r,o,a){var i=this,s,u,l,d=this.options&&this.options.interpolation&&this.options.interpolation.defaultVariables||{};function c(S){return S.replace(/\$/g,"$$$$")}var p=function(m){if(m.indexOf(i.formatSeparator)<0){var f=Qd(r,d,m,i.options.keySeparator,i.options.ignoreJSONStructure);return i.alwaysFormat?i.format(f,void 0,o,qe(qe(qe({},a),r),{},{interpolationkey:m})):f}var v=m.split(i.formatSeparator),P=v.shift().trim(),E=v.join(i.formatSeparator).trim();return i.format(Qd(r,d,P,i.options.keySeparator,i.options.ignoreJSONStructure),E,o,qe(qe(qe({},a),r),{},{interpolationkey:P}))};this.resetRegExp();var h=a&&a.missingInterpolationHandler||this.options.missingInterpolationHandler,g=a&&a.interpolation&&a.interpolation.skipOnVariables!==void 0?a.interpolation.skipOnVariables:this.options.interpolation.skipOnVariables,y=[{regex:this.regexpUnescape,safeValue:function(m){return c(m)}},{regex:this.regexp,safeValue:function(m){return i.escapeValue?c(i.escape(m)):c(m)}}];return y.forEach(function(S){for(l=0;s=S.regex.exec(n);){var m=s[1].trim();if(u=p(m),u===void 0)if(typeof h=="function"){var f=h(n,s,a);u=typeof f=="string"?f:""}else if(a&&Object.prototype.hasOwnProperty.call(a,m))u="";else if(g){u=s[0];continue}else i.logger.warn("missed to pass in variable ".concat(m," for interpolating ").concat(n)),u="";else typeof u!="string"&&!i.useRawValueToEscape&&(u=Ud(u));var v=S.safeValue(u);if(n=n.replace(s[0],v),g?(S.regex.lastIndex+=u.length,S.regex.lastIndex-=s[0].length):S.regex.lastIndex=0,l++,l>=i.maxReplaces)break}}),n}},{key:"nest",value:function(n,r){var o=this,a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i,s,u;function l(h,g){var y=this.nestingOptionsSeparator;if(h.indexOf(y)<0)return h;var S=h.split(new RegExp("".concat(y,"[ ]*{"))),m="{".concat(S[1]);h=S[0],m=this.interpolate(m,u);var f=m.match(/'/g),v=m.match(/"/g);(f&&f.length%2===0&&!v||v.length%2!==0)&&(m=m.replace(/'/g,'"'));try{u=JSON.parse(m),g&&(u=qe(qe({},g),u))}catch(P){return this.logger.warn("failed parsing options string in nesting for key ".concat(h),P),"".concat(h).concat(y).concat(m)}return delete u.defaultValue,h}for(;i=this.nestingRegexp.exec(n);){var d=[];u=qe({},a),u=u.replace&&typeof u.replace!="string"?u.replace:u,u.applyPostProcessor=!1,delete u.defaultValue;var c=!1;if(i[0].indexOf(this.formatSeparator)!==-1&&!/{.*}/.test(i[1])){var p=i[1].split(this.formatSeparator).map(function(h){return h.trim()});i[1]=p.shift(),d=p,c=!0}if(s=r(l.call(this,i[1].trim(),u),u),s&&i[0]===n&&typeof s!="string")return s;typeof s!="string"&&(s=Ud(s)),s||(this.logger.warn("missed to resolve ".concat(i[1]," for nesting ").concat(n)),s=""),c&&(s=d.reduce(function(h,g){return o.format(h,g,a.lng,qe(qe({},a),{},{interpolationkey:i[1].trim()}))},s.trim())),n=n.replace(i[0],s),this.regexp.lastIndex=0}return n}}]),e}();function Yd(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function gt(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?Yd(Object(n),!0).forEach(function(r){an(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Yd(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function US(e){var t=e.toLowerCase().trim(),n={};if(e.indexOf("(")>-1){var r=e.split("(");t=r[0].toLowerCase().trim();var o=r[1].substring(0,r[1].length-1);if(t==="currency"&&o.indexOf(":")<0)n.currency||(n.currency=o.trim());else if(t==="relativetime"&&o.indexOf(":")<0)n.range||(n.range=o.trim());else{var a=o.split(";");a.forEach(function(i){if(i){var s=i.split(":"),u=PS(s),l=u[0],d=u.slice(1),c=d.join(":").trim().replace(/^'+|'+$/g,"");n[l.trim()]||(n[l.trim()]=c),c==="false"&&(n[l.trim()]=!1),c==="true"&&(n[l.trim()]=!0),isNaN(c)||(n[l.trim()]=parseInt(c,10))}})}}return{formatName:t,formatOptions:n}}function jn(e){var t={};return function(r,o,a){var i=o+JSON.stringify(a),s=t[i];return s||(s=e(o,a),t[i]=s),s(r)}}var BS=function(){function e(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};ct(this,e),this.logger=at.create("formatter"),this.options=t,this.formats={number:jn(function(n,r){var o=new Intl.NumberFormat(n,gt({},r));return function(a){return o.format(a)}}),currency:jn(function(n,r){var o=new Intl.NumberFormat(n,gt(gt({},r),{},{style:"currency"}));return function(a){return o.format(a)}}),datetime:jn(function(n,r){var o=new Intl.DateTimeFormat(n,gt({},r));return function(a){return o.format(a)}}),relativetime:jn(function(n,r){var o=new Intl.RelativeTimeFormat(n,gt({},r));return function(a){return o.format(a,r.range||"day")}}),list:jn(function(n,r){var o=new Intl.ListFormat(n,gt({},r));return function(a){return o.format(a)}})},this.init(t)}return dt(e,[{key:"init",value:function(n){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{interpolation:{}},o=r.interpolation;this.formatSeparator=o.formatSeparator?o.formatSeparator:o.formatSeparator||","}},{key:"add",value:function(n,r){this.formats[n.toLowerCase().trim()]=r}},{key:"addCached",value:function(n,r){this.formats[n.toLowerCase().trim()]=jn(r)}},{key:"format",value:function(n,r,o){var a=this,i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},s=r.split(this.formatSeparator),u=s.reduce(function(l,d){var c=US(d),p=c.formatName,h=c.formatOptions;if(a.formats[p]){var g=l;try{var y=i&&i.formatParams&&i.formatParams[i.interpolationkey]||{},S=y.locale||y.lng||i.locale||i.lng||o;g=a.formats[p](l,S,gt(gt(gt({},h),i),y))}catch(m){a.logger.warn(m)}return g}else a.logger.warn("there was no format function for ".concat(p));return l},n);return u}}]),e}();function Jd(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function Xd(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?Jd(Object(n),!0).forEach(function(r){an(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Jd(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function $S(e){var t=WS();return function(){var r=lt(e),o;if(t){var a=lt(this).constructor;o=Reflect.construct(r,arguments,a)}else o=r.apply(this,arguments);return mo(this,o)}}function WS(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function zS(e,t){e.pending[t]!==void 0&&(delete e.pending[t],e.pendingCount--)}var qS=function(e){bi(n,e);var t=$S(n);function n(r,o,a){var i,s=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{};return ct(this,n),i=t.call(this),Ei&&tn.call(Yt(i)),i.backend=r,i.store=o,i.services=a,i.languageUtils=a.languageUtils,i.options=s,i.logger=at.create("backendConnector"),i.waitingReads=[],i.maxParallelReads=s.maxParallelReads||10,i.readingCalls=0,i.maxRetries=s.maxRetries>=0?s.maxRetries:5,i.retryTimeout=s.retryTimeout>=1?s.retryTimeout:350,i.state={},i.queue=[],i.backend&&i.backend.init&&i.backend.init(a,s.backend,s),i}return dt(n,[{key:"queueLoad",value:function(o,a,i,s){var u=this,l={},d={},c={},p={};return o.forEach(function(h){var g=!0;a.forEach(function(y){var S="".concat(h,"|").concat(y);!i.reload&&u.store.hasResourceBundle(h,y)?u.state[S]=2:u.state[S]<0||(u.state[S]===1?d[S]===void 0&&(d[S]=!0):(u.state[S]=1,g=!1,d[S]===void 0&&(d[S]=!0),l[S]===void 0&&(l[S]=!0),p[y]===void 0&&(p[y]=!0)))}),g||(c[h]=!0)}),(Object.keys(l).length||Object.keys(d).length)&&this.queue.push({pending:d,pendingCount:Object.keys(d).length,loaded:{},errors:[],callback:s}),{toLoad:Object.keys(l),pending:Object.keys(d),toLoadLanguages:Object.keys(c),toLoadNamespaces:Object.keys(p)}}},{key:"loaded",value:function(o,a,i){var s=o.split("|"),u=s[0],l=s[1];a&&this.emit("failedLoading",u,l,a),i&&this.store.addResourceBundle(u,l,i),this.state[o]=a?-1:2;var d={};this.queue.forEach(function(c){ES(c.loaded,[u],l),zS(c,o),a&&c.errors.push(a),c.pendingCount===0&&!c.done&&(Object.keys(c.loaded).forEach(function(p){d[p]||(d[p]={});var h=c.loaded[p];h.length&&h.forEach(function(g){d[p][g]===void 0&&(d[p][g]=!0)})}),c.done=!0,c.errors.length?c.callback(c.errors):c.callback())}),this.emit("loaded",d),this.queue=this.queue.filter(function(c){return!c.done})}},{key:"read",value:function(o,a,i){var s=this,u=arguments.length>3&&arguments[3]!==void 0?arguments[3]:0,l=arguments.length>4&&arguments[4]!==void 0?arguments[4]:this.retryTimeout,d=arguments.length>5?arguments[5]:void 0;if(!o.length)return d(null,{});if(this.readingCalls>=this.maxParallelReads){this.waitingReads.push({lng:o,ns:a,fcName:i,tried:u,wait:l,callback:d});return}this.readingCalls++;var c=function(y,S){if(s.readingCalls--,s.waitingReads.length>0){var m=s.waitingReads.shift();s.read(m.lng,m.ns,m.fcName,m.tried,m.wait,m.callback)}if(y&&S&&u<s.maxRetries){setTimeout(function(){s.read.call(s,o,a,i,u+1,l*2,d)},l);return}d(y,S)},p=this.backend[i].bind(this.backend);if(p.length===2){try{var h=p(o,a);h&&typeof h.then=="function"?h.then(function(g){return c(null,g)}).catch(c):c(null,h)}catch(g){c(g)}return}return p(o,a,c)}},{key:"prepareLoading",value:function(o,a){var i=this,s=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},u=arguments.length>3?arguments[3]:void 0;if(!this.backend)return this.logger.warn("No backend was added via i18next.use. Will not load resources."),u&&u();typeof o=="string"&&(o=this.languageUtils.toResolveHierarchy(o)),typeof a=="string"&&(a=[a]);var l=this.queueLoad(o,a,s,u);if(!l.toLoad.length)return l.pending.length||u(),null;l.toLoad.forEach(function(d){i.loadOne(d)})}},{key:"load",value:function(o,a,i){this.prepareLoading(o,a,{},i)}},{key:"reload",value:function(o,a,i){this.prepareLoading(o,a,{reload:!0},i)}},{key:"loadOne",value:function(o){var a=this,i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",s=o.split("|"),u=s[0],l=s[1];this.read(u,l,"read",void 0,void 0,function(d,c){d&&a.logger.warn("".concat(i,"loading namespace ").concat(l," for language ").concat(u," failed"),d),!d&&c&&a.logger.log("".concat(i,"loaded namespace ").concat(l," for language ").concat(u),c),a.loaded(o,d,c)})}},{key:"saveMissing",value:function(o,a,i,s,u){var l=arguments.length>5&&arguments[5]!==void 0?arguments[5]:{},d=arguments.length>6&&arguments[6]!==void 0?arguments[6]:function(){};if(this.services.utils&&this.services.utils.hasLoadedNamespace&&!this.services.utils.hasLoadedNamespace(a)){this.logger.warn('did not save key "'.concat(i,'" as the namespace "').concat(a,'" was not yet loaded'),"This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");return}if(!(i==null||i==="")){if(this.backend&&this.backend.create){var c=Xd(Xd({},l),{},{isUpdate:u}),p=this.backend.create.bind(this.backend);if(p.length<6)try{var h;p.length===5?h=p(o,a,i,s,c):h=p(o,a,i,s),h&&typeof h.then=="function"?h.then(function(g){return d(null,g)}).catch(d):d(null,h)}catch(g){d(g)}else p(o,a,i,s,d,c)}!o||!o[0]||this.store.addResource(o[0],a,i,s)}}}]),n}(tn);function Zd(){return{debug:!1,initImmediate:!0,ns:["translation"],defaultNS:["translation"],fallbackLng:["dev"],fallbackNS:!1,supportedLngs:!1,nonExplicitSupportedLngs:!1,load:"all",preload:!1,simplifyPluralSuffix:!0,keySeparator:".",nsSeparator:":",pluralSeparator:"_",contextSeparator:"_",partialBundledLanguages:!1,saveMissing:!1,updateMissing:!1,saveMissingTo:"fallback",saveMissingPlurals:!0,missingKeyHandler:!1,missingInterpolationHandler:!1,postProcess:!1,postProcessPassResolved:!1,returnNull:!0,returnEmptyString:!0,returnObjects:!1,joinArrays:!1,returnedObjectHandler:!1,parseMissingKeyHandler:!1,appendNamespaceToMissingKey:!1,appendNamespaceToCIMode:!1,overloadTranslationOptionHandler:function(t){var n={};if(Ue(t[1])==="object"&&(n=t[1]),typeof t[1]=="string"&&(n.defaultValue=t[1]),typeof t[2]=="string"&&(n.tDescription=t[2]),Ue(t[2])==="object"||Ue(t[3])==="object"){var r=t[3]||t[2];Object.keys(r).forEach(function(o){n[o]=r[o]})}return n},interpolation:{escapeValue:!0,format:function(t,n,r,o){return t},prefix:"{{",suffix:"}}",formatSeparator:",",unescapePrefix:"-",nestingPrefix:"$t(",nestingSuffix:")",nestingOptionsSeparator:",",maxReplaces:1e3,skipOnVariables:!0}}}function ef(e){return typeof e.ns=="string"&&(e.ns=[e.ns]),typeof e.fallbackLng=="string"&&(e.fallbackLng=[e.fallbackLng]),typeof e.fallbackNS=="string"&&(e.fallbackNS=[e.fallbackNS]),e.supportedLngs&&e.supportedLngs.indexOf("cimode")<0&&(e.supportedLngs=e.supportedLngs.concat(["cimode"])),e}function tf(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function tt(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?tf(Object(n),!0).forEach(function(r){an(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):tf(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function HS(e){var t=GS();return function(){var r=lt(e),o;if(t){var a=lt(this).constructor;o=Reflect.construct(r,arguments,a)}else o=r.apply(this,arguments);return mo(this,o)}}function GS(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function Lo(){}function KS(e){var t=Object.getOwnPropertyNames(Object.getPrototypeOf(e));t.forEach(function(n){typeof e[n]=="function"&&(e[n]=e[n].bind(e))})}var Ta=function(e){bi(n,e);var t=HS(n);function n(){var r,o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=arguments.length>1?arguments[1]:void 0;if(ct(this,n),r=t.call(this),Ei&&tn.call(Yt(r)),r.options=ef(o),r.services={},r.logger=at,r.modules={external:[]},KS(Yt(r)),a&&!r.isInitialized&&!o.isClone){if(!r.options.initImmediate)return r.init(o,a),mo(r,Yt(r));setTimeout(function(){r.init(o,a)},0)}return r}return dt(n,[{key:"init",value:function(){var o=this,a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},i=arguments.length>1?arguments[1]:void 0;typeof a=="function"&&(i=a,a={}),!a.defaultNS&&a.defaultNS!==!1&&a.ns&&(typeof a.ns=="string"?a.defaultNS=a.ns:a.ns.indexOf("translation")<0&&(a.defaultNS=a.ns[0]));var s=Zd();this.options=tt(tt(tt({},s),this.options),ef(a)),this.options.compatibilityAPI!=="v1"&&(this.options.interpolation=tt(tt({},s.interpolation),this.options.interpolation)),a.keySeparator!==void 0&&(this.options.userDefinedKeySeparator=a.keySeparator),a.nsSeparator!==void 0&&(this.options.userDefinedNsSeparator=a.nsSeparator);function u(m){return m?typeof m=="function"?new m:m:null}if(!this.options.isClone){this.modules.logger?at.init(u(this.modules.logger),this.options):at.init(null,this.options);var l;this.modules.formatter?l=this.modules.formatter:typeof Intl<"u"&&(l=BS);var d=new Hd(this.options);this.store=new jS(this.options.resources,this.options);var c=this.services;c.logger=at,c.resourceStore=this.store,c.languageUtils=d,c.pluralResolver=new FS(d,{prepend:this.options.pluralSeparator,compatibilityJSON:this.options.compatibilityJSON,simplifyPluralSuffix:this.options.simplifyPluralSuffix}),l&&(!this.options.interpolation.format||this.options.interpolation.format===s.interpolation.format)&&(c.formatter=u(l),c.formatter.init(c,this.options),this.options.interpolation.format=c.formatter.format.bind(c.formatter)),c.interpolator=new VS(this.options),c.utils={hasLoadedNamespace:this.hasLoadedNamespace.bind(this)},c.backendConnector=new qS(u(this.modules.backend),c.resourceStore,c,this.options),c.backendConnector.on("*",function(m){for(var f=arguments.length,v=new Array(f>1?f-1:0),P=1;P<f;P++)v[P-1]=arguments[P];o.emit.apply(o,[m].concat(v))}),this.modules.languageDetector&&(c.languageDetector=u(this.modules.languageDetector),c.languageDetector.init&&c.languageDetector.init(c,this.options.detection,this.options)),this.modules.i18nFormat&&(c.i18nFormat=u(this.modules.i18nFormat),c.i18nFormat.init&&c.i18nFormat.init(this)),this.translator=new qd(this.services,this.options),this.translator.on("*",function(m){for(var f=arguments.length,v=new Array(f>1?f-1:0),P=1;P<f;P++)v[P-1]=arguments[P];o.emit.apply(o,[m].concat(v))}),this.modules.external.forEach(function(m){m.init&&m.init(o)})}if(this.format=this.options.interpolation.format,i||(i=Lo),this.options.fallbackLng&&!this.services.languageDetector&&!this.options.lng){var p=this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);p.length>0&&p[0]!=="dev"&&(this.options.lng=p[0])}!this.services.languageDetector&&!this.options.lng&&this.logger.warn("init: no languageDetector is used and no lng is defined");var h=["getResource","hasResourceBundle","getResourceBundle","getDataByLanguage"];h.forEach(function(m){o[m]=function(){var f;return(f=o.store)[m].apply(f,arguments)}});var g=["addResource","addResources","addResourceBundle","removeResourceBundle"];g.forEach(function(m){o[m]=function(){var f;return(f=o.store)[m].apply(f,arguments),o}});var y=br(),S=function(){var f=function(P,E){o.isInitialized&&!o.initializedStoreOnce&&o.logger.warn("init: i18next is already initialized. You should call init just once!"),o.isInitialized=!0,o.options.isClone||o.logger.log("initialized",o.options),o.emit("initialized",o.options),y.resolve(E),i(P,E)};if(o.languages&&o.options.compatibilityAPI!=="v1"&&!o.isInitialized)return f(null,o.t.bind(o));o.changeLanguage(o.options.lng,f)};return this.options.resources||!this.options.initImmediate?S():setTimeout(S,0),y}},{key:"loadResources",value:function(o){var a=this,i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:Lo,s=i,u=typeof o=="string"?o:this.language;if(typeof o=="function"&&(s=o),!this.options.resources||this.options.partialBundledLanguages){if(u&&u.toLowerCase()==="cimode")return s();var l=[],d=function(h){if(h){var g=a.services.languageUtils.toResolveHierarchy(h);g.forEach(function(y){l.indexOf(y)<0&&l.push(y)})}};if(u)d(u);else{var c=this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);c.forEach(function(p){return d(p)})}this.options.preload&&this.options.preload.forEach(function(p){return d(p)}),this.services.backendConnector.load(l,this.options.ns,function(p){!p&&!a.resolvedLanguage&&a.language&&a.setResolvedLanguage(a.language),s(p)})}else s(null)}},{key:"reloadResources",value:function(o,a,i){var s=br();return o||(o=this.languages),a||(a=this.options.ns),i||(i=Lo),this.services.backendConnector.reload(o,a,function(u){s.resolve(),i(u)}),s}},{key:"use",value:function(o){if(!o)throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");if(!o.type)throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");return o.type==="backend"&&(this.modules.backend=o),(o.type==="logger"||o.log&&o.warn&&o.error)&&(this.modules.logger=o),o.type==="languageDetector"&&(this.modules.languageDetector=o),o.type==="i18nFormat"&&(this.modules.i18nFormat=o),o.type==="postProcessor"&&rh.addPostProcessor(o),o.type==="formatter"&&(this.modules.formatter=o),o.type==="3rdParty"&&this.modules.external.push(o),this}},{key:"setResolvedLanguage",value:function(o){if(!(!o||!this.languages)&&!(["cimode","dev"].indexOf(o)>-1))for(var a=0;a<this.languages.length;a++){var i=this.languages[a];if(!(["cimode","dev"].indexOf(i)>-1)&&this.store.hasLanguageSomeTranslations(i)){this.resolvedLanguage=i;break}}}},{key:"changeLanguage",value:function(o,a){var i=this;this.isLanguageChangingTo=o;var s=br();this.emit("languageChanging",o);var u=function(p){i.language=p,i.languages=i.services.languageUtils.toResolveHierarchy(p),i.resolvedLanguage=void 0,i.setResolvedLanguage(p)},l=function(p,h){h?(u(h),i.translator.changeLanguage(h),i.isLanguageChangingTo=void 0,i.emit("languageChanged",h),i.logger.log("languageChanged",h)):i.isLanguageChangingTo=void 0,s.resolve(function(){return i.t.apply(i,arguments)}),a&&a(p,function(){return i.t.apply(i,arguments)})},d=function(p){!o&&!p&&i.services.languageDetector&&(p=[]);var h=typeof p=="string"?p:i.services.languageUtils.getBestMatchFromCodes(p);h&&(i.language||u(h),i.translator.language||i.translator.changeLanguage(h),i.services.languageDetector&&i.services.languageDetector.cacheUserLanguage&&i.services.languageDetector.cacheUserLanguage(h)),i.loadResources(h,function(g){l(g,h)})};return!o&&this.services.languageDetector&&!this.services.languageDetector.async?d(this.services.languageDetector.detect()):!o&&this.services.languageDetector&&this.services.languageDetector.async?this.services.languageDetector.detect.length===0?this.services.languageDetector.detect().then(d):this.services.languageDetector.detect(d):d(o),s}},{key:"getFixedT",value:function(o,a,i){var s=this,u=function l(d,c){var p;if(Ue(c)!=="object"){for(var h=arguments.length,g=new Array(h>2?h-2:0),y=2;y<h;y++)g[y-2]=arguments[y];p=s.options.overloadTranslationOptionHandler([d,c].concat(g))}else p=tt({},c);p.lng=p.lng||l.lng,p.lngs=p.lngs||l.lngs,p.ns=p.ns||l.ns,p.keyPrefix=p.keyPrefix||i||l.keyPrefix;var S=s.options.keySeparator||".",m;return p.keyPrefix&&Array.isArray(d)?m=d.map(function(f){return"".concat(p.keyPrefix).concat(S).concat(f)}):m=p.keyPrefix?"".concat(p.keyPrefix).concat(S).concat(d):d,s.t(m,p)};return typeof o=="string"?u.lng=o:u.lngs=o,u.ns=a,u.keyPrefix=i,u}},{key:"t",value:function(){var o;return this.translator&&(o=this.translator).translate.apply(o,arguments)}},{key:"exists",value:function(){var o;return this.translator&&(o=this.translator).exists.apply(o,arguments)}},{key:"setDefaultNamespace",value:function(o){this.options.defaultNS=o}},{key:"hasLoadedNamespace",value:function(o){var a=this,i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(!this.isInitialized)return this.logger.warn("hasLoadedNamespace: i18next was not initialized",this.languages),!1;if(!this.languages||!this.languages.length)return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty",this.languages),!1;var s=i.lng||this.resolvedLanguage||this.languages[0],u=this.options?this.options.fallbackLng:!1,l=this.languages[this.languages.length-1];if(s.toLowerCase()==="cimode")return!0;var d=function(h,g){var y=a.services.backendConnector.state["".concat(h,"|").concat(g)];return y===-1||y===2};if(i.precheck){var c=i.precheck(this,d);if(c!==void 0)return c}return!!(this.hasResourceBundle(s,o)||!this.services.backendConnector.backend||this.options.resources&&!this.options.partialBundledLanguages||d(s,o)&&(!u||d(l,o)))}},{key:"loadNamespaces",value:function(o,a){var i=this,s=br();return this.options.ns?(typeof o=="string"&&(o=[o]),o.forEach(function(u){i.options.ns.indexOf(u)<0&&i.options.ns.push(u)}),this.loadResources(function(u){s.resolve(),a&&a(u)}),s):(a&&a(),Promise.resolve())}},{key:"loadLanguages",value:function(o,a){var i=br();typeof o=="string"&&(o=[o]);var s=this.options.preload||[],u=o.filter(function(l){return s.indexOf(l)<0});return u.length?(this.options.preload=s.concat(u),this.loadResources(function(l){i.resolve(),a&&a(l)}),i):(a&&a(),Promise.resolve())}},{key:"dir",value:function(o){if(o||(o=this.resolvedLanguage||(this.languages&&this.languages.length>0?this.languages[0]:this.language)),!o)return"rtl";var a=["ar","shu","sqr","ssh","xaa","yhd","yud","aao","abh","abv","acm","acq","acw","acx","acy","adf","ads","aeb","aec","afb","ajp","apc","apd","arb","arq","ars","ary","arz","auz","avl","ayh","ayl","ayn","ayp","bbz","pga","he","iw","ps","pbt","pbu","pst","prp","prd","ug","ur","ydd","yds","yih","ji","yi","hbo","men","xmn","fa","jpr","peo","pes","prs","dv","sam","ckb"],i=this.services&&this.services.languageUtils||new Hd(Zd());return a.indexOf(i.getLanguagePartFromCode(o))>-1||o.toLowerCase().indexOf("-arab")>1?"rtl":"ltr"}},{key:"cloneInstance",value:function(){var o=this,a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:Lo,s=tt(tt(tt({},this.options),a),{isClone:!0}),u=new n(s);(a.debug!==void 0||a.prefix!==void 0)&&(u.logger=u.logger.clone(a));var l=["store","services","language"];return l.forEach(function(d){u[d]=o[d]}),u.services=tt({},this.services),u.services.utils={hasLoadedNamespace:u.hasLoadedNamespace.bind(u)},u.translator=new qd(u.services,u.options),u.translator.on("*",function(d){for(var c=arguments.length,p=new Array(c>1?c-1:0),h=1;h<c;h++)p[h-1]=arguments[h];u.emit.apply(u,[d].concat(p))}),u.init(s,i),u.translator.options=u.options,u.translator.backendConnector.services.utils={hasLoadedNamespace:u.hasLoadedNamespace.bind(u)},u}},{key:"toJSON",value:function(){return{options:this.options,store:this.store,language:this.language,languages:this.languages,resolvedLanguage:this.resolvedLanguage}}}]),n}(tn);an(Ta,"createInstance",function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;return new Ta(e,t)});var ge=Ta.createInstance();ge.createInstance=Ta.createInstance;ge.createInstance;ge.dir;ge.init;ge.loadResources;ge.reloadResources;ge.use;ge.changeLanguage;ge.getFixedT;ge.t;ge.exists;ge.setDefaultNamespace;ge.hasLoadedNamespace;ge.loadNamespaces;ge.loadLanguages;function ao(e){return ao=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ao(e)}function QS(e,t){if(ao(e)!=="object"||e===null)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||"default");if(ao(r)!=="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function YS(e){var t=QS(e,"string");return ao(t)==="symbol"?t:String(t)}function JS(e,t,n){return t=YS(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var XS=/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,ZS={"&amp;":"&","&#38;":"&","&lt;":"<","&#60;":"<","&gt;":">","&#62;":">","&apos;":"'","&#39;":"'","&quot;":'"',"&#34;":'"',"&nbsp;":" ","&#160;":" ","&copy;":"©","&#169;":"©","&reg;":"®","&#174;":"®","&hellip;":"…","&#8230;":"…","&#x2F;":"/","&#47;":"/"},e1=function(t){return ZS[t]},t1=function(t){return t.replace(XS,e1)};function nf(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),n.push.apply(n,r)}return n}function rf(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?nf(Object(n),!0).forEach(function(r){JS(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):nf(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}var of={bindI18n:"languageChanged",bindI18nStore:"",transEmptyNodeValue:"",transSupportBasicHtmlNodes:!0,transWrapTextNodes:"",transKeepBasicHtmlNodesFor:["br","strong","i","p"],useSuspense:!0,unescape:t1};function n1(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};of=rf(rf({},of),e)}var r1={type:"3rdParty",init:function(t){n1(t.options.react)}};const o1="Tabelas",a1="Gráficos",i1="Gráfico",s1="Salvar",u1="Sim",l1="Não",c1="Consentimento",d1="Decodificado",f1="Gráfico",p1="Reside",m1="Operação",h1="Propriedade",g1="Tipo",v1="Valor",y1="Avançado",P1="Idade",S1="Botão",O1="Caixa de Seleção",b1="Colunas",E1="Container",D1="Conteúdo",w1="Cópia",C1="Moeda",N1="Personalizadas",I1="Dados",_1="Dia",R1="Descrição",j1="Editar",T1="Email",A1="Arquivo",L1="Gênero",x1="Oculto",k1="ID",M1="Identidade",F1="Impacto",V1="Classificação",U1="Classificação",B1="Layout",$1="Conexão",W1="Localização",z1="Nacionalidade",q1="Painel",H1="Senha",G1="Rádio",K1="reCAPTCHA",Q1="Remover",Y1="Recurso",J1="Selecionar",X1="Assinatura",Z1="Status",eO="Enviar",tO="Pesquisa",nO="Table",rO="Tabs",oO="Tags",aO="Horário",iO="Tipo",sO="Tipos",uO="URL",lO="Bem",cO="Países",dO="Função",fO="Título",pO="Colaboradores",mO="Gráficos",hO="Conscientização",gO=`Você deve se certificar de que os tomadores de decisão e as
pessoas-chave em sua organização estejam cientes de que a lei
está mudando para o LGPD. Eles precisam avaliar o impacto que
isso pode ter no dia a dia.`,vO=`def retVal = '';
try {

  long numEvents = g.V().has('Metadata.Type.Object.Awareness_Campaign',eq('Object.Awareness_Campaign')).in().as('events').count().next();
  
  
  def map = g.V().has('Metadata.Type.Object.Awareness_Campaign',eq('Object.Awareness_Campaign')).in().as('events').groupCount().by('Event.Training.Status').next();
            
  
  long failedCount = map.get('Failed') == null ? 0 :map.get('Failed');
  long secondReminder = map.get('Second  Reminder') == null ? 0 : map.get('Second  Reminder') ;
  long firstReminder = map.get('Reminder Sent') == null ? 0 :  map.get('Reminder Sent');
  long numPassed = (numEvents - failedCount - secondReminder - firstReminder); 
  
  long scoreValue = 100L;
  if (numEvents > 0){
    
    long pcntFailed = (long) (100L*failedCount/numEvents);
    if (pcntFailed > 10){
      scoreValue -= 60L;
    }
    else if (failedCount > 0){
      scoreValue -= (40L + 2L* pcntFailed)
    }
    
    
  
    long pcntSecondReminder = (long) (100L*secondReminder/numEvents);
    if (pcntSecondReminder > 10){
      scoreValue -= 30L;
    }
    else if (secondReminder > 0) {
      scoreValue -= (10L + 2L*pcntWithNegativeConsent)
    }
  
    scoreValue -= (10L * firstReminder/numEvents)
  
    // add a bit of a score, after all there was at least some training.
    if (scoreValue == 0)
    {
      scoreValue = 10L
    }
  
    
     
  }else{
    scoreValue = 0L; 
  }
  
  StringBuffer sb = new StringBuffer ('{ "scoreValue": ');
  
  sb.append(scoreValue)
    .append(', "scoreExplanation":"');
  if (numEvents > 0)  {
    sb.append('Esta pontuação reflete que de ')
      .append(numEvents).append((numEvents == 1)? ' registro de treinamento, ':' registros de treinamento, ')
    if (numPassed == 1){
      sb.append(' um PASSOU os testes da campanha de conscientização, ');
    }
    else if (numPassed > 1){
      sb.append(numPassed).append(' PASSARAM os testes da campanha de conscientização, ');
    }
    if (failedCount > 0){
      sb.append(failedCount).append((failedCount == 1)? ' FALHOU ':' FALHARAM ').append(' os testes da campanha de conscientização, ');
    }
    sb.append(firstReminder).append((firstReminder == 1)?' foi enviado um PRIMEIRO lembrete para fazer o curso de treinamento de campanha de conscientização, '
        : ' foram enviados um PRIMEIRO lembrete para fazer o curso de treinamento de campanha de conscientização, ')
      .append(secondReminder).append( (secondReminder == 1)?' foi enviado um SEGUNDO lembrete para fazer o curso de treinamento de campanha de conscientização.'
        : ' foram enviados um SEGUNDO lembrete para fazer o curso de treinamento de campanha de conscientização.')

  }
  
  else {
    sb.append('Não há registros de treinamento de campanhas de conscientização.')
  }
  sb.append('" }')  
  
  retVal = sb.toString()
} catch (Throwable t) {
    
  StringBuffer sb = new StringBuffer ('{ "scoreValue": ');
  
  sb.append(0L)
    .append(', "scoreExplanation":"');
    sb.append('Não há registros de treinamento de campanhas de conscientização.')
  sb.append('" }')  
  retVal = sb.toString()
}
retVal.toString()`,yO="Crianças",PO=`Você deve começar a pensar agora sobre a necessidade de
implementar sistemas para verificar a idade dos indivíduos
e obter o consentimento dos pais ou do responsável para 
qualquer atividade de processamento de dados.`,SO=`long ageThresholdMs = (long)(System.currentTimeMillis() - (3600000L * 24L *365L  * 18L));
def dateThreshold = new java.util.Date (ageThresholdMs);


long numChildren = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
    )
  )
.count().next()

long numNoGuardian = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
    ,__.outE('Has_Parent_Or_Guardian').count().is(eq(0))
    )
  )
.count().next()
 
long numWithoutAnyConsent = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
    ,__.outE('Consent').count().is(eq(0))
    )
  )
.count().next()
 
 
long numNegativeConsent = 

g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
 .where(
    __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
  ).as('children')
 .match(
     __.as('children').outE('Consent').as('consentEdges')
    ,__.as('consentEdges').count().as('consentEdgesCount')
    ,__.as('consentEdges').inV().as('consentEvents')
    ,__.as('consentEvents').has('Event.Consent.Status',eq('No Consent ')).count().as('negConsentCount')
    ,__.as('children').id().as('childId')

 )
 .select('consentEdgesCount','negConsentCount', 'childId')
.where('consentEdgesCount',eq('negConsentCount'))
.where(__.as('consentEdgesCount').is(gt(0)))

.count().next()



long numPendingConsent = 

g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
 .where(
    __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
  ).as('children')
 .match(
     __.as('children').outE('Consent').as('consentEdges')
    ,__.as('consentEdges').count().as('consentEdgesCount')
    ,__.as('consentEdges').inV().as('consentEvents')
    ,__.as('consentEvents').has('Event.Consent.Status',eq('Consent Pending')).count().as('pendingConsentCount')
    ,__.as('children').id().as('childId')

 )
 .select('consentEdgesCount','pendingConsentCount', 'childId')
.where('consentEdgesCount',eq('pendingConsentCount'))
.where(__.as('consentEdgesCount').is(gt(0)))

.count().next()



long scoreValue = 100L;
if (numChildren > 0){
  
  long pcntWithoutAnyConsent = (long) (100L*numWithoutAnyConsent/numChildren);
  if (pcntWithoutAnyConsent > 10){
    scoreValue -= 32L;
  }
  else if (numWithoutAnyConsent > 0) {
    scoreValue -= (22L + pcntWithoutAnyConsent)
  }
  
  
  long pcntWithoutAnyGuardian = (long) (100L*numNoGuardian/numChildren);
  if (pcntWithoutAnyGuardian > 10){
    scoreValue -= 32L;
  }
  else if (numNoGuardian > 0){
    scoreValue -= (22L + pcntWithoutAnyGuardian)
  }
    
  long pcntWithNegativeConsent = (long) (100L*numNegativeConsent/numChildren);
  if (pcntWithNegativeConsent > 10){
    scoreValue -= 32L;
  }
  else if (numNegativeConsent > 0){
    scoreValue -= (22L + pcntWithNegativeConsent)
  }

  scoreValue -= (7L * numPendingConsent/numChildren)
 

  
   
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numChildren > 0)  {
  sb.append('Esta pontuação reflete que de ')
    .append(numChildren).append(' crianças, ')
    .append(numWithoutAnyConsent).append(' não tem nenhum consentimento (positivo, negativo ou pendente), ')
    .append(numPendingConsent).append(' só tem um consentimento pendente para usar seus dados, ')
    .append(numNegativeConsent).append(' só tem um consentimento negativo para usar seus dados, e ')
    .append(numNoGuardian).append(' não tem pai ou guardião configurado no sistema.');
}
else {
  sb.append('Não há registros de dados pessoais de crianças no sistema.')
}
sb.append('" }')  

sb.toString()`,OO="Titulares",bO=`Você deve documentar quais dados pessoais você 
possui, de onde vieram e com quem você os compartilha. 
Você pode precisar organizar uma auditoria de
informações.
`,EO="Dados Armazenados",DO=`long numEvents = g.V().has('Metadata.Type.Event.Ingestion',eq('Event.Ingestion')).count().next();

long numRecordsNoEdges =
g.V()
 .has('Metadata.Type.Event.Ingestion',eq('Event.Ingestion'))
 .where(__.inE().count().is(eq(1)))
 .count().next()


long scoreValue = 100L;
if (numEvents > 0){
  
  long pcntNoEdges = (long) (100L*numRecordsNoEdges/numEvents);
  if (pcntNoEdges > 5 && pcntNoEdges < 40){
    scoreValue -= 40L;
  }
  else if (pcntNoEdges> 40) {
    scoreValue -= (20L + 2L* pcntNoEdges)
  }
  else  {
    scoreValue -= ( pcntNoEdges)
  }
  
  
   
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numRecordsNoEdges > 0)  {
  sb.append('Esta pontuação reflete que de ')
    .append(numEvents).append(' registros de ingestão de informações pessoalmente identificáveis, ')
    .append(numRecordsNoEdges).append(' não foram ligados a indivíduos.')
}
else if (numEvents > 0) {
  sb.append('Todos ').append(numEvents).append(' registros de ingestão de informações pessoalmente identificáveis no sistema foram ligados a indivíduos.')
}
else {
  sb.append('Não há registros de ingestão de informações pessoalmente identificáveis ​​no sistema.')
}
sb.append('" }')  

sb.toString()`,wO="LGPD",CO="Selecione um painel no menu no canto superior direito",NO="Fitro",IO="And",_O="Or",RO="Clear",jO="Apply",TO="Contém",AO="Não Contém",LO="Igual",xO="Diferente",kO="Começar Com",MO="Acaba Com",FO="Página",VO="a",UO="de",BO="Primeira",$O="Anterior",WO="Próxima",zO="Última",qO="Mais",HO="Maior",GO="Menor",KO="Entre",QO=`Você deve rever como você procura, registra e gerencia
os consentimentos para uso de dados pessoais.  Atualize
os consentimentos existentes se não atenderem ao padrão LGPD.`,YO="Consentimentos",JO=`long ageThresholdMs = (long)(System.currentTimeMillis() - (3600000L * 24L *365L  * 18L));
def dateThreshold = new java.util.Date (ageThresholdMs);


long numAdults = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(lt(dateThreshold))
    )
  )
.count().next()


long numWithoutAnyConsent = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(lt(dateThreshold))
    ,__.outE('Consent').count().is(eq(0))
    )
  )
.count().next()
 
 
long numNegativeConsent = 

g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
 .where(
    __.values('Person.Natural.Date_Of_Birth').is(lt(dateThreshold))
  ).as('adults')
 .match(
     __.as('adults').outE('Consent').as('consentEdges')
    ,__.as('consentEdges').count().as('consentEdgesCount')
    ,__.as('consentEdges').inV().as('consentEvents')
    ,__.as('consentEvents').has('Event.Consent.Status',eq('No Consent ')).count().as('negConsentCount')

 )
 .select('consentEdgesCount','negConsentCount')
.where('consentEdgesCount',eq('negConsentCount'))
.where(__.as('consentEdgesCount').is(gt(0)))

.count().next()



long numPendingConsent = 

g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
 .where(
    __.values('Person.Natural.Date_Of_Birth').is(lt(dateThreshold))
  ).as('adults')
 .match(
     __.as('adults').outE('Consent').as('consentEdges')
    ,__.as('consentEdges').count().as('consentEdgesCount')
    ,__.as('consentEdges').inV().as('consentEvents')
    ,__.as('consentEvents').has('Event.Consent.Status',eq('Consent Pending')).count().as('pendingConsentCount')

 )
 .select('consentEdgesCount','pendingConsentCount')
.where('consentEdgesCount',eq('pendingConsentCount'))
.where(__.as('consentEdgesCount').is(gt(0)))

.count().next()



long scoreValue = 100L;
if (numAdults > 0){
  
  long pcntWithoutAnyConsent = (long) (100L*numWithoutAnyConsent/numAdults);
  if (pcntWithoutAnyConsent > 10){
    scoreValue -= 45L;
  }
  else if (numWithoutAnyConsent > 0) {
    scoreValue -= (25L + 2L* pcntWithoutAnyConsent)
  }
  
  

  long pcntWithNegativeConsent = (long) (100L*numNegativeConsent/numAdults);
  if (pcntWithNegativeConsent > 10){
    scoreValue -= 45L;
  }
  else if (numNegativeConsent > 0){
    scoreValue -= (25L + 2L*pcntWithNegativeConsent)
  }

  scoreValue -= (10L * numPendingConsent/numAdults)
 

  
   
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numAdults > 0)  {
  sb.append('Esta pontuação reflete que de ')
    .append(numAdults).append(' registros de dados pessoais de adultos, ')
    .append(numWithoutAnyConsent).append(' não tem nenhum consentimento (positivo, negativo ou pendente), ')
    .append(numPendingConsent).append(' só tem um consentimento pendente para usar seus dados, ')
    .append(numNegativeConsent).append(' só tem um consentimento negativo para usar seus dados.');
}
else {
  sb.append('Não há registros de dados pessoais de adultos no sistema.')
}
sb.append('" }')  

sb.toString()`,XO=`Se a sua organização opera dados de cidadãos estrangeiros
você deve verificar eventuais legislações aplicáveis, como
por exemplo no caso de cidadãos de países membros da 
Comunidade Europeia em que a GDPR (Global Data Protection 
Regulation) é aplicável e já está em vigor.`,ZO="Internacional",eb=`long numItems = g.V().has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
.count().next()
 
 
long numPrivNoticesWithoutRegulator = 
  g.V()
  .has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
  .where( __.out().has('Metadata.Type.Person.Organisation',eq('Person.Organisation')).count().is(eq(0)))
  .count().next()


 

long scoreValue = 100L;
if (numItems > 0){
  
  scoreValue -= (long) (100L*numPrivNoticesWithoutRegulator/numItems);




 
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numItems > 0)  {
  sb.append('Esta pontuação reflete que ');
  if (numItems == 1){ 
    sb.append(' a única avaliação  de impacto de proteção de dados ');
  }else {
    sb.append(' de ').append(numItems).append(' avaliações de impacto de proteção de dados, ');
  }
  if (numPrivNoticesWithoutRegulator == 0){
    if (numItems == 1){ 
      sb.append(' tem um regulador internacional atribuído a ela ');
    }else {
      sb.append( 'TODAS têm um regulador internacional atribuído a elas.');
    }
  }
  else {
    if (numPrivNoticesWithoutRegulator == 1){
      sb.append( ' não tem um regulador internacional atribuído a ela.');
    }
    else{
      sb.append(numPrivNoticesWithoutRegulator);
      sb.append(' não têm um regulador internacional atribuído a elas.');
    }
  }
    
    

}
else {
  sb.append ('Não há avaliações de impacto de privacidade listadas no sistema.');
}




sb.append('" }')  

sb.toString()`,tb=`long numEvents = g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice'))
.count().next()


long numWithoutAnyLawfulBasis = g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice'))
.where(
  __.outE('Has_Lawful_Basis_On').count().is(eq(0))
)
.count().next()
 
 
long scoreValue = 100L;
if (numEvents > 0){
  scoreValue -= (100L * numWithoutAnyLawfulBasis/numEvents)
 
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numEvents > 0)  {
  sb.append('Esta pontuação reflete que de ');
  sb.append(numEvents).append(' avisos de privacidade, ');
   
  if (numWithoutAnyLawfulBasis == 0){
    sb.append( 'TODOS têm base legal associada a eles.');
  }
  else {
    sb.append(numWithoutAnyLawfulBasis);
    if (numWithoutAnyLawfulBasis == 1){
      sb.append( ' não tem base legal associada a eles.');
    }
    else{
      sb.append(' não têm base legal associada a eles.');
    }
  }
  

}
else {
  sb.append ('Não há avisos de privacidade associados a qualquer base legal no sistema.');
}

sb.append('" }')  

sb.toString()`,nb="Bases Legais",rb=`Você deve identificar a base legal para sua
atividade de processamento na LGPD, documentá-la
 e atualizar seu aviso de privacidade para explicá-la.`,ob="Impacto Prot Dados",ab=`Agora, você deve se familiarizar com as melhores práticas sobre
as avaliações de impacto de privacidade criadas pela Agencia
Nacional de Proteção de Dados e como e quando implementá-las em
sua organização.`,ib=`long numItems = g.V().has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
.count().next()
 
 
long numPIAWithoutPrivNotices = 
  g.V()
  .has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
  .where( __.both().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).count().is(eq(0)))
  .count().next()


 
long numPIAWithPrivNoticesAndDataWithoutConsent = 
  g.V()
  .has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
  .where( 
    __.both().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice'))
      .both().has('Event.Consent.Status',eq('No Consent '))
      .count().is(gt(0))
  )
  .count().next()


long numPIAWithPrivNoticesAndDataWithPendingConsent = 
  g.V()
  .has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
  .where( 
    __.both().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice'))
      .both().has('Event.Consent.Status',eq('Consent Pending'))
      .count().is(gt(0))
  )
  .count().next()




long scoreValue = 100L;
if (numItems > 0){
  
  scoreValue -= (numPIAWithoutPrivNotices > 0)?(long) (15L + 10L*numPIAWithoutPrivNotices/numItems):0;
  scoreValue -= (numPIAWithPrivNoticesAndDataWithoutConsent > 0)?(long) (40L + 5L*numPIAWithPrivNoticesAndDataWithoutConsent/numItems):0;
  scoreValue -= (numPIAWithPrivNoticesAndDataWithPendingConsent > 0)?(long) (20L + 10L*numPIAWithPrivNoticesAndDataWithPendingConsent/numItems):0;


  scoreValue = scoreValue < 0 ? 0 : scoreValue;

 
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numItems > 0)  {
  sb.append('Esta pontuação reflete que de ');
  sb.append(numItems).append((numItems == 1) ? ' avaliação de impacto de proteção de dados, ' :' avaliações de impacto de proteção de dados, ');
   
  if (numPIAWithoutPrivNotices == 0){
    sb.append( 'TODAS têm um aviso de privacidade atribuído a ela(s), ');
  }
  else {
    sb.append(numPIAWithoutPrivNotices);
    if (numPIAWithoutPrivNotices == 1){
      sb.append( ' não tem um aviso de privacidade atribuído a ela(s), ' );
    }
    else{
      sb.append(' não têm um aviso de privacidade atribuído a ela(s), ');
    }
  }
    
  if (numPIAWithPrivNoticesAndDataWithoutConsent == 0){
    sb.append( 'NENHUM dos avisos de privacidade atribuídos a ela(s) têm consentimento negativo, e ');
  }
  else {
    sb.append(numPIAWithPrivNoticesAndDataWithoutConsent);
    if (numPIAWithPrivNoticesAndDataWithoutConsent == 1){
      sb.append( ' tem um aviso de privacidade com consentimentos negados, e ' );
    }
    else{
      sb.append(' têm um aviso de privacidade com consentimentos negados, e ');
    }
  }
   
  if (numPIAWithPrivNoticesAndDataWithPendingConsent == 0){
    sb.append( 'NENHUM dos avisos de privacidade atribuídos a ela(s) têm consentimento pendente.');
  }
  else {
    sb.append(numPIAWithPrivNoticesAndDataWithPendingConsent);
    if (numPIAWithPrivNoticesAndDataWithPendingConsent == 1){
      sb.append( ' tem um aviso de privacidade com consentimentos pendentes.' );
    }
    else{
      sb.append(' têm um aviso de privacidade com consentimentos pendentes.');
    }
  }
   
   
   

}
else {
  sb.append ('Não há avaliações de impacto de privacidade listadas no sistema.');
}




sb.append('" }')  

sb.toString()`,sb="Avisos de Priv.",ub=`Você deve rever seus avisos de privacidade atuais
e colocar em prática um plano para fazer as
alterações necessárias a tempo para a 
implementação da LGPD.
`,lb=`long numEvents = g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).count().next();

long numRecordsNoConsent =
g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).as('privNotice')
.match(
    __.as('privNotice').both().has('Metadata.Type.Event.Consent',eq('Event.Consent')).count().as('consentCount')

)
.select('consentCount')
.where(__.as('consentCount').is(eq(0)))
.count().next()

long numRecordsNoPIA =
g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).as('privNotice')
.match(
    __.as('privNotice').both().has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment')).count().as('consentCount')

)
.select('consentCount')
.where(__.as('consentCount').is(eq(0)))
.count().next()

long numRecordsLessThan50PcntPositiveConsent =
g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).as('privNotice')
.match(
    __.as('privNotice').both().has('Metadata.Type.Event.Consent',eq('Event.Consent')).count().as('consentCount')
  , __.as('privNotice').both().has('Event.Consent.Status',eq('Consent')).count().math('_ * 2').as('posConsentCountDouble')
)
.select(
  'consentCount'
, 'posConsentCountDouble'
)
.where(
  'consentCount', gt('posConsentCountDouble')

)
.count().next()


long scoreValue = 100L;
if (numEvents > 0){
  
  long pcntNoConsent = (long) (100L*numRecordsNoConsent/numEvents);
  if (pcntNoConsent > 10){
    scoreValue -= 40L;
  }
  else if (numRecordsNoConsent> 0) {
    scoreValue -= (20L + 2L* pcntNoConsent)
  }
  
  
  long pcntNoPIA = (long) (100L*numRecordsNoPIA/numEvents);
  if (pcntNoPIA > 10){
    scoreValue -= 50L;
  }
  else if (numRecordsNoPIA > 0){
    scoreValue -= (30L + 2L*pcntNoPIA)
  }

  scoreValue -= (10L * numRecordsLessThan50PcntPositiveConsent/numEvents)
 

  
   
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numEvents > 0)  {
  sb.append('Esta pontuação reflete que de ');
  sb.append(numEvents).append(' avisos de privacidade, ');
   
  if (numRecordsNoConsent == 0){
    sb.append( ' TODOS tem consentimento, ');
  }
  else {
    sb.append(numRecordsNoConsent);
    if (numRecordsNoConsent == 1){
      sb.append( ' não tem consentimento, ');
    }
    else{
      sb.append(' não têm consentimento, ');
    }
  }
  
  if (numRecordsNoPIA == 0){
    sb.append(' TODOS têm avaliações de impacto de privacidade, ');

  }
  else{
    sb.append(numRecordsNoPIA);
    if (numRecordsNoPIA == 1){
      sb.append(' não tem avaliações de impacto de privacidade, e ');
    }
    else {
      sb.append(' não têm avaliações de impacto de privacidade, e ');
    }
  }
  
  if (numRecordsLessThan50PcntPositiveConsent == 0){
    sb.append(' NENHUM tem mais de 50% de consentimentos negativos ou pendentes.');
  }
  else{
    sb.append(numRecordsLessThan50PcntPositiveConsent);
    if (numRecordsLessThan50PcntPositiveConsent == 1){
      sb.append(' tem mais de 50% de consentimentos negativos ou pendentes.');
    }
    else {
      sb.append(' têm mais de 50% de consentimentos negativos ou pendentes.');
    }
  }


}
else {
  sb.append ('Não há avisos de privacidade no sistema.');
}

sb.append('" }')  

sb.toString()`,cb="Solicit. de Dados",db=`long fifteenDayThresholdMs = (long)(System.currentTimeMillis() - (3600000L * 24L *15L));
def fifteenDayThreshold = new java.util.Date (fifteenDayThresholdMs);
long fiveDayThresholdMs = (long)(System.currentTimeMillis() - (3600000L * 24L *5L));
def fiveDayThreshold = new java.util.Date (fiveDayThresholdMs);

long numEvents = g.V().has('Metadata.Type.Event.Subject_Access_Request',eq('Event.Subject_Access_Request')).count().next();

long numRecordsOlder15Days =

g.V().has('Metadata.Type.Event.Subject_Access_Request',eq('Event.Subject_Access_Request')).as('sar')
.where(
  __.values('Event.Subject_Access_Request.Metadata.Create_Date').is(lte(fifteenDayThreshold))
) 

.count().next()

long numRecordsOlder5Days =

g.V().has('Metadata.Type.Event.Subject_Access_Request',eq('Event.Subject_Access_Request')).as('sar')
.where(
  __.values('Event.Subject_Access_Request.Metadata.Create_Date').is(lte(fiveDayThreshold))
) 

.count().next()


long scoreValue = 100L;
if (numEvents > 0){
  
  long pcntOlder15Days = (long) (100L*numRecordsOlder15Days/numEvents);
  if (pcntOlder15Days > 10){
    scoreValue -= 80L;
  }
  else if (numRecordsOlder15Days> 0) {
    scoreValue -= (60L + 2L* pcntOlder15Days)
  }
  
  

  scoreValue -= (20L * numRecordsOlder5Days/numEvents)
 

  
   
}else{
  scoreValue = 100L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numEvents > 0)  {
  sb.append('Esta pontuação reflete que de ');
  sb.append(numEvents).append(' solicitações de dados, ');
   
  if (numRecordsOlder15Days == 0){
    sb.append( 'NENHUMA tem mais de 15 dias, e ');
  }
  else {
    sb.append(numRecordsOlder15Days);
    if (numRecordsOlder15Days == 1){
      sb.append( ' tem mais de 15 dias, e ');
    }
    else{
      sb.append(' têm mais de 15 dias, e ');
    }
  }
  
  if (numRecordsOlder5Days == 0){
    sb.append(' NENHUMA tem mais de 5 dias.');

  }
  else{
    sb.append(numRecordsOlder5Days);
    if (numRecordsOlder5Days == 1){
      sb.append(' tem mais de 5 dias.');
    }
    else {
      sb.append(' têm mais de 5 dias.');
    }
  }
  

}
else {
  sb.append ('Não há Solicitações de Acesso a dados pessoais no sistema.');
}

sb.append('" }')  

sb.toString()`,fb=`Você deve atualizar seus procedimentos e planejar como"
lidará com solicitações dentro dos novos prazos e "
fornecer qualquer informação adicional.`,pb="Direitos Pessoais",mb=`long numItems = g.V()
 .has('Metadata.Type.Object.Data_Procedures',eq('Object.Data_Procedures'))
 .count()
 .next()


long numDeleteURL = g.V()
 .has('Metadata.Type.Object.Data_Procedures',eq('Object.Data_Procedures'))
 .values('Object.Data_Procedures.Delete_URL')
 .count()
 .next()

long numUpdateURL = g.V()
 .has('Metadata.Type.Object.Data_Procedures',eq('Object.Data_Procedures'))
 .values('Object.Data_Procedures.Delete_URL')
 .count()
 .next()

long numWithoutDeleteUrl = (numItems - numDeleteURL);
long numWithoutUpdateUrl = (numItems - numUpdateURL);

long scoreValue = 100L;
if (numItems > 0){
  
  scoreValue -= (long) (50L*numWithoutDeleteUrl/numItems);
  scoreValue -= (long) (50L*numWithoutUpdateUrl/numItems);

}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numItems > 0)  {
  sb.append('Esta pontuação reflete que de ');
  sb.append(numItems).append(' procedimentos de fontes de dados, ');
   
  if (numWithoutUpdateUrl == 0){
    sb.append( 'TODOS têm um URL de atualização, ');
  }
  else {
    sb.append(numWithoutUpdateUrl);
    if (numWithoutUpdateUrl == 1){
      sb.append( ' tem um URL de atualização, ');
    }
    else{
      sb.append(' têm um URL de atualização, ');
    }
  }
    
    
       
  if (numWithoutDeleteUrl == 0){
    sb.append( 'TODOS têm um URL de exclusão.');
  }
  else {
    sb.append(numWithoutDeleteUrl);
    if (numWithoutDeleteUrl == 1){
      sb.append( ' tem um URL de exclusão.');
    }
    else{
      sb.append(' têm um URL de exclusão.');
    }
  }


}
else {
  sb.append ('Não há procedimentos de dados listados no sistema.');
}




sb.append('" }')  

sb.toString();`,hb=`Você deve verificar seus procedimentos para garantir
que cubram todos os direitos que os indivíduos têm,
inclusive como excluiria dados pessoais ou forneceria
dados eletronicamente e em um formato comumente usado.`,gb="Violação de Dados",vb=`long numItems = g.V().has('Metadata.Type.Event.Data_Breach',eq('Event.Data_Breach'))
.count().next()
 
 
long numOpenDataBreachDataStolen = 
  g.V()
  .has('Event.Data_Breach.Status',eq('Open'))
  .where( 
    or(
      __.has('Event.Data_Breach.Impact',eq('Customer Data Stolen (External)'))
     ,__.has('Event.Data_Breach.Impact',eq('Customer Data Stolen (Internal)'))
    )
  )
  .count().next()

long numOpenDataBreachDataLost = 
  g.V()
  .has('Event.Data_Breach.Status',eq('Open'))
  .where( 
    __.has('Event.Data_Breach.Impact',eq('Data Lost'))
  )
  .count().next()




long scoreValue = 100L;
if (numItems > 0){
  
  if (numOpenDataBreachDataLost > 0){
    scoreValue -= (long) (15L + 10L*numOpenDataBreachDataLost/numItems);
  }
  
  if (numOpenDataBreachDataStolen > 0){
    scoreValue -= (long) (60L + 15L*numOpenDataBreachDataStolen/numItems);
  }

  scoreValue = scoreValue < 0 ? 0 : scoreValue;

 
}else{
  scoreValue = 100L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numItems > 0)  {
  sb.append('Esta pontuação reflete que de ');
  sb.append(numItems).append(' Evento(s) de Violação de Dados, ');
   
  if (numOpenDataBreachDataStolen == 0){
    sb.append( 'Nenhum dado foi roubado, ');
  }
  else {
    sb.append(numOpenDataBreachDataStolen);
    if (numOpenDataBreachDataStolen == 1){
      sb.append( ' estava relacionado a dados roubados, ' );
    }
    else{
      sb.append(' estavam relacionados a dados roubados, ');
    }
  }
    
  if (numOpenDataBreachDataLost == 0){
    sb.append( 'e nenhum estava relacionado à perda de dados.');
  }
  else {
    sb.append('and ')
    sb.append(numOpenDataBreachDataLost);
    if (numOpenDataBreachDataLost == 1){
      sb.append( ' estava relacionado à perda de dados.' );
    }
    else{
      sb.append(' estavam relacionado à perda de dados.');
    }
  }
   
   
   

}
else {
  sb.append ('Não há eventos de violação de dados listados no sistema.');
}




sb.append('" }')  

sb.toString()`,yb=`Certifique-se de ter os procedimentos corretos
para detectar, denunciar e investigar uma violação
de dados pessoais.`,Pb="Encarregado",Sb=`long numDPOs = g.V().has('Person.Employee.Role',eq('Data Protection Officer'))
.count().next()
 
 
long numDPODirectReports = g.V().has('Person.Employee.Role',eq('Data Protection Officer')).inE('Reports_To')
.count().next()


long numDPOsFailed  = g.V().has('Person.Employee.Role',eq('Data Protection Officer'))
.in().has('Event.Training.Status',eq('Failed'))
.count().next()
 

long numDPODirectReportsFailed = g.V().has('Person.Employee.Role',eq('Data Protection Officer')).inE('Reports_To')
.outV().in().has('Event.Training.Status',eq('Failed'))
.count().next()


long numDPOsSecondReminder  = g.V().has('Person.Employee.Role',eq('Data Protection Officer'))
.in().has('Event.Training.Status',eq('Second  Reminder'))
.count().next()
 

long numDPODirectReportsSecondReminder = g.V().has('Person.Employee.Role',eq('Data Protection Officer')).inE('Reports_To')
.outV().in().has('Event.Training.Status',eq('Second  Reminder'))
.count().next()




long scoreValue = 100L;
if (numDPOs > 0){
  scoreValue -= (long) (25L + 25L*numDPOsFailed/numDPOs);
  scoreValue -= (long) (6L + 7L*numDPOsSecondReminder/numDPOs);
}
if (numDPODirectReports > 0){
  scoreValue -= (long) (13L + 12L*numDPODirectReportsFailed/numDPODirectReports);
  
  scoreValue -= (long) (6L + 6L*numDPODirectReportsSecondReminder/numDPODirectReports);
}
if (numDPOs == 0 && numDPODirectReports == 0){
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numDPOs > 0)  {
  sb.append('Esta pontuação reflete que de ');
  sb.append(numDPOs);
  sb.append(' Data Protection Officer(s), ');
  if (numDPOsFailed == 0){
    sb.append( 'TODOS passaram os Testes de Conhecimentos sobre a LGPD, e ');
  }
  else {
    sb.append(numDPOsFailed);
    if (numDPOsFailed == 1){
      sb.append( ' não passou os Testes de Conhecimentos sobre a LGPD, e ');
    }
    else{
      sb.append(' não passaram os Testes de Conhecimentos sobre a LGPD, e ');
    }
  }
    
    
  if (numDPOsSecondReminder == 0){
    sb.append( 'NINGUEM recebeu um segundo lembrete para fazer o teste.');
  }
  else {
    if (numDPOsSecondReminder == 1){
      sb.append( ' um recebeu um segundo lembrete para fazer o teste.');
    }
    else{
    sb.append(numDPOsSecondReminder);
      sb.append(' receberam um segundo lembrete para fazer o teste.');
    }
  }


}
else {
  sb.append ('Não há Data Protection Officers listados no sistema.');
}

if (numDPODirectReports > 0){
  if (numDPODirectReports == 1){
    sb.append('Dos colaboradores subordinados ao Data Protection Officer, ');
  }
  else{
    sb.append('Dos ')      .append(numDPODirectReports)      .append(' colaboradores subordinados ao Data Protection Officer, ');
  }
  
  if (numDPODirectReportsFailed == 0){
    sb.append ('TODOS passaram os Testes de Conhecimentos sobre a LGPD, ');
  }
  else{
    if (numDPODirectReportsFailed == 1){
      sb.append (' um não passou os Testes de Conhecimentos sobre a LGPD, e ');
    }
    else{
      sb.append(numDPODirectReportsFailed);
      sb.append (' não passaram os Testes de Conhecimentos sobre a LGPD, e ');
    }
  }
  
  if (numDPODirectReportsSecondReminder == 0){
    sb.append ('NINGUEM recebeu um segundo lembrete para fazer o teste');
  }
  else{
    if (numDPODirectReportsSecondReminder == 1){
      sb.append (' um recebeu um segundo lembrete para fazer o teste.');
    }
    else{
      sb.append(numDPODirectReportsSecondReminder);
      sb.append (' receberam um segundo lembrete para fazer o teste.');
    }
  }
  
  
}



sb.append('" }')  

sb.toString()`,Ob=`Você deve designar alguém para assumir a responsabilidade
pela conformidade da proteção de dados e avaliar onde essa
função se enquadrará na estrutura e nos procedimentos de 
governança de sua organização. Você deve considerar se é
necessário designar formalmente um responsável pela
proteção de dados.`,bb="Detalhes",Eb="Preview",Db="Salvar",wb="Aprovado",Cb="Titular",Nb="Texto",Ib="Etnia",_b="Religião",Rb="Propriedade",jb="Legislação",Tb="Conscientização",Ab="Crianças",Lb="Internacional",xb="Ler",kb="Ler",Mb="Negado",Fb="Novo",Vb="Excluir",Ub="Excluido",Bb="Atualizar",$b="Atualizar",Wb="Completo",zb="Confirmado",qb="Vizinho",Hb="Display",Gb="Filtro",Kb="Tem Transação",Qb="Tem Salário",Yb="É Responsável",Jb={tables:o1,graphics:a1,graphic:i1,"admin-panel":"Painel do Adm.","confirm-delete":"Deseja mesmo apagar?","delete-dashboard":"Apagar Dashboard","save-edition":"Salvar Edição","save-state":"Salvar",save:s1,yes:u1,no:l1,"donut-chart":"Gráfico Donut","submit-form":"Salvar","entry-registered":"Nova Entrada Registrada!","entry-updated":"Entrada atualizada!","enter-dashboard-name":"Insira um nome para o dashboard","confirm-delete-entries":"Quer realmente deletar essas entradas?","confirm-delete-entry":"Quer realmente deletar essa entrada?","add-component":"Adicionar Componente","CLICK ON THE GRID TO GET THE RELATED ITEMS TIME SERIES":"CLIQUE NO GRID PARA OBTER OS ITENS RELACIONADOS DA SÉRIE TEMPORAL",Consent:c1,"CRM System CSV File ":"CRM Arquivo CSV ","Data Impacted By Data Breach":"Dados Afetados pela Violação de Dados",Decoded:d1,"Domain Data":"Dados do Domínio","Event Consent":"Evento de Consentimento","Event Consent Date":"Data Evento Consentimento","Event Consent Metadata Create Date":"Data de Criação dos Metadados","Event Consent Metadata Update Date":"Data de Atualização dos Metadados","Event Consent Status":"Status","Event Data Breach":"Evento de Violação de Dados","Event Data Breach Description":"Descrição","Event Data Breach Id":"ID","Event Data Breach Impact":"Impacto","Event Data Breach Metadata Create Date":"Data de Criação dos Metadados","Event Data Breach Metadata Update Date":"Data de Atualização dos Metadados","Event Data Breach Source":"Fonte","Event Data Breach Status":"Status","Event Form Ingestion":"Evento Ingestão de Formulário","Event Form Ingestion Domain b64":"Dados b64","Event Form Ingestion Metadata Create Date":"Data de Criação dos Metadados","Event Form Ingestion Metadata GUID":"GUID de Metadados","Event Form Ingestion Operation":"Operação","Event Form Ingestion Type":"Tipo","Event Group Ingestion":"Evento Ingestão de Grupo","Event Group Ingestion Has Controller":"Possui Controlador","Event Group Ingestion Has Data Owner":"Possui Proprietário de Dados","Event Group Ingestion Has Processor":"Possui Processador","Event Group Ingestion Metadata End Date":"Data Final dos Metadados","Event Group Ingestion Metadata Start Date":"Data de Início dos Metadados","Event Group Ingestion Operation":"Operação","Event Group Ingestion Type":"Tipo","Event Ingestion":"Evento Ingestão","Event Ingestion Business Rules":"Regras de Negócio","Event Ingestion Domain b64":"Dados b64","Event Ingestion Domain Unstructured Data b64":"Dados Não Estruturados do Domínio b64","Event Ingestion Metadata Create Date":"Data de Criação","Event Ingestion Metadata GUID":"GUID","Event Ingestion Operation":"Operação","Event Ingestion Type":"Tipo","Event Subject Access Request":"Evento Solicitação de Acesso","Event Subject Access Request Metadata Create Date":"Data de Criação","Event Subject Access Request Metadata Update Date":"Data Atualização","Event Subject Access Request Request Type":"Tipo de Solicitação","Event Subject Access Request Status":"Status","Event Training":"Eventos de Treinamento","Event Training Status":"Status",Graph:f1,"Has Data Procedures":"Possui Procedimentos de Dados","Has Form Ingestion Event":"Possui Evento Ingestão de Formulário","Has Ingestion Event":"Possui Evento Ingestão","Has Ingress Peering":"Possui Emparelhamento","Has Lawful Basis On":"Possui Base Legal","Has Privacy Notice":"Possui Aviso de Privacidade","Has Privacy Impact Assessment":"Possui Availação de Impacto de Privacidade","Has Policy":"Possui Apólice","Has Phone":"Possui Telefone","Has Security Group":"Possui Grupo de Segurança","Has Server":"Possui Servidor","Has Contract":"Possui Contrato","Impacted By Data Breach":"Impactado pela Violação de Dados","Ingestion Date":"Data de Ingestão",Lives:p1,"Location Address":"Endereço","Location Address City":"Cidade","Location Address Full Address":"Endereço Completo","Location Address Neighborhood":"Bairro","Location Address parser category":"Parser de Endereços - Categoria","Location Address parser city":"Parser de Enderecos - Cidade","Location Address parser city district":"Parser de Enderecos - Estado","Location Address parser country":"Parser de Enderecos - País","Location Address parser country region":"Parser de Endereços - Continente","Location Address parser entrance":"Parser de Endereços - Entrada","Location Address parser house":"Parser de Endereços - Residência","Location Address parser house number":"Parser de Endereços – Número Residencial","Location Address parser island":"Parser de Endereços - Ilha","Location Address parser level":"Parser de Endereços - Nível","Location Address parser near":"Parser de Endereços – Próximo","Location Address parser po box":"Parser de Endereços – Caixa Postal","Location Address parser postcode":"Parser de Endereços - CEP","Location Address parser road":"Parser de Endereços - Rua","Location Address parser staircase":"Parser de Endereços - Escadaria","Location Address parser state":"Parser de Endereços - Estado","Location Address parser state district":"Parser de Endereços - Distrito","Location Address parser suburb":"Parser de Endereços - Subúrbio","Location Address parser unit":"Parser de Endereços - Unidade","Location Address parser world region":"Parser de Endereços – Região do Mundo","Location Address Post Code":"CEP","Location Address State":"Estado","Location Address Street":"Rua","Made SAR Request":"Solicitação SAR Realizada","Marketing Email System":"Sistema de Email Marketing","Metadata Create Date":"Data de Criação dos Metadados","Metadata GDPR Status":"Status da LGPD","Metadata Lineage":"Linhagem","Metadata Lineage Location Tag":"Tag de Localização da Linhagem dos Metadados","Metadata Lineage Server Tag":"Tag de Servidor da Linhagem dos Metadados","Metadata Redaction":"Redação dos Metadados","Metadata Status":"Status dos Metadados","Metadata Type":"Tipo dos Metadados","Metadata Type Event Consent":"Tipo de Dados – Evento Consentimento","Metadata Type Event Data Breach":"Tipo de Dados – Evento Violação de Dados","Metadata Type Event Form Ingestion":"Tipo de Dados – Evento Ingestão de Formulário","Metadata Type Event Group Ingestion":"Tipo de Dados – Evento Ingestão de Grupo","Metadata Type Event Ingestion":"Tipo de Dados – Evento Ingestão","Metadata Type Location Address":"Tipo de Dados - Endereço","Metadata Type Object AWS Instance":"Tipo de Dados - Objeto da Instância do AWS","Metadata Type Object Credential":"Tipo de Dados - Credencial do Objeto","Metadata Type Object Data Source":"Tipo de Fonte de Dados","Metadata Type Object Email Address":"Tipo de Dados - Endereço de Email","Metadata Type Object Insurance Policy":"Tipo de Dados - Apólice de Seguro","Metadata Type Object Privacy Impact Assessment":"Tipo de Dados - Avaliação de Impacto de Privacidade","Metadata Type Person Natural":"Tipo de Dados - Pessoa Natural","Metadata Update Date":"Data de Atualização","Metadata Version":"Versão","num events":"Número Eventos","Object Awareness Campaign":"Campanha de Conscientização","Object Awareness Campaign Description":"Descrição","Object Awareness Campaign Form Id":"ID Formulário","Object Awareness Campaign Form Owner Id":"ID do Proprietário do Formulário","Object Awareness Campaign Form Submission Id":"ID Envio do Formulário","Object Awareness Campaign Form Submission Owner Id":"ID do Proprietário do Envio do Formulário","Object Awareness Campaign Start Date":"Data de Início","Object Awareness Campaign Stop Date":"Data Final","Object Awareness Campaign URL":"URL","Object AWS Instance":"Objeto da Instância do AWS","Object AWS Instance EbsOptimized":"EBS Otimizado","Object AWS Instance EnaSupport":"Suporte de ENA ","Object AWS Instance Id":"ID","Object AWS Instance ImageId":"IDImagem","Object AWS Instance InstanceType":"Tipo de Instância","Object AWS Instance KeyName":"Nome Chave","Object AWS Instance LaunchTime":"Lançamento","Object AWS Instance PrivateDnsName":"NomeDNSPrivado","Object AWS Instance PrivateIpAddress":"Endereços de IP privados","Object AWS Instance ProductCodeIDs":"Código do Produto","Object AWS Instance ProductCodeTypes":"Tipos de Código do Produto","Object AWS Instance Public Dns Name":"Nome do DNS Público","Object AWS Instance Tags":"Tag","Object AWS Network Interface":"Objeto Interface AWS","Object AWS Network Interface AttachTime":"Anexar","Object AWS Network Interface Description":"Descrição","Object AWS Network Interface MacAddress":"Endereço MAC","Object AWS Network Interface NetworkInterfaceId":"ID da Interface de Rede","Object AWS Network Interface PrivateDnsName":"Nome do DNS Privado","Object AWS Network Interface PrivateIpAddresses":"Endereços IP Privados","Object AWS Security Group":"Objeto do Grupo de Segurança da AWS","Object AWS Security Group GroupName":"Nome do Grupo","Object AWS Security Group Id":"ID","Object AWS Security Group Ip Perms Egress IpRanges":"IP Permanente Saída IPRanges","Object AWS Security Group Ip Perms Ingress IpRanges":"IP Permanente Entrada IPRanges","Object AWS VPC":"Objeto AWS VPC","Object AWS VPC Id":"Objeto AWS VPC ID","Object Credential":"Objeto Credencial","Object Credential Login SHA256":"Login SHA256","Object Credential User Id":"ID do Usuário","Object Data Policy":"Objeto Política de Dados","Object Data Policy CreateDate":"Data de Criação","Object Data Policy Description":"Descrição","Object Data Policy Form Id":"ID Formulário","Object Data Policy Form Owner Id":"ID do Proprietário do Formulário","Object Data Policy Form Submission Id":"ID Envio do Formulário","Object Data Policy Form Submission Owner Id":"ID do Proprietário do Envio do Formulário","Object Data Policy Name":"Nome","Object Data Policy UpdateDate":"Data de Atualização","Object Data Procedures":"Procedimentos de Dados","Object Data Procedures Delete Mechanism":"Excluir Mecanismo","Object Data Procedures Delete URL":"Excluir URL","Object Data Procedures Property":"Propriedade","Object Data Procedures Type":"Tipo","Object Data Procedures Update Mechanism":"Mecanismo de Atualização","Object Data Procedures Update URL":"Atualização URL","Object Data Source":"Fonte de Dados","Object Data Source Create Date":"Data de Criação","Object Data Source Credential ApiKey":"Credencial ApiKey","Object Data Source Credential Principal":"Credencial Principal","Object Data Source Credential Secret":"Credencial Sigilosa","Object Data Source Description":"Descrição","Object Data Source Form Id":"ID Formulário","Object Data Source Form Owner Id":"ID do Proprietário do Formulário","Object Data Source Form Submission Id":"ID Envio do Formulário","Object Data Source Form Submission Owner Id":"ID do Proprietário do Envio do Formulário","Object Data Source Name":"Nome","Object Data Source Update Date":"Data de Atualização","Object Data Source URI Config":"Configuração URI","Object Data Source URI Control":"Controle URI","Object Data Source URI Delete":"Exclusão URI","Object Data Source URI Monitor":"Monitoramento URI","Object Data Source URI Read":"Leitura URI","Object Data Source URI Template":"Modelo URI","Object Data Source URI Update":"Atualização URI","Object Email Address":"Objeto Email","Object Email Address Email":"Email","Object Form":"Objeto Formulário","Object Form Metadata Create Date":"Data de Criação","Object Form Metadata GUID":"GUID","Object Form Metadata Owner":"Proprietário","Object Form Text":"Texto","Object Form URL":"URL","Object Form Vertex Label":"Vertex Classificação","Object Identity Card":"Objeto Identidade","Object Identity Card Id Name":"ID Nome","Object Identity Card Id Value":"ID Valor","Object Insurance Policy":"Objeto Apólice de Seguros","Object Insurance Policy Form Id":"ID Formulário","Object Insurance Policy Form Owner Id":"ID do Proprietário do Formulário","Object Insurance Policy Form Submission Id":"ID Envio do Formulário","Object Insurance Policy Form Submission Owner Id":"ID do Proprietário do Envio do Formulário","Object Insurance Policy Number":"Número","Object Insurance Policy Product Type":"Tipo de Produto","Object Insurance Policy Property Type":"Tipo de Propriedade","Object Insurance Policy Renewal":"Renovação","Object Insurance Policy Renewal Date":"Data de Renovação","Object Insurance Policy Status":"Status","Object Insurance Policy Type":"Tipo","Object Lawful Basis":"Objeto Base Legal","Object Lawful Basis Description":"Descrição","Object Lawful Basis Id":"ID","Object Contract":"Objeto Contrato","Object Contract Description":"Descrição","Object Contract Form Id":"ID Formulário","Object Contract Form Owner Id":"ID do Proprietário do Formulário","Object Contract Form Submission Id":"ID Envio do Formulário","Object Contract Form Submission Owner Id":"ID do Proprietário do Envio do Formulário","Object Contract Id":"ID","Object Contract Link":"Conexão","Object Contract Status":"Status","Object Notification Templates":"Objeto Modelos de Notificação","Object Notification Templates Id":"ID","Object Notification Templates Label":"Classificação","Object Notification Templates Text":"Texto","Object Notification Templates Types":"Tipos","Object Notification Templates URL":"URL","Object Phone Number":"Objeto Telefone","Object Phone Number Last 7 Digits":"Últimos 7 dígitos","Object Phone Number Numbers Only":"Apenas Números","Object Phone Number Raw":"Número Telefone Bruto","Object Phone Number Type":"Tipo","Object Privacy Impact Assessment":"Objeto Avaliação de Impacto de Privacidade","Object Privacy Impact Assessment Compliance Check Passed":"Verificação de Conformidade Aprovada","Object Privacy Impact Assessment Delivery Date":"Data de Envio","Object Privacy Impact Assessment Description":"Descrição","Object Privacy Impact Assessment Form Id":"ID Formulário","Object Privacy Impact Assessment Form Owner Id":"ID do Proprietário do Formulário","Object Privacy Impact Assessment Form Submission Id":"ID Envio do Formulário","Object Privacy Impact Assessment Form Submission Owner Id":"ID do Proprietário do Envio do Formulário","Object Privacy Impact Assessment Intrusion On Privacy":"Intrusão na Privacidade","Object Privacy Impact Assessment Risk Of Reputational Damage":"Risco de Dano de Reputação","Object Privacy Impact Assessment Risk To Corporation":"Risco à Corporação","Object Privacy Impact Assessment Risk To Individuals":"Risco para os Titulares","Object Privacy Impact Assessment Start Date":"Data de Início","Object Privacy Notice":"Objeto Aviso de Privacidade","Object Privacy Notice Delivery Date":"Data de Envio","Object Privacy Notice Description":"Descrição","Object Privacy Notice Effect On Individuals":"Efeito nos Titulares","Object Privacy Notice Expiry Date":"Data de Validade","Object Privacy Notice Form Id":"ID Formulário","Object Privacy Notice Form Owner Id":"ID do Proprietário do Formulário","Object Privacy Notice Form Submission Id":"ID Envio do Formulário","Object Privacy Notice Form Submission Owner Id":"ID do Proprietário do Envio do Formulário","Object Privacy Notice How Is It Collected":"Como é coletado?","Object Privacy Notice How Will It Be Used":"Como será usado?","Object Privacy Notice Id":"ID","Object Privacy Notice Info Collected":"Informação Coletada","Object Privacy Notice Likely To Complain":"Propenso a Reclamar","Object Privacy Notice Metadata Create Date":"Data de Criação dos Metadados","Object Privacy Notice Metadata Update Date":"Data de Atualização dos Metadados","Object Privacy Notice Text":"Texto","Object Privacy Notice URL":"URL","Object Privacy Notice Who Is Collecting":"Quem está coletando?","Object Privacy Notice Who Will It Be Shared":"Com quem será compartilhado?","Object Privacy Notice Why Is It Collected":"Por que é coletado?",Operation:m1,"Outlook PST Files ":"Arquivos PST do Outlook ","PDF Form Files ":"Arquivos de PDF ","Person Employee":"Colaborador","Person Employee Date Of Birth":"Data de Nascimento","Person Employee Ethnicity":"Etnia","Person Employee Full Name":"Nome Completo","Person Employee Gender":"Gênero","Person Employee Height":"Altura","Person Employee ID":"Identidade","Person Employee Is LGPD Role":"Qual função na LGPD?","Person Employee Last Name":"Sobrenome","Person Employee Marital Status":"Estado Civil","Person Employee Name Qualifier":"Título Nome","Person Employee Nationality":"Nacionalidade","Person Employee Place Of Birth":"Naturalidade","Person Employee Religion":"Religião","Person Employee Role":"Função","Person Employee Title":"Título","Person Identity":"Identidade do Titular","Person Identity Date Of Birth":"Data de Nascimento","Person Identity Ethnicity":"Etnia","Person Identity Full Name":"Nome Completo","Person Identity First Name":"Nome","Person Identity Full Name fuzzy":"Nome Completo Fuzzy","Person Identity Gender":"Gênero","Person Identity Height":"Altura","Person Identity ID":"Identidade","Person Identity Last Name":"Sobrenome","Person Identity Marital Status":"Estado Civil","Person Identity Name Qualifier":"Título Nome","Person Identity Nationality":"Nacionalidade","Person Identity Place Of Birth":"Naturalidade","Person Identity Religion":"Religião","Person Identity Title":"Título","Person Natural":"Titular","Person Natural Customer ID":"Identificação do Titular","Person Natural Date Of Birth":"Data de Nascimento","Person Natural Ethnicity":"Etnia","Person Natural First Name":"Nome","Person Natural Full Name":"Nome Completo","Person Natural Full Name fuzzy":"Nome Completo Fuzzy","Person Natural Gender":"Gênero","Person Natural Height":"Altura","Person Natural Last Name":"Sobrenome","Person Natural Marital Status":"Estado civil","Person Natural Name Qualifier":"Título Nome","Person Natural Nationality":"Nacionalidade","Person Natural Place Of Birth":"Naturalidade","Person Natural Religion":"Religião","Person Natural Title":"Título","Person Organisation":"Pessoa Jurídica","Person Organisation Department":"Departamento","Person Organisation Email":"Email","Person Organisation Fax":"Fax","Person Organisation Form Id":"ID Formulário","Person Organisation Form Owner Id":"ID do Proprietário do Formulário","Person Organisation Form Submission Id":"ID Envio do Formulário","Person Organisation Form Submission Owner Id":"ID do Proprietário do Envio do Formulário","Person Organisation Name":"Nome","Person Organisation orgCountrySet":"País","Person Organisation Phone":"Telefone","Person Organisation Registration Number":"Número de Registro","Person Organisation Sector":"Setor","Person Organisation Short Name":"Nome Curto","Person Organisation Tax Id":"CNPJ","Person Organisation Type":"Tipo","Person Organisation URL":"URL","Runs On":"Roda No Sistema",Property:h1,"Send Query":"Enviar Consulta","Structured Data Insertion":"Inserção de dados estruturados",Type:g1," unmatched":" Não Encontrado","Unstructured Data Insertion":"Inserção de Dados Não Estruturados","Uses Email":"Usa Email",Value:v1,"Address Field":"Campo de Endereço",Advanced:y1,Age:P1,"Basic Components":"Componentes Básicos",Button:S1,Checkbox:O1,Columns:b1,"Consent Status":"Status de Consentimento",Container:E1,Content:D1,Copy:w1,Currency:C1,Custom:N1,Data:I1,"Data Grid":"Grade de Dados","Data Map":"Mapa de Dados","Data Type":"Tipo de Dados",Date:"Data","Date / Time":"Data / Horário",Day:_1,"Delete Link":"Excluir Link","Delete Mechanism":"Excluir Mecanismo","Delivery Date":"Data de Envio",Description:R1,"Drag and Drop a form component":"Arrastar e soltar um componente do formulário",Edit:j1,"Edit Grid":"Editar Grade","Edit JSON":"Editar JSON",Email:T1,"Expiry Date":"Data de Validade","Field Set":"Conjunto de Campos",File:A1,"Full Name":"Nome Completo",Gender:L1,Hidden:x1,"HTML Element":"Elemento HTML",Id:k1,ID:M1,Impact:F1,Label:V1,label:U1,Layout:B1,Link:$1,Location:W1,"Modal Edit":"Edição Modal",Nationality:z1,"Nested Form":"Formulário Nested",Number:"Número",Panel:q1,Password:H1,"Paste below":"Colar Abaixo","Person Age":"Idade ","Person Name":"Nome","Phone Number":"Número de telefone",Radio:G1,reCAPTCHA:K1,Remove:Q1,Resource:Y1,"Select Boxes":"Selecionar Caixas",Select:J1,Signature:X1,"Start Date":"Data de Início",Status:Z1,Submit:eO,Survey:tO,Table:nO,Tabs:rO,Tags:oO,"Text Area":"Área de Texto","Text Field":"Campo de Texto",Time:aO,Tipo:iO,Types:sO,"Update Date":"Data de Atualização","Update Link":"Atualizar Link","Update Mechanism":"Mecanismo de Atualização",Url:uO,Well:lO,"Checks Passed":"Verificação Aprovada",Countries:cO,"Intrusion on Privacy":"Intrusão na Privacidade","Long Name":"Nome Comprido","Reputational Damage":"Dano de Reputação","Risk To Business":"Risco para os Negócios","Risk To Individuals":"Risco para os Indivíduos",Role:dO,"Short Name":"Nome Curto",Title:fO,"Awareness Campaigns":"Campanhas de Conscientização",Employees:pO,Charts:mO,NavPanelAwarenessPopup_title:hO,NavPanelAwarenessPopup_text:gO,NavPanelAwarenessPopup_query:vO,"Children Ages":"Histograma de idades","Children Data Graph":"Gráfico de Dados",NavPanelChildrenPopup_title:yO,NavPanelChildrenPopup_text:PO,NavPanelChildrenPopup_query:SO,"Main Score":"Pontuação","Privacy Notices":"Avisos de Privacidade","Consent Events":"Consentimentos","Consent Chart (Privacy Notice)":"Gráfico de Consentimentos (Avisos de Privacidade)","Data Graph":"Gráfico de Dados","Data Types":"Tipos de Dados","Unmatched Records":"Registros Sem Titular","Ingestion Events":"Eventos de Ingestão",NavPanelInformationYouHold_personGrid:OO,NavPanelInformationYouHoldPopup_text:bO,NavPanelInformationYouHoldPopup_title:EO,NavPanelInformationYouHoldPopup_query:DO,App_title:wO,App_message:CO,"Object Sensitive Data":"Objeto Dados Sensíveis","Object Sensitive Data Club Membership":"Associação a Clubes","Object Sensitive Data Church Membership":"Membros de Igreja","Object Sensitive Data Political View":"Orientação Política","Object Sensitive Data Union Membership":"Membro de Sindicato","Object Sensitive Data Sexual Orientation":"Orientação Sexual","Object Sensitive Data Ethnicity":"Etnia","Object Sensitive Data Religion":"Religião","Object Health":"Objeto Dados de Saúde","Object Health Organ Donor":"Doador de Órgãos","Object Health Alergies":"Alergias","Object Health Blood Type":"Tipo Sanguíneo","Object Health Diseases":"Doenças","Object Biometric":"Objeto Dados Biometricos","Object Biometric Retinal scans":"Digitalização da Retina","Object Biometric Eye Colour":"Cor dos Olhos","Object Biometric Facial Picture":"Imagem Facial","Object Biometric Height cm":"Altura cm","Object Biometric Weight kg":"Peso kg","Object Biometric Fingerprints":"Impressões Digitais","Object Genetic":"Objeto Dados Geneticos","Object Genetic RNA":"RNA","Object Genetic Family Medical History":"História Médica da Família","Object Genetic DNA":"DNA",grid_filterOoo:NO,grid_andCondition:IO,grid_orCondition:_O,grid_clearFilter:RO,grid_applyFilter:jO,grid_contains:TO,grid_notContains:AO,grid_equals:LO,grid_notEqual:xO,grid_startsWith:kO,grid_endsWith:MO,grid_page:FO,grid_to:VO,grid_of:UO,grid_first:BO,grid_previous:$O,grid_next:WO,grid_last:zO,grid_more:qO,grid_greaterThan:HO,grid_lessThan:GO,grid_inRange:KO,NavPanelConsentPopup_text:QO,NavPanelConsentPopup_title:YO,NavPanelConsentPopup_query:JO,"World Map":"Mapa Mundial",NavPanelInternationalPopup_text:XO,NavPanelInternationalPopup_title:ZO,NavPanelInternationalPopup_query:eb,NavPanelLawfulBasisPopup_query:tb,NavPanelLawfulBasisPopup_title:nb,NavPanelLawfulBasisPopup_text:rb,NavPanelPrivacyImpactAssessmentPopup_title:ob,NavPanelPrivacyImpactAssessmentPopup_text:ab,NavPanelPrivacyImpactAssessmentPopup_query:ib,NavPanelPrivacyNoticesPopup_title:sb,NavPanelPrivacyNoticesPopup_text:ub,NavPanelPrivacyNoticesPopup_query:lb,NavPanelSubjectAccessRequestPopup_title:cb,NavPanelSubjectAccessRequestPopup_query:db,NavPanelSubjectAccessRequestPopup_text:fb,"Date Of Birth":"Data de Nascimento","Customer ID":"Identificação do Titular","Compliance Scores":"Pontuação",NavPanelIndividualsRightsPopup_title:pb,NavPanelIndividualsRightsPopup_query:mb,NavPanelIndividualsRightsPopup_text:hb,NavPanelDataBreachPopup_title:gb,NavPanelDataBreachPopup_query:vb,NavPanelDataBreachPopup_text:yb,NavPanelDataProtnOfficerPopup_title:Pb,NavPanelDataProtnOfficerPopup_query:Sb,NavPanelDataProtnOfficerPopup_text:Ob,"SAR Type":"Classificação de SAR","Request Date":"Data da Solicitação","SAR Status":"Status da Solicitação ","Request Status":"Status da Solicitação","Request Types":"Classificações de SAR","Detailed Scores":"Pontuação Detalhada",Details:bb,Preview:Eb,Save:Db,"Chidren's ages":"Idades de crianças","Info Collected":"Informações Coletadas","Who is Collecting":"Quem está Coletando","How is it Collected":"Como estão sendo Coletadas","Why is it Collected":"Porque estão sendo Coletadas","How will it be Used":"Como será Utilizado","Who will it be Shared":"Como será Compartilhada","Effect on Individuals":"Efeitos nos indivíduos","Likely to Complain":"Possibilidade de Reclamação","Link to Campaign":"Link para a Campanha","Stop Date":"Data de Expiração",Passed:wb,"Link Sent":"Link Enviado","Reminder Sent":"Alerta Enviado","Second  Reminder":"Segundo Alerta","Compliance Notices":"Avisos de Conformidade","Compliance Notices Grid":"Grid de Avisos de Conformidade",Titular:Cb,"Metadata Type Object Privacy Notice":"Classificação por Tipo",Text:Nb,"Data Breach Graph":"Grafo de Vazamento de Dados","Infrastructure Graph":"Grafo de Infraestrutura","Metadata Type Object AWS VPC":"VPC","Sensitive Data":"Dados Sensíveis",Ethnicity:Ib,Religion:_b,"Political View":"Orientação Política","Union Membership":"Membro de Sindicato","Church Membership":"Membro de Igreja","Metadata Type Event Subject Access Request":"Classificação",Name:Rb,"Match Weight":"Peso da Propriedade","Exclude From Search":"Excluída da Pesquisa","Exclude From Subsequence Search":"Propriedade Não Obrigatória","Exclude From Update":"Excluída do Update","Reports To":"Subordinado","Metadata Type Person Employee":"Classificação","Assigned SAR Request":"Responsável por cumprir","Event Training Person":"foi treinado","Metadata Type Event Training":"Classificação","Metadata Type Object AWS Security Group":"Classificação",Legislation:jb,Awareness:Tb,Children:Ab,"Data Breaches":"Violação de Dados","Data Protection Officer":"Encarregado","Indiv Rights":"Direitos Pessoais","Info you hold":"Dados Armazenados",International:Lb,"Lawful Basis":"Bases Legais","Privacy Impact Assessment":"Availação de Impacto de Priv","Subject Access Requests":"Solicitação de Acesso","Total Score":"Pontuação Total","GDPR Scores":"Pontuação LGPD","POLE Counts":"Contagem POLE","Has Table":"Tem Tabela","Has Column":"Tem Coluna","Has Semantic":"Tem Semântica","Object Metadata Source Name":"Nome","Object Metadata Source Create Date":"Data de Criação","Object Metadata Source Update Date":"Data de Atualização","Metadata Source Type":"Tipo de Dados","Metadata Type Object Metadata Source":"Metadados","Object Metadata Source Description":"Descrição","Object Metadata Source":"Metadados","Object Metadata Source Domain":"Domínio","Object Metadata Source Domain Frequency":"Frequência","Unstructured Data PII":"Dados Pessoais de Fontes Nao Estruturadas","Structured Data PII":"Dados Pessoais de Fontes Estruturadas","DB Tables":"Tabelas de Bancos de Dadaos","DB Columns":"Colunas de Bancos de Dados","Unstructured Data Sources":"Fontes de Dados Não Estruturados","Mixed Data Sources":"Mixed Data Sources","Email PST":"Email PST","PDF Forms":"Formulários de PDF","Sensitive Data Spreadsheet 2":"Sensitive Data Spreadsheet 2","CRM System CSV":"CRM System CSV","Events Per Data Source":"Eventos Por Fonte de Dados","Marketing System XLSX":"Sistema de Marketing XLSX",Read:xb,read:kb,Denied:Mb,"Data Controller":"Controlador de Dados","Last 5 days":"Últimos 5 dias",New:Fb,Delete:Vb,"Delete ":"Excluir ",delete:"Excluir",Deleted:Ub,Update:Bb,update:$b,Completed:Wb,"Data Owner":"Responsável",Acknowledged:zb,"Object Data Procedures Why Is It Collected":"Por que é coletado?","Object Data Procedures Info Collected":"Informações Coletadas","Object Data Procedures Country Where Stored":"País onde as informações estão localizadas","Object Data Procedures Description":"Descrição","Object Data Procedures Number Of Records Monthly":"Quantidade de pessoas por mês","Object Data Procedures Type Of Natural Person":"Categoria dos titulares dos dados","Object Application Start Date":"Data Inicial","Object Application Name":"Nome","Object Application Form Submission Id":"ID Envio do Formulário","Object Application Form Id":"ID Formulário","Object Application Form Submission Owner Id":"ID do Proprietário do Envio do Formulário","Object Application Form Owner Id":"ID do Proprietário do Formulário","Object Application Description":"Descrição","Object Application URL":"URL","Object Application Stop Date":"Data Final",Neighbour:qb,Display:Hb,"Self Namespace":"Nome Próprio","Base URL":"URL Base","Is Neighbour":"É Vizinho","Object Application":"Aplicação","Object Data Source Engine":"Mecanismo de Fonte de Dados","Object Data Source Business Rules":"Regras de Negócio","Object Data Source Domain Frequency":"Frequência","Object Data Source Type":"Tipo","Object Data Source Domain":"Domínio da Fonte de Dados","Object Data Source Retention Policy":"Política de Retenção","Object Data Policy Type":"Tipo de Política","Object Data Policy Retention Period":"Período de Retenção","Object Lawful Basis Short Description":"Tipo",Filter:Gb,"Custom Filter":"Filtro Customisado","Person Natural Type":"Tipo","Location Address Type":"Tipo","Event Transaction":"Transações","Event Transaction Description":"Descrição","Event Transaction Currency":"Moeda","Event Transaction Type":"Tipo","Event Transaction Date":"Data","Event Transaction Status":"Status","Event Transaction Value":"Valor","Object Salary":"Salário","Object Salary Value":"Valor","Object Salary Period":"Período","Object Salary Currency":"Moeda",Has_Transaction:Kb,"Has Transaction":"Tem Transação","Has Salary":"Tem Salário",Has_Salary:Qb,Is_Responsible:Yb,"Is Responsible":"É Responsável"},Xb="Tables",Zb="Graphics",eE="Graphic",tE="Save",nE="Yes",rE="No",oE="Consent",aE="Decoded",iE="Graph",sE="Lives",uE="Operation",lE="Property",cE="Type",dE="Value",fE="Advanced",pE="Age",mE="Button",hE="Checkbox",gE="Columns",vE="Container",yE="Content",PE="Copy",SE="Currency",OE="Custom",bE="Data",EE="Day",DE="Description",wE="Edit",CE="Email",NE="File",IE="Gender",_E="Hidden",RE="Id",jE="ID",TE="Impact",AE="Label",LE="Layout",xE="Link",kE="Location",ME="Nationality",FE="Panel",VE="Password",UE="Radio",BE="reCAPTCHA",$E="Remove",WE="Resource",zE="Select",qE="Signature",HE="Status",GE="Submit",KE="Survey",QE="Table",YE="Tabs",JE="Tags",XE="Time",ZE="Tipo",eD="Types",tD="Url",nD="Well",rD="Countries",oD="Role",aD="Title",iD="Employees",sD="Charts",uD="Awareness",lD=`You should make sure that decision makers and key
 people in your organisation are aware that the law is
changing to the GDPR. They need to appreciate the
impact this is likely to have.`,cD=`def retVal = '';
try {
  long numEvents = g.V().has('Metadata.Type.Object.Awareness_Campaign',eq('Object.Awareness_Campaign')).in().as('events').count().next();
  
  def map = g.V().has('Metadata.Type.Object.Awareness_Campaign',eq('Object.Awareness_Campaign')).in().as('events').groupCount().by('Event.Training.Status').next();
  
  
  long failedCount = map.get('Failed') == null ? 0 :map.get('Failed');
  long secondReminder = map.get('Second  Reminder') == null ? 0 : map.get('Second  Reminder') ;
  long firstReminder = map.get('Reminder Sent') == null ? 0 :  map.get('Reminder Sent');
  
  
  long scoreValue = 100L;
  if (numEvents > 0){
    
    long pcntFailed = (long) (100L*failedCount/numEvents);
    if (pcntFailed > 10){
      scoreValue -= 60L;
    }
    else if (failedCount > 0){
      scoreValue -= (40L + 2L* pcntFailed)
    }
    
    
  
    long pcntSecondReminder = (long) (100L*secondReminder/numEvents);
    if (pcntSecondReminder > 10){
      scoreValue -= 30L;
    }
    else if (secondReminder > 0) {
      scoreValue -= (10L + 2L*pcntWithNegativeConsent)
    }
  
    scoreValue -= (10L * firstReminder/numEvents)
   
    // add a bit of a score, after all there was at least some training.
    if (scoreValue == 0)
    {
      scoreValue = 10L
    }
  
  
    
     
  }else{
    scoreValue = 0L; 
  }
  
  StringBuffer sb = new StringBuffer ('{ "scoreValue": ');
  
  sb.append(scoreValue)
    .append(', "scoreExplanation":"');
  if (numEvents > 0)  {
    sb.append('This score reflects that out of ')
      .append(numEvents).append(' GDPR training records, ')
      .append(failedCount).append(' have FAILED the awareness campaign tests, ')
      .append(firstReminder).append(' have been sent a FIRST reminder to take the awareness campaign training course and, ')
      .append(secondReminder).append(' have been sent a SECOND reminder to take the awareness campaign training course.');
  }
  else {
    sb.append('There are no awareness campaign training records in place.')
  }
  sb.append('" }')  
  
  retVal = sb.toString()
} catch (Throwable t) {
    
  StringBuffer sb = new StringBuffer ('{ "scoreValue": ');
  
  sb.append(0L)
    .append(', "scoreExplanation":"');
    sb.append('There are no awareness campaign training records in place.')
  sb.append('" }')  
  retVal = sb.toString()
}
retVal.toString()
`,dD="Children",fD=`You should start thinking now about whether you
need to put systems in place to verify individuals’
ages and to obtain parental or guardian consent for
any data processing activity.`,pD=`long ageThresholdMs = (long)(System.currentTimeMillis() - (3600000L * 24L *365L  * 18L));
def dateThreshold = new java.util.Date (ageThresholdMs);


long numChildren = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
    )
  )
.count().next()

long numNoGuardian = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
    ,__.outE('Has_Parent_Or_Guardian').count().is(eq(0))
    )
  )
.count().next()
 
long numWithoutAnyConsent = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
    ,__.outE('Consent').count().is(eq(0))
    )
  )
.count().next()
 
 
long numNegativeConsent = 

g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
 .where(
    __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
  ).as('children')
 .match(
     __.as('children').outE('Consent').as('consentEdges')
    ,__.as('consentEdges').count().as('consentEdgesCount')
    ,__.as('consentEdges').inV().as('consentEvents')
    ,__.as('consentEvents').has('Event.Consent.Status',eq('No Consent ')).count().as('negConsentCount')
    ,__.as('children').id().as('childId')

 )
 .select('consentEdgesCount','negConsentCount', 'childId')
.where('consentEdgesCount',eq('negConsentCount'))
.where(__.as('consentEdgesCount').is(gt(0)))

.count().next()



long numPendingConsent = 

g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
 .where(
    __.values('Person.Natural.Date_Of_Birth').is(gte(dateThreshold))
  ).as('children')
 .match(
     __.as('children').outE('Consent').as('consentEdges')
    ,__.as('consentEdges').count().as('consentEdgesCount')
    ,__.as('consentEdges').inV().as('consentEvents')
    ,__.as('consentEvents').has('Event.Consent.Status',eq('Consent Pending')).count().as('pendingConsentCount')
    ,__.as('children').id().as('childId')

 )
 .select('consentEdgesCount','pendingConsentCount', 'childId')
.where('consentEdgesCount',eq('pendingConsentCount'))
.where(__.as('consentEdgesCount').is(gt(0)))

.count().next()



long scoreValue = 100L;
if (numChildren > 0){
  
  long pcntWithoutAnyConsent = (long) (100L*numWithoutAnyConsent/numChildren);
  if (pcntWithoutAnyConsent > 10){
    scoreValue -= 32L;
  }
  else if (numWithoutAnyConsent > 0) {
    scoreValue -= (22L + pcntWithoutAnyConsent)
  }
  
  
  long pcntWithoutAnyGuardian = (long) (100L*numNoGuardian/numChildren);
  if (pcntWithoutAnyGuardian > 10){
    scoreValue -= 32L;
  }
  else if (numNoGuardian > 0){
    scoreValue -= (22L + pcntWithoutAnyGuardian)
  }
    
  long pcntWithNegativeConsent = (long) (100L*numNegativeConsent/numChildren);
  if (pcntWithNegativeConsent > 10){
    scoreValue -= 32L;
  }
  else if (numNegativeConsent > 0){
    scoreValue -= (22L + pcntWithNegativeConsent)
  }

  scoreValue -= (7L * numPendingConsent/numChildren)
 

  
   
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numChildren > 0)  {
  sb.append('This score reflects the fact that out of ')
    .append(numChildren).append(' children, ')
    .append(numWithoutAnyConsent).append(' do not have any consent (positive, negative or pending), ')
    .append(numPendingConsent).append(' only have a pending consent to use their data, ')
    .append(numNegativeConsent).append(' only have a negative consent to use their data, and ')
    .append(numNoGuardian).append(' do not have a parent or guardian configured in the system.');
}
else {
  sb.append('There are not any children records for this business.')
}
sb.append('" }')  

sb.toString()`,mD="Natural Persons",hD=`You should document what personal data you hold,
where it came from and who you share it with. You
may need to organise an information audit.`,gD="Info You Hold",vD=`long numEvents = g.V().has('Metadata.Type.Event.Ingestion',eq('Event.Ingestion')).count().next();

long numRecordsNoEdges =
g.V()
 .has('Metadata.Type.Event.Ingestion',eq('Event.Ingestion'))
 .where(__.inE().count().is(eq(1)))
 .count().next()


long scoreValue = 100L;
if (numEvents > 0){
  
  long pcntNoEdges = (long) (100L*numRecordsNoEdges/numEvents);
  if (pcntNoEdges > 5 && pcntNoEdges < 40){
    scoreValue -= 40L;
  }
  else if (pcntNoEdges> 40) {
    scoreValue -= (20L + 2L* pcntNoEdges)
  }
  else  {
    scoreValue -= ( pcntNoEdges)
  }
  
  
   
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numRecordsNoEdges > 0)  {
  sb.append('This score reflects that out of ')
    .append(numEvents).append(' personally identifiable information ingestion records, ')
    .append(numRecordsNoEdges).append(' have not been matched to an individual.')
}
else if (numEvents > 0) {
  sb.append('All ').append(numEvents).append(' personally identifiable information ingestion records in the system have been matched against individuals.')
}
else {
  sb.append('There are no personally identifiable information ingestion records in the system.')
}
sb.append('" }')  

sb.toString()`,yD="GDPR",PD="Select a panel from the menu on the top right",SD="Filter",OD="And",bD="Or",ED="Clear",DD="Apply",wD="Contains",CD="Not Contains",ND="Equals",ID="Not Equals",_D="Starts With",RD="Ends With",jD="Page",TD="to",AD="of",LD="First",xD="Previous",kD="Next",MD="Last",FD="More",VD=`You should review how you seek, record and manage
consent and whether you need to make any changes.
Refresh existing consents now if they don’t meet the
GDPR standard.`,UD="Consent",BD=`long ageThresholdMs = (long)(System.currentTimeMillis() - (3600000L * 24L *365L  * 18L));
def dateThreshold = new java.util.Date (ageThresholdMs);


long numAdults = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(lt(dateThreshold))
    )
  )
.count().next()


long numWithoutAnyConsent = g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
.where(
    and(
      __.values('Person.Natural.Date_Of_Birth').is(lt(dateThreshold))
    ,__.outE('Consent').count().is(eq(0))
    )
  )
.count().next()
 
 
long numNegativeConsent = 

g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
 .where(
    __.values('Person.Natural.Date_Of_Birth').is(lt(dateThreshold))
  ).as('adults')
 .match(
     __.as('adults').outE('Consent').as('consentEdges')
    ,__.as('consentEdges').count().as('consentEdgesCount')
    ,__.as('consentEdges').inV().as('consentEvents')
    ,__.as('consentEvents').has('Event.Consent.Status',eq('No Consent ')).count().as('negConsentCount')

 )
 .select('consentEdgesCount','negConsentCount')
.where('consentEdgesCount',eq('negConsentCount'))
.where(__.as('consentEdgesCount').is(gt(0)))

.count().next()



long numPendingConsent = 

g.V().has('Metadata.Type.Person.Natural',eq('Person.Natural'))
 .where(
    __.values('Person.Natural.Date_Of_Birth').is(lt(dateThreshold))
  ).as('adults')
 .match(
     __.as('adults').outE('Consent').as('consentEdges')
    ,__.as('consentEdges').count().as('consentEdgesCount')
    ,__.as('consentEdges').inV().as('consentEvents')
    ,__.as('consentEvents').has('Event.Consent.Status',eq('Consent Pending')).count().as('pendingConsentCount')

 )
 .select('consentEdgesCount','pendingConsentCount')
.where('consentEdgesCount',eq('pendingConsentCount'))
.where(__.as('consentEdgesCount').is(gt(0)))

.count().next()



long scoreValue = 100L;
if (numAdults > 0){
  
  long pcntWithoutAnyConsent = (long) (100L*numWithoutAnyConsent/numAdults);
  if (pcntWithoutAnyConsent > 10){
    scoreValue -= 45L;
  }
  else if (numWithoutAnyConsent > 0) {
    scoreValue -= (25L + 2L* pcntWithoutAnyConsent)
  }
  
  

  long pcntWithNegativeConsent = (long) (100L*numNegativeConsent/numAdults);
  if (pcntWithNegativeConsent > 10){
    scoreValue -= 45L;
  }
  else if (numNegativeConsent > 0){
    scoreValue -= (25L + 2L*pcntWithNegativeConsent)
  }

  scoreValue -= (10L * numPendingConsent/numAdults)
 

  
   
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numAdults > 0)  {
  sb.append('This score reflects that out of ')
    .append(numAdults).append(", adult's records, ")
    .append(numWithoutAnyConsent).append(' do not have any consent (positive, negative or pending), ')
    .append(numPendingConsent).append(' only have a pending consent to use their data, ')
    .append(numNegativeConsent).append(' only have a negative consent to use their data.');
}
else {
  sb.append('There are not any adult records for this business.')
}
sb.append('" }')  

sb.toString()`,$D=`If your organisation operates in more than one EU
member state (ie you carry out cross-border
processing), you should determine your lead data
protection supervisory authority. Article 29 Working
Party guidelines will help you do this.`,WD="International",zD=`long numItems = g.V().has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
.count().next()
 
 
long numPrivNoticesWithoutRegulator = 
  g.V()
  .has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
  .where( __.out().has('Metadata.Type.Person.Organisation',eq('Person.Organisation')).count().is(eq(0)))
  .count().next()


 

long scoreValue = 100L;
if (numItems > 0){
  
  scoreValue -= (long) (100L*numPrivNoticesWithoutRegulator/numItems);




 
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numItems > 0)  {
  sb.append('This score reflects that out of ');
  sb.append(numItems).append(' Privacy Impact Assessments, ');
   
  if (numPrivNoticesWithoutRegulator == 0){
    sb.append( 'ALL have a regulator assigned to them.');
  }
  else {
    sb.append(numPrivNoticesWithoutRegulator);
    if (numPrivNoticesWithoutRegulator == 1){
      sb.append( ' does not have a regulator assigned to it.');
    }
    else{
      sb.append(' do not have a regulator assigned to it.');
    }
  }
    
    

}
else {
  sb.append ('There are no Privacy Impact Assessments listed in the system.');
}




sb.append('" }')  

sb.toString()`,qD=`long numEvents = g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice'))
.count().next()


long numWithoutAnyLawfulBasis = g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice'))
.where(
  __.outE('Has_Lawful_Basis_On').count().is(eq(0))
)
.count().next()
 
 
long scoreValue = 100L;
if (numEvents > 0){
  scoreValue -= (100L * numWithoutAnyLawfulBasis/numEvents)
 
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numEvents > 0)  {
  sb.append('This score reflects that out of ');
  sb.append(numEvents).append(' Privacy Notices, ');
   
  if (numWithoutAnyLawfulBasis == 0){
    sb.append( 'ALL have lawful basis associated with them.');
  }
  else {
    sb.append(numWithoutAnyLawfulBasis);
    if (numWithoutAnyLawfulBasis == 1){
      sb.append( ' does not have a lawful basis associated with it.');
    }
    else{
      sb.append(' do not have a lawful basis associated with them.');
    }
  }
  

}
else {
  sb.append ('There are no Privacy Notices associated with any lawful basis in the system.');
}

sb.append('" }')  

sb.toString()`,HD="Lawful Basis",GD=`You should identify the lawful basis for your
processing activity in the GDPR, document it and
update your privacy notice to explain it.`,KD="Priv Impact Asmnt",QD=`You should familiarise yourself now with the ICO’s
code of practice on Privacy Impact Assessments as
well as the latest guidance from the Article 29
Working Party, and work out how and when to
implement them in your organisation.`,YD=`long numItems = g.V().has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
.count().next()
 
 
long numPIAWithoutPrivNotices = 
  g.V()
  .has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
  .where( __.both().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).count().is(eq(0)))
  .count().next()


 
long numPIAWithPrivNoticesAndDataWithoutConsent = 
  g.V()
  .has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
  .where( 
    __.both().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice'))
      .both().has('Event.Consent.Status',eq('No Consent '))
      .count().is(gt(0))
  )
  .count().next()


long numPIAWithPrivNoticesAndDataWithPendingConsent = 
  g.V()
  .has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment'))
  .where( 
    __.both().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice'))
      .both().has('Event.Consent.Status',eq('Consent Pending'))
      .count().is(gt(0))
  )
  .count().next()




long scoreValue = 100L;
if (numItems > 0){
  
  scoreValue -= (numPIAWithoutPrivNotices > 0)?(long) (15L + 10L*numPIAWithoutPrivNotices/numItems):0;
  scoreValue -= (numPIAWithPrivNoticesAndDataWithoutConsent > 0)?(long) (40L + 5L*numPIAWithPrivNoticesAndDataWithoutConsent/numItems):0;
  scoreValue -= (numPIAWithPrivNoticesAndDataWithPendingConsent > 0)?(long) (20L + 10L*numPIAWithPrivNoticesAndDataWithPendingConsent/numItems):0;


  scoreValue = scoreValue < 0 ? 0 : scoreValue;

 
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numItems > 0)  {
  sb.append('This score reflects that out of ');
  sb.append(numItems).append(' Privacy Impact Assessments, ');
   
  if (numPIAWithoutPrivNotices == 0){
    sb.append( 'ALL have a Privacy Notice assigned to them, ');
  }
  else {
    sb.append(numPIAWithoutPrivNotices);
    if (numPIAWithoutPrivNotices == 1){
      sb.append( ' does not have a Privacy Notice assigned to it, ' );
    }
    else{
      sb.append(' do not have a Privacy Notice assigned to them, ');
    }
  }
    
  if (numPIAWithPrivNoticesAndDataWithoutConsent == 0){
    sb.append( 'NONE of the Privacy Notices assigned to them have negative consents, and ');
  }
  else {
    sb.append(numPIAWithPrivNoticesAndDataWithoutConsent);
    if (numPIAWithPrivNoticesAndDataWithoutConsent == 1){
      sb.append( ' has a privacy notice with data events that have negative consents, and ' );
    }
    else{
      sb.append(' have a privacy notice with data events that have negative consents, and ');
    }
  }
   
  if (numPIAWithPrivNoticesAndDataWithPendingConsent == 0){
    sb.append( 'NONE of the Privacy Notices assigned to them have pending consents.');
  }
  else {
    sb.append(numPIAWithPrivNoticesAndDataWithPendingConsent);
    if (numPIAWithPrivNoticesAndDataWithPendingConsent == 1){
      sb.append( ' has a privacy notice with data events that have negative consents.' );
    }
    else{
      sb.append(' have a privacy notice with data events that have negative consents.');
    }
  }
   
   
   

}
else {
  sb.append ('There are no Privacy Impact Assessments listed in the system.');
}




sb.append('" }')  

sb.toString()`,JD="Privacy Notices",XD=`You should review your current privacy notices and
put a plan in place for making any necessary
changes in time for GDPR implementation.`,ZD=`long numEvents = g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).count().next();

long numRecordsNoConsent =
g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).as('privNotice')
.match(
    __.as('privNotice').both().has('Metadata.Type.Event.Consent',eq('Event.Consent')).count().as('consentCount')

)
.select('consentCount')
.where(__.as('consentCount').is(eq(0)))
.count().next()

long numRecordsNoPIA =
g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).as('privNotice')
.match(
    __.as('privNotice').both().has('Metadata.Type.Object.Privacy_Impact_Assessment',eq('Object.Privacy_Impact_Assessment')).count().as('consentCount')

)
.select('consentCount')
.where(__.as('consentCount').is(eq(0)))
.count().next()

long numRecordsLessThan50PcntPositiveConsent =
g.V().has('Metadata.Type.Object.Privacy_Notice',eq('Object.Privacy_Notice')).as('privNotice')
.match(
    __.as('privNotice').both().has('Metadata.Type.Event.Consent',eq('Event.Consent')).count().as('consentCount')
  , __.as('privNotice').both().has('Event.Consent.Status',eq('Consent')).count().math('_ * 2').as('posConsentCountDouble')
)
.select(
  'consentCount'
, 'posConsentCountDouble'
)
.where(
  'consentCount', gt('posConsentCountDouble')

)
.count().next()


long scoreValue = 100L;
if (numEvents > 0){
  
  long pcntNoConsent = (long) (100L*numRecordsNoConsent/numEvents);
  if (pcntNoConsent > 10){
    scoreValue -= 40L;
  }
  else if (numRecordsNoConsent> 0) {
    scoreValue -= (20L + 2L* pcntNoConsent)
  }
  
  
  long pcntNoPIA = (long) (100L*numRecordsNoPIA/numEvents);
  if (pcntNoPIA > 10){
    scoreValue -= 50L;
  }
  else if (numRecordsNoPIA > 0){
    scoreValue -= (30L + 2L*pcntNoPIA)
  }

  scoreValue -= (10L * numRecordsLessThan50PcntPositiveConsent/numEvents)
 

  
   
}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numEvents > 0)  {
  sb.append('This score reflects that out of ');
  sb.append(numEvents).append(' privacy notices, ');
   
  if (numRecordsNoConsent == 0){
    sb.append( ' ALL have consent events, ');
  }
  else {
    sb.append(numRecordsNoConsent);
    if (numRecordsNoConsent == 1){
      sb.append( ' does not have any consent events, ');
    }
    else{
      sb.append(' do not have any consent events, and ');
    }
  }
  
  if (numRecordsNoPIA == 0){
    sb.append(' ALL have Privacy Impact Assessments, and ');

  }
  else{
    sb.append(numRecordsNoPIA);
    if (numRecordsNoPIA == 1){
      sb.append(' does not have any Privacy Impact Assessments, and ');
    }
    else {
      sb.append(' do not have any Privacy Impact Assessments, and ');
    }
  }
  
  if (numRecordsLessThan50PcntPositiveConsent == 0){
    sb.append(' NONE have more than 50% negative or pending consent events.');
  }
  else{
    sb.append(numRecordsLessThan50PcntPositiveConsent);
    if (numRecordsLessThan50PcntPositiveConsent == 1){
      sb.append(' has more than 50% negative or pending consent events.');
    }
    else {
      sb.append(' have more than 50% negative or pending consent events.');
    }
  }


}
else {
  sb.append ('There are no Privacy Notices in the system.');
}

sb.append('" }')  

sb.toString()`,ew="Subj Access Req",tw=`long thirtyDayThresholdMs = (long)(System.currentTimeMillis() - (3600000L * 24L *30L));
def thirtyDayDateThreshold = new java.util.Date (thirtyDayThresholdMs);
long tenDayThresholdMs = (long)(System.currentTimeMillis() - (3600000L * 24L *10L));
def tenDayDateThreshold = new java.util.Date (tenDayThresholdMs);

long numEvents = g.V().has('Metadata.Type.Event.Subject_Access_Request',eq('Event.Subject_Access_Request')).count().next();

long numRecordsOlder30Days =

g.V().has('Metadata.Type.Event.Subject_Access_Request',eq('Event.Subject_Access_Request')).as('sar')
.where(
  __.values('Event.Subject_Access_Request.Metadata.Create_Date').is(lte(thirtyDayDateThreshold))
) 

.count().next()

long numRecordsOlder10Days =

g.V().has('Metadata.Type.Event.Subject_Access_Request',eq('Event.Subject_Access_Request')).as('sar')
.where(
  __.values('Event.Subject_Access_Request.Metadata.Create_Date').is(lte(tenDayDateThreshold))
) 

.count().next()


long scoreValue = 100L;
if (numEvents > 0){
  
  long pcntOlder30Days = (long) (100L*numRecordsOlder30Days/numEvents);
  if (pcntOlder30Days > 10){
    scoreValue -= 80L;
  }
  else if (numRecordsOlder30Days> 0) {
    scoreValue -= (60L + 2L* pcntOlder30Days)
  }
  
  

  scoreValue -= (20L * numRecordsOlder10Days/numEvents)
 

  
   
}else{
  scoreValue = 100L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numEvents > 0)  {
  sb.append('This score reflects that out of ');
  sb.append(numEvents).append(' Subject Access Requests, ');
   
  if (numRecordsOlder30Days == 0){
    sb.append( 'NONE are older than 30 days, and ');
  }
  else {
    sb.append(numRecordsOlder30Days);
    if (numRecordsOlder30Days == 1){
      sb.append( ' is older than 30 days, and ');
    }
    else{
      sb.append(' are older than 30 days, and ');
    }
  }
  
  if (numRecordsOlder10Days == 0){
    sb.append(' NONE are older than 10 days.');

  }
  else{
    sb.append(numRecordsOlder10Days);
    if (numRecordsOlder10Days == 1){
      sb.append(' is older than 10 days.');
    }
    else {
      sb.append(' are older than 10 days.');
    }
  }
  

}
else {
  sb.append ('There are no Subject Access Requests in the system.');
}

sb.append('" }')  

sb.toString()`,nw=`You should update your procedures and plan how you
will handle requests within the new timescales and
provide any additional information.`,rw="Individual's Rights",ow=`long numItems = g.V()
 .has('Metadata.Type.Object.Data_Procedures',eq('Object.Data_Procedures'))
 .count()
 .next()


long numDeleteURL = g.V()
 .has('Metadata.Type.Object.Data_Procedures',eq('Object.Data_Procedures'))
 .values('Object.Data_Procedures.Delete_URL')
 .count()
 .next()

long numUpdateURL = g.V()
 .has('Metadata.Type.Object.Data_Procedures',eq('Object.Data_Procedures'))
 .values('Object.Data_Procedures.Delete_URL')
 .count()
 .next()

long numWithoutDeleteUrl = (numItems - numDeleteURL);
long numWithoutUpdateUrl = (numItems - numUpdateURL);

long scoreValue = 100L;
if (numItems > 0){
  
  scoreValue -= (long) (50L*numWithoutDeleteUrl/numItems);
  scoreValue -= (long) (50L*numWithoutUpdateUrl/numItems);

}else{
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numItems > 0)  {
  sb.append('This score reflects that out of ');
  sb.append(numItems).append(' Data Procedures, ');
   
  if (numWithoutUpdateUrl == 0){
    sb.append( 'ALL have an update URL, and ');
  }
  else {
    sb.append(numWithoutUpdateUrl);
    if (numWithoutUpdateUrl == 1){
      sb.append( ' has an update URL, and ');
    }
    else{
      sb.append(' have an update URL, and ');
    }
  }
    
    
       
  if (numWithoutDeleteUrl == 0){
    sb.append( 'ALL have a delete URL.');
  }
  else {
    sb.append(numWithoutDeleteUrl);
    if (numWithoutDeleteUrl == 1){
      sb.append( ' has a delete URL.');
    }
    else{
      sb.append(' have a delete URL.');
    }
  }


}
else {
  sb.append ('There are no Data Procedures listed in the system.');
}




sb.append('" }')  

sb.toString();`,aw=`You should check your procedures to ensure they
cover all the rights individuals have, including how
you would delete personal data or provide data
electronically and in a commonly used format. `,iw="Data Breaches",sw=`long numItems = g.V().has('Metadata.Type.Event.Data_Breach',eq('Event.Data_Breach'))
.count().next()
 
 
long numOpenDataBreachDataStolen = 
  g.V()
  .has('Event.Data_Breach.Status',eq('Open'))
  .where( 
    or(
      __.has('Event.Data_Breach.Impact',eq('Customer Data Stolen (External)'))
     ,__.has('Event.Data_Breach.Impact',eq('Customer Data Stolen (Internal)'))
    )
  )
  .count().next()

long numOpenDataBreachDataLost = 
  g.V()
  .has('Event.Data_Breach.Status',eq('Open'))
  .where( 
    __.has('Event.Data_Breach.Impact',eq('Data Lost'))
  )
  .count().next()




long scoreValue = 100L;
if (numItems > 0){
  
  if (numOpenDataBreachDataLost > 0){
    scoreValue -= (long) (15L + 10L*numOpenDataBreachDataLost/numItems);
  }
  
  if (numOpenDataBreachDataStolen > 0){
    scoreValue -= (long) (60L + 15L*numOpenDataBreachDataStolen/numItems);
  }

  scoreValue = scoreValue < 0 ? 0 : scoreValue;

 
}else{
  scoreValue = 100L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numItems > 0)  {
  sb.append('This score reflects that out of ');
  sb.append(numItems).append(' Data Breach Event(s), ');
   
  if (numOpenDataBreachDataStolen == 0){
    sb.append( 'No data has been stolen, ');
  }
  else {
    sb.append(numOpenDataBreachDataStolen);
    if (numOpenDataBreachDataStolen == 1){
      sb.append( ' was related to stolen data, ' );
    }
    else{
      sb.append(' were related to stolen data, ');
    }
  }
    
  if (numOpenDataBreachDataLost == 0){
    sb.append( 'and NONE were related to data loss.');
  }
  else {
    sb.append('and ')
    sb.append(numOpenDataBreachDataLost);
    if (numOpenDataBreachDataLost == 1){
      sb.append( ' was related to data loss.' );
    }
    else{
      sb.append(' were related to data loss.');
    }
  }
   
   
   

}
else {
  sb.append ('There are no Data Breach Events listed in the system.');
}




sb.append('" }')  

sb.toString()`,uw=`You should make sure you have the right procedures
in place to detect, report and investigate a personal
data breach.`,lw="Data Prot'n Offcr",cw=`long numDPOs = g.V().has('Person.Employee.Role',eq('Data Protection Officer'))
.count().next()
 
 
long numDPODirectReports = g.V().has('Person.Employee.Role',eq('Data Protection Officer')).inE('Reports_To')
.count().next()


long numDPOsFailed  = g.V().has('Person.Employee.Role',eq('Data Protection Officer'))
.in().has('Event.Training.Status',eq('Failed'))
.count().next()
 

long numDPODirectReportsFailed = g.V().has('Person.Employee.Role',eq('Data Protection Officer')).inE('Reports_To')
.outV().in().has('Event.Training.Status',eq('Failed'))
.count().next()


long numDPOsSecondReminder  = g.V().has('Person.Employee.Role',eq('Data Protection Officer'))
.in().has('Event.Training.Status',eq('Second  Reminder'))
.count().next()
 

long numDPODirectReportsSecondReminder = g.V().has('Person.Employee.Role',eq('Data Protection Officer')).inE('Reports_To')
.outV().in().has('Event.Training.Status',eq('Second  Reminder'))
.count().next()




long scoreValue = 100L;
if (numDPOs > 0){
  scoreValue -= (long) (25L + 25L*numDPOsFailed/numDPOs);
  scoreValue -= (long) (6L + 7L*numDPOsSecondReminder/numDPOs);
}
if (numDPODirectReports > 0){
  scoreValue -= (long) (13L + 12L*numDPODirectReportsFailed/numDPODirectReports);
  
  scoreValue -= (long) (6L + 6L*numDPODirectReportsSecondReminder/numDPODirectReports);
}
if (numDPOs == 0 && numDPODirectReports == 0){
  scoreValue = 0L; 
}

StringBuffer sb = new StringBuffer ('{ "scoreValue": ');

sb.append(scoreValue)
  .append(', "scoreExplanation":"');
if (numDPOs > 0)  {
  sb.append('This score reflects that out of ');
  sb.append(numDPOs);
  sb.append(' Data Protection Officer(s), ');
  if (numDPOsFailed == 0){
    sb.append( 'NONE have failed the GDPR Awareness Test, and ');
  }
  else {
    sb.append(numDPOsFailed);
    if (numDPOsFailed == 1){
      sb.append( ' has failed the GDPR Awarenss Test, and ');
    }
    else{
      sb.append(' have failed the GDPR Awarenss Test, and ');
    }
  }
    
    
  if (numDPOsSecondReminder == 0){
    sb.append( 'NONE have received a second reminder to take the test.');
  }
  else {
    sb.append(numDPOsSecondReminder);
    if (numDPOsSecondReminder == 1){
      sb.append( ' has received a second reminder to take the test.');
    }
    else{
      sb.append(' have received a second reminder to take the test.');
    }
  }


}
else {
  sb.append ('There are no Data Protection Officers listed in the system.');
}

if (numDPODirectReports > 0){
  sb.append ("  Out of the ").append(numDPODirectReports);
  if (numDPODirectReports == 1){
    sb.append(" Data Protection Officers Direct Report, ");
  }
  else{
    sb.append(" Data Protection Officers Direct Reports, ");
  }
  
  if (numDPODirectReportsFailed == 0){
    sb.append ("NONE have failed the test, and ");
  }
  else{
    sb.append(numDPODirectReportsFailed);
    if (numDPODirectReportsFailed == 1){
      sb.append (" has failed the test, and ");
    }
    else{
      sb.append (" have failed the test, and ");
    }
  }
  
  if (numDPODirectReportsSecondReminder == 0){
    sb.append ("NONE have received a second test reminder.");
  }
  else{
    sb.append(numDPODirectReportsSecondReminder);
    if (numDPODirectReportsSecondReminder == 1){
      sb.append (" has received a second test reminder.");
    }
    else{
      sb.append (" have received a second test reminder.");
    }
  }
  
  
}



sb.append('" }')  

sb.toString()`,dw=`You should designate someone to take responsibility
for data protection compliance and assess where this
role will sit within your organisation’s structure and
governance arrangements. You should consider
whether you are required to formally designate a
Data Protection Officer.`,fw="Details",pw="Preview",mw="Save",hw="Approved",gw="Text",vw="Ethnicity",yw="Religion",Pw="Name",Sw="Legislation",Ow="Awareness",bw="Children",Ew="International",Dw="Read",ww="Denied",Cw="Delete",Nw="Update",Iw="Completed",_w="Neighbour",Rw="Display",jw="Filter",Tw={tables:Xb,graphics:Zb,graphic:eE,"admin-panel":"Admin Panel","delete-dashboard":"Delete Dashboard","confirm-delete":"Do you really want to delete it?","save-edition":"Save Edition","save-state":"Save State",save:tE,yes:nE,no:rE,"donut-chart":"Doughnut Chart","submit-form":"Submit","entry-registered":"Entry registered!","select-inputs":"Select inputs","entry-updated":"Entry Updated!","enter-dashboard-name":"Enter the dashboard name","confirm-delete-entries":"Are you sure you want to delete those entries?","confirm-delete-entry":"Are you sure you want to delete this entry?","add-component":"Add Component","CLICK ON THE GRID TO GET THE RELATED ITEMS TIME SERIES":"CLICK ON THE GRID TO GET THE RELATED ITEMS TIME SERIES",Consent:oE,"CRM System CSV File ":"CRM System CSV File ","Data Impacted By Data Breach":"Data Impacted By Data Breach",Decoded:aE,"Domain Data":"Domain Data","Event Consent":"Event Consent","Event Consent Date":"Date","Event Consent Metadata Create Date":"Metadata Create Date","Event Consent Metadata Update Date":"Metadata Update Date","Event Consent Status":"Status","Event Data Breach":"Event Data Breach","Event Data Breach Description":"Description","Event Data Breach Id":"Id","Event Data Breach Impact":"Impact","Event Data Breach Metadata Create Date":"Metadata Create Date","Event Data Breach Metadata Update Date":"Metadata Update Date","Event Data Breach Source":"Source","Event Data Breach Status":"Status","Event Form Ingestion":"Event Form Ingestion","Event Form Ingestion Domain b64":"Domain b64","Event Form Ingestion Metadata Create Date":"Metadata Create Date","Event Form Ingestion Metadata GUID":"Metadata GUID","Event Form Ingestion Operation":"Operation","Event Form Ingestion Type":"Type","Event Group Ingestion":"Event Group Ingestion","Event Group Ingestion Has Controller":"Has Controller","Event Group Ingestion Has Data Owner":"Has Data Owner","Event Group Ingestion Has Processor":"Has Processor","Event Group Ingestion Metadata End Date":"Metadata End Date","Event Group Ingestion Metadata Start Date":"Metadata Start Date","Event Group Ingestion Operation":"Operation","Event Group Ingestion Type":"Type","Event Ingestion":"Event Ingestion","Event Ingestion Business Rules":"Business Rules","Event Ingestion Domain b64":"Domain b64","Event Ingestion Domain Unstructured Data b64":"Domain Unstructured Data b64","Event Ingestion Metadata Create Date":"Metadata Create Date","Event Ingestion Metadata GUID":"Metadata GUID","Event Ingestion Operation":"Operation","Event Ingestion Type":"Type","Event Subject Access Request":"Event Subject Access Request","Event Subject Access Request Metadata Create Date":"Create Date","Event Subject Access Request Metadata Update Date":"Update Date","Event Subject Access Request Request Type":"Request Type","Event Subject Access Request Status":"Status","Event Training":"Event Training","Event Training Status":"Status",Graph:iE,"Has Form Ingestion Event":"Has Form Ingestion Event","Has Ingestion Event":"Has Ingestion Event","Has Ingress Peering":"Has Ingress Peering","Has Policy":"Has Policy","Has Security Group":"Has Security Group","Has Server":"Has Server","Impacted By Data Breach":"Impacted By Data Breach","Ingestion Date":"Ingestion Date",Lives:sE,"Location Address":"Location Address","Location Address City":"City","Location Address Full Address":"Full Address","Location Address parser category":"Address Parser category","Location Address parser city":"Address Parser city","Location Address parser city district":"Address Parser city district","Location Address parser country":"Address Parser country","Location Address parser country region":"Address Parser country region","Location Address parser entrance":"Address Parser entrance","Location Address parser house":"Address Parser house","Location Address parser house number":"Address Parser house number","Location Address parser island":"Address Parser island","Location Address parser level":"Address Parser level","Location Address parser near":"Address Parser near","Location Address parser po box":"Address Parser po box","Location Address parser postcode":"Address Parser postcode","Location Address parser road":"Address Parser road","Location Address parser staircase":"Address Parser staircase","Location Address parser state":"Address Parser state","Location Address parser state district":"Address Parser state district","Location Address parser suburb":"Address Parser suburb","Location Address parser unit":"Address Parser unit","Location Address parser world region":"Address Parser world region","Location Address Post Code":"Post Code","Location Address State":"State","Location Address Street":"Street","Made SAR Request":"Made SAR Request","Marketing Email System ":"Marketing Email System ","Metadata Create Date":"Metadata Create Date","Metadata GDPR Status":"Metadata GDPR Status","Metadata Lineage":"Metadata Lineage","Metadata Lineage Location Tag":"Metadata Lineage Location Tag","Metadata Redaction":"Metadata Redaction","Metadata Status":"Metadata Status","Metadata Type":"Metadata Type","Metadata Type Event Consent":"Data Type - Event Consent","Metadata Type Event Data Breach":"Data Type - Event Data Breach","Metadata Type Event Form Ingestion":"Data Type - Event Form Ingestion","Metadata Type Event Group Ingestion":"Data Type - Event Group Ingestion","Metadata Type Event Ingestion":"Data Type - Event Ingestion","Metadata Type Location Address":"Data Type - Location Address","Metadata Type Object AWS Instance":"Data Type - Object AWS Instance","Metadata Type Object Credential":"Data Type - Object Credential","Metadata Type Object Email Address":"Data Type - Object Email Address","Metadata Type Object Insurance Policy":"Data Type - Object Insurance Policy","Metadata Type Object Privacy Impact Assessment":"Data Type - Object Privacy Impact Assessment","Metadata Type Person Natural":"Data Type - Person Natural","Metadata Update Date":"Update Date","Metadata Version":"Version"," num events":" num events","Object Awareness Campaign":"Object Awareness Campaign","Object Awareness Campaign Description":"Description","Object Awareness Campaign Form Id":"Form Id","Object Awareness Campaign Form Owner Id":"Form Owner Id","Object Awareness Campaign Form Submission Id":"Form Submission Id","Object Awareness Campaign Form Submission Owner Id":"Form Submission Owner Id","Object Awareness Campaign Start Date":"Start Date","Object Awareness Campaign Stop Date":"Stop Date","Object Awareness Campaign URL":"URL","Object AWS Instance":"Object AWS Instance","Object AWS Instance EbsOptimized":"EbsOptimized","Object AWS Instance EnaSupport":"EnaSupport","Object AWS Instance Id":"Id","Object AWS Instance ImageId":"ImageId","Object AWS Instance InstanceType":"InstanceType","Object AWS Instance KeyName":"KeyName","Object AWS Instance LaunchTime":"LaunchTime","Object AWS Instance PrivateDnsName":"PrivateDnsName","Object AWS Instance PrivateIpAddress":"PrivateIpAddress","Object AWS Instance ProductCodeIDs":"ProductCodeIDs","Object AWS Instance ProductCodeTypes":"ProductCodeTypes","Object AWS Instance Public Dns Name":"Public Dns Name","Object AWS Instance Tags":"Tags","Object AWS Network Interface":"Object AWS Network Interface","Object AWS Network Interface AttachTime":"Attach Time","Object AWS Network Interface Description":"Description","Object AWS Network Interface MacAddress":"Mac Address","Object AWS Network Interface NetworkInterfaceId":"Network Interface Id","Object AWS Network Interface PrivateDnsName":"Private Dns Name","Object AWS Network Interface PrivateIpAddresses":"Private Ip Addresses","Object AWS Security Group":"Object AWS Security Group","Object AWS Security Group GroupName":"GroupName","Object AWS Security Group Id":"Id","Object AWS Security Group Ip Perms Egress IpRanges":"Ip Perms Egress IpRanges","Object AWS Security Group Ip Perms Ingress IpRanges":"Ip Perms Ingress IpRanges","Object AWS VPC":"Object AWS VPC","Object AWS VPC Id":"Object AWS VPC Id","Object Credential":"Object Credential","Object Credential Login SHA256":"Login SHA256","Object Credential User Id":"User Id","Object Data Policy":"Object Data Policy","Object Data Policy CreateDate":"CreateDate","Object Data Policy Description":"Description","Object Data Policy Form Id":"Form Id","Object Data Policy Form Owner Id":"Form Owner Id","Object Data Policy Form Submission Id":"Form Submission Id","Object Data Policy Form Submission Owner Id":"Form Submission Owner Id","Object Data Policy Name":"Name","Object Data Policy UpdateDate":"UpdateDate","Object Data Procedures":"Object Data Procedures","Object Data Procedures Delete Mechanism":"Delete Mechanism","Object Data Procedures Delete URL":"Delete URL","Object Data Procedures Property":"Property","Object Data Procedures Type":"Type","Object Data Procedures Update Mechanism":"Update Mechanism","Object Data Procedures Update URL":"Update URL","Object Data Source":"Object Data Source","Object Data Source Create Date":"Create Date","Object Data Source Credential ApiKey":"Credential ApiKey","Object Data Source Credential Principal":"Credential Principal","Object Data Source Credential Secret":"Credential Secret","Object Data Source Description":"Description","Object Data Source Form Id":"Form Id","Object Data Source Form Owner Id":"Form Owner Id","Object Data Source Form Submission Id":"Form Submission Id","Object Data Source Form Submission Owner Id":"Form Submission Owner Id","Object Data Source Name":"Name","Object Data Source Update Date":"Update Date","Object Data Source URI Config":"URI Config","Object Data Source URI Control":"URI Control","Object Data Source URI Delete":"URI Delete","Object Data Source URI Monitor":"URI Monitor","Object Data Source URI Read":"URI Read","Object Data Source URI Template":"URI Template","Object Data Source URI Update":"URI Update","Object Email Address":"Object Email Address","Object Email Address Email":"Email","Object Form":"Object Form","Object Form Metadata Create Date":"Create Date","Object Form Metadata GUID":"GUID","Object Form Metadata Owner":"Owner","Object Form Text":"Text","Object Form URL":"URL","Object Form Vertex Label":"Vertex Label","Object Identity Card":"Object Identity Card","Object Identity Card Id Name":"Id Name","Object Identity Card Id Value":"Id Value","Object Insurance Policy":"Object Insurance Policy","Object Insurance Policy Form Id":"Form Id","Object Insurance Policy Form Owner Id":"Form Owner Id","Object Insurance Policy Form Submission Id":"Form Submission Id","Object Insurance Policy Form Submission Owner Id":"Form Submission Owner Id","Object Insurance Policy Number":"Number","Object Insurance Policy Product Type":"Product Type","Object Insurance Policy Property Type":"Property Type","Object Insurance Policy Renewal":"Renewal","Object Insurance Policy Renewal Date":"Renewal Date","Object Insurance Policy Status":"Status","Object Insurance Policy Type":"Type","Object Lawful Basis":"Object Lawful Basis","Object Lawful Basis Description":"Description","Object Lawful Basis Id":"Id","Object MoU":"Object MoU","Object MoU Description":"Description","Object MoU Form Id":"Form Id","Object MoU Form Owner Id":"Form Owner Id","Object MoU Form Submission Id":"Form Submission Id","Object MoU Form Submission Owner Id":"Form Submission Owner Id","Object MoU Id":"Id","Object MoU Link":"Link","Object MoU Status":"Status","Object Notification Templates":"Object Notification Templates","Object Notification Templates Id":"Id","Object Notification Templates Label":"Label","Object Notification Templates Text":"Text","Object Notification Templates Types":"Types","Object Notification Templates URL":"URL","Object Phone Number":"Object Phone Number","Object Phone Number Last 7 Digits":"Last 7 Digits","Object Phone Number Numbers Only":"Numbers Only","Object Phone Number Raw":"Raw","Object Phone Number Type":"Type","Object Privacy Impact Assessment":"Object Privacy Impact Assessment","Object Privacy Impact Assessment Compliance Check Passed":"Compliance Check Passed","Object Privacy Impact Assessment Delivery Date":"Delivery Date","Object Privacy Impact Assessment Description":"Description","Object Privacy Impact Assessment Form Id":"Form Id","Object Privacy Impact Assessment Form Owner Id":"Form Owner Id","Object Privacy Impact Assessment Form Submission Id":"Form Submission Id","Object Privacy Impact Assessment Form Submission Owner Id":"Form Submission Owner Id","Object Privacy Impact Assessment Intrusion On Privacy":"Intrusion On Privacy","Object Privacy Impact Assessment Risk Of Reputational Damage":"Risk Of Reputational Damage","Object Privacy Impact Assessment Risk To Corporation":"Risk To Corporation","Object Privacy Impact Assessment Risk To Individuals":"Risk To Individuals","Object Privacy Impact Assessment Start Date":"Start Date","Object Privacy Notice":"Object Privacy Notice","Object Privacy Notice Delivery Date":"Delivery Date","Object Privacy Notice Description":"Description","Object Privacy Notice Effect On Individuals":"Effect On Individuals","Object Privacy Notice Expiry Date":"Expiry Date","Object Privacy Notice Form Id":"Form Id","Object Privacy Notice Form Owner Id":"Form Owner Id","Object Privacy Notice Form Submission Id":"Form Submission Id","Object Privacy Notice Form Submission Owner Id":"Form Submission Owner Id","Object Privacy Notice How Is It Collected":"How Is It Collected","Object Privacy Notice How Will It Be Used":"How Will It Be Used","Object Privacy Notice Id":"Id","Object Privacy Notice Info Collected":"Info Collected","Object Privacy Notice Likely To Complain":"Likely To Complain","Object Privacy Notice Metadata Create Date":"Metadata Create Date","Object Privacy Notice Metadata Update Date":"Metadata Update Date","Object Privacy Notice Text":"Text","Object Privacy Notice URL":"URL","Object Privacy Notice Who Is Collecting":"Who Is Collecting","Object Privacy Notice Who Will It Be Shared":"Who Will It Be Shared","Object Privacy Notice Why Is It Collected":"Why Is It Collected",Operation:uE,"Outlook PST Files ":"Outlook PST Files ","PDF Form Files ":"PDF Form Files ","Person Employee":"Person Employee","Person Employee Date Of Birth":"Date Of Birth","Person Employee Ethnicity":"Ethnicity","Person Employee Full Name":"Full Name","Person Employee Gender":"Gender","Person Employee Height":"Height","Person Employee ID":"ID","Person Employee Is GDPR Role":"Is GDPR Role","Person Employee Last Name":"Last Name","Person Employee Marital Status":"Marital Status","Person Employee Name Qualifier":"Name Qualifier","Person Employee Nationality":"Nationality","Person Employee Place Of Birth":"Place Of Birth","Person Employee Religion":"Religion","Person Employee Role":"Role","Person Employee Title":"Title","Person Identity":"Person Identity","Person Identity Date Of Birth":"Date Of Birth","Person Identity Ethnicity":"Ethnicity","Person Identity Full Name":"Full Name","Person Identity Full Name fuzzy":"Full Name fuzzy","Person Identity Gender":"Gender","Person Identity Height":"Height","Person Identity ID":"ID","Person Identity Last Name":"Last Name","Person Identity Marital Status":"Marital Status","Person Identity Name Qualifier":"Name Qualifier","Person Identity Nationality":"Nationality","Person Identity Place Of Birth":"Place Of Birth","Person Identity Religion":"Religion","Person Identity Title":"Title","Person Natural":"Person Natural","Person Natural Customer ID":"Customer ID","Person Natural Date Of Birth":"Date Of Birth","Person Natural Ethnicity":"Ethnicity","Person Natural Full Name":"Full Name","Person Natural Full Name fuzzy":"Full Name fuzzy","Person Natural Gender":"Gender","Person Natural Height":"Height","Person Natural Last Name":"Last Name","Person Natural Marital Status":"Marital Status","Person Natural Name Qualifier":"Name Qualifier","Person Natural Nationality":"Nationality","Person Natural Place Of Birth":"Place Of Birth","Person Natural Religion":"Religion","Person Natural Title":"Title","Person Organisation":"Person Organisation","Person Organisation Department":"Department","Person Organisation Email":"Email","Person Organisation Fax":"Fax","Person Organisation Form Id":"Form Id","Person Organisation Form Owner Id":"Form Owner Id","Person Organisation Form Submission Id":"Form Submission Id","Person Organisation Form Submission Owner Id":"Form Submission Owner Id","Person Organisation Name":"Name","Person Organisation orgCountrySet":"orgCountrySet","Person Organisation Phone":"Phone","Person Organisation Registration Number":"Registration Number","Person Organisation Sector":"Sector","Person Organisation Short Name":"Short Name","Person Organisation Tax Id":"Tax Id","Person Organisation Type":"Type","Person Organisation URL":"URL",Property:lE,"Send Query":"Send Query","Structured Data Insertion":"Structured Data Insertion",Type:cE," unmatched":" unmatched","Unstructured Data Insertion":"Unstructured Data Insertion","Uses Email":"Uses Email",Value:dE,"Address Field":"Address Field",Advanced:fE,Age:pE,"Basic Components":"Basic Components",Button:mE,Checkbox:hE,Columns:gE,"Consent Status":"Consent Status",Container:vE,Content:yE,Copy:PE,Currency:SE,Custom:OE,Data:bE,"Data Grid":"Data Grid","Data Map":"Data Map","Data Type":"Data Type",Date:"Date","Date / Time":"Date / Time",Day:EE,"Delete Link":"Delete Link","Delete Mechanism":"Delete Mechanism","Delivery Date":"Delivery Date",Description:DE,"Drag and Drop a form component":"Drag and Drop a form component",Edit:wE,"Edit Grid":"Edit Grid","Edit JSON":"Edit JSON",Email:CE,"Expiry Date":"Expiry Date","Field Set":"Field Set",File:NE,"Full Name":"Full Name",Gender:IE,Hidden:_E,"HTML Element":"HTML Element",Id:RE,ID:jE,Impact:TE,Label:AE,Layout:LE,Link:xE,Location:kE,"Modal Edit":"Modal Edit",Nationality:ME,"Nested Form":"Nested Form",Number:"Number",Panel:FE,Password:VE,"Paste below":"Paste below","Person Age":"Person Age","Phone Number":"Phone Number",Radio:UE,reCAPTCHA:BE,Remove:$E,Resource:WE,"Select Boxes":"Select Boxes",Select:zE,Signature:qE,"Start Date":"Start Date",Status:HE,Submit:GE,Survey:KE,Table:QE,Tabs:YE,Tags:JE,"Text Area":"Text Area","Text Field":"Text Field",Time:XE,Tipo:ZE,Types:eD,"Update Date":"Update Date","Update Link":"Update Link","Update Mechanism":"Update Mechanism",Url:tD,Well:nD,"Checks Passed":"Checks Passed",Countries:rD,"Intrusion on Privacy":"Intrusion on Privacy","Long Name":"Long Name","Reputational Damage":"Reputational Damage","Risk To Business":"Risk To Business","Risk To Individuals":"Risk To Individuals",Role:oD,"Short Name":"Short Name",Title:aD,"Awareness Campaigns":"Awareness Campaigns",Employees:iD,Charts:sD,NavPanelAwarenessPopup_title:uD,NavPanelAwarenessPopup_text:lD,NavPanelAwarenessPopup_query:cD,"Children Ages":"Children Ages","Children Data Graph":"Children Data Graph",NavPanelChildrenPopup_title:dD,NavPanelChildrenPopup_text:fD,NavPanelChildrenPopup_query:pD,"Main Score":"Main Score","Privacy Notices":"Privacy Notices","Consent Events":"Consent Events","Consent Chart (Privacy Notice)":"Consent Chart (Privacy Notice)","Data Graph":"Data Graph","Data Types":"Data Types","Unmatched Records":"Unmatched Records","Ingestion Events":"Ingestion Events",NavPanelInformationYouHold_personGrid:mD,NavPanelInformationYouHoldPopup_text:hD,NavPanelInformationYouHoldPopup_title:gD,NavPanelInformationYouHoldPopup_query:vD,App_title:yD,App_message:PD,"Object Contract":"Object Contract","Object Sensitive Data":"Object Sensitive Data","Object Sensitive Data Club Membership":"Club Membership","Object Sensitive Data Church Membership":"Church Membership","Object Sensitive Data Political View":"Political View","Object Sensitive Data Union Membership":"Union Membership","Object Sensitive Data Sexual Orientation":"Sexual Orientation","Object Sensitive Data Ethnicity":"Ethnicity","Object Sensitive Data Religion":"Religion","Object Health":"Object Health","Object Health Organ Donor":"Organ Donor","Object Health Alergies":"Allergies","Object Health Blood Type":"Blood Type","Object Health Diseases":"Diseases","Object Biometric":"Object Biometric","Object Biometric Retinal scans":"Retinal Scans","Object Biometric Eye Colour":"Eye Colour","Object Biometric Facial Picture":"Facial Picture","Object Biometric Height cm":"Height cm","Object Biometric Weight kg":"Weight kg","Object Biometric Fingerprints":"Fingerprints","Object Genetic":"Object Genetic","Object Genetic RNA":"RNA","Object Genetic Family Medical History":"Family Medical History","Object Genetic DNA":"DNA",grid_filterOoo:SD,grid_andCondition:OD,grid_orCondition:bD,grid_clearFilter:ED,grid_applyFilter:DD,grid_contains:wD,grid_notContains:CD,grid_equals:ND,grid_notEqual:ID,grid_startsWith:_D,grid_endsWith:RD,grid_page:jD,grid_to:TD,grid_of:AD,grid_first:LD,grid_previous:xD,grid_next:kD,grid_last:MD,grid_more:FD,NavPanelConsentPopup_text:VD,NavPanelConsentPopup_title:UD,NavPanelConsentPopup_query:BD,"World Map":"World Map",NavPanelInternationalPopup_text:$D,NavPanelInternationalPopup_title:WD,NavPanelInternationalPopup_query:zD,NavPanelLawfulBasisPopup_query:qD,NavPanelLawfulBasisPopup_title:HD,NavPanelLawfulBasisPopup_text:GD,NavPanelPrivacyImpactAssessmentPopup_title:KD,NavPanelPrivacyImpactAssessmentPopup_text:QD,NavPanelPrivacyImpactAssessmentPopup_query:YD,NavPanelPrivacyNoticesPopup_title:JD,NavPanelPrivacyNoticesPopup_text:XD,NavPanelPrivacyNoticesPopup_query:ZD,NavPanelSubjectAccessRequestPopup_title:ew,NavPanelSubjectAccessRequestPopup_query:tw,NavPanelSubjectAccessRequestPopup_text:nw,"Date Of Birth":"Date Of Birth","Compliance Scores":"Compliance Scores",NavPanelIndividualsRightsPopup_title:rw,NavPanelIndividualsRightsPopup_query:ow,NavPanelIndividualsRightsPopup_text:aw,NavPanelDataBreachPopup_title:iw,NavPanelDataBreachPopup_query:sw,NavPanelDataBreachPopup_text:uw,NavPanelDataProtnOfficerPopup_title:lw,NavPanelDataProtnOfficerPopup_query:cw,NavPanelDataProtnOfficerPopup_text:dw,"SAR Type":"SAR Type","Request Date":"Request Date","SAR Status":"SAR Status","Request Status":"Request Status","Request Types":"Request Types","Detailed Scores":"Detailed Scores",Details:fw,Preview:pw,Save:mw,"Chidren's ages":"Chidren's ages","Info Collected":"Info Collected","Who is Collecting":"Who is Collecting","How is it Collected":"How is it Collected","Why is it Collected":"Why is it Collected","How will it be Used":"How will it be Used","Who will it be Shared":"Who will it be Shared","Effect on Individuals":"Effect on Individuals","Likely to Complain":"Likely to Complain","Link to Campaign":"Link to Campaign","Stop Date":"Expiry Date",Passed:hw,"Link Sent":"Link Sent","Reminder Sent":"Reminder Sent","Second  Reminder":"Second Reminder","Compliance Notices":"Compliance Notices","Compliance Notices Grid":"Compliance Notices Grid","Metadata Type Object Privacy Notice":"Data Type",Text:gw,"Data Breach Graph":"Data Breach Graph","Infrastructure Graph":"Infrastructure Graph","Metadata Type Object AWS VPC":"VPC",Ethnicity:vw,Religion:yw,"Political View":"Political View","Union Membership":"Union Membership","Church Membership":"Church Membership","Sensitive Data":"Sensitive Data","Metadata Type Event Subject Access Request":"Data Type",Name:Pw,"Match Weight":"Match Weight","Exclude From Search":"Exclude From Search","Reports To":"Reports To","Metadata Type Person Employee":"Data Type","Assigned SAR Request":"Assigned SAR Request","Event Training Person":"was trained","Metadata Type Event Training":"Data Type","Metadata Type Object AWS Security Group":"Data Type",Legislation:Sw,Awareness:Ow,Children:bw,"Data Breaches":"Data Breaches","Data Protection Officer":"Data Protection Officer","Indiv Rights":"Indiv Rights","Info you hold":"Info you hold",International:Ew,"Lawful Basis":"Lawful Basis","Privacy Impact Assessment":"Privacy Impact Assessment","Subject Access Requests":"Subject Access Requests","Total Score":"Total Score","GDPR Scores":"GDPR Scores","POLE Counts":"POLE Counts","Has Table":"Has Table","Has Column":"Has Column","Has Semantic":"Has Semantic","Object Metadata Source Name":"Name","Object Metadata Source Create Date":"Create Date","Object Metadata Source Update Date":"Update Date","Metadata Source Type":"Metadata Source Type","Metadata Type Object Metadata Source":"Metadata Source","Object Metadata Source Description":"Description","Object Metadata Source":"Metadata Source","Object Metadata Source Domain":"Domain","Object Metadata Source Domain Frequency":"Domain Frequency","Unstructured Data PII":"Unstructured Data PII","Structured Data PII":"Structured Data PII","DB Tables":"DB Tables","DB Columns":"DB Columns","Unstructured Data Sources":"Unstructured Data Sources","Mixed Data Sources":"Mixed Data Sources","Email PST":"Email PST","PDF Forms":"PDF Forms","Sensitive Data Spreadsheet 2":"Sensitive Data Spreadsheet 2","CRM System CSV":"CRM System CSV","Marketing System XLSX":"Marketing System XLSX",Read:Dw,Denied:ww,"Data Controller":"Data Controller","Last 5 days":"Last 5 days",Delete:Cw,Update:Nw,Completed:Iw,"Data Owner":"Data Owner","Object Data Procedures Why Is It Collected":"Why Is the Data Collected","Object Data Procedures Info Collected":"Info Collected","Object Data Procedures Country Where Stored":"Country Where Data is Stored","Object Data Procedures Description":"Description","Object Data Procedures Number Of Records Monthly":"Number of Monthly Records","Object Data Procedures Type Of Natural Person":"Types Of Natural Person","Object Application Start Date":"Start Date","Object Application Name":"Name","Object Application Form Submission Id":"Form Submission Id","Object Application Form Id":"Form Id","Object Application Form Submission Owner Id":"Form Submission Owner Id","Object Application Form Owner Id":"Form Owner Id","Object Application Description":"Description","Object Application URL":"URL","Object Application Stop Date":"Stop Date",Neighbour:_w,Display:Rw,"Self Namespace":"Self Namespace","Base URL":"Base URL","Is Neighbour":"Is Neighbour","Object Application":"Application","Object Data Source Engine":"Data Source Engine","Object Data Source Business Rules":"Business Rules","Object Data Source Domain Frequency":"Domain Frequency","Object Data Source Type":"Type","Object Data Source Domain":"Domain","Object Data Source Retention Policy":"Retention Policy","Object Data Policy Type":"Policy Type","Object Data Policy Retention Period":"Retention Period","Object Lawful Basis Short Description":"Short Description",Filter:jw,"Custom Filter":"Custom Filter","Person Natural Type":"Type","Location Address Type":"Type","Event Transaction":"Event Transaction","Event Transaction Description":"Description","Event Transaction Currency":"Currency","Event Transaction Type":"Type","Event Transaction Date":"Date","Event Transaction Status":"Status"},Aw={en:{translation:Tw},ptBr:{translation:Jb}};ge.use(r1).init({resources:Aw,lng:"en",interpolation:{escapeValue:!1}});hs.createRoot(document.getElementById("root")).render(H(Nu.StrictMode,{children:H(oy,{children:H(zy,{store:Ou,children:H(pP,{})})})}));
