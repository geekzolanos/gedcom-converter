//
//  Generator Manager
//  Administrador del proceso de conversion
//

window.GenManager = function() {
    // Propiedades privadas
    let currentTemplate = Templates.get('Base');
    let parsedData = {};
    let parsedKeys = [];

    // Propiedades Privadas    
    let HTMLHeadEnd = '</head>';
    let HTMLBodyStart = '<body>';
    let HTMLHeadStart = [
        '<html>',
        '<head>'
    ].join('');
    let HTMLBodyEnd = [
        '</body>',
        '</html>'
    ].join('');

    // Metodos privados

    let generateNext = () => {
        let idxNode = parseInt(window.sessionStorage.getItem(ssURI.currentNode));       
        let dirpath = window.sessionStorage.getItem(ssURI.dirPath);
        console.log('Nodo Actual: ' + idxNode);
        let content = this.generateHTML(parsedData[parsedKeys[idxNode]]);
        // Escribimos los datos
        fs.writeFile(dirpath + '/' + parsedKeys[idxNode] + '.html', content, generateNext);
        window.sessionStorage.setItem(ssURI.currentNode, idxNode + 1);
        app.ui.utils.convUpdateProgress();
    }

    // Metodos Publicos
    this.generateHTML = (node) => {
        console.log('Procesando Nodo');
        console.log(node);

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
        
        window.sessionStorage.setItem(ssURI.totalNodes, parsedKeys.length + 1);
        window.sessionStorage.setItem(ssURI.currentNode, 0);
        app.ui.utils.convUpdateProgress();

        generateNext();        
    }

    this.start = () => {
        // Convierto el Gedcom
        let filepath = window.sessionStorage.getItem(ssURI.filePath);
        let parseNode = app.vWrapper.readFile(filepath);
        parseNode.then(this.setup);
    }
}