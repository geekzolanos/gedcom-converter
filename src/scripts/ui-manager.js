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
        nodes.pagesContainer = document.querySelector('section[role="pages"]');
        nodes.ddContainer = document.querySelector('.dd-container');
        nodes.bgTone = document.querySelector('.bg-tone');
    }

    let setUIEvs = () => {
        // Aqui van los EventListeners de la app
        window.addEventListener('drop', (e) => { e.preventDefault(); }, false);
        window.addEventListener('dragover', (e) => { e.preventDefault(); }, false);

        nodes.ddContainer.addEventListener('click', evt_ddContainerClick);
        // Utilizamos la misma mezcla de Handler/Event para Drop y DragLeave (Solo por ahorrar espacio)
        nodes.ddContainer.addEventListener('drop', evt_ddContainerDrop);
        nodes.ddContainer.addEventListener('dragleave', evt_ddContainerDrop);
        nodes.ddContainer.addEventListener('dragover', evt_ddContainerDOver);
    }

    // Event Handlers
    let evt_ddContainerClick = (e) => {
        if(nodes.ddContainer.hasAttribute('open-dialog-visible') === false)
            _self.utils.openSelectorDialog.call(_self, e);
    }

    let evt_ddContainerDrop = (e) => {
        _self.utils.selectorDDHandler.call(_self, e);
    }

    let evt_ddContainerDOver = (e) => {
        _self.utils.selectorDDOver.call(_self, e);
    }

    // Metodos publicos
    this.initialize = () => {
        loadAllPages();
        getNodes();
        setUIEvs();
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

    this.showPage = (id) => {
        let activePages = nodes.pagesContainer.querySelectorAll('.page.active');
        let target = nodes.pagesContainer.querySelector('.page[role="' + id + '"]');
        if(activePages)
            activePages.forEach((elem) => {elem.classList.remove('active');});
        if(target)
            target.classList.add('active');
        else
            throw new ReferenceError('La pagina no existe.');

    }

    this.setBackgroundTone = (color) => {        
        color = color || 0;
        nodes.bgTone.setAttribute('data-color', color);        
    }

    // Utilerias
    this.utils = {
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
            else {
                this.setBackgroundTone(Tones.ALPHA_DARK);
                this.showPage('destination');
            }
        }            
    };

    // Inicializamos el modulo
    this.initialize();
}