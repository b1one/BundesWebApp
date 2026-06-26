import { state } from '../../core/state';
import { Actions } from '../../core/actions';
import { Components } from '../components';

export const Views = {
    Login: () => {
        const el = document.createElement('div');
        el.className = "p-6 flex flex-col h-full justify-center fade-in";
        el.innerHTML = `
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
        `;
        return el;
    },

    PinEntry: () => {
        const el = document.createElement('div');
        el.className = "p-6 flex flex-col h-full pt-10 fade-in";
        const header = document.createElement('div');
        header.className = "text-center mb-4";
        header.innerHTML = `
            <h2 class="text-xl font-bold text-slate-800">2-Faktor Schutz</h2>
            <p class="text-sm text-slate-500 mt-1">Bitte geben Sie Ihre 6-stellige eID-PIN ein.</p>
        `;
        el.appendChild(header);
        if (state.error) {
            const err = document.createElement('div');
            err.className = "bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-4 border border-red-100";
            err.innerHTML = `<i class="ph-bold ph-warning mr-1"></i> ${state.error}`;
            el.appendChild(err);
        }
        el.appendChild(Components.PinPad());
        return el;
    },

    Dashboard: () => {
        const el = document.createElement('div');
        el.className = "p-4 space-y-4 fade-in";
        const welcome = document.createElement('div');
        welcome.className = "mb-6 mt-2";
        welcome.innerHTML = `
            <h2 class="text-2xl font-bold text-slate-800">Hallo, ${state.user ? state.user.name.split(' ')[0] : 'Gast'}</h2>
            <div class="flex items-center gap-2 text-sm text-green-600 mt-1 bg-green-50 inline-block px-3 py-1 rounded-full border border-green-100">
                <i class="ph-bold ph-check-circle"></i> Identität verifiziert
            </div>
        `;
        el.appendChild(welcome);
        state.elections.forEach(e => {
            const isVoted = e.status === 'voted';
            const isOpen = e.status === 'open';
            const statusClass = isVoted ? 'bg-blue-100 text-blue-700' : (isOpen ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500');
            const statusText = isVoted ? 'Abgestimmt' : (isOpen ? 'Offen' : 'Geschlossen');
            const cardClass = isVoted ? 'bg-blue-50 border-blue-200' : (isOpen ? 'bg-white border-slate-100 cursor-pointer transition active:scale-[0.98]' : 'opacity-70 grayscale bg-white border-slate-100');
            const card = document.createElement('div');
            card.className = `p-5 rounded-2xl shadow-sm border relative overflow-hidden ${cardClass}`;
            if (isOpen) {
                card.onclick = () => {
                    window.dispatchEvent(new CustomEvent('action', { detail: { name: 'selectElection', args: [e] } }));
                };
            }
            card.innerHTML = `
                <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${isOpen ? 'from-blue-500/10 to-transparent' : (isVoted ? 'from-blue-200/50 to-transparent' : 'from-slate-200 to-transparent')} rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
                <div class="flex justify-between items-start mb-2 relative z-10">
                    <div class="bg-slate-100 p-2 rounded-lg text-slate-600">
                        <i class="ph-bold ${e.type === 'parliament' ? 'ph-bank' : 'ph-users-three'} text-xl"></i>
                    </div>
                    <span class="${statusClass} text-[10px] font-bold px-2 py-1 rounded-full uppercase">${statusText}</span>
                </div>
                <h3 class="font-bold text-lg text-slate-800 relative z-10">${e.title}</h3>
                <p class="text-sm text-slate-500 mt-1 line-clamp-2 relative z-10">${e.type === 'parliament' ? 'Wählen Sie Ihre Vertreter.' : 'Stimmen Sie über Sachfragen ab.'}</p>
                ${isVoted ? `<div class="mt-3 text-sm font-medium text-blue-600 flex items-center gap-1"><i class="ph-bold ph-check"></i> Ihre Stimme wurde registriert.</div>` : ''}
            `;
            el.appendChild(card);
        });
        return el;
    },

    Voting: () => {
        const e = state.selectedElection;
        if (!e) return document.createElement('div');
        const isReferendum = e.type === 'referendum';
        const el = document.createElement('div');
        el.className = "flex flex-col h-full fade-in";
        el.innerHTML = `
            <div class="p-4 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center gap-3">
                <button id="vote-back-btn" class="p-2 hover:bg-slate-50 rounded-full"><i class="ph-bold ph-arrow-left text-xl"></i></button>
                <div class="font-bold text-slate-800 truncate">${e.title}</div>
            </div>
            <div class="p-4 space-y-6 pb-32">
                ${isReferendum ? `
                    <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 class="font-bold text-blue-900 mb-2"><i class="ph-bold ph-question mr-1"></i> Frage</h4>
                        <p class="text-blue-800 text-sm leading-relaxed">${e.question}</p>
                    </div>
                    <div class="space-y-3">
                        ${e.options?.map(opt => `
                            <div class="vote-opt" data-id="${opt.id}" data-type="first"
                                 class="p-4 rounded-xl border-2 transition flex items-center justify-between cursor-pointer ${state.votes.first === opt.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}">
                                <span class="font-bold ${state.votes.first === opt.id ? 'text-blue-700' : 'text-slate-700'}">${opt.name}</span>
                                ${state.votes.first === opt.id ? '<i class="ph-fill ph-check-circle text-2xl text-blue-600"></i>' : '<div class="w-6 h-6 rounded-full border-2 border-slate-300"></div>'}
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div>
                        <h4 class="font-bold text-slate-700 mb-3 uppercase text-xs tracking-wider">Erststimme (Kandidat)</h4>
                        <div class="space-y-3">
                            ${e.candidates?.map(c => `
                                <div class="vote-opt" data-id="${c.id}" data-type="first"
                                     class="p-3 rounded-xl border-2 transition cursor-pointer ${state.votes.first === c.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}">
                                    <div class="flex justify-between">
                                        <div class="font-bold text-slate-800">${c.name}</div>
                                        ${state.votes.first === c.id ? '<i class="ph-fill ph-check-circle text-blue-600"></i>' : ''}
                                    </div>
                                    <div class="text-xs text-slate-500 mt-1">${c.party}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-700 mb-3 mt-2 uppercase text-xs tracking-wider">Zweitstimme (Partei)</h4>
                        <div class="space-y-3">
                            ${e.parties?.map(p => `
                                <div class="vote-opt" data-id="${p.id}" data-type="second"
                                     class="p-3 rounded-xl border-2 transition cursor-pointer ${state.votes.second === p.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white'}">
                                    <div class="flex justify-between">
                                        <div class="font-bold text-slate-800">${p.name}</div>
                                        ${state.votes.second === p.id ? '<i class="ph-fill ph-check-circle text-indigo-600"></i>' : ''}
                                    </div>
                                    <div class="text-xs text-slate-500 mt-1">${p.desc}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `}
            </div>
            <div class="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-200 z-10 safe-area-bottom">
                <button id="vote-review-btn" 
                        ${!Actions.isVoteComplete() ? 'disabled' : ''}
                        class="w-full bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 text-white py-4 rounded-xl font-bold shadow-lg transition">
                    Zur Überprüfung
                </button>
            </div>
        `;
        return el;
    },

    Confirmation: () => {
        const el = document.createElement('div');
        el.className = "p-6 flex flex-col h-full fade-in";
        el.innerHTML = `
            <h2 class="text-2xl font-bold text-slate-800 mb-2">Zusammenfassung</h2>
            <p class="text-slate-500 mb-6">Bitte prüfen Sie Ihre Auswahl vor der finalen, digitalen Signatur.</p>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 mb-8">
                <div class="flex gap-3 items-start">
                    <i class="ph-duotone ph-info text-blue-600 text-xl mt-1"></i>
                    <div class="text-sm text-slate-600">Ihre Stimme wird mit Ihrem eID-Token signiert und anonymisiert an den Server übermittelt.</div>
                </div>
                <hr class="border-slate-200">
                ${state.votes.first ? `<div class="flex justify-between font-medium text-slate-800"><span>Auswahl 1:</span> <span>${Actions.getLabel(state.votes.first)}</span></div>` : ''}
                ${state.votes.second ? `<div class="flex justify-between font-medium text-slate-800"><span>Auswahl 2:</span> <span>${Actions.getLabel(state.votes.second)}</span></div>` : ''}
            </div>
            <button id="vote-submit-btn" class="w-full bg-blue-800 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition flex items-center justify-center gap-3">
                <i class="ph-bold ph-lock-key"></i>
                Stimme Versiegeln & Abgeben
            </button>
            <button id="vote-cancel-btn" class="mt-4 w-full text-slate-500 font-medium">Korrektur vornehmen</button>
        `;
        return el;
    },

    Success: () => {
        const el = document.createElement('div');
        el.className = "p-6 flex flex-col h-full items-center justify-center text-center fade-in";
        el.innerHTML = `
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <i class="ph-fill ph-check-circle text-6xl"></i>
            </div>
            <h2 class="text-3xl font-bold text-slate-800 mb-2">Erfolgreich!</h2>
            <p class="text-slate-500 mb-8">Ihre Stimme wurde gezählt und ist nun Teil der Blockchain.</p>
            <div class="bg-slate-100 p-4 rounded-lg w-full mb-8">
                <div class="text-xs text-slate-400 uppercase font-bold mb-1">Transaktions-Hash</div>
                <div class="font-mono text-xs text-slate-600 break-all">0x${Math.random().toString(16).substr(2, 32)}...</div>
            </div>
            <button id="success-dashboard-btn" class="w-full bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg">
                Zurück zum Dashboard
            </button>
        `;
        return el;
    },

    About: () => {
        const el = document.createElement('div');
        el.className = "p-6 fade-in";
        el.innerHTML = `
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
        `;
        return el;
    }
};
