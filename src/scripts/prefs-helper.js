//
//  PreferencesHelper
//  Helper para el manejo de preferencias en la app
//
(function() {
    let preferencesURI = {
        filePath: 'app://gviewer.gk.com/session/current/filepath',
        dirPath: 'app://gviewer.gk.com/session/current/dirpath',
        adSnippet: 'app://gviewer.gk.com/session/current/prefs/adSnippet',
        totalNodes: 'app://gviewer.gk.com/session/progress/totalNodes'
    };

    window.Preferences = {
        /* No Persistentes */
        get filePath() { return window.sessionStorage.getItem(preferencesURI.filePath); },
        set filePath(data) { window.sessionStorage.setItem(preferencesURI.filePath, data); },

        get dirPath() { return window.sessionStorage.getItem(preferencesURI.dirPath); },
        set dirPath(data) { window.sessionStorage.setItem(preferencesURI.dirPath, data); },

        /* Preferencias de sesion */
        get adSnippet() { return window.sessionStorage.getItem(preferencesURI.adSnippet); },
        set adSnippet(data) { window.sessionStorage.setItem(preferencesURI.adSnippet, data); },

        /* Progreso total */
        get totalNodes() { return parseInt(window.sessionStorage.getItem(preferencesURI.adSnippet)); },
        set totalNodes(data) { window.sessionStorage.setItem(preferencesURI.adSnippet, data); }    
    }
})();