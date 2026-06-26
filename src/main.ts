import { state, setState } from './core/state';
import { Actions } from './core/actions';
import { Components } from './ui/components';
import { Views } from './ui/views';

function render() {
    const root = document.getElementById('app-root');
    if (!root) return;
    root.innerHTML = '';

    if (!state.nfcActive) {
        root.appendChild(Components.Header());
    }

    const main = document.createElement('main');
    main.className = "flex-grow overflow-y-auto pb-24 relative w-full";
    
    switch(state.view) {
        case 'login': main.appendChild(Views.Login()); break;
        case 'pin_entry': main.appendChild(Views.PinEntry()); break;
        case 'dashboard': main.appendChild(Views.Dashboard()); break;
        case 'voting': main.appendChild(Views.Voting()); break;
        case 'confirmation': main.appendChild(Views.Confirmation()); break;
        case 'success': main.appendChild(Views.Success()); break;
        case 'about': main.appendChild(Views.About()); break;
    }
    root.appendChild(main);

    if (state.menuOpen) root.appendChild(Components.MenuModal());
    if (state.isLoading) root.appendChild(Components.LoadingOverlay());
    if (state.nfcActive) root.appendChild(Components.PersoSimOverlay());

    attachEventListeners();
}

function attachEventListeners() {
    // Menu
    document.getElementById('menu-toggle')?.addEventListener('click', () => Actions.toggleMenu());
    document.getElementById('menu-close')?.addEventListener('click', () => Actions.toggleMenu());
    document.getElementById('nav-about')?.addEventListener('click', () => Actions.navigateTo('about'));
    document.getElementById('logout-btn')?.addEventListener('click', () => Actions.logout());

    // Login
    document.getElementById('login-eid-btn')?.addEventListener('click', () => Actions.startNfc());

    // NFC
    document.getElementById('cancel-nfc')?.addEventListener('click', () => Actions.cancelNfc());

    // PinPad
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', () => Actions.pinInput(btn.textContent || ''));
    });
    document.getElementById('pin-submit')?.addEventListener('click', () => Actions.submitPin());
    // Handle del key separately since it's not .pin-btn
    document.querySelectorAll('[id^="pin-key-del"]').forEach(btn => {
        btn.addEventListener('click', () => Actions.pinInput('del'));
    });
    // Handle numeric keys that aren't .pin-btn (like '0' which might not have the class in the loop)
    document.querySelectorAll('[id^="pin-key-"]').forEach(btn => {
        if (btn.id !== 'pin-key-del') {
            btn.addEventListener('click', () => Actions.pinInput(btn.textContent || ''));
        }
    });

    // Voting
    document.getElementById('vote-back-btn')?.addEventListener('click', () => Actions.navigateTo('dashboard'));
    document.getElementById('vote-review-btn')?.addEventListener('click', () => Actions.goToReview());
    document.getElementById('vote-submit-btn')?.addEventListener('click', () => Actions.submitVote());
    document.getElementById('vote-cancel-btn')?.addEventListener('click', () => Actions.navigateTo('voting'));
    document.getElementById('success-dashboard-btn')?.addEventListener('click', () => Actions.navigateTo('dashboard'));
    document.getElementById('about-back-btn')?.addEventListener('click', () => Actions.navigateTo('dashboard'));

    // Selection options in voting view
    document.querySelectorAll('.vote-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            const id = opt.getAttribute('data-id');
            const type = opt.getAttribute('data-type') as 'first' | 'second';
            if (id && type) Actions.vote(type, id);
        });
    });
}

// Initial Render
render();

// Listen for state changes to trigger re-render
window.addEventListener('statechange', render);

// Listen for generic actions (used in some dynamic components)
window.addEventListener('action', (e: any) => {
    const { name, args } = e.detail;
    if (Actions[name as keyof typeof Actions]) {
        (Actions[name as keyof typeof Actions] as Function)(...args);
    }
});
