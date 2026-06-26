import { state } from '../../core/state';

export const Components = {
    Header: () => {
        const el = document.createElement('header');
        el.className = "bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 shrink-0 z-20";
        el.innerHTML = `
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
        `;
        return el;
    },

    LoadingOverlay: () => {
        const el = document.createElement('div');
        el.className = "absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center fade-in";
        el.innerHTML = `
            <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p class="text-slate-600 font-medium animate-pulse">${state.loadingMessage || 'Verarbeite...'}</p>
        `;
        return el;
    },

    PersoSimOverlay: () => {
        const el = document.createElement('div');
        el.className = "absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center text-white p-6 fade-in";
        el.innerHTML = `
            <div class="absolute top-0 left-0 w-full p-4 flex justify-between items-center opacity-50">
                <span class="text-xs font-mono">PersoSim Simulator Interface</span>
                <i class="ph-fill ph-wifi-high"></i>
            </div>
            <div class="relative flex items-center justify-center mb-10">
                <div class="nfc-ripple"></div>
                <div class="nfc-ripple"></div>
                <div class="nfc-ripple"></div>
                <i class="ph-duotone ph-identification-card text-8xl relative z-10 text-blue-400"></i>
            </div>
            <h2 class="text-2xl font-bold mb-2 text-center">Ausweis bereit</h2>
            <p class="text-slate-300 text-center mb-8 max-w-xs">
                Halten Sie Ihren Personalausweis an die Rückseite Ihres Gerätes, um die eID-Funktion zu nutzen.
            </p>
            <div class="bg-slate-800 rounded-lg p-4 w-full max-w-xs border border-slate-700 flex items-center gap-3">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-slate-300 font-mono">Scanner aktiv...</span>
            </div>
            <button id="cancel-nfc" class="mt-12 text-slate-400 hover:text-white text-sm font-medium py-2 px-6 border border-slate-600 rounded-full">
                Abbrechen
            </button>
        `;
        return el;
    },

    MenuModal: () => {
        const el = document.createElement('div');
        el.className = "absolute inset-0 bg-black/50 z-40";
        el.onclick = (e) => { if((e.target as HTMLElement) === el) {
            window.dispatchEvent(new CustomEvent('action', { detail: { name: 'toggleMenu' } }));
        } };
        
        const content = document.createElement('div');
        content.className = "absolute top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-2xl p-6 slide-in-right flex flex-col";
        content.innerHTML = `
            <div class="flex justify-end mb-8">
                <button id="menu-close" class="p-2 bg-slate-100 rounded-full text-slate-500">
                    <i class="ph-bold ph-x text-xl"></i>
                </button>
            </div>
            <nav class="space-y-2">
                ${state.user ? `
                    <div class="p-4 bg-blue-50 rounded-xl mb-6 border border-blue-100">
                        <div class="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Angemeldet als</div>
                        <div class="font-bold text-slate-800">${state.user.name}</div>
                        <div class="text-xs text-slate-500 mt-1 font-mono">ID: ${state.user.id}</div>
                    </div>
                ` : ''}
                <button id="nav-about" class="w-full text-left p-4 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium">
                    <i class="ph-bold ph-info text-blue-600"></i> Über die App & FAQ
                </button>
                <button onclick="window.open('https://github.com/PersoSim', '_blank')" class="w-full text-left p-4 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium">
                    <i class="ph-bold ph-code text-blue-600"></i> PersoSim Projekt
                </button>
            </nav>
            ${state.user ? `
                <div class="mt-auto border-t border-slate-100 pt-6">
                    <button id="logout-btn" class="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition">
                        <i class="ph-bold ph-sign-out"></i> Abmelden
                    </button>
                </div>
            ` : ''}
        `;
        el.appendChild(content);
        return el;
    },

    PinPad: () => {
        const pad = document.createElement('div');
        pad.className = "mt-auto w-full max-w-[300px] mx-auto";
        const display = document.createElement('div');
        display.className = "flex justify-center gap-3 mb-8";
        for (let i=0; i<6; i++) {
            const dot = document.createElement('div');
            const active = i < state.pinInput.length;
            dot.className = `w-4 h-4 rounded-full border-2 transition-all duration-200 ${active ? 'bg-blue-600 border-blue-600 scale-110' : 'bg-transparent border-slate-300'}`;
            display.appendChild(dot);
        }
        pad.appendChild(display);
        const grid = document.createElement('div');
        grid.className = "grid grid-cols-3 gap-4";
        const keys = ['1','2','3','4','5','6','7','8','9','del','0','ok'];
        keys.forEach(k => {
            const btn = document.createElement('button');
            if (k === 'ok') {
                btn.className = "aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm bg-blue-600 text-white active:bg-blue-700 transition";
                btn.innerHTML = `<i class="ph-bold ph-check"></i>`;
                btn.id = 'pin-submit';
                if (state.pinInput.length !== 6) btn.classList.add('opacity-50', 'cursor-not-allowed');
            } else if (k === 'del') {
                btn.className = "aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm bg-slate-200 text-slate-600 active:bg-slate-300 transition";
                btn.innerHTML = `<i class="ph-bold ph-backspace"></i>`;
                btn.id = `pin-key-${k}`;
            } else {
                btn.className = "pin-btn aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-700 shadow-sm border border-slate-200";
                btn.textContent = k;
                btn.id = `pin-key-${k}`;
            }
            grid.appendChild(btn);
        });
        pad.appendChild(grid);
        return pad;
    }
};
