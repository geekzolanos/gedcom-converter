(function() {
    function Handler() {
        let _self = this;
        let nodes = {}

        let methods = {
            prefsGoFwd: () => {
                let adSnippet = nodes.prefsAdSnippet.value;
                if(adSnippet)
                    window.sessionStorage.setItem(ssURI.adSnippet, adSnippet);

                app.ui.showPage('converting');
                app.ui.convert.start();
            },

            prefsGoBack: () => {
                app.ui.showPage('destination');
            }
        }

        let evtHandlers = {
            _prefsAcceptClick: (e) => { methods.prefsGoFwd.call(_self, e); },
            _prefsCancelClick: (e) => { methods.prefsGoBack.call(_self, e); }
        }

        this.id = "preferences";

        this.getNodes = () => {
            nodes.prefsBtnAccept = document.querySelector('.page[role="preferences"] button.accept');
            nodes.prefsBtnCancel = document.querySelector('.page[role="preferences"] button.cancel');
            nodes.prefsAdSnippet = document.querySelector('.page[role="preferences"] #ad-snippet');
        }

        this.setEventListeners = () => {
            nodes.prefsBtnAccept.addEventListener('click', evtHandlers._prefsAcceptClick);
            nodes.prefsBtnCancel.addEventListener('click', evtHandlers._prefsCancelClick);
        }
    }
    
    app.ui.registerPage(new Handler(), document.currentScript.ownerDocument);
})();