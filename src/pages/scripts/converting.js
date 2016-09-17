(function() {
    function Handler() {
        let _self = this;
        let r_animInterval = null;
        let CONV_UI = {Default: 0, Error: 1, Paused: 2, Success: 3, Cancel: 4};

        let nodes = {}

        let methods = { 
            convCancel: () => {
                electron.dialog.showMessageBox({
                    type: "question",
                    buttons: ['Yes', 'No'],
                    title: 'Gedcom Converter',
                    message: 'Confirm. Do you want to cancel the current process?'
                }, (e) => { if(e == 0) methods.convSetStatus(CONV_UI.Cancel); });
            },

            convThrowFatalError: () => {
                methods.convSetStatus(CONV_UI.Error);
                electron.dialog.showMessageBox({
                    type: 'error',
                    buttons: [],
                    title: 'Gedcom Converter',
                    message: 'Fatal Error',
                    detail: 'An unrecoverable error has been occurred on file conversion, the process can not continue.'
                });
            },

            convSetStatus: (type) => {
                switch(type) {
                    case CONV_UI.Error:
                        methods.convSetPause(true);
                        methods.convSetShellAnimate(false);
                        app.ui.setBackgroundTone(Tones.light.POMEGRANATE);
                        nodes.convRootPath.classList.add('error');
                    break;

                    case CONV_UI.Paused:
                        methods.convSetPause(true);
                        methods.convSetShellAnimate(false);
                        app.ui.setBackgroundTone(Tones.light.YELLOW);
                        nodes.convRootPath.classList.add('paused');
                    break;

                    case CONV_UI.Success:
                        methods.convSetShellAnimate(false);
                        app.ui.setBackgroundTone(Tones.light.LIGHT_GREEN);
                        nodes.convRootPath.classList.add('success');
                    break;

                    case CONV_UI.Cancel:
                        methods.convSetPause(true);
                        methods.convSetShellAnimate(false);
                        app.ui.setBackgroundTone(Tones.light.POMEGRANATE);
                        nodes.convRootPath.classList.add('cancel');
                    break;

                    default:
                        methods.convSetPause(false);                     
                        methods.convSetShellAnimate(true);
                        nodes.convRootPath.classList.remove('cancel');
                        nodes.convRootPath.classList.remove('error');
                        nodes.convRootPath.classList.remove('paused');
                        nodes.convRootPath.classList.remove('success');
                    break;
                };
            },

            convSetShellAnimate: (status) => {                
                if(status === true) {
                    document.body.classList.add('converting');
                    // Establecemos el Loop
                    r_animInterval = setInterval(() => {
                        let tonesKeys = Object.keys(Tones.light);
                        let idx = Math.floor(Math.random() * tonesKeys.length);
                        app.ui.setBackgroundTone(Tones.light[tonesKeys[idx]]);
                    }, 5000);
                }
                else {                    
                    clearInterval(r_animInterval);                
                    document.body.classList.remove('converting');
                }
            },

            convSetPause: (status) => {
                if(status === true) {
                    Preferences.session.progress.isPaused = true;
                }

                else {
                    Preferences.session.progress.isPaused = false;
                    app.generator.generateNext();
                }
            },
            
            convTogglePause: () => {              
                let btnIcon = nodes.convBtnPause.querySelector('i');
                if(Preferences.session.progress.isPaused === true) {                    
                    btnIcon.classList.remove('fa-pause');
                    btnIcon.classList.add('fa-play');
                    methods.convSetStatus(CONV_UI.Paused);
                }
                else {                    
                    btnIcon.classList.remove('fa-play');
                    btnIcon.classList.add('fa-pause');
                    methods.convSetStatus(CONV_UI.Default);
                }
            },

            convRetry: () => {
                this.methods.convStartProcess();
            },

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
            _convOutputClick: (e) => { methods.convShowOutput.call(_self, e); },
            _convPauseClick: (e) => { methods.convTogglePause.call(_self, e); }
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
            nodes.convBtnPause = nodes.convRootPath.querySelector('.progress[role="wrapper"] .set');
        }

        this.setEventListeners = () => {
            nodes.convBtnCancel.addEventListener('click', evtHandlers._convCancelClick);            
            nodes.convBtnRetry.addEventListener('click', evtHandlers._convRetryClick);            
            nodes.convBtnProcess.addEventListener('click', evtHandlers._convProcessClick);
            nodes.convBtnOutput.addEventListener('click', evtHandlers._convOutputClick);
            nodes.convBtnPause.addEventListener('click', evtHandlers._convPauseClick);
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
                methods.convSetStatus(CONV_UI.Success);
                // Mostramos el mensaje de exito
                electron.dialog.showMessageBox({
                    type: 'info',
                    buttons: [],
                    title: 'Gedcom Converter',
                    message: 'All files converted',
                    detail: 'The conversion process has been done successfully!'                    
                });
            },

            convStartProcess: () => {
                // TODO: Migrar el generador a un Worker para otorgar multiprocesamiento.
                window.onerror = window.onunhandledrejection = methods.convThrowFatalError;

                // Animamos el Shell durante el proceso
                methods.convSetStatus(CONV_UI.Default);

                // Damos tiempo a la aplicacion para finalizar la transicion entre paginas
                setTimeout(app.generator.start, 1000);
            },
        }        
    }

    app.ui.registerPage(new Handler(), document.currentScript.ownerDocument);
})();