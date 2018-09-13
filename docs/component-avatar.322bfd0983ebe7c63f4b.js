(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{124:function(e,a,t){"use strict";var n=t(196);var s=function(){for(var e=arguments.length,a=new Array(e),t=0;t<e;t++)a[t]=arguments[t];return Object(n.flattenDeep)(a).filter(Boolean).join(" ")};t(198),t(203),t(80);t.d(a,"a",function(){return s})},141:function(e,a,t){e.exports={main:"main-3ZTFi",image:"image-2oEhx",sizeXS:"sizeXS-2Mvur",sizeSM:"sizeSM-3942P",sizeMD:"sizeMD-PMeZd",sizeLG:"sizeLG-2qG-L",sizeXL:"sizeXL-SO4Mv",rect:"rect-1vvtE",roundSM:"roundSM-Vnr3L",roundMD:"roundMD-2LfKS",roundLG:"roundLG-2Zyz_",circle:"circle-1ijLq"}},146:function(e,a,t){e.exports={main:"main-1i-7I",header1:"header1-2kyBs",header2:"header2-2qkXl",header3:"header3-3Ftd_",header4:"header4-9s0-r",header5:"header5-1dNO3",header6:"header6-3zIBz",codeblock:"codeblock-21y7C",example:"example-10lhO",row:"row-14kDd",col:"col-1ylCP",icon:"icon-1lMcv"}},17:function(e,a,t){"use strict";t.r(a);var n=t(0),s=t(172),c=t(18),l=t(146),r=t.n(l);t(350);a.default=function(){return n.createElement("div",{className:r.a.main},n.createElement("h1",{className:r.a.header1},"<Avatar />"),n.createElement("h2",{className:r.a.header2},"基本用法"),n.createElement("pre",{className:r.a.codeblock},n.createElement("code",{className:"language-jsx"},n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token punctuation"},"<"),"Avatar")," ",n.createElement("span",{className:"token attr-name"},"value"),n.createElement("span",{className:"token attr-value"},n.createElement("span",{className:"token punctuation"},"="),n.createElement("span",{className:"token punctuation"},'"'),"path/to/avatar.jpg",n.createElement("span",{className:"token punctuation"},'"'))," ",n.createElement("span",{className:"token punctuation"},"/>")))),"生成默认Avatar组件:",n.createElement("div",{className:r.a.example},n.createElement(s.a,{value:Object(c.avatar)()})),n.createElement("h2",{className:r.a.header2},"Size, 组件大小"),n.createElement("pre",{className:r.a.codeblock},n.createElement("code",{className:"language-jsx"},n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token punctuation"},"<"),"Avatar")," ",n.createElement("span",{className:"token attr-name"},"value"),n.createElement("span",{className:"token attr-value"},n.createElement("span",{className:"token punctuation"},"="),n.createElement("span",{className:"token punctuation"},'"'),"path/to/avatar.jpg",n.createElement("span",{className:"token punctuation"},'"'))," ",n.createElement("span",{className:"token attr-name"},"size"),n.createElement("span",{className:"token attr-value"},n.createElement("span",{className:"token punctuation"},"="),n.createElement("span",{className:"token punctuation"},'"'),"lg",n.createElement("span",{className:"token punctuation"},'"'))," ",n.createElement("span",{className:"token punctuation"},"/>")))),n.createElement("div",{className:r.a.example},n.createElement("div",{className:r.a.row},n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),size:"xs"})),"size: xs"),n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),size:"sm"})),"size: sm"),n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),size:"md"})),"size: md(默认)"),n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),size:"lg"})),"size: lg"),n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),size:"xl"})),"size: xl"))),n.createElement("h2",{className:r.a.header2},"Round, 组件形状"),n.createElement("pre",{className:r.a.codeblock},n.createElement("code",{className:"language-jsx"},n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token punctuation"},"<"),"Avatar")," ",n.createElement("span",{className:"token attr-name"},"value"),n.createElement("span",{className:"token attr-value"},n.createElement("span",{className:"token punctuation"},"="),n.createElement("span",{className:"token punctuation"},'"'),"path/to/avatar.jpg",n.createElement("span",{className:"token punctuation"},'"'))," ",n.createElement("span",{className:"token attr-name"},"round"),n.createElement("span",{className:"token attr-value"},n.createElement("span",{className:"token punctuation"},"="),n.createElement("span",{className:"token punctuation"},'"'),"md",n.createElement("span",{className:"token punctuation"},'"'))," ",n.createElement("span",{className:"token punctuation"},"/>")))),n.createElement("div",{className:r.a.example},n.createElement("div",{className:r.a.row},n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),round:!1})),"round: false"),n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),round:!0})),"round: true(默认)"),n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),round:"sm"})),"round: sm"),n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),round:"md"})),"round: md"),n.createElement("div",{className:r.a.col},n.createElement("div",{className:r.a.icon},n.createElement(s.a,{value:Object(c.avatar)(),round:"lg"})),"round: lg"))),n.createElement("h2",{className:r.a.header2},"Custom className or style"),n.createElement("pre",{className:r.a.codeblock},n.createElement("code",{className:"language-jsx"},n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token punctuation"},"<"),"Avatar")," ",n.createElement("span",{className:"token attr-name"},"value"),n.createElement("span",{className:"token attr-value"},n.createElement("span",{className:"token punctuation"},"="),n.createElement("span",{className:"token punctuation"},'"'),"path/to/avatar.jpg",n.createElement("span",{className:"token punctuation"},'"'))," ",n.createElement("span",{className:"token attr-name"},"classNameName"),n.createElement("span",{className:"token attr-value"},n.createElement("span",{className:"token punctuation"},"="),n.createElement("span",{className:"token punctuation"},'"'),"md",n.createElement("span",{className:"token punctuation"},'"'))," ",n.createElement("span",{className:"token punctuation"},"/>")))),n.createElement(s.a,{value:Object(c.avatar)(),className:"custom"}),n.createElement("h2",{className:r.a.header2},"code 实例"),n.createElement("h3",{className:r.a.header3},"案例1, 引入组件"),n.createElement("pre",{className:r.a.codeblock},n.createElement("code",{className:"language-jsx"},n.createElement("span",{className:"token keyword"},"import")," ",n.createElement("span",{className:"token punctuation"},"{")," Avatar ",n.createElement("span",{className:"token punctuation"},"}")," ",n.createElement("span",{className:"token keyword"},"from")," ",n.createElement("span",{className:"token string"},"'~component'"),"\n\n",n.createElement("span",{className:"token keyword"},"function")," ",n.createElement("span",{className:"token function"},"Component"),n.createElement("span",{className:"token punctuation"},"("),n.createElement("span",{className:"token punctuation"},")")," ",n.createElement("span",{className:"token punctuation"},"{"),"\n  ",n.createElement("span",{className:"token keyword"},"return")," ",n.createElement("span",{className:"token punctuation"},"("),"\n    ",n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token tag"},n.createElement("span",{className:"token punctuation"},"<"),"Avatar")," ",n.createElement("span",{className:"token attr-name"},"value"),n.createElement("span",{className:"token attr-value"},n.createElement("span",{className:"token punctuation"},"="),n.createElement("span",{className:"token punctuation"},'"'),"path/to/avatar.jpg",n.createElement("span",{className:"token punctuation"},'"'))," ",n.createElement("span",{className:"token punctuation"},"/>")),"\n  ",n.createElement("span",{className:"token punctuation"},")"),"\n",n.createElement("span",{className:"token punctuation"},"}"))))}},172:function(e,a,t){"use strict";var n=t(68),s=t(97),c=t.n(s),l=t(103),r=t.n(l),m=t(195),o=t.n(m),u=t(80),i=t.n(u),p=t(140),E=t.n(p),N=t(0),d=t(141),v=t.n(d),k=t(124);var h=function(e){var a=e.value,t=e.size,n=void 0===t?"md":t,s=e.round,l=e.classNames,m=void 0===l?{}:l,u=e.className,p=e.styles,d=void 0===p?{}:p,h=e.style,g=E()(e,["value","size","round","classNames","className","styles","style"]),f=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};switch(e){case"xs":return[a.sizeXS,null];case"sm":return[a.sizeSM,null];case"md":return[a.sizeMD,null];case"lg":return[a.sizeLG,null];case"xl":return[a.sizeXL,null];default:return[null,{width:e,height:e}]}}(n,v.a),z=o()(f,2),b=z[0],j=z[1],w=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};switch(i()(e)){case"boolean":return[e?a.circle:a.rect,null];case"string":switch(e){case"sm":return[a.roundSM,null];case"md":return[a.roundMD,null];case"lg":return[a.roundLG,null];default:return[null,{borderRadius:e}]}default:return[null,null]}}(void 0===s||s,v.a),x=o()(w,2),y=x[0],O=x[1],M=Object(k.a)(v.a.main,b,m.main,u),L=Object(k.a)(v.a.image,y,m.image),S=r()({},j,d.main,h),A=r()({},O,d.image);return N.createElement("div",{className:M,style:S},N.createElement("img",c()({className:L,style:A,src:a},g)))};t.d(a,"b",function(){return n.a}),t.d(a,"a",function(){return h})},350:function(e,a,t){},68:function(e,a,t){"use strict";var n=t(97),s=t.n(n),c=t(103),l=t.n(c),r=t(185),m=t.n(r),o=t(186),u=t.n(o),i=t(187),p=t.n(i),E=t(192),N=t.n(E),d=t(194),v=t.n(d),k=t(0);a.a=function(e,a){return function(t){return function(n){function c(e){var a;return m()(this,c),(a=p()(this,N()(c).call(this,e))).container=void 0,a.ret=void 0,a.container=k.createRef(),a}return v()(c,n),u()(c,[{key:"componentDidMount",value:function(){var a=this.container,t=this.props;this.ret=e&&e(l()({container:a},t))}},{key:"componentWillUnmount",value:function(){var e=this.container,t=this.ret,n=this.props;a&&a(l()({container:e},n),t)}},{key:"render",value:function(){return k.createElement(t,s()({},this.props,{container:this.container}))}}]),c}(k.PureComponent)}}}}]);