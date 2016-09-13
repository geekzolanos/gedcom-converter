//
//  Plantilla base para Gedcom Converter
//

(function() {
    // Cabeceras   
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

    let generateHTMLAsPerson = (node) => {
        let HTMLTree = [];
        let currentTime = new Date().getTime();
        let name = node.plugin.name.join("");
        let birthYear = (node.plugin.birt) ? node.plugin.birt.date : "Unknown Birth Year";
        let locationBirth = (node.plugin.birt) ? node.plugin.birt.place : "Unknown location";
        let sex = node.plugin.sexe || "Unknown";

        HTMLTree.push(HTMLHeadStart);

        HTMLTree.push([
            '<title>' + '' + '</title>',
            '<meta name="Title" content="' + name + '"></meta>',
            '<meta name="BirthYear" content="' + birthYear + '"></meta>',
            '<meta name="CurrentDate" content="' + currentTime + '"></meta>',
            '<meta name="Description" content="' + name + " - " + locationBirth + '"></meta>',
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Nombre
        HTMLTree.push('<h1>' + name + '</h1>');
        HTMLTree.push('<br>');

        // Fecha de Natalidad
        HTMLTree.push([
            '<h2>Birth Info</h2>',
            '<h4>Year</h4>',
            '<p>' + birthYear + '</p>',
            '<h4>Location</h4>',
            '<p>' + locationBirth + '</p>'
        ].join(''));
        HTMLTree.push('<br><br>');

        // Fecha de Mortalidad
        if(node.plugin.deat) {
            let deatYear = node.plugin.deat.date;
            let deatBirth = node.plugin.deat.place || "Unknown location";

            HTMLTree.push([
                '<h2>Death Info</h2>',
                '<h4>Year</h4>',
                '<p>' + deatYear + '</p>',
                '<h4>Location</h4>',
                '<p>' + deatBirth + '</p>'
            ].join(''));
            HTMLTree.push('<br><br>');
        }

        // Padre
        if(node.plugin.familleParent) {
            let fatherNode = node.plugin.familleParent.husb;
            let motherNode = node.plugin.familleParent.wife;

            HTMLTree.push('<h2>Parent Info</h2>');

            if(fatherNode)
                HTMLTree.push([
                    '<h4>Father</h4>',
                    '<a href="' + fatherNode.id + '.html">' + fatherNode.plugin.name.join('') + '</a>'
                ].join(''));

            if(motherNode)
                HTMLTree.push([                    
                    '<h4>Mother</h4>',
                    '<a href="' + motherNode.id + '.html">' + motherNode.plugin.name.join('') + '</a>'
                ].join(''));

            HTMLTree.push('<br><br>');
        }          

        // Familias
        if(node.familles) {
            let conyuges = [];
            let childrens = [];

            HTMLTree.push("<h2>Familia</h2>")
            // Recolectamos la informacion de la familia
            node.familles.forEach((famille) => {
                // Conyuge
                let conyuge = (sexe == "M") ? famille.wife : famille.husb;
                if(conyuge)
                    conyuges.push(conyuge);
                // Hijos
                if (famille.childs) {
                    famille.childs.forEach((child) => {
                        childrens.push(child);
                    });
                }
            });
            if (conyuges.length > 0) {
                HTMLTree.push("<h3>Conyuges</h4>");
                conyuges.forEach((conyuge) => {
                    HTMLTree.push('<a href="' + conyuge.id + '.html">' + conyuge.plugin.name.join('') + '</a>');
                });
            }
            if (childrens.length > 0) {
                HTMLTree.push("<h3>Hijos</h4>");
                childrens.forEach((child) => {
                    HTMLTree.push('<a href="' + child.id + '.html">' + child.plugin.name.join('') + '</a>');
                });
            }
        }

        // Sexo
        HTMLTree.push("<h2>Sexo</h2>");
        switch(sex) {
            case "M":
                HTMLTree.push('<p>Masculino</p>');
            break;
            case "F":
                HTMLTree.push('<p>Femenino</p>');
            break;
            default:
                HTMLTree.push('<p>Desconocido</p>');
            break;
        }

        HTMLTree.push(HTMLBodyEnd);

        return HTMLTree.join('');
    }

    let generateHTMLAsFamily = (node) => {
        
    }

    let generateHTMLAsSource = (node) => {
        
    }

    Templates.register(new Template('Base', generateHTMLAsPerson, generateHTMLAsFamily, generateHTMLAsSource));
})();
