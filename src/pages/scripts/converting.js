// Converting
nodes.convBtnCancel = document.querySelector('.page[role="converting"] button.cancel');
nodes.convProgressBar = document.querySelector('.page[role="converting"] progress');
nodes.convCurrentNode = document.querySelector('.page[role="converting"] span.current');
nodes.convTotalNodes = document.querySelector('.page[role="converting"] span.total');

// Converting
nodes.convBtnCancel.addEventListener('click', evt_convCancelClick);

// Converting
let evt_convCancelClick = (e) => { _self.utils.convCancel.call(_self, e); }

// Converting
convStartProcess: () => {
    // Damos tiempo a la aplicacion para finalizar la transicion entre paginas
    // TODO: Migrar el generador a un Worker para otorgar multiprocesamiento.
    window.addEventListener('unhandledrejection', app.ui.utils.convThrowFatalError);
    window.addEventListener('error', app.ui.utils.convThrowFatalError);
    setTimeout(app.generator.start, 1000);
},

convCancel: () => {
    electron.dialog.showMessageBox({
        type: "question",
        buttons: ['Yes', 'No'],
        title: 'Gedcom Converter',
        message: 'Confirm. Do you want to cancel the current process?'
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
    let dirpath = window.sessionStorage.getItem(ssURI.dirPath);
    
    // Bloqueamos el boton Cancelar de la pagina
    nodes.convBtnCancel.disabled = true;

    // Mostramos la carpeta de salida
    process.exec('explorer.exe ' + dirpath);

    // Mostramos el mensaje de exito
    electron.dialog.showMessageBox({
        type: 'info',
        buttons: [],
        title: 'Gedcom Converter',
        message: 'Process Done',
        detail: 'The convertion process has been done successfully. Out path:\n' + dirpath                    
    }, () => { document.location.reload(); });
},

convThrowFatalError: () => {
    // Bloqueamos el boton Cancelar de la pagina
    nodes.convBtnCancel.disabled = true;
    
    electron.dialog.showMessageBox({
        type: 'error',
        buttons: [],
        title: 'Gedcom Converter',
        message: 'Fatal Error',
        detail: 'An unrecoverable while during file conversion error occurred, the process can not continue.'
    }, () => { document.location.reload(); });
}