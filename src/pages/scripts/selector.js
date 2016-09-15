(function() {
    function Handler() {
        let _self = this;
        let nodes = {}

        let methods = {
             openSelectorDialog: (e) => {
                // No debemos permitir la apertura de mas de un cuadro de dialogo.
                nodes.ddContainer.setAttribute('open-dialog-visible', true);

                electron.dialog.showOpenDialog({
                    properties: ['openFile'], 
                    title: 'Select a GEDCOM File', 
                    filters: [{name: 'GEDCOM Files', extensions: ['ged']}]
                }, methods.selectorSgfHandler);
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
                    methods.selectorSgfHandler(filepath);
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
            
                if(app.ui.setGCFile(filepath) === false)
                    electron.dialog.showErrorBox('Invalid File', 'The selected file is not a valid GEDCOM File. Please, try again.');
                else 
                    app.ui.showPage('destination');
            }
        }
        
        let evtHandlers = {
            _ddContainerDrop: (e) => { methods.selectorDDHandler.call(_self, e); },
            _ddContainerDOver: (e) => { methods.selectorDDOver.call(_self, e); },
            _ddContainerClick: (e) => {
                if (nodes.ddContainer.hasAttribute('open-dialog-visible') === false)
                    methods.openSelectorDialog.call(_self, e);
            }
        }

        this.id = "selector";

        this.getNodes = () => {
             // Selector
            nodes.ddContainer = document.querySelector('.dd-container');
        }

        this.setEventListeners = () => {
             // Selector
            nodes.ddContainer.addEventListener('click', evtHandlers._ddContainerClick);
            // Utilizamos la misma mezcla de Handler/Event para Drop y DragLeave (Solo por ahorrar espacio)
            nodes.ddContainer.addEventListener('drop', evtHandlers._ddContainerDrop);
            nodes.ddContainer.addEventListener('dragleave', evtHandlers._ddContainerDrop);
            nodes.ddContainer.addEventListener('dragover', evtHandlers._ddContainerDOver);
        }
    }
})();