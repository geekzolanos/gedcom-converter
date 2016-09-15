// Preferences
nodes.prefsBtnAccept = document.querySelector('.page[role="preferences"] button.accept');
nodes.prefsBtnCancel = document.querySelector('.page[role="preferences"] button.cancel');
nodes.prefsAdSnippet = document.querySelector('.page[role="preferences"] #ad-snippet');

// Preferences
nodes.prefsBtnAccept.addEventListener('click', evt_prefsAcceptClick);
nodes.prefsBtnCancel.addEventListener('click', evt_prefsCancelClick);

// Preferences
let evt_prefsAcceptClick = (e) => { _self.utils.prefsGoFwd.call(_self, e); }
let evt_prefsCancelClick = (e) => { _self.utils.prefsGoBack.call(_self, e); }

// Preferences
prefsGoFwd: () => {
    let adSnippet = nodes.prefsAdSnippet.value;
    if(adSnippet)
        window.sessionStorage.setItem(ssURI.adSnippet, adSnippet);

    app.ui.showPage('converting');
    app.ui.utils.convStartProcess();
},

prefsGoBack: () => {
    app.ui.showPage('destination');
},