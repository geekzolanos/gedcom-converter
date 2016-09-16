(function() {
    function Handler() {
        let _self = this;
        let nodes = {}

        let methods = {
            updateOptions: () => {
                Preferences.session.options.adSnippet = nodes.optsAdSnippet.content;
                Preferences.session.options.noHome = nodes.optsNoHome.checked;
                Preferences.session.options.noFamily = nodes.optsNoFamily.checked;
                Preferences.session.options.prologe = nodes.optsAddProloge.checked;
                Preferences.session.options.credits = nodes.optsAddCredits.checked;
                Preferences.persist.enabled = nodes.optsOverwritePersist.checked;

                if(parseBool(Preferences.persist.enabled) === true) {
                    Preferences.persist.options.adSnippet = nodes.optsAdSnippet.content;
                    Preferences.persist.options.noHome = nodes.optsNoHome.checked;
                    Preferences.persist.options.noFamily = nodes.optsNoFamily.checked;
                    Preferences.persist.options.prologe = nodes.optsAddProloge.checked;
                    Preferences.persist.options.credits = nodes.optsAddCredits.checked;
                }
            },

            writePersistentOpts: () => {
                if(parseBool(Preferences.persist.enabled) === true) {
                    nodes.optsOverwritePersist.checked = parseBool(Preferences.persist.enabled);
                    nodes.optsNoHome.checked = parseBool(Preferences.persist.options.noHome);
                    nodes.optsNoFamily.checked = parseBool(Preferences.persist.options.noFamily);
                    nodes.optsAddProloge.checked = parseBool(Preferences.persist.options.prologe);
                    nodes.optsAddCredits.checked = parseBool(Preferences.persist.options.credits);
                    
                    if(!Preferences.persist.options.adSnippet.empty()) {
                        nodes.optsAdSnippetCheck.checked = true;
                        nodes.optsAdSnippet.disabled = false;
                        nodes.optsAdSnippet.content = Preferences.persist.options.adSnippet;
                    }
                }
            },

            optsGoFwd: () => {
                methods.updateOptions();
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
            nodes.optsAdSnippetCheck = document.querySelector('.page[role="options"] #ad-snippet-enabled');
            nodes.optsAdSnippet = document.querySelector('.page[role="options"] #ad-snippet');
            nodes.optsNoHome = document.querySelector('.page[role="options"] #no-home');
            nodes.optsNoFamily = document.querySelector('.page[role="options"] #no-family');
            nodes.optsAddProloge = document.querySelector('.page[role="options"] #prologe');
            nodes.optsAddCredits = document.querySelector('.page[role="options"] #credits');
            nodes.optsOverwritePersist = document.querySelector('.page[role="options"] #overwrite-persist');
        }

        this.setEventListeners = () => {
            nodes.optsBtnAccept.addEventListener('click', evtHandlers._optsAcceptClick);
            nodes.optsBtnCancel.addEventListener('click', evtHandlers._optsCancelClick);
            nodes.optsAdSnippetCheck.addEventListener('change', (e) => { nodes.optsAdSnippet.disabled = !(e.target.checked); });

            // Tomamos ventaja de este metodo para escribir la informacion de persistencia
            methods.writePersistentOpts();
        }
    }
    
    app.ui.registerPage(new Handler(), document.currentScript.ownerDocument);
})();