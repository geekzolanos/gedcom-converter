//
//  UI Manager
//  Administrador de la Interfaz de usuario
//

window.UIManager = function() {
    // Propiedades
    let _self = this;
    let nodes = {};
    let pages = [
        'selector',
        'destination',
        'preferences',
        'converting'
    ];

    // Metodos Privados
    let loadAllPages = () => {        
        let container = document.querySelector('section[role="pages"]');

        pages.forEach((elem) => {
            let importNode = document.head.querySelector('link[rel="import"]#' + elem).import;
            let content = importNode.querySelector('template').content;
            container.appendChild(content.cloneNode(true));
        });
    }

    let getNodes = () => {
        // Shell
        nodes.btnAbout = document.querySelector('header .btn-about');
        nodes.pagesContainer = document.querySelector('section[role="pages"]');
        nodes.bgTone = document.querySelector('.bg-tone');

        // Selector
        nodes.ddContainer = document.querySelector('.dd-container');

        // Destination
        nodes.destContainer = document.querySelector('.dest-container');
        nodes.destPathSubtitle = nodes.destContainer.querySelector('h2');
        nodes.destBtnAccept = document.querySelector('.page[role="destination"] button.accept');
        nodes.destBtnCancel = document.querySelector('.page[role="destination"] button.cancel');

        // Preferences
        nodes.prefsBtnAccept = document.querySelector('.page[role="preferences"] button.accept');
        nodes.prefsBtnCancel = document.querySelector('.page[role="preferences"] button.cancel');
        nodes.prefsAdSnippet = document.querySelector('.page[role="preferences"] #ad-snippet');

        // Converting
        nodes.convBtnCancel = document.querySelector('.page[role="converting"] button.cancel');
        nodes.convProgressBar = document.querySelector('.page[role="converting"] progress');
        nodes.convCurrentNode = document.querySelector('.page[role="converting"] span.current');
        nodes.convTotalNodes = document.querySelector('.page[role="converting"] span.total');
    }

    let setUIEvs = () => {
        // Shell
        window.addEventListener('drop', (e) => { e.preventDefault(); }, false);
        window.addEventListener('dragover', (e) => { e.preventDefault(); }, false);
        nodes.btnAbout.addEventListener('click', evt_shellBtnAboutClick);

        // Selector
        nodes.ddContainer.addEventListener('click', evt_ddContainerClick);
        // Utilizamos la misma mezcla de Handler/Event para Drop y DragLeave (Solo por ahorrar espacio)
        nodes.ddContainer.addEventListener('drop', evt_ddContainerDrop);
        nodes.ddContainer.addEventListener('dragleave', evt_ddContainerDrop);
        nodes.ddContainer.addEventListener('dragover', evt_ddContainerDOver);

        // Destination
        nodes.destContainer.addEventListener('click', evt_destContainerClick);
        nodes.destBtnAccept.addEventListener('click', evt_destAcceptClick);
        nodes.destBtnCancel.addEventListener('click', evt_destCancelClick);

        // Preferences
        nodes.prefsBtnAccept.addEventListener('click', evt_prefsAcceptClick);
        nodes.prefsBtnCancel.addEventListener('click', evt_prefsCancelClick);

        // Converting
        nodes.convBtnCancel.addEventListener('click', evt_convCancelClick);
    }

    // Event Handlers
    // Shell
    let evt_shellBtnAboutClick = (e) => { _self.utils.showAboutMsg(); }

    // Selector
    let evt_ddContainerDrop = (e) => { _self.utils.selectorDDHandler.call(_self, e); }
    let evt_ddContainerDOver = (e) => { _self.utils.selectorDDOver.call(_self, e); }
    let evt_ddContainerClick = (e) => {
        if (nodes.ddContainer.hasAttribute('open-dialog-visible') === false)
            _self.utils.openSelectorDialog.call(_self, e);
    }

    // Destination
    let evt_destAcceptClick = (e) => { _self.utils.destGoFwd.call(_self, e); }
    let evt_destCancelClick = (e) => { _self.utils.destGoBack.call(_self, e); }
    let evt_destContainerClick = (e) => { 
        if (nodes.destContainer.hasAttribute('open-dialog-visible') === false)
            _self.utils.destOpenDialog.call(_self, e); 
    }

    // Preferences
    let evt_prefsAcceptClick = (e) => { _self.utils.prefsGoFwd.call(_self, e); }
    let evt_prefsCancelClick = (e) => { _self.utils.prefsGoBack.call(_self, e); }

    // Converting
    let evt_convCancelClick = (e) => { _self.utils.convCancel.call(_self, e); }

    // Metodos publicos
    this.initialize = () => {
        // Limpiamos la sessionStorage (Por precaucion)
        window.sessionStorage.clear();
        // Cargamos las paginas
        loadAllPages();
        // Establecemos los nodos
        getNodes();
        // Configuramos la UI
        setUIEvs();
        // Mostramos la pagina principal
        this.showPage(APP_START_PAGE);
    };

    this.setGCFile = (filepath) => {
        // Por precaucion
        if(!filepath)
            return false;

        // filepath debe ser un String
        if (filepath.constructor != String)
            return false;

        // filepath debe indicar la ruta a un archivo de extension GED
        else if (path.extname(filepath) != '.ged')
            return false;
        
        // Si todo esta en orden, procedemos a almacenar la referencia
        window.sessionStorage.setItem(ssURI.filePath, filepath);
        return true;
    }

    this.setDestination = (dirpath) => {
        // Por precaucion
        if(!dirpath)
            return false;

        // filepath debe ser un String
        if (dirpath.constructor != String)
            return false;
        
        // Si todo esta en orden, procedemos a almacenar la referencia
        window.sessionStorage.setItem(ssURI.dirPath, dirpath);
        return true;
    }

    this.showPage = (id) => {
        let activePages = nodes.pagesContainer.querySelectorAll('.page.active');
        let target = nodes.pagesContainer.querySelector('.page[role="' + id + '"]');

        if(activePages) {
            activePages.forEach((elem) => {
                elem.classList.remove('visible');
                elem.classList.add('hidden');
            });
        }
        
        if (!target)
            throw new ReferenceError('La pagina no existe.');
        
        target.classList.remove('hidden');
        target.classList.add('active');
        target.classList.add('visible');

        // Modificamos el tono de fondo
        this.setBackgroundTone(target.getAttribute('data-bg-tone'));
    }

    this.setBackgroundTone = (color) => {        
        color = color || 0;
        nodes.bgTone.setAttribute('data-color', color);        
    }

    // Utilerias
    this.utils = {
        // Shell
        showAboutMsg: () => {
            electron.dialog.showMessageBox({
                type: "info",
                buttons: [],
                title: "Acerca de...",
                message: "Gedcom Converter",
                detail: "Version 1.0\nDesarrollado por Geekzolanos para Upwork.\nPara mas informacion contactenos enviando un correo a\n\ngeekzolanos@gmail.com"
            });
        },

        // Selector
        openSelectorDialog: (e) => {
            // No debemos permitir la apertura de mas de un cuadro de dialogo.
            nodes.ddContainer.setAttribute('open-dialog-visible', true);

            electron.dialog.showOpenDialog({
                properties: ['openFile'], 
                title: 'Select a GEDCOM File', 
                filters: [{name: 'GEDCOM Files', extensions: ['ged']}]
            }, this.utils.selectorSgfHandler);
        },

        selectorDDOver: (e) => {
            e.preventDefault();      
            e.dataTransfer.dropEffect = "move";
            if(nodes.ddContainer.classList.contains('dropping') === false)
                nodes.ddContainer.classList.add('dropping');
        },

        selectorDDHandler: (e) => {
            e.preventDefault();
            nodes.ddContainer.classList.remove('dropping');
            if((e.type == "drop") && (e.dataTransfer.files.length > 0)) {
                let filepath = e.dataTransfer.files[0].path;
                this.utils.selectorSgfHandler(filepath);
            }
        },

        // Sgf: SetGCFile
        selectorSgfHandler: (filepath) => {
            // No debemos permitir la apertura de mas de un cuadro de dialogo.
            nodes.ddContainer.removeAttribute('open-dialog-visible');

            // filepath puede no estar definido
            if(!filepath)
                return false;

            // filepath puede ser un array si proviene de un cuadro de dialogo
            else if (Array.isArray(filepath) === true)
                filepath = filepath[0];
        
            if(this.setGCFile(filepath) === false)
                electron.dialog.showErrorBox('Invalid File', 'The selected file is not a valid GEDCOM File. Please, try again.');
            else 
                this.showPage('destination');
        },

        // Destination   
        destOpenDialog: () => {
            // No debemos permitir la apertura de mas de un cuadro de dialogo.
            nodes.destContainer.setAttribute('open-dialog-visible', true);

            electron.dialog.showOpenDialog({
                properties: ['openDirectory'], 
                title: 'Select destination'
            }, this.utils.destSetDestinationHandler);
        },

        destSetDestinationHandler: (dirpath) => {            
            // No debemos permitir la apertura de mas de un cuadro de dialogo.
            nodes.destContainer.removeAttribute('open-dialog-visible');

            if(!dirpath)
                return false;
            else if (Array.isArray(dirpath) === true)
                dirpath = dirpath[0];

            nodes.destContainer.dirpath = dirpath;
            nodes.destPathSubtitle.innerHTML = dirpath;
            nodes.destBtnAccept.disabled = false;
        },

        destGoFwd: () => {
            let dirpath = nodes.destContainer.dirpath;
            if(this.setDestination(dirpath) === false)
                electron.dialog.showErrorBox('Invalid File', 'The selected destination is invalid. Please, try again.');
            else 
                this.showPage('preferences');
        },

        destGoBack: () => {
            this.showPage('selector');
        },

        // Preferences
        prefsGoFwd: () => {
            let adSnippet = nodes.prefsAdSnippet.innerHTML;
            if(adSnippet)
                window.sessionStorage.setItem(ssURI.adSnippet, adSnippet);

            this.showPage('converting');
            // Damos tiempo a la aplicacion para finalizar la transicion entre paginas
            // TODO: Migrar el generador a un Worker para otorgar multiprocesamiento.
            setTimeout(app.generator.start, 1000);
        },

        prefsGoBack: () => {
            this.showPage('destination');
        },

        // Converting
        convCancel: () => {
            electron.dialog.showMessageBox({
                type: "question",
                buttons: ['Yes', 'No'],
                title: 'Gedcom Converter',
                message: 'Confirme, ¿Desea cancelar el proceso de conversion?'
            }, (e) => { if(e == 0) document.location.reload(); });
        },

        convUpdateProgress: (current) => {
            let total = parseInt(window.sessionStorage.getItem(ssURI.totalNodes));
            let progressVal = (current * 100) / (total - 1);

            nodes.convCurrentNode.innerHTML = current + 1;
            nodes.convTotalNodes.innerHTML = total;
            nodes.convProgressBar.value = progressVal;
        },

        convShowSuccessMsg: () => {            
            electron.dialog.showMessageBox({
                type: 'info',
                buttons: [],
                title: 'Gedcom Converter',
                message: 'Proceso Finalizado',
                detail: 'El proceso de conversion ha finalizado satisfactoriamente.\nRuta de salida: ' + window.sessionStorage.getItem(ssURI.dirPath)                    
            }, () => { document.location.reload(); });
            
            return true;
        },

        convThrowFatalError: () => {
            electron.dialog.showMessageBox({
                type: 'error',
                buttons: [],
                title: 'Gedcom Converter',
                message: 'Error Fatal',
                detail: 'Ha ocurrido un error irrecuperable mientras durante la conversion del archivo, el proceso no puede continuar.'
            }, () => { document.location.reload(); });
        }
    };

    // Inicializamos el modulo
    this.initialize();
}