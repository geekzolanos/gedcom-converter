//
//  Generator Manager
//  Administrador del proceso de conversion
//

window.GenManager = function() {
    // Propiedades privadas
    let currentTemplate = Templates.get('Base');
    let idxCurrentNode = -1;
    let parsedData = {};
    let parsedKeys = [];
    let directoryData = {persons: [], families: []};

    // Metodos privados
    let generateNext = () => {
        let dirpath = window.sessionStorage.getItem(ssURI.dirPath);

        // Desplazamos el indice
        idxCurrentNode++;

        // Si el indice alcanzo el limite, generamos a Home y mostramos mensaje de exito.
        if(idxCurrentNode > parsedKeys.length - 1) {
            let content = currentTemplate.generateHome(directoryData);            
            fs.writeFile(dirpath + '/index.html', content, app.ui.utils.convShowSuccessMsg);
            return false;
        }
        
        let currentKey = parsedKeys[idxCurrentNode];
        let currentNode = parsedData[currentKey];
        if(DEBUG) {
            console.log('Nodo Actual: ' + idxCurrentNode);
        }

        // Actualizamos el progreso
        app.ui.utils.convUpdateProgress(idxCurrentNode);

        // Generamos el contenido
        let content = this.generateContent(currentNode);

        // Escribimos los datos
        fs.writeFile(dirpath + '/' + currentKey + '.html', content, generateNext);
    }

    // Metodos Publicos
    this.generateContent = (node) => {
        if(DEBUG) {
            console.log('Procesando Nodo');
            console.log(node);
        }

        // Es posible que algunos nodos sean indefinidos (Por error del formato) Asi que los ignoramos.
        if(!node)
            return false;

        switch(node.type) {
            case GedcomConst.indicator.personne:
                if(DEBUG)
                    console.log('Es una Persona!');
                directoryData.persons.push({id: node.id, value: node.plugin.name.join('')});
                return currentTemplate.generatePerson(node);

            case GedcomConst.indicator.famille:
                if(DEBUG)
                    console.log('Es una Familia!');
                directoryData.families.push({id: node.id, value: (node.husb) ? node.husb.plugin.name[node.husb.plugin.name.length - 1] : "Unknown Family name"});
                return currentTemplate.generateFamily(node);

            /*case GedcomConst.indicator.source:
                if(DEBUG)
                    console.log('Es una Fuente!');
                return currentTemplate.generateSource(node);*/
        }
    }

    this.setup = (data) => {
        parsedData = data._object;
        parsedKeys = Object.keys(parsedData);        
        
        if(DEBUG) {
            console.log('Raiz del objeto parseado')
            console.log(parsedData);
            console.log('Claves del objeto parseado');
            console.log(parsedKeys);
        }
        
        window.sessionStorage.setItem(ssURI.totalNodes, parsedKeys.length);
        generateNext();
    }

    this.start = () => {
        // Convierto el Gedcom
        let filepath = window.sessionStorage.getItem(ssURI.filePath);
        let parseNode = app.vWrapper.readFile(filepath);
        parseNode.then(this.setup);
    }
}