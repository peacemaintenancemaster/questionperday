var V=t=>{throw TypeError(t)};var J=(t,e,s)=>e.has(t)||V("Cannot "+s);var r=(t,e,s)=>(J(t,e,"read from private field"),s?s.call(t):e.get(t)),h=(t,e,s)=>e.has(t)?V("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),c=(t,e,s,a)=>(J(t,e,"write to private field"),a?a.call(t,s):e.set(t,s),s);var D=(t,e,s,a)=>({set _(i){c(t,e,i,s)},get _(){return r(t,e,a)}});import{r as H,p as fe,w as pe,q as ye,t as ge,M as me,L as be,S as ve,v as Pe,x as we,O as Qe,i as Oe}from"./chunk-JZWAC4HX-RAvRF26o.js";import{u as Me,j as o,c as Ae,G as ke,A as ne,a as qe,e as Se,b as x,T as Fe,d as Ce,F as oe}from"./index-DlNrAyH6.js";import{e as Ee,a as De,b as xe,c as Te,S as ue,M as He,n as l,m as X,d as g,h as ce,Q as Ie,f as Y,g as Ke,o as Z,r as $,i as je,j as W,p as ee,s as Re,t as Be,k as Ne}from"./QueryClientProvider-CuEB3_5v.js";import{Q as Ge,f as ze}from"./question-k-UYFDSz.js";import"./supabase-C7_hgrEP.js";function Le(){return Me(),o(ke,{styles:Ae`
				*,
				*::before,
				*::after {
					box-sizing: border-box;
				}

				* {
					margin: 0;
					padding: 0;
					font-family: 'Pretendard Variable', Pretendard, -apple-system,
						BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI',
						'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic',
						'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
				}

				button {
					cursor: pointer;
					border: none;
					background: none;
				}

				ul[role='list'],
				ol[role='list'] {
					list-style: none;
				}

				html:focus-within {
					scroll-behavior: smooth;
				}

				a:not([class]) {
					text-decoration-skip-ink: auto;
				}

				img,
				picture,
				svg,
				video,
				canvas {
					max-width: 100%;
					height: auto;
					vertical-align: middle;
					font-style: italic;
					background-repeat: no-repeat;
					background-size: cover;
				}

				input,
				button,
				textarea,
				select {
					font: inherit;
					outline: none;
				}

				input:-webkit-autofill,
				input:-webkit-autofill:hover,
				input:-webkit-autofill:focus,
				input:-webkit-autofill:active {
					-webkit-box-shadow: 0 0 0 30px white inset !important;
				}

				@media (prefers-reduced-motion: reduce) {
					html:focus-within {
						scroll-behavior: auto;
					}
					*,
					*::before,
					*::after {
						animation-duration: 0.01ms !important;
						animation-iteration-count: 1 !important;
						transition-duration: 0.01ms !important;
						scroll-behavior: auto !important;
						transition: none;
					}
				}

				body,
				html {
					height: 100%;
					scroll-behavior: smooth;
				}

				blockquote {
					border-left: 3px solid var(--gray-3);
					margin: 1.5rem 0;
					padding-left: 1rem;
				}

				hr {
					border: none;
					border-top: 1px solid var(--gray-2);
					margin: 2rem 0;
				}
			`})}function Ue(){const{state:t,dispatch:e}=H.useContext(ne),s=fe();H.useEffect(()=>{(async()=>{try{if(t.isAuthenticated)return;const a=await qe.Auth.session();e({type:"LOGIN",payload:a.admin})}catch{s("/login")}})()},[t.isAuthenticated])}function te(t){return{onFetch:(e,s)=>{var K,j,R,B,N;const a=e.options,i=(R=(j=(K=e.fetchOptions)==null?void 0:K.meta)==null?void 0:j.fetchMore)==null?void 0:R.direction,u=((B=e.state.data)==null?void 0:B.pages)||[],p=((N=e.state.data)==null?void 0:N.pageParams)||[];let k={pages:[],pageParams:[]},C=0;const I=async()=>{let q=!1;const E=d=>{Te(d,()=>e.signal,()=>q=!0)},he=Ee(e.options,e.fetchOptions),G=async(d,b,S)=>{if(q)return Promise.reject();if(b==null&&d.pages.length)return Promise.resolve(d);const le=(()=>{const _={client:e.client,queryKey:e.queryKey,pageParam:b,direction:S?"backward":"forward",meta:e.options.meta};return E(_),_})(),de=await he(le),{maxPages:L}=e.options,U=S?De:xe;return{pages:U(d.pages,de,L),pageParams:U(d.pageParams,b,L)}};if(i&&u.length){const d=i==="backward",b=d?_e:se,S={pages:u,pageParams:p},z=b(a,S);k=await G(S,z,d)}else{const d=t??u.length;do{const b=C===0?p[0]??a.initialPageParam:se(a,k);if(C>0&&b==null)break;k=await G(k,b),C++}while(C<d)}return k};e.options.persister?e.fetchFn=()=>{var q,E;return(E=(q=e.options).persister)==null?void 0:E.call(q,I,{client:e.client,queryKey:e.queryKey,meta:e.options.meta,signal:e.signal},s)}:e.fetchFn=I}}}function se(t,{pages:e,pageParams:s}){const a=e.length-1;return e.length>0?t.getNextPageParam(e[a],e,s[a],s):void 0}function _e(t,{pages:e,pageParams:s}){var a;return e.length>0?(a=t.getPreviousPageParam)==null?void 0:a.call(t,e[0],e,s[0],s):void 0}var m,f,F,ae,Ve=(ae=class extends ue{constructor(e={}){super();h(this,m);h(this,f);h(this,F);this.config=e,c(this,m,new Set),c(this,f,new Map),c(this,F,0)}build(e,s,a){const i=new He({client:e,mutationCache:this,mutationId:++D(this,F)._,options:e.defaultMutationOptions(s),state:a});return this.add(i),i}add(e){r(this,m).add(e);const s=T(e);if(typeof s=="string"){const a=r(this,f).get(s);a?a.push(e):r(this,f).set(s,[e])}this.notify({type:"added",mutation:e})}remove(e){if(r(this,m).delete(e)){const s=T(e);if(typeof s=="string"){const a=r(this,f).get(s);if(a)if(a.length>1){const i=a.indexOf(e);i!==-1&&a.splice(i,1)}else a[0]===e&&r(this,f).delete(s)}}this.notify({type:"removed",mutation:e})}canRun(e){const s=T(e);if(typeof s=="string"){const a=r(this,f).get(s),i=a==null?void 0:a.find(u=>u.state.status==="pending");return!i||i===e}else return!0}runNext(e){var a;const s=T(e);if(typeof s=="string"){const i=(a=r(this,f).get(s))==null?void 0:a.find(u=>u!==e&&u.state.isPaused);return(i==null?void 0:i.continue())??Promise.resolve()}else return Promise.resolve()}clear(){l.batch(()=>{r(this,m).forEach(e=>{this.notify({type:"removed",mutation:e})}),r(this,m).clear(),r(this,f).clear()})}getAll(){return Array.from(r(this,m))}find(e){const s={exact:!0,...e};return this.getAll().find(a=>X(s,a))}findAll(e={}){return this.getAll().filter(s=>X(e,s))}notify(e){l.batch(()=>{this.listeners.forEach(s=>{s(e)})})}resumePausedMutations(){const e=this.getAll().filter(s=>s.state.isPaused);return l.batch(()=>Promise.all(e.map(s=>s.continue().catch(g))))}},m=new WeakMap,f=new WeakMap,F=new WeakMap,ae);function T(t){var e;return(e=t.options.scope)==null?void 0:e.id}var y,re,Je=(re=class extends ue{constructor(e={}){super();h(this,y);this.config=e,c(this,y,new Map)}build(e,s,a){const i=s.queryKey,u=s.queryHash??ce(i,s);let p=this.get(u);return p||(p=new Ie({client:e,queryKey:i,queryHash:u,options:e.defaultQueryOptions(s),state:a,defaultOptions:e.getQueryDefaults(i)}),this.add(p)),p}add(e){r(this,y).has(e.queryHash)||(r(this,y).set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){const s=r(this,y).get(e.queryHash);s&&(e.destroy(),s===e&&r(this,y).delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){l.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}get(e){return r(this,y).get(e)}getAll(){return[...r(this,y).values()]}find(e){const s={exact:!0,...e};return this.getAll().find(a=>Y(s,a))}findAll(e={}){const s=this.getAll();return Object.keys(e).length>0?s.filter(a=>Y(e,a)):s}notify(e){l.batch(()=>{this.listeners.forEach(s=>{s(e)})})}onFocus(){l.batch(()=>{this.getAll().forEach(e=>{e.onFocus()})})}onOnline(){l.batch(()=>{this.getAll().forEach(e=>{e.onOnline()})})}},y=new WeakMap,re),n,v,P,Q,O,w,M,A,ie,Xe=(ie=class{constructor(t={}){h(this,n);h(this,v);h(this,P);h(this,Q);h(this,O);h(this,w);h(this,M);h(this,A);c(this,n,t.queryCache||new Je),c(this,v,t.mutationCache||new Ve),c(this,P,t.defaultOptions||{}),c(this,Q,new Map),c(this,O,new Map),c(this,w,0)}mount(){D(this,w)._++,r(this,w)===1&&(c(this,M,Ke.subscribe(async t=>{t&&(await this.resumePausedMutations(),r(this,n).onFocus())})),c(this,A,Z.subscribe(async t=>{t&&(await this.resumePausedMutations(),r(this,n).onOnline())})))}unmount(){var t,e;D(this,w)._--,r(this,w)===0&&((t=r(this,M))==null||t.call(this),c(this,M,void 0),(e=r(this,A))==null||e.call(this),c(this,A,void 0))}isFetching(t){return r(this,n).findAll({...t,fetchStatus:"fetching"}).length}isMutating(t){return r(this,v).findAll({...t,status:"pending"}).length}getQueryData(t){var s;const e=this.defaultQueryOptions({queryKey:t});return(s=r(this,n).get(e.queryHash))==null?void 0:s.state.data}ensureQueryData(t){const e=this.defaultQueryOptions(t),s=r(this,n).build(this,e),a=s.state.data;return a===void 0?this.fetchQuery(t):(t.revalidateIfStale&&s.isStaleByTime($(e.staleTime,s))&&this.prefetchQuery(e),Promise.resolve(a))}getQueriesData(t){return r(this,n).findAll(t).map(({queryKey:e,state:s})=>{const a=s.data;return[e,a]})}setQueryData(t,e,s){const a=this.defaultQueryOptions({queryKey:t}),i=r(this,n).get(a.queryHash),u=i==null?void 0:i.state.data,p=je(e,u);if(p!==void 0)return r(this,n).build(this,a).setData(p,{...s,manual:!0})}setQueriesData(t,e,s){return l.batch(()=>r(this,n).findAll(t).map(({queryKey:a})=>[a,this.setQueryData(a,e,s)]))}getQueryState(t){var s;const e=this.defaultQueryOptions({queryKey:t});return(s=r(this,n).get(e.queryHash))==null?void 0:s.state}removeQueries(t){const e=r(this,n);l.batch(()=>{e.findAll(t).forEach(s=>{e.remove(s)})})}resetQueries(t,e){const s=r(this,n);return l.batch(()=>(s.findAll(t).forEach(a=>{a.reset()}),this.refetchQueries({type:"active",...t},e)))}cancelQueries(t,e={}){const s={revert:!0,...e},a=l.batch(()=>r(this,n).findAll(t).map(i=>i.cancel(s)));return Promise.all(a).then(g).catch(g)}invalidateQueries(t,e={}){return l.batch(()=>(r(this,n).findAll(t).forEach(s=>{s.invalidate()}),(t==null?void 0:t.refetchType)==="none"?Promise.resolve():this.refetchQueries({...t,type:(t==null?void 0:t.refetchType)??(t==null?void 0:t.type)??"active"},e)))}refetchQueries(t,e={}){const s={...e,cancelRefetch:e.cancelRefetch??!0},a=l.batch(()=>r(this,n).findAll(t).filter(i=>!i.isDisabled()&&!i.isStatic()).map(i=>{let u=i.fetch(void 0,s);return s.throwOnError||(u=u.catch(g)),i.state.fetchStatus==="paused"?Promise.resolve():u}));return Promise.all(a).then(g)}fetchQuery(t){const e=this.defaultQueryOptions(t);e.retry===void 0&&(e.retry=!1);const s=r(this,n).build(this,e);return s.isStaleByTime($(e.staleTime,s))?s.fetch(e):Promise.resolve(s.state.data)}prefetchQuery(t){return this.fetchQuery(t).then(g).catch(g)}fetchInfiniteQuery(t){return t.behavior=te(t.pages),this.fetchQuery(t)}prefetchInfiniteQuery(t){return this.fetchInfiniteQuery(t).then(g).catch(g)}ensureInfiniteQueryData(t){return t.behavior=te(t.pages),this.ensureQueryData(t)}resumePausedMutations(){return Z.isOnline()?r(this,v).resumePausedMutations():Promise.resolve()}getQueryCache(){return r(this,n)}getMutationCache(){return r(this,v)}getDefaultOptions(){return r(this,P)}setDefaultOptions(t){c(this,P,t)}setQueryDefaults(t,e){r(this,Q).set(W(t),{queryKey:t,defaultOptions:e})}getQueryDefaults(t){const e=[...r(this,Q).values()],s={};return e.forEach(a=>{ee(t,a.queryKey)&&Object.assign(s,a.defaultOptions)}),s}setMutationDefaults(t,e){r(this,O).set(W(t),{mutationKey:t,defaultOptions:e})}getMutationDefaults(t){const e=[...r(this,O).values()],s={};return e.forEach(a=>{ee(t,a.mutationKey)&&Object.assign(s,a.defaultOptions)}),s}defaultQueryOptions(t){if(t._defaulted)return t;const e={...r(this,P).queries,...this.getQueryDefaults(t.queryKey),...t,_defaulted:!0};return e.queryHash||(e.queryHash=ce(e.queryKey,e)),e.refetchOnReconnect===void 0&&(e.refetchOnReconnect=e.networkMode!=="always"),e.throwOnError===void 0&&(e.throwOnError=!!e.suspense),!e.networkMode&&e.persister&&(e.networkMode="offlineFirst"),e.queryFn===Re&&(e.enabled=!1),e}defaultMutationOptions(t){return t!=null&&t._defaulted?t:{...r(this,P).mutations,...(t==null?void 0:t.mutationKey)&&this.getMutationDefaults(t.mutationKey),...t,_defaulted:!0}}clear(){r(this,n).clear(),r(this,v).clear()}},n=new WeakMap,v=new WeakMap,P=new WeakMap,Q=new WeakMap,O=new WeakMap,w=new WeakMap,M=new WeakMap,A=new WeakMap,ie);const Ye=new Xe,at=()=>[{rel:"stylesheet",href:"https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"}];function rt({children:t}){return Se(),x("html",{lang:"en",children:[x("head",{children:[o("meta",{charSet:"utf-8"}),o("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),o("link",{rel:"apple-touch-icon",sizes:"180x180",href:"/favicon.png"}),o("link",{rel:"icon",type:"image/png",sizes:"32x32",href:"/favicon.png"}),o("link",{rel:"icon",type:"image/png",sizes:"16x16",href:"/favicon.png"}),o("link",{rel:"stylesheet",href:"https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"}),o("link",{rel:"manifest",href:"/site.webmanifest"}),o(me,{}),o(be,{})]}),x("body",{children:[o(Ne,{client:Ye,children:x(Fe,{theme:Be,children:[o(Le,{}),o(Ce,{children:o(Ge,{children:t})})]})}),o(ve,{}),o(Pe,{}),o("div",{id:"modal"})]})]})}const it=ge(function(){return o(oe,{})}),nt=pe(function(){const{state:e}=H.use(ne),{isAuthenticated:s}=e,[a,i]=we();return Ue(),H.useEffect(()=>{s&&(a.get("dateAt")||a.get("view")||i({dateAt:ze(new Date,"yyyy-MM-dd"),view:"calendar"}))},[a,s]),o(Qe,{})}),ot=ye(function({error:e}){let s="An unexpected error occurred.";return Oe(e)&&(e.status,s=e.status===404?"The requested page could not be found.":e.statusText||s),o(oe,{})});export{ot as ErrorBoundary,it as HydrateFallback,rt as Layout,nt as default,at as links};
