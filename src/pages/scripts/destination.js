// Destination
nodes.destContainer = document.querySelector('.dest-container');
nodes.destPathSubtitle = nodes.destContainer.querySelector('h2');
nodes.destBtnAccept = document.querySelector('.page[role="destination"] button.accept');
nodes.destBtnCancel = document.querySelector('.page[role="destination"] button.cancel');

// Destination
nodes.destContainer.addEventListener('click', evt_destContainerClick);
nodes.destBtnAccept.addEventListener('click', evt_destAcceptClick);
nodes.destBtnCancel.addEventListener('click', evt_destCancelClick);

// Destination
let evt_destAcceptClick = (e) => { _self.utils.destGoFwd.call(_self, e); }
let evt_destCancelClick = (e) => { _self.utils.destGoBack.call(_self, e); }
let evt_destContainerClick = (e) => { 
    if (nodes.destContainer.hasAttribute('open-dialog-visible') === false)
        _self.utils.destOpenDialog.call(_self, e); 
}

// Destination   
destOpenDialog: () => {
    // No debemos permitir la apertura de mas de un cuadro de dialogo.
    nodes.destContainer.setAttribute('open-dialog-visible', true);

    electron.dialog.showOpenDialog({
        properties: ['openDirectory'], 
        title: 'Select destination'
    }, app.ui.utils.destSetDestinationHandler);
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
    if(app.ui.setDestination(dirpath) === false)
        electron.dialog.showErrorBox('Invalid File', 'The selected destination is invalid. Please, try again.');
    else 
        app.ui.showPage('preferences');
},

destGoBack: () => {
    app.ui.showPage('selector');
},