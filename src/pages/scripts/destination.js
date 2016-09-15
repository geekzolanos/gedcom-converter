(function() {
    function Handler() {
        let _self = this;
        let nodes = {}

        let methods = {
            destOpenDialog: () => {
                // No debemos permitir la apertura de mas de un cuadro de dialogo.
                nodes.destContainer.setAttribute('open-dialog-visible', true);

                electron.dialog.showOpenDialog({
                    properties: ['openDirectory'], 
                    title: 'Select destination'
                }, methods.destSetDestinationHandler);
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
                    app.ui.showPage('options');
            },

            destGoBack: () => {
                app.ui.showPage('selector');
            }
        }

        let evtHandlers = {
            _destAcceptClick: (e) => { methods.destGoFwd.call(_self, e); },
            _destCancelClick: (e) => { methods.destGoBack.call(_self, e); },
            _destContainerClick: (e) => { 
                if (nodes.destContainer.hasAttribute('open-dialog-visible') === false)
                   methods.destOpenDialog.call(_self, e); 
            }
        }

        this.id = "destination";

        this.getNodes = () => {
            nodes.destContainer = document.querySelector('.dest-container');
            nodes.destPathSubtitle = nodes.destContainer.querySelector('h2');
            nodes.destBtnAccept = document.querySelector('.page[role="destination"] button.accept');
            nodes.destBtnCancel = document.querySelector('.page[role="destination"] button.cancel');
        }

        this.setEventListeners = () => {
            nodes.destContainer.addEventListener('click', evtHandlers._destContainerClick);
            nodes.destBtnAccept.addEventListener('click', evtHandlers._destAcceptClick);
            nodes.destBtnCancel.addEventListener('click', evtHandlers._destCancelClick);
        }
    }

    app.ui.registerPage(new Handler(), document.currentScript.ownerDocument);
})();