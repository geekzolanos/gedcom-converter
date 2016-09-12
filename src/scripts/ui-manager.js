//
//  UI Manager
//  Administrador de la Interfaz de usuario
//

window.UIManager = function() {
    // Propiedades
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
    }

    // Metodos publicos
    this.initialize = () => {
        loadAllPages();
        getNodes();
        setUIEvs();
        this.showPage(APP_START_PAGE);
    };

    this.setGCFile = (path) => {
        console.log(path);
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

    this.utils = {
        openSelectorDialog: (e) => {
        
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
                let path = e.dataTransfer.files[0].path;
                this.setGCFile(path);
            }
        }
    };

    // Inicializamos el modulo
    this.initialize();
}