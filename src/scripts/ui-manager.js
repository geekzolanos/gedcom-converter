//
//  UI Manager
//  Administrador de la Interfaz de usuario
//

window.UIManager = function() {
    // Propiedades
    let nodes = {};
    
    let pages = [
        'selector'
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
        nodes.ddContainer = document.querySelector('.dd-container');
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
    };

    this.setGCFile = (path) => {
        console.log(path);
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