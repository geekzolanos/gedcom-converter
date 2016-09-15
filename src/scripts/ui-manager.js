//
//  UI Manager
//  Administrador de la Interfaz de usuario
//
(function() {
     // Propiedades
    let _self = app.ui;
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
    }

    let setUIEvs = () => {
        // Shell
        window.addEventListener('drop', (e) => { e.preventDefault(); }, false);
        window.addEventListener('dragover', (e) => { e.preventDefault(); }, false);
        nodes.btnAbout.addEventListener('click', evt_shellBtnAboutClick);

        // Utilizamos la misma mezcla de Handler/Event para Drop y DragLeave (Solo por ahorrar espacio)
        nodes.ddContainer.addEventListener('drop', evt_ddContainerDrop);
        nodes.ddContainer.addEventListener('dragleave', evt_ddContainerDrop);
        nodes.ddContainer.addEventListener('dragover', evt_ddContainerDOver);
    }

    // Event Handlers
    // Shell
    let evt_shellBtnAboutClick = (e) => { _self.utils.showAboutMsg(); }


    window.app.ui = {
       // Metodos publicos
        initialize: () => {
            // Limpiamos la sessionStorage (Por precaucion)
            window.sessionStorage.clear();
            // ContextMenu
            ctxMenu.use(inputCtxMenu);
            ctxMenu.activate();
            // Cargamos las paginas
            loadAllPages();
            // Establecemos los nodos
            getNodes();
            // Configuramos la UI
            setUIEvs();
            // Mostramos la pagina principal
            app.ui.showPage(APP_START_PAGE);
        },

        setGCFile: (filepath) => {
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
        },

        setDestination: (dirpath) => {
            // Por precaucion
            if(!dirpath)
                return false;

            // filepath debe ser un String
            if (dirpath.constructor != String)
                return false;
            
            // Si todo esta en orden, procedemos a almacenar la referencia
            window.sessionStorage.setItem(ssURI.dirPath, dirpath);
            return true;
        },

        showPage: (id) => {
            let pagesContainer = document.querySelector('section[role="pages"]');
            let activePages = pagesContainer.querySelectorAll('.page.active');
            let target = pagesContainer.querySelector('.page[role="' + id + '"]');

            if(activePages) {
                activePages.forEach((elem) => {
                    elem.classList.remove('visible');
                    elem.classList.add('hidden');
                });
            }
            
            if (!target)
                throw new ReferenceError('The page doesnt exists.');
            
            target.classList.remove('hidden');
            target.classList.add('active');
            target.classList.add('visible');

            // Modificamos el tono de fondo
            app.ui.setBackgroundTone(target.getAttribute('data-bg-tone'));
        },

        setBackgroundTone: (color) => {        
            let bgTone = document.querySelector('.bg-tone');
            color = color || 0;
            bgTone.setAttribute('data-color', color);        
        },
        
        convert: {
            updateProgress: (current) => {
                if(_pages.converting)
                    _pages.converting.methods.convUpdateProgress(current);
            },

            showSuccess: () => {
                if(_pages.converting)
                    _pages.converting.methods.convShowSuccessMsg();
            },

            start: () => {
                if(_pages.converting)
                    _pages.converting.methods.convStartProcess();
            },
        }
    }
})();