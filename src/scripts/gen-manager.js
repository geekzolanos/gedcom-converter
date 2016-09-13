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

    // Metodos privados
    let generateNext = () => {
        // Desplazamos el indice
        idxCurrentNode++;

        // Si el indice alcanzo el limite, mostramos mensaje de exito.
        if(idxCurrentNode > parsedKeys.length - 1)
            return app.ui.utils.convShowSuccessMsg();

        let dirpath = window.sessionStorage.getItem(ssURI.dirPath);
        let currentKey = parsedKeys[idxCurrentNode];
        let currentNode = parsedData[currentKey];
        console.log('Nodo Actual: ' + idxCurrentNode);

        // Actualizamos el progreso
        app.ui.utils.convUpdateProgress(idxCurrentNode);

        // Generamos el contenido
        let content = this.generateContent(currentNode);

        // Escribimos los datos
        fs.writeFile(dirpath + '/' + currentKey + '.html', content, generateNext);
    }

    // Metodos Publicos
    this.generateContent = (node) => {
        console.log('Procesando Nodo');
        console.log(node);

        // Es posible que algunos nodos sean indefinidos (Por error del formato) Asi que los ignoramos.
        if(!node)
            return false;

        switch(node.type) {
            case GedcomConst.indicator.personne:
                console.log('Es una Persona!');
                return currentTemplate.generatePerson(node);

            case GedcomConst.indicator.famille:
                console.log('Es una Familia!');
                return currentTemplate.generateFamily(node);

            case GedcomConst.indicator.source:
                console.log('Es una Fuente!');
                return currentTemplate.generateSource(node);
        }
    }

    this.setup = (data) => {
        parsedData = data._object;
        parsedKeys = Object.keys(parsedData);        

        console.log('Raiz del objeto parseado')
        console.log(parsedData);
        console.log('Claves del objeto parseado');
        console.log(parsedKeys);
        
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