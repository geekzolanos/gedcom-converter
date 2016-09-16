//
//  PreferencesHelper
//  Helper para el manejo de preferencias en la app
//
(function() {
    let firstRun = null;

    let preferencesURI = {
        filePath: 'app://gconv.gk.com/session/filepath',
        dirPath: 'app://gconv.gk.com/session/dirpath',
        adSnippet: 'app://gconv.gk.com/session/options/adSnippet',
        noHome: 'app://gconv.gk.com/session/options/noHome',
        noFamily: 'app://gconv.gk.com/session/options/noFamily',
        prologe: 'app://gconv.gk.com/session/options/prologe',
        credits: 'app://gconv.gk.com/session/options/credits',
        totalNodes: 'app://gconv.gk.com/session/progress/totalNodes',
        p_enabled: 'app://gconv.gk.com/persist/enabled',
        p_adSnippet: 'app://gconv.gk.com/persist/options/adSnippet',
        p_noHome: 'app://gconv.gk.com/persist/options/noHome',
        p_noFamily: 'app://gconv.gk.com/persist/options/noFamily',
        p_prologe: 'app://gconv.gk.com/persist/options/prologe',
        p_credits: 'app://gconv.gk.com/persist/options/credits'
    };

    window.Preferences = {        
        /* No Persistentes */
        session: {
            /* Basicas de conversion */
            get filePath() { return window.sessionStorage.getItem(preferencesURI.filePath); },
            set filePath(data) { window.sessionStorage.setItem(preferencesURI.filePath, data); },

            get dirPath() { return window.sessionStorage.getItem(preferencesURI.dirPath); },
            set dirPath(data) { window.sessionStorage.setItem(preferencesURI.dirPath, data); },

            
            /* Progreso total */
            progress: {
                get totalNodes() { return parseInt(window.sessionStorage.getItem(preferencesURI.adSnippet)); },
                set totalNodes(data) { window.sessionStorage.setItem(preferencesURI.adSnippet, data); } 
            },

            /* Opciones de personalizacion */
            options: {
                get adSnippet() { return window.sessionStorage.getItem(preferencesURI.adSnippet); },
                set adSnippet(data) { window.sessionStorage.setItem(preferencesURI.adSnippet, data); },
                
                get noHome() { return window.sessionStorage.getItem(preferencesURI.noHome); },
                set noHome(data) { window.sessionStorage.setItem(preferencesURI.noHome, data); },

                get noFamily() { return window.sessionStorage.getItem(preferencesURI.noFamily); },
                set noFamily(data) { window.sessionStorage.setItem(preferencesURI.noFamily, data); },

                get prologe() { return window.sessionStorage.getItem(preferencesURI.prologe); },
                set prologe(data) { window.sessionStorage.setItem(preferencesURI.prologe, data); },

                get credits() { return window.sessionStorage.getItem(preferencesURI.credits); },
                set credits(data) { window.sessionStorage.setItem(preferencesURI.credits, data); }
            }
        },

        /* Persistentes */
        persist: {
            get enabled() { return window.localStorage.getItem(preferencesURI.p_enabled) || false; },
            set enabled(data) { window.localStorage.setItem(preferencesURI.p_enabled, data); },

            /* Opciones de personalizacion */
            options: {
                get adSnippet() { return window.localStorage.getItem(preferencesURI.p_adSnippet); },
                set adSnippet(data) { window.localStorage.setItem(preferencesURI.p_adSnippet, data); },

                get noHome() { return window.localStorage.getItem(preferencesURI.p_noHome); },
                set noHome(data) { window.localStorage.setItem(preferencesURI.p_noHome, data); },

                get noFamily() { return window.localStorage.getItem(preferencesURI.p_noFamily); },
                set noFamily(data) { window.localStorage.setItem(preferencesURI.p_noFamily, data); },

                get prologe() { return window.localStorage.getItem(preferencesURI.p_prologe); },
                set prologe(data) { window.localStorage.setItem(preferencesURI.p_prologe, data); },

                get credits() { return window.localStorage.getItem(preferencesURI.p_credits); },
                set credits(data) { window.localStorage.setItem(preferencesURI.p_credits, data); }
            }
        }
    }

    // Limpiamos la sessionStorage (Por precaucion)
    window.sessionStorage.clear();
})();