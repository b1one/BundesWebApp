var e=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}},t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n,r,i=e((()=>{n=[{id:`bt-2025`,title:`Bundestagswahl 2025`,type:`parliament`,status:`open`,info:`Wahl zum 21. Deutschen Bundestag`,candidates:[{id:`c1`,name:`Dr. Anna Schmidt`,party:`Demokratische Union`,desc:`Direktkandidatin Wahlkreis 042`},{id:`c2`,name:`Markus Weber`,party:`Soziale Zukunft`,desc:`Direktkandidat Wahlkreis 042`}],parties:[{id:`p1`,name:`Demokratische Union (DU)`,desc:`Konservativ-Liberal`},{id:`p2`,name:`Soziale Zukunft (SZ)`,desc:`Sozialdemokratisch`},{id:`p3`,name:`Grüne Innovation (GI)`,desc:`Ökologisch-Progressiv`}]},{id:`ve-mobil`,title:`Volksentscheid: Mobilität`,type:`referendum`,status:`open`,question:`Soll der Ausbau des öffentlichen Nahverkehrs (ÖPNV) vorrangig vor dem Straßenbau gefördert werden?`,options:[{id:`ja`,name:`JA`,desc:`Zustimmung zum Gesetzesentwurf`},{id:`nein`,name:`NEIN`,desc:`Ablehnung des Gesetzesentwurf`}]}],r={CORRECT_PIN:`123456`,API_DELAY:1500,NFC_SCAN_TIME:3e3}}));function a(e){Object.assign(o,e),window.dispatchEvent(new CustomEvent(`statechange`))}var o,s=e((()=>{i(),o={view:`login`,user:null,elections:JSON.parse(JSON.stringify(n)),selectedElection:null,votes:{first:null,second:null},pinInput:``,error:null,isLoading:!1,loadingMessage:``,nfcActive:!1,menuOpen:!1}})),c,l,u=e((()=>{c=class e{static instance;API_BASE_URL=`https://api.signicat.com/eid-hub/v1`;CLIENT_ID=`BUNDESWAHLAPP_SANDBOX_ID`;CLIENT_SECRET=`BUNDESWAHLAPP_SANDBOX_SECRET`;constructor(){}static getInstance(){return e.instance||=new e,e.instance}async request(e,t={}){let n=`${this.API_BASE_URL}${e}`,r=`Basic `+btoa(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`),i=await fetch(n,{...t,headers:{...t.headers,Authorization:r,"Content-Type":`application/json`,Accept:`application/json`}});if(!i.ok){let e=await i.json().catch(()=>({}));throw Error(e.message||`API Error: ${i.status}`)}return i.json()}async createSession(){return console.log(`[EIDService] Creating Signicat session for German eID...`),this.request(`/sessions`,{method:`POST`,body:JSON.stringify({idp:`DE_EID`,callbackUrl:`https://bundeswahlapp.de/callback`})})}async getSessionStatus(e){return console.log(`[EIDService] Checking status for session ${e}...`),this.request(`/sessions/${e}`)}async cancelSession(e){return console.log(`[EIDService] Canceling session ${e}...`),this.request(`/sessions/${e}`,{method:`DELETE`})}async signPayload(e,t){return console.log(`[EIDService] Requesting cryptographic signature from Signicat...`),(await this.request(`/sign`,{method:`POST`,body:JSON.stringify({sessionId:t,payload:e})})).signature}},l=c.getInstance()})),d,f=e((()=>{s(),i(),u(),d={navigateTo:e=>{a({view:e})},toggleMenu:()=>{a({menuOpen:!o.menuOpen})},startNfc:async()=>{a({isLoading:!0,loadingMessage:`Initialisiere eID-Sitzung...`});try{let e=await l.createSession();console.log(`[Actions] Signicat Session created: ${e.id}`),a({isLoading:!1,nfcActive:!0,loadingMessage:`Sitzung ${e.id} aktiv`}),d.pollSessionStatus(e.id)}catch(e){a({isLoading:!1,error:`eID-Fehler: ${e.message}`})}},pollSessionStatus:async e=>{let t=3e3,n=0,r=async()=>{if(o.nfcActive)try{let i=await l.getSessionStatus(e);if(console.log(`[Actions] Session status: ${i.status}`),i.status===`COMPLETED`){a({nfcActive:!1,isLoading:!0,loadingMessage:`Verifiziere Identität...`}),setTimeout(()=>{a({isLoading:!1,view:`pin_entry`,user:i.user||{name:`Max Mustermann`,id:`L029384`,verified:!0}})},1e3);return}if(i.status===`CANCELED`||i.status===`EXPIRED`){a({nfcActive:!1,error:`Die Authentifizierung wurde abgebrochen oder ist abgelaufen.`});return}if(n++,n>=20){a({nfcActive:!1,error:`Zeitüberschreitung: Bitte versuchen Sie es erneut.`});return}setTimeout(r,t)}catch(e){console.error(`[Actions] Polling error:`,e),setTimeout(r,t)}};r()},cancelNfc:()=>{a({nfcActive:!1})},nfcScanSuccess:async()=>{a({nfcActive:!1,isLoading:!0,loadingMessage:`Verifiziere Identität...`});try{let e=await l.verifyToken(`eid_token_secure_12345`);e.success&&e.user?(a({isLoading:!1,view:`pin_entry`}),a({user:e.user})):a({isLoading:!1,error:e.error||`Identitätsprüfung fehlgeschlagen.`})}catch{a({isLoading:!1,error:`Ein kritischer Fehler ist aufgetreten.`})}},pinInput:e=>{let t=o.pinInput;e===`del`?t=t.slice(0,-1):t.length<6&&(t+=e),a({pinInput:t,error:null})},submitPin:async()=>(a({isLoading:!0,loadingMessage:`Prüfe PIN...`}),new Promise(e=>{setTimeout(()=>{a({isLoading:!1}),o.pinInput===r.CORRECT_PIN?a({view:`dashboard`,pinInput:``}):a({error:`Falsche PIN. (Hinweis: 123456)`,pinInput:``,view:`pin_entry`}),e(!0)},1e3)})),selectElection:e=>{a({selectedElection:e,votes:{first:null,second:null},view:`voting`})},vote:(e,t)=>{a({votes:{...o.votes,[e]:t}})},isVoteComplete:()=>{let e=o.selectedElection;return e?e.type===`parliament`?!!(o.votes.first&&o.votes.second):!!o.votes.first:!1},goToReview:()=>{a({view:`confirmation`})},getLabel:e=>{let t=o.selectedElection;if(!t)return e;let n=t.candidates?.find(t=>t.id===e)||t.parties?.find(t=>t.id===e)||t.options?.find(t=>t.id===e);return n?n.name:e},submitVote:async()=>{a({isLoading:!0,loadingMessage:`Signiere mit eID...`});try{let e={electionId:o.selectedElection?.id,votes:o.votes,userId:o.user?.id},t=await l.signPayload(e);console.log(`[Actions] Vote signed securely: ${t}`),setTimeout(()=>{let e=o.selectedElection?.id;a({isLoading:!1,view:`success`,elections:o.elections.map(t=>t.id===e?{...t,status:`voted`}:t)})},1500)}catch{a({isLoading:!1,error:`Fehler beim Signieren der Stimme.`})}},logout:()=>{a({user:null,menuOpen:!1,view:`login`})}}})),p,m=e((()=>{s(),p={Header:()=>{let e=document.createElement(`header`);return e.className=`bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 shrink-0 z-20`,e.innerHTML=`
            <div class="flex items-center gap-2">
                <div class="bg-blue-700 text-white p-1.5 rounded-lg">
                    <i class="ph-bold ph-archive-box text-xl"></i>
                </div>
                <div class="leading-none">
                    <h1 class="font-bold text-slate-800 text-lg">BundesWahl<span class="text-blue-600">App</span></h1>
                    <span class="text-[10px] text-slate-400 tracking-widest uppercase font-medium">Offiziell</span>
                </div>
            </div>
            <button id="menu-toggle" class="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
                <i class="ph-bold ph-list text-2xl"></i>
            </button>
        `,e},LoadingOverlay:()=>{let e=document.createElement(`div`);return e.className=`absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center fade-in`,e.innerHTML=`
            <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p class="text-slate-600 font-medium animate-pulse">${o.loadingMessage||`Verarbeite...`}</p>
        `,e},PersoSimOverlay:()=>{let e=document.createElement(`div`);return e.className=`absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center text-white p-6 fade-in`,e.innerHTML=`
            <div class="absolute top-0 left-0 w-full p-4 flex justify-between items-center opacity-50">
                <span class="text-xs font-mono">Signicat eID Hub Interface</span>
                <i class="ph-fill ph-wifi-high"></i>
            </div>
            <div class="relative flex items-center justify-center mb-10">
                <div class="nfc-ripple"></div>
                <div class="nfc-ripple"></div>
                <div class="nfc-ripple"></div>
                <i class="ph-duotone ph-identification-card text-8xl relative z-10 text-blue-400"></i>
            </div>
            <h2 class="text-2xl font-bold mb-2 text-center">AusweisApp gestartet</h2>
            <p class="text-slate-300 text-center mb-8 max-w-xs">
                Bitte öffnen Sie die AusweisApp auf Ihrem Smartphone und bestätigen Sie die Identifizierung.
            </p>
            <div class="bg-slate-800 rounded-lg p-4 w-full max-w-xs border border-slate-700 flex items-center gap-3">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-slate-300 font-mono">Warte auf Bestätigung...</span>
            </div>
            <button id="cancel-nfc" class="mt-12 text-slate-400 hover:text-white text-sm font-medium py-2 px-6 border border-slate-600 rounded-full">
                Abbrechen
            </button>
        `,e},MenuModal:()=>{let e=document.createElement(`div`);e.className=`absolute inset-0 bg-black/50 z-40`,e.onclick=t=>{t.target===e&&window.dispatchEvent(new CustomEvent(`action`,{detail:{name:`toggleMenu`}}))};let t=document.createElement(`div`);return t.className=`absolute top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-2xl p-6 slide-in-right flex flex-col`,t.innerHTML=`
            <div class="flex justify-end mb-8">
                <button id="menu-close" class="p-2 bg-slate-100 rounded-full text-slate-500">
                    <i class="ph-bold ph-x text-xl"></i>
                </button>
            </div>
            <nav class="space-y-2">
                ${o.user?`
                    <div class="p-4 bg-blue-50 rounded-xl mb-6 border border-blue-100">
                        <div class="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Angemeldet als</div>
                        <div class="font-bold text-slate-800">${o.user.name}</div>
                        <div class="text-xs text-slate-500 mt-1 font-mono">ID: ${o.user.id}</div>
                    </div>
                `:``}
                <button id="nav-about" class="w-full text-left p-4 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium">
                    <i class="ph-bold ph-info text-blue-600"></i> Über die App & FAQ
                </button>
                <button onclick="window.open('https://github.com/PersoSim', '_blank')" class="w-full text-left p-4 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium">
                    <i class="ph-bold ph-code text-blue-600"></i> PersoSim Projekt
                </button>
            </nav>
            ${o.user?`
                <div class="mt-auto border-t border-slate-100 pt-6">
                    <button id="logout-btn" class="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition">
                        <i class="ph-bold ph-sign-out"></i> Abmelden
                    </button>
                </div>
            `:``}
        `,e.appendChild(t),e},PinPad:()=>{let e=document.createElement(`div`);e.className=`mt-auto w-full max-w-[300px] mx-auto`;let t=document.createElement(`div`);t.className=`flex justify-center gap-3 mb-8`;for(let e=0;e<6;e++){let n=document.createElement(`div`);n.className=`w-4 h-4 rounded-full border-2 transition-all duration-200 ${e<o.pinInput.length?`bg-blue-600 border-blue-600 scale-110`:`bg-transparent border-slate-300`}`,t.appendChild(n)}e.appendChild(t);let n=document.createElement(`div`);return n.className=`grid grid-cols-3 gap-4`,[`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`del`,`0`,`ok`].forEach(e=>{let t=document.createElement(`button`);e===`ok`?(t.className=`aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm bg-blue-600 text-white active:bg-blue-700 transition`,t.innerHTML=`<i class="ph-bold ph-check"></i>`,t.id=`pin-submit`,o.pinInput.length!==6&&t.classList.add(`opacity-50`,`cursor-not-allowed`)):e===`del`?(t.className=`aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm bg-slate-200 text-slate-600 active:bg-slate-300 transition`,t.innerHTML=`<i class="ph-bold ph-backspace"></i>`,t.id=`pin-key-${e}`):(t.className=`pin-btn aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-700 shadow-sm border border-slate-200`,t.textContent=e,t.id=`pin-key-${e}`),n.appendChild(t)}),e.appendChild(n),e}}})),h,g=e((()=>{s(),f(),m(),h={Login:()=>{let e=document.createElement(`div`);return e.className=`p-6 flex flex-col h-full justify-center fade-in`,e.innerHTML=`
            <div class="text-center mb-10">
                <div class="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
                    <i class="ph-duotone ph-fingerprint text-5xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Willkommen</h2>
                <p class="text-slate-500 leading-relaxed">
                    Bitte identifizieren Sie sich mit Ihrem Personalausweis, um sicher an Wahlen teilzunehmen.
                </p>
            </div>
            <button id="login-eid-btn" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-[0.98] transition flex items-center justify-center gap-3 text-lg">
                <i class="ph-bold ph-identification-card text-2xl"></i>
                Mit BundID anmelden
            </button>
            <div class="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <i class="ph-fill ph-shield-check text-green-500"></i>
                <span>Ende-zu-Ende verschlüsselt via PersoSim</span>
            </div>
        `,e},PinEntry:()=>{let e=document.createElement(`div`);e.className=`p-6 flex flex-col h-full pt-10 fade-in`;let t=document.createElement(`div`);if(t.className=`text-center mb-4`,t.innerHTML=`
            <h2 class="text-xl font-bold text-slate-800">2-Faktor Schutz</h2>
            <p class="text-sm text-slate-500 mt-1">Bitte geben Sie Ihre 6-stellige eID-PIN ein.</p>
        `,e.appendChild(t),o.error){let t=document.createElement(`div`);t.className=`bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-4 border border-red-100`,t.innerHTML=`<i class="ph-bold ph-warning mr-1"></i> ${o.error}`,e.appendChild(t)}return e.appendChild(p.PinPad()),e},Dashboard:()=>{let e=document.createElement(`div`);e.className=`p-4 space-y-4 fade-in`;let t=document.createElement(`div`);return t.className=`mb-6 mt-2`,t.innerHTML=`
            <h2 class="text-2xl font-bold text-slate-800">Hallo, ${o.user?o.user.name.split(` `)[0]:`Gast`}</h2>
            <div class="flex items-center gap-2 text-sm text-green-600 mt-1 bg-green-50 inline-block px-3 py-1 rounded-full border border-green-100">
                <i class="ph-bold ph-check-circle"></i> Identität verifiziert
            </div>
        `,e.appendChild(t),o.elections.forEach(t=>{let n=t.status===`voted`,r=t.status===`open`,i=n?`bg-blue-100 text-blue-700`:r?`bg-green-100 text-green-700`:`bg-slate-100 text-slate-500`,a=n?`Abgestimmt`:r?`Offen`:`Geschlossen`,o=n?`bg-blue-50 border-blue-200`:r?`bg-white border-slate-100 cursor-pointer transition active:scale-[0.98]`:`opacity-70 grayscale bg-white border-slate-100`,s=document.createElement(`div`);s.className=`p-5 rounded-2xl shadow-sm border relative overflow-hidden ${o}`,r&&(s.onclick=()=>{window.dispatchEvent(new CustomEvent(`action`,{detail:{name:`selectElection`,args:[t]}}))}),s.innerHTML=`
                <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${r?`from-blue-500/10 to-transparent`:n?`from-blue-200/50 to-transparent`:`from-slate-200 to-transparent`} rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
                <div class="flex justify-between items-start mb-2 relative z-10">
                    <div class="bg-slate-100 p-2 rounded-lg text-slate-600">
                        <i class="ph-bold ${t.type===`parliament`?`ph-bank`:`ph-users-three`} text-xl"></i>
                    </div>
                    <span class="${i} text-[10px] font-bold px-2 py-1 rounded-full uppercase">${a}</span>
                </div>
                <h3 class="font-bold text-lg text-slate-800 relative z-10">${t.title}</h3>
                <p class="text-sm text-slate-500 mt-1 line-clamp-2 relative z-10">${t.type===`parliament`?`Wählen Sie Ihre Vertreter.`:`Stimmen Sie über Sachfragen ab.`}</p>
                ${n?`<div class="mt-3 text-sm font-medium text-blue-600 flex items-center gap-1"><i class="ph-bold ph-check"></i> Ihre Stimme wurde registriert.</div>`:``}
            `,e.appendChild(s)}),e},Voting:()=>{let e=o.selectedElection;if(!e)return document.createElement(`div`);let t=e.type===`referendum`,n=document.createElement(`div`);return n.className=`flex flex-col h-full fade-in`,n.innerHTML=`
            <div class="p-4 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center gap-3">
                <button id="vote-back-btn" class="p-2 hover:bg-slate-50 rounded-full"><i class="ph-bold ph-arrow-left text-xl"></i></button>
                <div class="font-bold text-slate-800 truncate">${e.title}</div>
            </div>
            <div class="p-4 space-y-6 pb-32">
                ${t?`
                    <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 class="font-bold text-blue-900 mb-2"><i class="ph-bold ph-question mr-1"></i> Frage</h4>
                        <p class="text-blue-800 text-sm leading-relaxed">${e.question}</p>
                    </div>
                    <div class="space-y-3">
                        ${e.options?.map(e=>`
                            <div class="vote-opt" data-id="${e.id}" data-type="first"
                                 class="p-4 rounded-xl border-2 transition flex items-center justify-between cursor-pointer ${o.votes.first===e.id?`border-blue-600 bg-blue-50`:`border-slate-200 bg-white`}">
                                <span class="font-bold ${o.votes.first===e.id?`text-blue-700`:`text-slate-700`}">${e.name}</span>
                                ${o.votes.first===e.id?`<i class="ph-fill ph-check-circle text-2xl text-blue-600"></i>`:`<div class="w-6 h-6 rounded-full border-2 border-slate-300"></div>`}
                            </div>
                        `).join(``)}
                    </div>
                `:`
                    <div>
                        <h4 class="font-bold text-slate-700 mb-3 uppercase text-xs tracking-wider">Erststimme (Kandidat)</h4>
                        <div class="space-y-3">
                            ${e.candidates?.map(e=>`
                                <div class="vote-opt" data-id="${e.id}" data-type="first"
                                     class="p-3 rounded-xl border-2 transition cursor-pointer ${o.votes.first===e.id?`border-blue-600 bg-blue-50`:`border-slate-200 bg-white`}">
                                    <div class="flex justify-between">
                                        <div class="font-bold text-slate-800">${e.name}</div>
                                        ${o.votes.first===e.id?`<i class="ph-fill ph-check-circle text-blue-600"></i>`:``}
                                    </div>
                                    <div class="text-xs text-slate-500 mt-1">${e.party}</div>
                                </div>
                            `).join(``)}
                        </div>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-700 mb-3 mt-2 uppercase text-xs tracking-wider">Zweitstimme (Partei)</h4>
                        <div class="space-y-3">
                            ${e.parties?.map(e=>`
                                <div class="vote-opt" data-id="${e.id}" data-type="second"
                                     class="p-3 rounded-xl border-2 transition cursor-pointer ${o.votes.second===e.id?`border-indigo-600 bg-indigo-50`:`border-slate-200 bg-white`}">
                                    <div class="flex justify-between">
                                        <div class="font-bold text-slate-800">${e.name}</div>
                                        ${o.votes.second===e.id?`<i class="ph-fill ph-check-circle text-indigo-600"></i>`:``}
                                    </div>
                                    <div class="text-xs text-slate-500 mt-1">${e.desc}</div>
                                </div>
                            `).join(``)}
                        </div>
                    </div>
                `}
            </div>
            <div class="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-200 z-10 safe-area-bottom">
                <button id="vote-review-btn" 
                        ${d.isVoteComplete()?``:`disabled`}
                        class="w-full bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 text-white py-4 rounded-xl font-bold shadow-lg transition">
                    Zur Überprüfung
                </button>
            </div>
        `,n},Confirmation:()=>{let e=document.createElement(`div`);return e.className=`p-6 flex flex-col h-full fade-in`,e.innerHTML=`
            <h2 class="text-2xl font-bold text-slate-800 mb-2">Zusammenfassung</h2>
            <p class="text-slate-500 mb-6">Bitte prüfen Sie Ihre Auswahl vor der finalen, digitalen Signatur.</p>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 mb-8">
                <div class="flex gap-3 items-start">
                    <i class="ph-duotone ph-info text-blue-600 text-xl mt-1"></i>
                    <div class="text-sm text-slate-600">Ihre Stimme wird mit Ihrem eID-Token signiert und anonymisiert an den Server übermittelt.</div>
                </div>
                <hr class="border-slate-200">
                ${o.votes.first?`<div class="flex justify-between font-medium text-slate-800"><span>Auswahl 1:</span> <span>${d.getLabel(o.votes.first)}</span></div>`:``}
                ${o.votes.second?`<div class="flex justify-between font-medium text-slate-800"><span>Auswahl 2:</span> <span>${d.getLabel(o.votes.second)}</span></div>`:``}
            </div>
            <button id="vote-submit-btn" class="w-full bg-blue-800 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition flex items-center justify-center gap-3">
                <i class="ph-bold ph-lock-key"></i>
                Stimme Versiegeln & Abgeben
            </button>
            <button id="vote-cancel-btn" class="mt-4 w-full text-slate-500 font-medium">Korrektur vornehmen</button>
        `,e},Success:()=>{let e=document.createElement(`div`);return e.className=`p-6 flex flex-col h-full items-center justify-center text-center fade-in`,e.innerHTML=`
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <i class="ph-fill ph-check-circle text-6xl"></i>
            </div>
            <h2 class="text-3xl font-bold text-slate-800 mb-2">Erfolgreich!</h2>
            <p class="text-slate-500 mb-8">Ihre Stimme wurde gezählt und ist nun Teil der Blockchain.</p>
            <div class="bg-slate-100 p-4 rounded-lg w-full mb-8">
                <div class="text-xs text-slate-400 uppercase font-bold mb-1">Transaktions-Hash</div>
                <div class="font-mono text-xs text-slate-600 break-all">0x${Math.random().toString(16).substr(2,32)}...</div>
            </div>
            <button id="success-dashboard-btn" class="w-full bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg">
                Zurück zum Dashboard
            </button>
        `,e},About:()=>{let e=document.createElement(`div`);return e.className=`p-6 fade-in`,e.innerHTML=`
            <button id="about-back-btn" class="mb-4 flex items-center text-blue-600 font-medium"><i class="ph-bold ph-arrow-left mr-2"></i> Zurück</button>
            <h2 class="text-2xl font-bold text-slate-800 mb-4">Über & FAQ</h2>
            <div class="space-y-4">
                <details class="bg-white border border-slate-200 rounded-xl p-4 open:bg-slate-50">
                    <summary class="font-bold text-slate-700 cursor-pointer list-none flex justify-between">Wie sicher ist das? <i class="ph-bold ph-caret-down"></i></summary>
                    <p class="mt-2 text-sm text-slate-600">Durch die Nutzung des PersoSim/eID Kernels wird eine staatlich geprüfte 2-Faktor-Authentifizierung gewährleistet.</p>
                </details>
                <details class="bg-white border border-slate-200 rounded-xl p-4">
                    <summary class="font-bold text-slate-700 cursor-pointer list-none flex justify-between">Wie liegen meine Daten? <i class="ph-bold ph-caret-down"></i></summary>
                    <p class="mt-2 text-sm text-slate-600">Ihre Identitätsdaten werden nur zur Prüfung genutzt. Die Stimme selbst wird anonym gespeichert (Zero-Knowledge-Proof).</p>
                </details>
            </div>
        `,e}}}));t((()=>{s(),f(),m(),g();function e(){let e=document.getElementById(`app-root`);if(!e)return;e.innerHTML=``,o.nfcActive||e.appendChild(p.Header());let n=document.createElement(`main`);switch(n.className=`flex-grow overflow-y-auto pb-24 relative w-full`,o.view){case`login`:n.appendChild(h.Login());break;case`pin_entry`:n.appendChild(h.PinEntry());break;case`dashboard`:n.appendChild(h.Dashboard());break;case`voting`:n.appendChild(h.Voting());break;case`confirmation`:n.appendChild(h.Confirmation());break;case`success`:n.appendChild(h.Success());break;case`about`:n.appendChild(h.About());break}e.appendChild(n),o.menuOpen&&e.appendChild(p.MenuModal()),o.isLoading&&e.appendChild(p.LoadingOverlay()),o.nfcActive&&e.appendChild(p.PersoSimOverlay()),t()}function t(){document.getElementById(`menu-toggle`)?.addEventListener(`click`,()=>d.toggleMenu()),document.getElementById(`menu-close`)?.addEventListener(`click`,()=>d.toggleMenu()),document.getElementById(`nav-about`)?.addEventListener(`click`,()=>d.navigateTo(`about`)),document.getElementById(`logout-btn`)?.addEventListener(`click`,()=>d.logout()),document.getElementById(`login-eid-btn`)?.addEventListener(`click`,()=>d.startNfc()),document.getElementById(`cancel-nfc`)?.addEventListener(`click`,()=>d.cancelNfc()),document.querySelectorAll(`.pin-btn`).forEach(e=>{e.addEventListener(`click`,()=>d.pinInput(e.textContent||``))}),document.getElementById(`pin-submit`)?.addEventListener(`click`,()=>d.submitPin()),document.querySelectorAll(`[id^="pin-key-del"]`).forEach(e=>{e.addEventListener(`click`,()=>d.pinInput(`del`))}),document.querySelectorAll(`[id^="pin-key-"]`).forEach(e=>{e.id!==`pin-key-del`&&e.addEventListener(`click`,()=>d.pinInput(e.textContent||``))}),document.getElementById(`vote-back-btn`)?.addEventListener(`click`,()=>d.navigateTo(`dashboard`)),document.getElementById(`vote-review-btn`)?.addEventListener(`click`,()=>d.goToReview()),document.getElementById(`vote-submit-btn`)?.addEventListener(`click`,()=>d.submitVote()),document.getElementById(`vote-cancel-btn`)?.addEventListener(`click`,()=>d.navigateTo(`voting`)),document.getElementById(`success-dashboard-btn`)?.addEventListener(`click`,()=>d.navigateTo(`dashboard`)),document.getElementById(`about-back-btn`)?.addEventListener(`click`,()=>d.navigateTo(`dashboard`)),document.querySelectorAll(`.vote-opt`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-id`),n=e.getAttribute(`data-type`);t&&n&&d.vote(n,t)})})}e(),window.addEventListener(`statechange`,e),window.addEventListener(`action`,e=>{let{name:t,args:n}=e.detail;d[t]&&d[t](...n)})}))();