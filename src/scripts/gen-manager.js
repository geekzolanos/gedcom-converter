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
    let directoryData = { persons: [], families: [] };

    // Metodos Publicos
    let cleanPersonNode = (node) => {
        // Los datos de nacimiento no pueden ser "undefined"
        node.plugin.birt = node.plugin.birt ? node.plugin.birt : {};

        // Existen casos donde las propiedades tienen el valor de 'undefined'
        let birthDate = node.plugin.birt.date;
        let birthLoc = node.plugin.birt.place;
        node.plugin.birt.date = (birthDate == "undefined") ? undefined : birthDate;
        node.plugin.birt.place = (birthLoc == "undefined") ? undefined : birthLoc;

        // Agregamos la propiedad year
        if (birthDate) {
            let by_start = birthDate.length;
            let by_end = birthDate.length - 4;
            let birthYear = parseInt(birthDate.substring(by_start, by_end));
            if (isNaN(birthYear) === false)
                node.plugin.birt.year = birthYear.toString();
        }

        // La fecha y lugar de mortalidad no puede ser "undefined"
        if (node.plugin.deat) {
            let deatDate = node.plugin.deat.date;
            let deatLoc = node.plugin.deat.place;
            node.plugin.deat.date = (deatDate == "undefined") ? undefined : deatDate;
            node.plugin.deat.place = (deatLoc == "undefined") ? undefined : deatLoc;
        }

        // La familia debe ser un array
        let familles = node.plugin.familles;
        if (Array.isArray(familles) === false)
            node.plugin.familles = undefined;

        // La familia no puede ser un array vacio
        else if (familles.length == 0)
            node.plugin.familles = undefined;

        else {
            familles.forEach((family, i) => {
                // Childrens debe ser un array y no puede ser vacio
                let childs = family.childs;
                if (Array.isArray(childs) === false)
                    familles[i].childs = undefined;
                else if (childs.length == 0)
                    familles[i].childs = undefined
            });
        }

        if (!!DEBUG) {
            console.log('Estructura despues de la limpieza del nodo:');
            console.log(node);
        }
    }

    let generateContent = (node) => {
        if (!!DEBUG) {
            console.log('Procesando Nodo');
            console.log(node);
        }

        // Es posible que algunos nodos sean indefinidos (Por error del formato) Asi que los ignoramos.
        if (!node)
            return false;

        // Fixed ID
        node.fixedID = node.id.replace(/[\@]/g, "");

        switch (node.type) {
            case GedcomConst.indicator.personne:
                if (!!DEBUG)
                    console.log('Es una Persona!');

                // Limpiando datos de entrada del nodo
                cleanPersonNode(node);

                // Colocamos una referencia en el directorio para el indice
                directoryData.persons.push({ id: node.fixedID, value: node.plugin.name.join('\xa0') });

                return currentTemplate.generatePerson(node);

            case GedcomConst.indicator.famille:
                if (!!DEBUG)
                    console.log('Es una Familia!');

                if (Preferences.session.options.noFamily === true) {
                    if (!!DEBUG)
                        console.log('No se permite generar paginas de familias.');
                    return false;
                }

                // Colocamos una referencia en el directorio para el indice
                directoryData.families.push({ id: node.fixedID, value: (node.husb) ? node.husb.plugin.name[node.husb.plugin.name.length - 1] : "Unknown Family name" });

                return currentTemplate.generateFamily(node);

                /*case GedcomConst.indicator.source:
                    if(!!DEBUG)
                        console.log('Es una Fuente!');
                    return currentTemplate.generateSource(node);*/
        }
    }

    // Metodos privados
    this.generateHome = () => {
        let dirpath, content;

        if (Preferences.session.options.noHome === true) {
            app.ui.convert.showSuccess();
            return true;
        }

        dirpath = Preferences.session.dirPath;
        content = currentTemplate.generateHome(directoryData);
        fs.writeFile(dirpath + '/index.html', content, app.ui.convert.showSuccess);
    }

    this.generateNext = () => {
        let dirpath = Preferences.session.dirPath;

        // Si el proceso esta en pausa no podemos continuar
        if (Preferences.session.progress.isPaused === true) {
            if (!!DEBUG)
                console.log('Proceso en pausa. Deteniendo.');
            return false;
        }

        // Desplazamos el indice
        idxCurrentNode++;

        // Si el indice alcanzo el limite, generamos a Home y mostramos mensaje de exito.
        if (idxCurrentNode > parsedKeys.length - 1) {
            this.generateHome();
            return true;
        }

        // De lo contrario, continuamos
        let currentKey = parsedKeys[idxCurrentNode];
        let currentNode = parsedData[currentKey];
        if (!!DEBUG) {
            console.log('Nodo Actual: ' + idxCurrentNode);
        }

        // Actualizamos el progreso
        app.ui.convert.updateProgress(idxCurrentNode);

        // Generamos el contenido
        let content = generateContent(currentNode);

        // Escribimos los datos
        // Hay circunstancias en donde el contenido no es generado. Si este es el caso solo pasamos al siguiente nodo.
        if (content)
            fs.writeFile(dirpath + '/' + currentNode.fixedID + '.html', content, this.generateNext);
        else
            this.generateNext();
    }

    this.setup = (data) => {
        parsedData = data._object;
        parsedKeys = Object.keys(parsedData);

        if (!!DEBUG) {
            console.log('Raiz del objeto parseado')
            console.log(parsedData);
            console.log('Claves del objeto parseado');
            console.log(parsedKeys);
        }

        Preferences.session.progress.totalNodes = parsedKeys.length;
        this.generateNext();
    }

    this.start = () => {
        // Convierto el Gedcom
        let filepath = Preferences.session.filePath;
        let parseNode = app.vWrapper.readFile(filepath);
        parseNode.then(this.setup);
    }
};