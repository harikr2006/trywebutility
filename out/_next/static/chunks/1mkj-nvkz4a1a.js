(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,39748,e=>{"use strict";var r=e.i(43476),t=e.i(71645),l=e.i(59994),s=e.i(22407),a=e.i(24687),o=e.i(99847),n=e.i(20906);let i=`# Hello World

This is a **bold** statement and _italic_ text.

## Features
- Item one
- Item two
- Item three

> A blockquote example`,d=`| Name | Age | City |
|------|-----|------|
| Alice | 30 | New York |
| Bob | 25 | London |`;e.s(["default",0,function(){let[e,m]=(0,t.useState)("table"),[c,u]=(0,t.useState)(d),{html:x,error:b}="table"===e?function(e){try{if(!e.trim())return{html:"",error:null};let r=e.trim().split("\n").filter(e=>e.trim());if(r.length<2)return{html:"",error:"Need at least a header row and separator row"};let t=e=>e.split("|").map(e=>e.trim()).filter((e,r,t)=>r>0&&r<t.length-1),l=t(r[0]),s=r.slice(2).map(t),a=l.map(e=>`    <th>${e}</th>`).join("\n"),o=s.map(e=>`  <tr>
${e.map(e=>`    <td>${e}</td>`).join("\n")}
  </tr>`).join("\n");return{html:`<table>
  <thead>
  <tr>
${a}
  </tr>
  </thead>
  <tbody>
${o}
  </tbody>
</table>`,error:null}}catch(e){return{html:"",error:e instanceof Error?e.message:"Conversion failed"}}}(c):function(e){try{if(!e.trim())return{html:"",error:null};return{html:n.marked.parse(e),error:null}}catch(e){return{html:"",error:e instanceof Error?e.message:"Conversion failed"}}}(c);return(0,r.jsx)(l.default,{title:"Markdown → HTML",description:"Convert Markdown documents or tables to clean HTML markup.",children:(0,r.jsxs)("div",{className:"space-y-4",children:[(0,r.jsxs)("div",{className:"flex gap-2",children:[(0,r.jsx)("button",{onClick:()=>{m("table"),u(d)},className:`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${"table"===e?"bg-primary text-primary-foreground border-primary":"bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"}`,children:"Table Only"}),(0,r.jsx)("button",{onClick:()=>{m("full"),u(i)},className:`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${"full"===e?"bg-primary text-primary-foreground border-primary":"bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"}`,children:"Full Document"})]}),(0,r.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,r.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,r.jsx)("div",{className:"flex items-center h-7",children:(0,r.jsx)("label",{className:"text-xs font-semibold text-muted-foreground uppercase tracking-wide",children:"Markdown Input"})}),(0,r.jsx)(a.Textarea,{value:c,onChange:e=>u(e.target.value),className:"font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"})]}),(0,r.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between h-7",children:[(0,r.jsx)("label",{className:"text-xs font-semibold text-muted-foreground uppercase tracking-wide",children:"HTML Output"}),(0,r.jsx)(s.default,{text:x})]}),b?(0,r.jsxs)("div",{className:"flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive min-h-[400px]",children:[(0,r.jsx)(o.AlertCircle,{className:"h-4 w-4 shrink-0 mt-0.5"}),(0,r.jsx)("span",{children:b})]}):(0,r.jsx)(a.Textarea,{readOnly:!0,value:x,className:"font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60"})]})]})]})})}],39748)},91977,e=>{e.v(r=>Promise.all(["static/chunks/3rnjceolsn7ft.js"].map(r=>e.l(r))).then(()=>r(91279)))}]);