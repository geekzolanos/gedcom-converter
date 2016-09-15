// Selector
nodes.ddContainer = document.querySelector('.dd-container');


// Selector
nodes.ddContainer.addEventListener('click', evt_ddContainerClick);

// Selector
let evt_ddContainerDrop = (e) => { _self.utils.selectorDDHandler.call(_self, e); }
let evt_ddContainerDOver = (e) => { _self.utils.selectorDDOver.call(_self, e); }
let evt_ddContainerClick = (e) => {
    if (nodes.ddContainer.hasAttribute('open-dialog-visible') === false)
        _self.utils.openSelectorDialog.call(_self, e);
}

// Selector
openSelectorDialog: (e) => {
    // No debemos permitir la apertura de mas de un cuadro de dialogo.
    nodes.ddContainer.setAttribute('open-dialog-visible', true);

    electron.dialog.showOpenDialog({
        properties: ['openFile'], 
        title: 'Select a GEDCOM File', 
        filters: [{name: 'GEDCOM Files', extensions: ['ged']}]
    }, app.ui.utils.selectorSgfHandler);
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
        app.ui.utils.selectorSgfHandler(filepath);
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
    