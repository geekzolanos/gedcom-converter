//
//  UI Manager
//  Administrador de la Interfaz de usuario
//
(function() {
    let _pages = {}

    window.app.ui = {
        pages: [],

        loadAllPages: () => {
            for (e in _pages) {
                _pages[e].getNodes();
                _pages[e].setEventListeners();
            }
        },

        registerPage: (obj, doc) => {
            if(!obj)
                throw new TypeError('El parametro no es un objeto.');
            let id = obj.id;
            let container = document.querySelector('section[role="pages"]');

            if(app.ui.pages.includes(id))
                throw new Error('La pagina ya esta registrada');

            // Registramos el ID de la pagina
            app.ui.pages.push(id);

            // Registramos el objeto
            _pages[id] = obj;
            
            // Registramos el documento
            let content = doc.querySelector('template').content;
            container.appendChild(content.cloneNode(true));
        },


    
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