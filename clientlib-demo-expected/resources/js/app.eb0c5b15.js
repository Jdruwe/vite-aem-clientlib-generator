import{d as h,r as m,c as v,a as t,t as u,F as f,p as g,b as k,e as s,o as E,f as b}from"../chunks/vendor.3f6b5a88.js";const y="modulepreload",i={},S="/",I=function(n,l){return!l||l.length===0?n():Promise.all(l.map(e=>{if(e=`${S}${e}`,e in i)return;i[e]=!0;const c=e.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${d}`))return;const r=document.createElement("link");if(r.rel=c?"stylesheet":y,c||(r.as="script",r.crossOrigin=""),r.href=e,document.head.appendChild(r),c)return new Promise((_,p)=>{r.addEventListener("load",_),r.addEventListener("error",p)})})).then(()=>n())};var V=(o,n)=>{for(const[l,e]of n)o[l]=e;return o};const a=o=>(g("data-v-0c40cc0c"),o=o(),k(),o),D=a(()=>t("p",null,[s(" Recommended IDE setup bob: "),t("a",{href:"https://code.visualstudio.com/",target:"_blank"},"VSCode"),s(" + "),t("a",{href:"https://github.com/johnsoncodehk/volar",target:"_blank"},"Volar")],-1)),j=a(()=>t("p",null,[s("See "),t("code",null,"README.md"),s(" for more information.")],-1)),x=a(()=>t("p",null,[t("a",{href:"https://vitejs.dev/guide/features.html",target:"_blank"}," Vite Docs "),s(" | "),t("a",{href:"https://v3.vuejs.org/",target:"_blank"},"Vue 3 Docs")],-1)),B=a(()=>t("p",null,[s(" Edit "),t("code",null,"components/HelloWorld.vue"),s(" to test hot module replacement. ")],-1)),C=h({props:{msg:{type:String,required:!0}},setup(o){const n=m(0);return(l,e)=>(E(),v(f,null,[t("h1",null,u(o.msg),1),D,j,x,t("button",{type:"button",onClick:e[0]||(e[0]=c=>n.value++)},"count is: "+u(n.value),1),B],64))}});var W=V(C,[["__scopeId","data-v-0c40cc0c"]]);b(W).mount("#helloWorld");document.getElementById("viteButton").addEventListener("click",()=>{I(()=>import("../chunks/other-module.978edf84.js"),["etc.clientlibs/project/clientlibs/demo-clientlib/resources/chunks/other-module.978edf5.js","etc.clientlibs/project/clientlibs/demo-clientlib/resources/css/other-module.cd49c0e7.css","etc.clientlibs/project/clientlibs/demo-clientlib/resources/chunks/vendor.3f6b5a88.js"])});export{I as _};
