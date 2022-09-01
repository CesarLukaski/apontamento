const Xe=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const a of l)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function t(l){const a={};return l.integrity&&(a.integrity=l.integrity),l.referrerpolicy&&(a.referrerPolicy=l.referrerpolicy),l.crossorigin==="use-credentials"?a.credentials="include":l.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(l){if(l.ep)return;l.ep=!0;const a=t(l);fetch(l.href,a)}};Xe();function y(){}function Be(n,e){for(const t in e)n[t]=e[t];return n}function Ke(n){return n&&typeof n=="object"&&typeof n.then=="function"}function He(n){return n()}function Me(){return Object.create(null)}function K(n){n.forEach(He)}function Ue(n){return typeof n=="function"}function j(n,e){return n!=n?e==e:n!==e||n&&typeof n=="object"||typeof n=="function"}let ae;function Ce(n,e){return ae||(ae=document.createElement("a")),ae.href=e,n===ae.href}function Ve(n){return Object.keys(n).length===0}function et(n,...e){if(n==null)return y;const t=n.subscribe(...e);return t.unsubscribe?()=>t.unsubscribe():t}function c(n,e){n.appendChild(e)}function C(n,e,t){n.insertBefore(e,t||null)}function M(n){n.parentNode.removeChild(n)}function _(n){return document.createElement(n)}function S(n){return document.createTextNode(n)}function v(){return S(" ")}function Oe(){return S("")}function G(n,e,t,s){return n.addEventListener(e,t,s),()=>n.removeEventListener(e,t,s)}function u(n,e,t){t==null?n.removeAttribute(e):n.getAttribute(e)!==t&&n.setAttribute(e,t)}function tt(n){return Array.from(n.childNodes)}function q(n,e){e=""+e,n.wholeText!==e&&(n.data=e)}function Ae(n,e){n.value=e==null?"":e}function fe(n,e,t,s){t===null?n.style.removeProperty(e):n.style.setProperty(e,t,s?"important":"")}function nt(n,e,{bubbles:t=!1,cancelable:s=!1}={}){const l=document.createEvent("CustomEvent");return l.initCustomEvent(n,t,s,e),l}let ie;function X(n){ie=n}function me(){if(!ie)throw new Error("Function called outside component initialization");return ie}function lt(n){me().$$.after_update.push(n)}function st(n){me().$$.on_destroy.push(n)}function it(){const n=me();return(e,t,{cancelable:s=!1}={})=>{const l=n.$$.callbacks[e];if(l){const a=nt(e,t,{cancelable:s});return l.slice().forEach(d=>{d.call(n,a)}),!a.defaultPrevented}return!0}}function Se(n,e){const t=n.$$.callbacks[e.type];t&&t.slice().forEach(s=>s.call(this,e))}const se=[],Re=[],ue=[],De=[],ze=Promise.resolve();let pe=!1;function qe(){pe||(pe=!0,ze.then(we))}function rt(){return qe(),ze}function ye(n){ue.push(n)}const ve=new Set;let ce=0;function we(){const n=ie;do{for(;ce<se.length;){const e=se[ce];ce++,X(e),ot(e.$$)}for(X(null),se.length=0,ce=0;Re.length;)Re.pop()();for(let e=0;e<ue.length;e+=1){const t=ue[e];ve.has(t)||(ve.add(t),t())}ue.length=0}while(se.length);for(;De.length;)De.pop()();pe=!1,ve.clear(),X(n)}function ot(n){if(n.fragment!==null){n.update(),K(n.before_update);const e=n.dirty;n.dirty=[-1],n.fragment&&n.fragment.p(n.ctx,e),n.after_update.forEach(ye)}}const de=new Set;let ee;function _e(){ee={r:0,c:[],p:ee}}function he(){ee.r||K(ee.c),ee=ee.p}function T(n,e){n&&n.i&&(de.delete(n),n.i(e))}function $(n,e,t,s){if(n&&n.o){if(de.has(n))return;de.add(n),ee.c.push(()=>{de.delete(n),s&&(t&&n.d(1),s())}),n.o(e)}else s&&s()}function re(n,e){const t=e.token={};function s(l,a,d,i){if(e.token!==t)return;e.resolved=i;let r=e.ctx;d!==void 0&&(r=r.slice(),r[d]=i);const o=l&&(e.current=l)(r);let m=!1;e.block&&(e.blocks?e.blocks.forEach((f,h)=>{h!==a&&f&&(_e(),$(f,1,1,()=>{e.blocks[h]===f&&(e.blocks[h]=null)}),he())}):e.block.d(1),o.c(),T(o,1),o.m(e.mount(),e.anchor),m=!0),e.block=o,e.blocks&&(e.blocks[a]=o),m&&we()}if(Ke(n)){const l=me();if(n.then(a=>{X(l),s(e.then,1,e.value,a),X(null)},a=>{if(X(l),s(e.catch,2,e.error,a),X(null),!e.hasCatch)throw a}),e.current!==e.pending)return s(e.pending,0),!0}else{if(e.current!==e.then)return s(e.then,1,e.value,n),!0;e.resolved=n}}function oe(n,e,t){const s=e.slice(),{resolved:l}=n;n.current===n.then&&(s[n.value]=l),n.current===n.catch&&(s[n.error]=l),n.block.p(s,t)}function Ge(n,e){const t={},s={},l={$$scope:1};let a=n.length;for(;a--;){const d=n[a],i=e[a];if(i){for(const r in d)r in i||(s[r]=1);for(const r in i)l[r]||(t[r]=i[r],l[r]=1);n[a]=i}else for(const r in d)l[r]=1}for(const d in s)d in t||(t[d]=void 0);return t}function Qe(n){return typeof n=="object"&&n!==null?n:{}}function L(n){n&&n.c()}function N(n,e,t,s){const{fragment:l,on_mount:a,on_destroy:d,after_update:i}=n.$$;l&&l.m(e,t),s||ye(()=>{const r=a.map(He).filter(Ue);d?d.push(...r):K(r),n.$$.on_mount=[]}),i.forEach(ye)}function F(n,e){const t=n.$$;t.fragment!==null&&(K(t.on_destroy),t.fragment&&t.fragment.d(e),t.on_destroy=t.fragment=null,t.ctx=[])}function at(n,e){n.$$.dirty[0]===-1&&(se.push(n),qe(),n.$$.dirty.fill(0)),n.$$.dirty[e/31|0]|=1<<e%31}function x(n,e,t,s,l,a,d,i=[-1]){const r=ie;X(n);const o=n.$$={fragment:null,ctx:null,props:a,update:y,not_equal:l,bound:Me(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(r?r.$$.context:[])),callbacks:Me(),dirty:i,skip_bound:!1,root:e.target||r.$$.root};d&&d(o.root);let m=!1;if(o.ctx=t?t(n,e.props||{},(f,h,...b)=>{const I=b.length?b[0]:h;return o.ctx&&l(o.ctx[f],o.ctx[f]=I)&&(!o.skip_bound&&o.bound[f]&&o.bound[f](I),m&&at(n,f)),h}):[],o.update(),m=!0,K(o.before_update),o.fragment=s?s(o.ctx):!1,e.target){if(e.hydrate){const f=tt(e.target);o.fragment&&o.fragment.l(f),f.forEach(M)}else o.fragment&&o.fragment.c();e.intro&&T(n.$$.fragment),N(n,e.target,e.anchor,e.customElement),we()}X(r)}class B{$destroy(){F(this,1),this.$destroy=y}$on(e,t){const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(t),()=>{const l=s.indexOf(t);l!==-1&&s.splice(l,1)}}$set(e){this.$$set&&!Ve(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function ct(n){let e;return{c(){e=_("main"),e.innerHTML='<img src="/images/LogoCIM.png" alt="" class="svelte-s1bw8i"/>',u(e,"class","svelte-s1bw8i")},m(t,s){C(t,e,s)},p:y,i:y,o:y,d(t){t&&M(e)}}}class ut extends B{constructor(e){super(),x(this,e,null,ct,j,{})}}function dt(n){let e;return{c(){e=_("nav"),e.innerHTML=`<ol class="breadcrumb svelte-1y1a3ro"><li class="breadcrumb-item"><a href="/#/ferramenta">Ferramentas</a></li> 
    <li class="breadcrumb-item"><a href="/#/codigobarras/apontamento">Apontamento</a></li></ol>`,u(e,"aria-label","breadcrumb")},m(t,s){C(t,e,s)},p:y,i:y,o:y,d(t){t&&M(e)}}}class le extends B{constructor(e){super(),x(this,e,null,dt,j,{})}}function ft(n){return{c:y,m:y,p:y,d:y}}function mt(n){let e,t,s,l=n[8][0].DT_INICIO_OP.slice(6,8)+"",a,d,i=n[8][0].DT_INICIO_OP.slice(4,6)+"",r,o,m=n[8][0].DT_INICIO_OP.slice(0,4)+"",f,h,b=(n[8][0].HORA_INICIO=n[8][0].HORA_INICIO===null?"SEM DADOS":n[8][0].HORA_INICIO)+"",I,A,k,E,D,P=n[8][0].DT_FIM_OP.slice(6,8)+"",p,w,O=n[8][0].DT_FIM_OP.slice(4,6)+"",g,R,H=n[8][0].DT_FIM_OP.slice(0,4)+"",W,Y,V=(n[8][0].HORA_FIM=n[8][0].HORA_FIM===null?"SEM DADOS":n[8][0].HORA_FIM)+"",Z;return{c(){e=_("div"),t=_("div"),t.textContent="INICIO:",s=v(),a=S(l),d=S(` /\r
      `),r=S(i),o=S(` /\r
      `),f=S(m),h=S(`\r
      - `),I=S(b),A=v(),k=_("div"),E=_("div"),E.textContent="FINAL:",D=v(),p=S(P),w=S(` /\r
      `),g=S(O),R=S(` /\r
      `),W=S(H),Y=S(` -\r
      `),Z=S(V),u(t,"class","title svelte-wocr6h"),u(e,"class","div1 svelte-wocr6h"),u(E,"class","title svelte-wocr6h"),u(k,"class","div2 svelte-wocr6h")},m(U,J){C(U,e,J),c(e,t),c(e,s),c(e,a),c(e,d),c(e,r),c(e,o),c(e,f),c(e,h),c(e,I),C(U,A,J),C(U,k,J),c(k,E),c(k,D),c(k,p),c(k,w),c(k,g),c(k,R),c(k,W),c(k,Y),c(k,Z)},p:y,d(U){U&&M(e),U&&M(A),U&&M(k)}}}function _t(n){let e;return{c(){e=_("div"),e.textContent="...",u(e,"class","svelte-wocr6h")},m(t,s){C(t,e,s)},p:y,d(t){t&&M(e)}}}function ht(n){let e,t={ctx:n,current:null,token:null,hasCatch:!1,pending:_t,then:mt,catch:ft,value:8};return re(n[0],t),{c(){e=_("main"),t.block.c(),u(e,"class","main svelte-wocr6h")},m(s,l){C(s,e,l),t.block.m(e,t.anchor=null),t.mount=()=>e,t.anchor=null},p(s,[l]){n=s,oe(t,n,l)},i:y,o:y,d(s){s&&M(e),t.block.d(),t.token=null,t=null}}}function gt(n){var e=localStorage.getItem("barcodeData");let t=Number(e.slice(10)),s=e.slice(0,5),l=e.slice(5,10);new Headers;let a=`/api/v1/apontamento?NUMERO_ODF=${t}&CODIGO_MAQUINA=${l}&NUMERO_OPERACAO=${s}`,d=i();async function i(){return await(await fetch(a)).json()}return[d]}class bt extends B{constructor(e){super(),x(this,e,gt,ht,j,{})}}function vt(n){return{c:y,m:y,p:y,d:y}}function pt(n){let e,t,s,l,a,d,i,r,o=n[8][0].CODIGO_PECA+"",m,f,h,b,I,A=n[8][0].CODIGO_CLIENTE+"",k,E,D,P,p,w,O,g,R,H,W,Y,V,Z=n[8][0].QTDE_ODF[0]+"",U;return{c(){e=_("div"),t=_("div"),t.textContent="ODF:",s=v(),l=_("div"),l.textContent=`${n[0]}`,a=v(),d=_("div"),d.textContent="C\xF3d. Interno:",i=v(),r=_("div"),m=S(o),f=v(),h=_("div"),h.textContent="C\xF3d. do Cliente:",b=v(),I=_("div"),k=S(A),E=v(),D=_("div"),D.textContent="Operador:",P=v(),p=_("div"),p.textContent=`${n[3].FUNCIONARIO}`,w=v(),O=_("div"),O.textContent="OP:",g=v(),R=_("div"),H=S(n[1]),W=S(" - "),Y=S(n[2]),V=S(" - "),U=S(Z),u(t,"class","odf svelte-1428mlt"),u(l,"class","bold svelte-1428mlt"),u(d,"class","odf svelte-1428mlt"),u(r,"class","bold svelte-1428mlt"),u(h,"class","odf svelte-1428mlt"),u(I,"class","bold svelte-1428mlt"),u(D,"class","odf svelte-1428mlt"),u(p,"class","bold svelte-1428mlt"),u(O,"class","odf svelte-1428mlt"),u(R,"class","bold svelte-1428mlt"),u(e,"class","areaCodigos svelte-1428mlt")},m(J,te){C(J,e,te),c(e,t),c(e,s),c(e,l),c(e,a),c(e,d),c(e,i),c(e,r),c(r,m),c(e,f),c(e,h),c(e,b),c(e,I),c(I,k),c(e,E),c(e,D),c(e,P),c(e,p),c(e,w),c(e,O),c(e,g),c(e,R),c(R,H),c(R,W),c(R,Y),c(R,V),c(R,U)},p:y,d(J){J&&M(e)}}}function yt(n){let e;return{c(){e=_("div"),e.textContent="..."},m(t,s){C(t,e,s)},p:y,d(t){t&&M(e)}}}function Ot(n){let e,t={ctx:n,current:null,token:null,hasCatch:!1,pending:yt,then:pt,catch:vt,value:8};return re(n[4],t),{c(){e=_("main"),t.block.c()},m(s,l){C(s,e,l),t.block.m(e,t.anchor=null),t.mount=()=>e,t.anchor=null},p(s,[l]){n=s,oe(t,n,l)},i:y,o:y,d(s){s&&M(e),t.block.d(),t.token=null,t=null}}}function wt(n){const e=localStorage.getItem("barcodeData");let t=Number(e.slice(10)),s=e.slice(0,5),l=e.slice(5,10),a=document.cookie.split(";").map(o=>o.split("=")).reduce((o,[m,f])=>({...o,[m.trim()]:decodeURIComponent(f)}),{});console.log(a);let d=`/api/v1/apontamento?NUMERO_ODF=${t}&CODIGO_MAQUINA=${l}&NUMERO_OPERACAO=${s}`;async function i(){const m=await(await fetch(d)).json();return console.log(m),m}let r=i();return[t,s,l,a,r]}class It extends B{constructor(e){super(),x(this,e,wt,Ot,j,{})}}function kt(n){let e,t,s,l,a,d,i,r,o,m,f,h,b,I,A,k,E,D,P;return{c(){e=_("main"),t=_("ul"),t.innerHTML=`<li>Faltante</li> 
        <li>Retrabalhar</li> 
        <li>Inspe\xE7\xE3o</li> 
        <li>Historico</li> 
        <li>Parada</li> 
        <li>Desenho</li>`,s=v(),l=_("div"),a=_("button"),a.textContent="Faltante",d=v(),i=_("button"),i.textContent="Retrabalhar",r=v(),o=_("a"),o.innerHTML='<button type="button" class="btn btn-primary">Inspe\xE7\xE3o</button>',m=v(),f=_("a"),f.innerHTML='<button type="button" class="btn btn-primary">Historico</button>',h=v(),b=_("button"),b.textContent="Parada",I=v(),A=_("a"),A.innerHTML='<button type="button" class="btn btn-primary">Desenho</button>',k=v(),E=_("div"),E.innerHTML=`<div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLongTitle">Motivo da Parada</h5></div> 
                    <div class="modal-body"><li>DOR DE BARRIGA</li> 
                        <li>DIARREIA</li> 
                        <li>CAGANEIRA</li> 
                        <li>SOLTA UM BARRO</li> 
                        <li>HEMORROIDA ATACADA</li> 
                        <li>FEIJOADA DEMAIS</li></div> 
                    <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button></div></div></div>`,u(t,"class","nav2 svelte-1gb7i5i"),u(a,"type","button"),u(a,"class","btn btn-primary"),u(a,"id","missingFeed"),u(a,"name","missing"),u(i,"type","button"),u(i,"class","btn btn-primary"),u(i,"id","reworkFeed"),u(i,"name","rework"),u(o,"href","/#/rip/"),u(f,"href","/#/historico/"),u(b,"type","button"),u(b,"class","btn btn-primary"),u(b,"data-bs-toggle","modal"),u(b,"data-bs-target","#exampleModalCenter"),u(A,"href","/#/desenho/"),u(E,"class","modal fade"),u(E,"id","exampleModalCenter"),u(E,"tabindex","-1"),u(E,"role","dialog"),u(E,"aria-labelledby","exampleModalCenterTitle"),u(E,"aria-hidden","true"),u(l,"class","nav svelte-1gb7i5i")},m(p,w){C(p,e,w),c(e,t),c(e,s),c(e,l),c(l,a),c(l,d),c(l,i),c(l,r),c(l,o),c(l,m),c(l,f),c(l,h),c(l,b),c(l,I),c(l,A),c(l,k),c(l,E),D||(P=[G(a,"click",n[0]),G(i,"click",n[1])],D=!0)},p:y,i:y,o:y,d(p){p&&M(e),D=!1,K(P)}}}function Et(n){return[()=>{document.getElementById("faltante").style.display="block",document.getElementById("retrabalhar").style.display="none",document.getElementById("some").style.display="none",document.getElementById("badFeed").style.display="none"},()=>{document.getElementById("faltante").style.display="none",document.getElementById("retrabalhar").style.display="block",document.getElementById("some").style.display="none",document.getElementById("badFeed").style.display="none"}]}class Mt extends B{constructor(e){super(),x(this,e,Et,kt,j,{})}}function Ct(n){return{c:y,m:y,p:y,d:y}}function At(n){let e,t,s,l=n[13][0].QTDE_ODF[0]+"",a,d,i,r,o,m,f,h,b,I,A,k,E;return{c(){e=_("form"),t=_("div"),s=S("Produzir "),a=S(l),d=v(),i=_("div"),i.innerHTML=`Boas
                <input class="input svelte-zpjh8q" id="goodFeed" name="goodFeed"/>`,r=v(),o=_("div"),o.innerHTML=`Ruins
                <input class="input svelte-zpjh8q" id="badFeed" name="badFeed"/>`,m=v(),f=_("div"),f.innerHTML=`Retrabalhar
                <input class="input svelte-zpjh8q" type="text" id="reworkFeed" name="reworkFeed"/>`,h=v(),b=_("div"),b.innerHTML=`Faltante
                <input class="input svelte-zpjh8q" type="text" id="missingFeed" name="missingFeed"/>`,I=v(),A=_("button"),A.textContent="Apontar",u(t,"class","write svelte-zpjh8q"),u(i,"class","write svelte-zpjh8q"),u(i,"id","goodFeed"),u(o,"class","write svelte-zpjh8q"),u(o,"id","some"),u(o,"name","some"),u(f,"class","write svelte-zpjh8q"),u(f,"id","retrabalhar"),u(b,"class","write svelte-zpjh8q"),u(b,"id","faltante"),u(A,"id","button"),u(A,"type","submit"),u(A,"class","btn btn-primary"),u(e,"action","/api/v1/apontar"),u(e,"method","POST"),u(e,"class","svelte-zpjh8q")},m(D,P){C(D,e,P),c(e,t),c(t,s),c(t,a),c(e,d),c(e,i),c(e,r),c(e,o),c(e,m),c(e,f),c(e,h),c(e,b),c(e,I),c(e,A),k||(E=G(A,"click",n[0]),k=!0)},p:y,d(D){D&&M(e),k=!1,E()}}}function St(n){let e;return{c(){e=_("div"),e.textContent="...",u(e,"class","svelte-zpjh8q")},m(t,s){C(t,e,s)},p:y,d(t){t&&M(e)}}}function Rt(n){let e,t={ctx:n,current:null,token:null,hasCatch:!1,pending:St,then:At,catch:Ct,value:13};return re(n[1],t),{c(){e=_("main"),t.block.c(),u(e,"id","main"),u(e,"class","align-self-center svelte-zpjh8q")},m(s,l){C(s,e,l),t.block.m(e,t.anchor=null),t.mount=()=>e,t.anchor=null},p(s,[l]){n=s,oe(t,n,l)},i:y,o:y,d(s){s&&M(e),t.block.d(),t.token=null,t=null}}}function Dt(n){const e=localStorage.getItem("barcodeData");let t=Number(e.slice(10)),s=e.slice(0,5),l=e.slice(5,10),a,d,i,r;new Headers().append("Content-Type","application/json");let m=`/api/v1/apontamento?NUMERO_ODF=${t}&CODIGO_MAQUINA=${l}&NUMERO_OPERACAO=${s}`;async function f(){return await(await fetch(m)).json()}const h=async()=>{const I=new Headers;fetch("/api/v1/apontar",{method:"POST",body:JSON.stringify({goodFeed:a,badFeed:d,reworkFeed:r,missingFeed:i}),headers:I})};let b=f();return[h,b]}class Tt extends B{constructor(e){super(),x(this,e,Dt,Rt,j,{})}}function Pt(n){return{c:y,m:y,p:y,d:y}}function $t(n){let e,t,s,l,a,d,i=n[0]<=50&&Te(),r=n[0]>50&&n[0]<100&&Pe(),o=n[0]>100&&n[0]<150&&$e(),m=n[0]>150&&Ne();return{c(){i&&i.c(),e=v(),r&&r.c(),t=v(),o&&o.c(),s=v(),m&&m.c(),l=v(),a=_("img"),u(a,"class","img svelte-ik9eed"),Ce(a.src,d=n[1][0].img)||u(a,"src",d),u(a,"alt","")},m(f,h){i&&i.m(f,h),C(f,e,h),r&&r.m(f,h),C(f,t,h),o&&o.m(f,h),C(f,s,h),m&&m.m(f,h),C(f,l,h),C(f,a,h)},p(f,h){f[0]<=50?i||(i=Te(),i.c(),i.m(e.parentNode,e)):i&&(i.d(1),i=null),f[0]>50&&f[0]<100?r||(r=Pe(),r.c(),r.m(t.parentNode,t)):r&&(r.d(1),r=null),f[0]>100&&f[0]<150?o||(o=$e(),o.c(),o.m(s.parentNode,s)):o&&(o.d(1),o=null),f[0]>150?m||(m=Ne(),m.c(),m.m(l.parentNode,l)):m&&(m.d(1),m=null),h&2&&!Ce(a.src,d=f[1][0].img)&&u(a,"src",d)},d(f){i&&i.d(f),f&&M(e),r&&r.d(f),f&&M(t),o&&o.d(f),f&&M(s),m&&m.d(f),f&&M(l),f&&M(a)}}}function Te(n){let e;return{c(){e=_("div"),u(e,"class","item svelte-ik9eed"),fe(e,"background-color","black"),u(e,"id","status")},m(t,s){C(t,e,s)},d(t){t&&M(e)}}}function Pe(n){let e;return{c(){e=_("div"),u(e,"class","item svelte-ik9eed"),fe(e,"background-color","blue"),u(e,"id","status")},m(t,s){C(t,e,s)},d(t){t&&M(e)}}}function $e(n){let e;return{c(){e=_("div"),u(e,"class","item svelte-ik9eed"),fe(e,"background-color","red"),u(e,"id","status")},m(t,s){C(t,e,s)},d(t){t&&M(e)}}}function Ne(n){let e;return{c(){e=_("div"),u(e,"class","item svelte-ik9eed"),fe(e,"background-color","gray"),u(e,"id","status")},m(t,s){C(t,e,s)},d(t){t&&M(e)}}}function Nt(n){let e;return{c(){e=_("div"),e.textContent="...",u(e,"class","svelte-ik9eed")},m(t,s){C(t,e,s)},p:y,d(t){t&&M(e)}}}function Ft(n){let e,t={ctx:n,current:null,token:null,hasCatch:!1,pending:Nt,then:$t,catch:Pt,value:5};return re(n[2],t),{c(){e=_("div"),t.block.c(),u(e,"class","content svelte-ik9eed")},m(s,l){C(s,e,l),t.block.m(e,t.anchor=null),t.mount=()=>e,t.anchor=null},p(s,[l]){n=s,oe(t,n,l)},i:y,o:y,d(s){s&&M(e),t.block.d(),t.token=null,t=null}}}function Lt(n,e,t){let s=0,l="",a="/api/v1/IMAGEM";setInterval(()=>{t(0,s++,s)},200);async function d(){const r=await fetch(a);return t(1,l=await r.json()),console.log(l),l}let i=d();return[s,l,i]}class jt extends B{constructor(e){super(),x(this,e,Lt,Ft,j,{})}}function xt(n){let e,t,s,l,a,d,i,r;return s=new jt({}),a=new It({}),i=new Tt({}),{c(){e=_("main"),t=_("div"),L(s.$$.fragment),l=v(),L(a.$$.fragment),d=v(),L(i.$$.fragment),u(t,"class","areaImagem svelte-1exng74"),u(e,"class","content svelte-1exng74")},m(o,m){C(o,e,m),c(e,t),N(s,t,null),c(t,l),N(a,t,null),c(e,d),N(i,e,null),r=!0},p:y,i(o){r||(T(s.$$.fragment,o),T(a.$$.fragment,o),T(i.$$.fragment,o),r=!0)},o(o){$(s.$$.fragment,o),$(a.$$.fragment,o),$(i.$$.fragment,o),r=!1},d(o){o&&M(e),F(s),F(a),F(i)}}}class Bt extends B{constructor(e){super(),x(this,e,null,xt,j,{})}}function Ht(n){let e,t,s;return{c(){e=_("main"),t=_("h1"),s=S(n[0]),u(t,"id","title"),u(t,"class","svelte-6ezid9")},m(l,a){C(l,e,a),c(e,t),c(t,s)},p(l,[a]){a&1&&q(s,l[0])},i:y,o:y,d(l){l&&M(e)}}}function Ut(n,e,t){let{title:s="APONTAMENTO"}=e;return n.$$set=l=>{"title"in l&&t(0,s=l.title)},[s]}class Ie extends B{constructor(e){super(),x(this,e,Ut,Ht,j,{title:0})}}function zt(n){let e,t,s,l,a,d,i,r,o,m,f;return t=new le({}),l=new Ie({}),d=new Mt({}),r=new Bt({}),m=new bt({}),{c(){e=_("main"),L(t.$$.fragment),s=v(),L(l.$$.fragment),a=v(),L(d.$$.fragment),i=v(),L(r.$$.fragment),o=v(),L(m.$$.fragment),u(e,"class","svelte-1eh5ztr")},m(h,b){C(h,e,b),N(t,e,null),c(e,s),N(l,e,null),c(e,a),N(d,e,null),c(e,i),N(r,e,null),c(e,o),N(m,e,null),f=!0},p:y,i(h){f||(T(t.$$.fragment,h),T(l.$$.fragment,h),T(d.$$.fragment,h),T(r.$$.fragment,h),T(m.$$.fragment,h),f=!0)},o(h){$(t.$$.fragment,h),$(l.$$.fragment,h),$(d.$$.fragment,h),$(r.$$.fragment,h),$(m.$$.fragment,h),f=!1},d(h){h&&M(e),F(t),F(l),F(d),F(r),F(m)}}}class qt extends B{constructor(e){super(),x(this,e,null,zt,j,{})}}const ne=[];function We(n,e){return{subscribe:Je(n,e).subscribe}}function Je(n,e=y){let t;const s=new Set;function l(i){if(j(n,i)&&(n=i,t)){const r=!ne.length;for(const o of s)o[1](),ne.push(o,n);if(r){for(let o=0;o<ne.length;o+=2)ne[o][0](ne[o+1]);ne.length=0}}}function a(i){l(i(n))}function d(i,r=y){const o=[i,r];return s.add(o),s.size===1&&(t=e(l)||y),i(n),()=>{s.delete(o),s.size===0&&(t(),t=null)}}return{set:l,update:a,subscribe:d}}function Ye(n,e,t){const s=!Array.isArray(n),l=s?[n]:n,a=e.length<2;return We(t,d=>{let i=!1;const r=[];let o=0,m=y;const f=()=>{if(o)return;m();const b=e(s?r[0]:r,d);a?d(b):m=Ue(b)?b:y},h=l.map((b,I)=>et(b,A=>{r[I]=A,o&=~(1<<I),i&&f()},()=>{o|=1<<I}));return i=!0,f(),function(){K(h),m()}})}function Gt(n,e){if(n instanceof RegExp)return{keys:!1,pattern:n};var t,s,l,a,d=[],i="",r=n.split("/");for(r[0]||r.shift();l=r.shift();)t=l[0],t==="*"?(d.push("wild"),i+="/(.*)"):t===":"?(s=l.indexOf("?",1),a=l.indexOf(".",1),d.push(l.substring(1,~s?s:~a?a:l.length)),i+=!!~s&&!~a?"(?:/([^/]+?))?":"/([^/]+?)",~a&&(i+=(~s?"?":"")+"\\"+l.substring(a))):i+="/"+l;return{keys:d,pattern:new RegExp("^"+i+(e?"(?=$|/)":"/?$"),"i")}}function Qt(n){let e,t,s;const l=[n[2]];var a=n[0];function d(i){let r={};for(let o=0;o<l.length;o+=1)r=Be(r,l[o]);return{props:r}}return a&&(e=new a(d()),e.$on("routeEvent",n[7])),{c(){e&&L(e.$$.fragment),t=Oe()},m(i,r){e&&N(e,i,r),C(i,t,r),s=!0},p(i,r){const o=r&4?Ge(l,[Qe(i[2])]):{};if(a!==(a=i[0])){if(e){_e();const m=e;$(m.$$.fragment,1,0,()=>{F(m,1)}),he()}a?(e=new a(d()),e.$on("routeEvent",i[7]),L(e.$$.fragment),T(e.$$.fragment,1),N(e,t.parentNode,t)):e=null}else a&&e.$set(o)},i(i){s||(e&&T(e.$$.fragment,i),s=!0)},o(i){e&&$(e.$$.fragment,i),s=!1},d(i){i&&M(t),e&&F(e,i)}}}function Wt(n){let e,t,s;const l=[{params:n[1]},n[2]];var a=n[0];function d(i){let r={};for(let o=0;o<l.length;o+=1)r=Be(r,l[o]);return{props:r}}return a&&(e=new a(d()),e.$on("routeEvent",n[6])),{c(){e&&L(e.$$.fragment),t=Oe()},m(i,r){e&&N(e,i,r),C(i,t,r),s=!0},p(i,r){const o=r&6?Ge(l,[r&2&&{params:i[1]},r&4&&Qe(i[2])]):{};if(a!==(a=i[0])){if(e){_e();const m=e;$(m.$$.fragment,1,0,()=>{F(m,1)}),he()}a?(e=new a(d()),e.$on("routeEvent",i[6]),L(e.$$.fragment),T(e.$$.fragment,1),N(e,t.parentNode,t)):e=null}else a&&e.$set(o)},i(i){s||(e&&T(e.$$.fragment,i),s=!0)},o(i){e&&$(e.$$.fragment,i),s=!1},d(i){i&&M(t),e&&F(e,i)}}}function Jt(n){let e,t,s,l;const a=[Wt,Qt],d=[];function i(r,o){return r[1]?0:1}return e=i(n),t=d[e]=a[e](n),{c(){t.c(),s=Oe()},m(r,o){d[e].m(r,o),C(r,s,o),l=!0},p(r,[o]){let m=e;e=i(r),e===m?d[e].p(r,o):(_e(),$(d[m],1,1,()=>{d[m]=null}),he(),t=d[e],t?t.p(r,o):(t=d[e]=a[e](r),t.c()),T(t,1),t.m(s.parentNode,s))},i(r){l||(T(t),l=!0)},o(r){$(t),l=!1},d(r){d[e].d(r),r&&M(s)}}}function Fe(){const n=window.location.href.indexOf("#/");let e=n>-1?window.location.href.substr(n+1):"/";const t=e.indexOf("?");let s="";return t>-1&&(s=e.substr(t+1),e=e.substr(0,t)),{location:e,querystring:s}}const ke=We(null,function(e){e(Fe());const t=()=>{e(Fe())};return window.addEventListener("hashchange",t,!1),function(){window.removeEventListener("hashchange",t,!1)}});Ye(ke,n=>n.location);Ye(ke,n=>n.querystring);const Le=Je(void 0);function Yt(n,e,t){let{routes:s={}}=e,{prefix:l=""}=e,{restoreScrollState:a=!1}=e;class d{constructor(w,O){if(!O||typeof O!="function"&&(typeof O!="object"||O._sveltesparouter!==!0))throw Error("Invalid component object");if(!w||typeof w=="string"&&(w.length<1||w.charAt(0)!="/"&&w.charAt(0)!="*")||typeof w=="object"&&!(w instanceof RegExp))throw Error('Invalid value for "path" argument - strings must start with / or *');const{pattern:g,keys:R}=Gt(w);this.path=w,typeof O=="object"&&O._sveltesparouter===!0?(this.component=O.component,this.conditions=O.conditions||[],this.userData=O.userData,this.props=O.props||{}):(this.component=()=>Promise.resolve(O),this.conditions=[],this.props={}),this._pattern=g,this._keys=R}match(w){if(l){if(typeof l=="string")if(w.startsWith(l))w=w.substr(l.length)||"/";else return null;else if(l instanceof RegExp){const H=w.match(l);if(H&&H[0])w=w.substr(H[0].length)||"/";else return null}}const O=this._pattern.exec(w);if(O===null)return null;if(this._keys===!1)return O;const g={};let R=0;for(;R<this._keys.length;){try{g[this._keys[R]]=decodeURIComponent(O[R+1]||"")||null}catch{g[this._keys[R]]=null}R++}return g}async checkConditions(w){for(let O=0;O<this.conditions.length;O++)if(!await this.conditions[O](w))return!1;return!0}}const i=[];s instanceof Map?s.forEach((p,w)=>{i.push(new d(w,p))}):Object.keys(s).forEach(p=>{i.push(new d(p,s[p]))});let r=null,o=null,m={};const f=it();async function h(p,w){await rt(),f(p,w)}let b=null,I=null;a&&(I=p=>{p.state&&p.state.__svelte_spa_router_scrollY?b=p.state:b=null},window.addEventListener("popstate",I),lt(()=>{b?window.scrollTo(b.__svelte_spa_router_scrollX,b.__svelte_spa_router_scrollY):window.scrollTo(0,0)}));let A=null,k=null;const E=ke.subscribe(async p=>{A=p;let w=0;for(;w<i.length;){const O=i[w].match(p.location);if(!O){w++;continue}const g={route:i[w].path,location:p.location,querystring:p.querystring,userData:i[w].userData,params:O&&typeof O=="object"&&Object.keys(O).length?O:null};if(!await i[w].checkConditions(g)){t(0,r=null),k=null,h("conditionsFailed",g);return}h("routeLoading",Object.assign({},g));const R=i[w].component;if(k!=R){R.loading?(t(0,r=R.loading),k=R,t(1,o=R.loadingParams),t(2,m={}),h("routeLoaded",Object.assign({},g,{component:r,name:r.name,params:o}))):(t(0,r=null),k=null);const H=await R();if(p!=A)return;t(0,r=H&&H.default||H),k=R}O&&typeof O=="object"&&Object.keys(O).length?t(1,o=O):t(1,o=null),t(2,m=i[w].props),h("routeLoaded",Object.assign({},g,{component:r,name:r.name,params:o})).then(()=>{Le.set(o)});return}t(0,r=null),k=null,Le.set(void 0)});st(()=>{E(),I&&window.removeEventListener("popstate",I)});function D(p){Se.call(this,n,p)}function P(p){Se.call(this,n,p)}return n.$$set=p=>{"routes"in p&&t(3,s=p.routes),"prefix"in p&&t(4,l=p.prefix),"restoreScrollState"in p&&t(5,a=p.restoreScrollState)},n.$$.update=()=>{n.$$.dirty&32&&(history.scrollRestoration=a?"manual":"auto")},[r,o,m,s,l,a,D,P]}class Zt extends B{constructor(e){super(),x(this,e,Yt,Jt,j,{routes:3,prefix:4,restoreScrollState:5})}}function Xt(n){let e,t,s,l,a,d,i;return t=new le({}),{c(){e=_("div"),L(t.$$.fragment),s=v(),l=S(n[0]),a=v(),d=_("div"),u(d,"class","content svelte-1lo28c1"),u(e,"class","svelte-1lo28c1")},m(r,o){C(r,e,o),N(t,e,null),c(e,s),c(e,l),c(e,a),c(e,d),i=!0},p(r,[o]){(!i||o&1)&&q(l,r[0])},i(r){i||(T(t.$$.fragment,r),i=!0)},o(r){$(t.$$.fragment,r),i=!1},d(r){r&&M(e),F(t)}}}function Kt(n,e,t){let{Subtitle:s="Selecione as Ferramentas necessarias: "}=e;localStorage.getItem("barcodeData");let l=[],a=`/api/v1/ferramenta?fetchItem=${l}`;new Headers().append("Content-Type","application/json");async function i(){return l=await(await fetch(a)).json(),l}return i().then(()=>{const o=l[0].img;l.forEach(m=>{let f=document.querySelector("div"),h=document.createElement("img");f.appendChild(h),h.setAttribute("src",o),h.setAttribute("alt","ferramenta"),h.style.width="170px",h.style.height="170px",h.style.margin="2%",h.style.borderRadius="3px"})}),n.$$set=o=>{"Subtitle"in o&&t(0,s=o.Subtitle)},[s]}class Vt extends B{constructor(e){super(),x(this,e,Kt,Xt,j,{Subtitle:0})}}function en(n){let e,t,s,l,a,d,i,r,o,m,f,h,b,I,A,k,E,D,P,p,w,O,g,R,H,W,Y,V,Z,U,J,te,ge,Ee,be;return{c(){e=_("main"),t=_("table"),s=_("thead"),l=_("tr"),a=_("th"),d=S(n[0]),i=v(),r=_("th"),o=S(n[1]),m=v(),f=_("th"),h=S(n[2]),b=v(),I=_("th"),A=S(n[3]),k=v(),E=_("th"),D=S(n[4]),P=v(),p=_("th"),w=S(n[5]),O=v(),g=_("th"),R=S(n[6]),H=v(),W=_("th"),Y=S(n[7]),V=v(),Z=_("th"),U=S(n[8]),J=v(),te=_("th"),ge=S(n[9]),Ee=v(),be=_("tbody"),be.innerHTML=`<tr class="table-active"><th scope="row">1</th> 
                <td>Espessuura</td> 
                <td>#8</td> 
                <td>MICROMETRO</td> 
                <td>7,19</td> 
                <td>8,96</td></tr> 
              <tr><th scope="row">2</th> 
                <td>Perfil - Regular</td> 
                <td>106,25</td> 
                <td>16,50</td> 
                <td>7,19</td> 
                <td>8,96</td></tr> 
              <tr><th scope="row">3</th> 
                <td class="table-active">Perfil Dobra</td> 
                <td>85</td> 
                <td>85</td> 
                <td>85</td> 
                <td>85</td> 
                <td>85</td> 
                <td>85</td> 
                <td>85</td> 
                <td>8</td></tr>`,u(a,"scope","col"),u(r,"scope","col"),u(f,"scope","col"),u(I,"scope","col"),u(E,"scope","col"),u(p,"scope","col"),u(g,"scope","col"),u(W,"scope","col"),u(Z,"scope","col"),u(te,"scope","col"),u(t,"class","table")},m(z,Q){C(z,e,Q),c(e,t),c(t,s),c(s,l),c(l,a),c(a,d),c(l,i),c(l,r),c(r,o),c(l,m),c(l,f),c(f,h),c(l,b),c(l,I),c(I,A),c(l,k),c(l,E),c(E,D),c(l,P),c(l,p),c(p,w),c(l,O),c(l,g),c(g,R),c(l,H),c(l,W),c(W,Y),c(l,V),c(l,Z),c(Z,U),c(l,J),c(l,te),c(te,ge),c(t,Ee),c(t,be)},p(z,[Q]){Q&1&&q(d,z[0]),Q&2&&q(o,z[1]),Q&4&&q(h,z[2]),Q&8&&q(A,z[3]),Q&16&&q(D,z[4]),Q&32&&q(w,z[5]),Q&64&&q(R,z[6]),Q&128&&q(Y,z[7]),Q&256&&q(U,z[8]),Q&512&&q(ge,z[9])},i:y,o:y,d(z){z&&M(e)}}}function tn(n,e,t){let{cell:s}=e,{Item:l}=e,{Descri\u00E7\u00E3o:a}=e,{Instrumento:d}=e,{Especifica\u00E7\u00E3o:i}=e,{LIE:r}=e,{LSE:o}=e,{SETUP:m}=e,{M2:f}=e,{M3:h}=e,{M4:b}=e,{M5:I}=e,{M6:A}=e,{M7:k}=e,{M8:E}=e,{M9:D}=e,{M10:P}=e,{M11:p}=e,{M12:w}=e,{M13:O}=e;return n.$$set=g=>{"cell"in g&&t(10,s=g.cell),"Item"in g&&t(0,l=g.Item),"Descri\xE7\xE3o"in g&&t(1,a=g.Descri\u00E7\u00E3o),"Instrumento"in g&&t(2,d=g.Instrumento),"Especifica\xE7\xE3o"in g&&t(3,i=g.Especifica\u00E7\u00E3o),"LIE"in g&&t(4,r=g.LIE),"LSE"in g&&t(5,o=g.LSE),"SETUP"in g&&t(6,m=g.SETUP),"M2"in g&&t(7,f=g.M2),"M3"in g&&t(8,h=g.M3),"M4"in g&&t(9,b=g.M4),"M5"in g&&t(11,I=g.M5),"M6"in g&&t(12,A=g.M6),"M7"in g&&t(13,k=g.M7),"M8"in g&&t(14,E=g.M8),"M9"in g&&t(15,D=g.M9),"M10"in g&&t(16,P=g.M10),"M11"in g&&t(17,p=g.M11),"M12"in g&&t(18,w=g.M12),"M13"in g&&t(19,O=g.M13)},[l,a,d,i,r,o,m,f,h,b,s,I,A,k,E,D,P,p,w,O]}class nn extends B{constructor(e){super(),x(this,e,tn,en,j,{cell:10,Item:0,Descri\u00E7\u00E3o:1,Instrumento:2,Especifica\u00E7\u00E3o:3,LIE:4,LSE:5,SETUP:6,M2:7,M3:8,M4:9,M5:11,M6:12,M7:13,M8:14,M9:15,M10:16,M11:17,M12:18,M13:19})}}function ln(n){let e,t,s,l,a,d,i,r;return t=new le({}),i=new nn({}),{c(){e=_("main"),L(t.$$.fragment),s=v(),l=_("div"),a=S(n[0]),d=v(),L(i.$$.fragment),u(l,"class","svelte-udtv2t"),u(e,"class","svelte-udtv2t")},m(o,m){C(o,e,m),N(t,e,null),c(e,s),c(e,l),c(l,a),c(e,d),N(i,e,null),r=!0},p(o,[m]){(!r||m&1)&&q(a,o[0])},i(o){r||(T(t.$$.fragment,o),T(i.$$.fragment,o),r=!0)},o(o){$(t.$$.fragment,o),$(i.$$.fragment,o),r=!1},d(o){o&&M(e),F(t),F(i)}}}let sn="",rn=1;function on(n,e,t){let{Subtitle:s="RIP - RELAT\xD3RIO DE INSPE\xC7\xC3O DE PROCESSOS"}=e;localStorage.getItem("barcodeData"),new Headers().append("Content-Type","application/json");let a=`/api/v1/rip?APT_TEMPO_OPERACAO=${sn}&let APT_TEMPO_OPERACAO=${rn}`;d();async function d(){return await(await fetch(a)).json()}return n.$$set=i=>{"Subtitle"in i&&t(0,s=i.Subtitle)},[s]}class an extends B{constructor(e){super(),x(this,e,on,ln,j,{Subtitle:0})}}function cn(n){let e,t,s,l,a,d,i,r,o,m,f,h,b,I,A,k,E,D,P;return t=new le({}),{c(){e=_("main"),L(t.$$.fragment),s=v(),l=_("div"),a=S(n[0]),d=v(),i=_("div"),r=_("button"),r.textContent="DIREITA",o=v(),m=_("button"),m.textContent="ESQUERDA",f=v(),h=_("button"),h.textContent="ZOOM +",b=v(),I=_("button"),I.textContent="ZOOM -",A=v(),k=_("button"),k.textContent="IMPRIMIR",u(l,"id","subtitle"),u(l,"class","subtitle svelte-d0a34h"),u(r,"id","right"),u(r,"class","svelte-d0a34h"),u(m,"id","left"),u(m,"class","svelte-d0a34h"),u(h,"id","zoomIn"),u(h,"class","svelte-d0a34h"),u(I,"id","zoomOut"),u(I,"class","svelte-d0a34h"),u(k,"id","print"),u(k,"class","svelte-d0a34h"),u(i,"id","buttons"),u(i,"class","svelte-d0a34h"),u(e,"class","svelte-d0a34h")},m(p,w){C(p,e,w),N(t,e,null),c(e,s),c(e,l),c(l,a),c(e,d),c(e,i),c(i,r),c(i,o),c(i,m),c(i,f),c(i,h),c(i,b),c(i,I),c(i,A),c(i,k),E=!0,D||(P=[G(r,"click",n[1]),G(m,"click",n[2]),G(h,"click",un),G(I,"click",dn),G(k,"click",fn)],D=!0)},p(p,[w]){(!E||w&1)&&q(a,p[0])},i(p){E||(T(t.$$.fragment,p),E=!0)},o(p){$(t.$$.fragment,p),E=!1},d(p){p&&M(e),F(t),D=!1,K(P)}}}let Ze=400;function un(){var n=document.getElementById("some"),e=n.clientWidth;n.style.width=e+Ze+"px",n.style.marginLeft="2%",n.style.marginRight="2%",n.style.display="flex",n.style.justifyContent="center",n.style.alignItems="center",n.style.textAlign="center"}function dn(){var n=document.getElementById("some"),e=n.clientWidth;n.style.width=e-Ze+"px",n.style.marginLeft="2%",n.style.marginRight="2%",n.style.display="flex",n.style.justifyContent="center",n.style.alignItems="center",n.style.textAlign="center"}function fn(){let n=window.open();n.close(),n.focus(),n.print()}function mn(n,e,t){let{Subtitle:s="DESENHO"}=e,l=0,a=[],d=`/api/v1/desenho?imagemBack=${a}`;async function i(){return a=await(await fetch(d)).json(),console.log(a),a}i().then(()=>{const f=a[0].img;let h=document.querySelector("div"),b=document.createElement("img");h.appendChild(b),b.setAttribute("src",f),b.setAttribute("alt","ferramenta"),b.id="some",b.classList.add("some"),b.style.margin="2%",b.style.borderRadius="3px",b.style.display="flex",b.style.alignItems="center",b.style.justifyContent="center",b.style.textAlign="center",b.style.overflowY="hidden",b.style.overflowX="hidden",b.style.maxWidth="90%",b.style.minWidth="30%"});function o(){l+=90,document.getElementById("some").style.transition="all 1s",document.getElementById("some").style.transform=`rotate(${l}deg)`,document.getElementById("some").style.marginRight="2%",document.getElementById("some").style.marginLeft="2%"}function m(){l-=90,document.getElementById("some").style.transition="all 1s",document.getElementById("some").style.transform=`rotate(${l}deg)`,document.getElementById("some").style.marginRight="2%",document.getElementById("some").style.marginLeft="2%"}return n.$$set=f=>{"Subtitle"in f&&t(0,s=f.Subtitle)},[s,o,m]}class _n extends B{constructor(e){super(),x(this,e,mn,cn,j,{Subtitle:0})}}function je(n){let e;return{c(){e=_("div"),e.innerHTML=`<div><div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLongTitle">Codigo de barras Invalido</h5></div> 
            <div class="modal-body"><p>Codigo de barras n\xE3o encontrado ou n\xE3o \xE9 valido</p></div> 
            <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button></div></div></div></div>`,u(e,"class","modal fade show"),u(e,"id","exampleModalCenter"),u(e,"tabindex","-1"),u(e,"role","dialog"),u(e,"aria-labelledby","exampleModalCenterTitle"),u(e,"aria-hidden","true")},m(t,s){C(t,e,s)},d(t){t&&M(e)}}}function hn(n){let e,t,s,l,a,d,i,r,o,m,f,h,b,I,A,k,E,D,P,p,w;s=new le({}),a=new Ie({});let O=n[1].ok&&je();return{c(){e=_("main"),t=_("div"),L(s.$$.fragment),l=v(),L(a.$$.fragment),d=v(),i=_("div"),i.textContent="C\xF3digo de barras",r=v(),o=_("form"),m=_("label"),f=_("input"),h=v(),b=_("form"),I=_("div"),A=_("div"),A.textContent="Colaborador",k=v(),E=_("input"),D=v(),O&&O.c(),u(i,"class","bar svelte-1o7vnwp"),u(i,"id","title"),u(f,"id","codigoBarras"),u(f,"name","codigoBarras"),u(f,"type","text"),u(f,"class","svelte-1o7vnwp"),u(m,"class","input svelte-1o7vnwp"),u(o,"action","/api/v1/apontamento"),u(o,"method","POST"),u(A,"id","title"),u(A,"class","svelte-1o7vnwp"),u(E,"name","MATRIC"),u(E,"id","MATRIC"),u(E,"type","text"),u(E,"class","svelte-1o7vnwp"),u(I,"id","popUpCracha"),u(I,"class","svelte-1o7vnwp"),u(b,"action","/api/v1/apontamentoCracha"),u(b,"method","POST"),u(e,"class","svelte-1o7vnwp")},m(g,R){C(g,e,R),c(e,t),N(s,t,null),c(t,l),N(a,t,null),c(t,d),c(t,i),c(t,r),c(t,o),c(o,m),c(m,f),Ae(f,n[0]),c(t,h),c(t,b),c(b,I),c(I,A),c(I,k),c(I,E),c(e,D),O&&O.m(e,null),P=!0,p||(w=[G(f,"input",n[4]),G(f,"input",xe),G(f,"input",n[3]),G(o,"submit",n[2]),G(E,"input",xe)],p=!0)},p(g,[R]){R&1&&f.value!==g[0]&&Ae(f,g[0]),g[1].ok?O||(O=je(),O.c(),O.m(e,null)):O&&(O.d(1),O=null)},i(g){P||(T(s.$$.fragment,g),T(a.$$.fragment,g),P=!0)},o(g){$(s.$$.fragment,g),$(a.$$.fragment,g),P=!1},d(g){g&&M(e),F(s),F(a),O&&O.d(),p=!1,K(w)}}}function xe(n){let e=n.target.value;n.target.value=gn(e)}function gn(n){const e=/[A-Za-z0-9]/;return n.split("").map(s=>e.test(s)?s:"").join("")}function bn(n,e,t){let s="",l={},a="/api/v1/apontamento";async function d(){const f=await(await fetch(a,{method:"POST",body:JSON.stringify({codigoBarras:""})})).json().then(h=>Promise.resolve({json:h,res:Response}));console.log(f[0])}function i(){t(1,l=d())}function r(){var m=s;localStorage.setItem("barcodeData",m)}function o(){s=this.value,t(0,s)}return[s,l,i,r,o]}class vn extends B{constructor(e){super(),x(this,e,bn,hn,j,{})}}function pn(n){return{c:y,m:y,p:y,d:y}}function yn(n){let e,t=JSON.stringify(n[0])+"",s;return{c(){e=_("div"),s=S(t),u(e,"id","cardb"),u(e,"class","card svelte-10p2x27")},m(l,a){C(l,e,a),c(e,s)},p:y,d(l){l&&M(e)}}}function On(n){let e;return{c(){e=_("div"),e.textContent="..."},m(t,s){C(t,e,s)},p:y,d(t){t&&M(e)}}}function wn(n){let e,t,s,l,a,d,i;t=new le({}),l=new Ie({});let r={ctx:n,current:null,token:null,hasCatch:!1,pending:On,then:yn,catch:pn,value:0};return re(n[1],r),{c(){e=_("main"),L(t.$$.fragment),s=v(),L(l.$$.fragment),a=v(),d=_("div"),r.block.c(),u(e,"class","svelte-10p2x27")},m(o,m){C(o,e,m),N(t,e,null),c(e,s),N(l,e,null),c(e,a),c(e,d),r.block.m(d,r.anchor=null),r.mount=()=>d,r.anchor=null,i=!0},p(o,[m]){n=o,oe(r,n,m)},i(o){i||(T(t.$$.fragment,o),T(l.$$.fragment,o),i=!0)},o(o){$(t.$$.fragment,o),$(l.$$.fragment,o),i=!1},d(o){o&&M(e),F(t),F(l),r.block.d(),r.token=null,r=null}}}function In(n,e,t){let s=[],l=`/api/v1/HISTORICO?&HISTORICO=${s}`;async function a(){const i=await fetch(l);return t(0,s=await i.json()),console.log(JSON.stringify(s)),s}let d=a();return[s,d]}class kn extends B{constructor(e){super(),x(this,e,In,wn,j,{})}}function En(n){let e,t,s,l,a;return t=new ut({}),l=new Zt({props:{routes:{"/codigobarras/apontamento":qt,"/desenho":_n,"/rip":an,"/ferramenta":Vt,"/codigobarras":vn,"/historico":kn}}}),{c(){e=_("main"),L(t.$$.fragment),s=v(),L(l.$$.fragment)},m(d,i){C(d,e,i),N(t,e,null),C(d,s,i),N(l,d,i),a=!0},p:y,i(d){a||(T(t.$$.fragment,d),T(l.$$.fragment,d),a=!0)},o(d){$(t.$$.fragment,d),$(l.$$.fragment,d),a=!1},d(d){d&&M(e),F(t),d&&M(s),F(l,d)}}}class Mn extends B{constructor(e){super(),x(this,e,null,En,j,{})}}new Mn({target:document.getElementById("app")});
