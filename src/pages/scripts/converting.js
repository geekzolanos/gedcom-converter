(function() {
    function Handler() {
        let _self = this;
        let r_animInterval = null;
        let nodes = {}

        let methods = { 
            convCancel: () => {
                electron.dialog.showMessageBox({
                    type: "question",
                    buttons: ['Yes', 'No'],
                    title: 'Gedcom Converter',
                    message: 'Confirm. Do you want to cancel the current process?'
                }, (e) => { if(e == 0) methods.convSetUIStop(true); });
            },

            convThrowFatalError: () => {
                methods.convSetUIStop(true);
                electron.dialog.showMessageBox({
                    type: 'error',
                    buttons: [],
                    title: 'Gedcom Converter',
                    message: 'Fatal Error',
                    detail: 'An unrecoverable while during file conversion error occurred, the process can not continue.'
                });
            },

            convSetUIStop: (asError) => {
                // Detenemos la animacion de fondo
                clearInterval(r_animInterval);                
                document.body.classList.remove('converting');
                app.ui.setBackgroundTone((asError === true) ? Tones.light.POMEGRANATE : Tones.light.LIGHT_GREEN);
                // Configuramos el footer
                nodes.convRootPath.classList.add((asError === true) ? 'error' : 'success');
            },

            convShellAnimate: () => {
                let tonesKeys = Object.keys(Tones.light);
                let idx = Math.floor(Math.random() * tonesKeys.length);
                app.ui.setBackgroundTone(Tones.light[tonesKeys[idx]]);
            },

            convRetry: () => { convStartProcess(); },
            convNewProcess: () => { document.location.reload(); },

            convShowOutput: () => {
                let dirpath = Preferences.session.dirPath;
                process.exec('explorer.exe ' + dirpath);
            }
        }            

        let evtHandlers = {
            _convCancelClick: (e) => { methods.convCancel.call(_self, e); },
            _convRetryClick: (e) => { methods.convRetry.call(_self, e); },
            _convProcessClick: (e) => { methods.convNewProcess.call(_self, e); },            
            _convOutputClick: (e) => { methods.convShowOutput.call(_self, e); }
        }

        this.id = "converting";

        this.getNodes = () => {
            nodes.convRootPath = document.querySelector('.page[role="converting"]');
            nodes.convBtnCancel = nodes.convRootPath.querySelector('button.cancel');
            nodes.convProgressBar = nodes.convRootPath.querySelector('progress');
            nodes.convCurrentNode = nodes.convRootPath.querySelector('span.current');
            nodes.convTotalNodes = nodes.convRootPath.querySelector('span.total');
            nodes.convBtnRetry = nodes.convRootPath.querySelector('button.retry');
            nodes.convBtnProcess = nodes.convRootPath.querySelector('button.process');
            nodes.convBtnOutput = nodes.convRootPath.querySelector('button.show-output');
        }

        this.setEventListeners = () => {
            nodes.convBtnCancel.addEventListener('click', evtHandlers._convCancelClick);            
            nodes.convBtnRetry.addEventListener('click', evtHandlers._convRetryClick);            
            nodes.convBtnProcess.addEventListener('click', evtHandlers._convProcessClick);
            nodes.convBtnOutput.addEventListener('click', evtHandlers._convOutputClick);
        }

        this.methods = {
            convUpdateProgress: (current) => {
                let total = Preferences.session.progress.totalNodes;
                let progressVal = (current * 100) / (total - 1);

                nodes.convCurrentNode.innerHTML = current + 1;
                nodes.convTotalNodes.innerHTML = total;
                nodes.convProgressBar.value = progressVal;
            },

            convShowSuccessMsg: () => {
                // Hacemos cambios en la UI
                methods.convSetUIStop(false);
                // Mostramos el mensaje de exito
                electron.dialog.showMessageBox({
                    type: 'info',
                    buttons: [],
                    title: 'Gedcom Converter',
                    message: 'Process Done',
                    detail: 'The convertion process has been done successfully'                    
                });
            },

            convStartProcess: () => {
                // TODO: Migrar el generador a un Worker para otorgar multiprocesamiento.
                window.onerror = window.onunhandledrejection = methods.convThrowFatalError;

                // Animamos el Shell durante el proceso
                document.body.classList.add('converting');
                r_animInterval = setInterval(methods.convShellAnimate, 5000);

                // Damos tiempo a la aplicacion para finalizar la transicion entre paginas
                setTimeout(app.generator.start, 1000);
            },
        }        
    }

    app.ui.registerPage(new Handler(), document.currentScript.ownerDocument);
})();