(function() {
    function Handler() {
        let _self = this;
        let nodes = {}

        let methods = {
            optsGoFwd: () => {
                let adSnippet = nodes.optsAdSnippet.value;
                if(adSnippet)
                    window.sessionStorage.setItem(ssURI.adSnippet, adSnippet);

                app.ui.showPage('converting');
                app.ui.convert.start();
            },

            optsGoBack: () => {
                app.ui.showPage('destination');
            }
        }

        let evtHandlers = {
            _optsAcceptClick: (e) => { methods.optsGoFwd.call(_self, e); },
            _optsCancelClick: (e) => { methods.optsGoBack.call(_self, e); }
        }

        this.id = "options";

        this.getNodes = () => {
            nodes.optsBtnAccept = document.querySelector('.page[role="options"] button.accept');
            nodes.optsBtnCancel = document.querySelector('.page[role="options"] button.cancel');
            nodes.optsAdSnippet = document.querySelector('.page[role="options"] #ad-snippet');
        }

        this.setEventListeners = () => {
            nodes.optsBtnAccept.addEventListener('click', evtHandlers._optsAcceptClick);
            nodes.optsBtnCancel.addEventListener('click', evtHandlers._optsCancelClick);
        }
    }
    
    app.ui.registerPage(new Handler(), document.currentScript.ownerDocument);
})();