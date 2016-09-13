//
//  Plantilla base para Gedcom Converter
//

(function() {
    // Widgets
    let GoogleSearchWidget = [
        '<form id="searchbox" action="https://www.google.com/">',
        '<input name="q" type="text" size="40" />',
        '<input type="submit" name="sa" value="Search" />',
        '</form>'
    ].join('');

    // Cabeceras
    let HTMLHeadStart = [
        '<html>',
        '<head>'
    ].join('');

    let HTMLHeadEnd = '</head>';

    let HTMLBodyEnd = [
        '<br><br>',
        GoogleSearchWidget,        
        '<a href="home.html">Ir a Inicio</a>',
        '<p>Documento generado por Gedcom Converter. Para mas informacion contactenos a nuestro <a href="mailto:geekzolanos@gmail.com">correo electronico</a>.</p>',
        '</body>',
        '</html>'
    ].join('');  

    let HTMLBodyStart = '<body style="background-color: #f7f7f7; text-align: center;">';
    
    let generateHTMLAsHome = (data) => {
        let HTMLTree = [];
        let adsenseSnippet = window.sessionStorage.getItem(ssURI.adSnippet);
        let currentTime = new Date().getTime();

        HTMLTree.push(HTMLHeadStart);

        HTMLTree.push([
            '<title>Main Page</title>',
            '<meta name="Title" content="Main Page"></meta>',
            '<meta name="CurrentDate" content="' + currentTime + '"></meta>',
            '<meta name="Description" content="Main Page"></meta>',
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Nombre de familia
        HTMLTree.push('<h1 style="color: #00f;">Main Page</h1>');

        // Snippet para Adsense
        if(adsenseSnippet) {
            HTMLTree.push('<p>Our advertiser</p>');
            HTMLTree.push(adsenseSnippet);
            HTMLTree.push('<br>');
        }

        HTMLTree.push('<br><hr><br>');

        // Hijos
        HTMLTree.push("<h2>Families</h2>");
        data.families.forEach((family) => {
            HTMLTree.push('<a href="' + family.id + '.html"><p>' + family.value + '</p></a>');
        });

        HTMLTree.push('<br><hr><br>');

        HTMLTree.push("<h2>Persons</h2>");
        data.persons.forEach((person) => {
            HTMLTree.push('<a href="' + person.id + '.html"><p>' + person.value + '</p></a>');
        });

        HTMLTree.push(HTMLBodyEnd);

        return HTMLTree.join('');
    }

    let generateHTMLAsPerson = (node) => {
        let HTMLTree = [];
        let adsenseSnippet = window.sessionStorage.getItem(ssURI.adSnippet);
        let currentTime = new Date().getTime();
        let name = node.plugin.name.join("");
        let birthYear = (node.plugin.birt) ? node.plugin.birt.date : "Unknown Birth Year";
        let birthPlace = (node.plugin.birt) ? node.plugin.birt.place : "Unknown location";
        let sex = node.plugin.sexe || "Unknown";

        HTMLTree.push(HTMLHeadStart);

        HTMLTree.push([
            '<title>' + name + '</title>',
            '<meta name="Title" content="' + name + '"></meta>',
            '<meta name="BirthYear" content="' + birthYear + '"></meta>',
            '<meta name="CurrentDate" content="' + currentTime + '"></meta>',
            '<meta name="Description" content="' + name + " - " + birthPlace + '"></meta>',
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Nombre
        HTMLTree.push('<h1 style="color: #00f;">' + name + ' (' + birthYear + ')' + '</h1>');

        // Snippet para Adsense
        if(adsenseSnippet) {
            HTMLTree.push('<p>Our advertiser</p>');
            HTMLTree.push(adsenseSnippet);
            HTMLTree.push('<br>');
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

        // Fecha de Natalidad
        HTMLTree.push([
            '<h2>Birth Info</h2>',
            '<h4>Year</h4>',
            '<p>' + birthYear + '</p>',
            '<h4>Location</h4>',
            '<p>' + birthPlace + '</p>'
        ].join(''));
        HTMLTree.push('<br>');

        // Padres
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

            HTMLTree.push('<br><hr><br>');
        }          

        // Fecha de Mortalidad
        if(node.plugin.deat) {
            let deatYear = node.plugin.deat.date;
            let deatPlace = node.plugin.deat.place || "Unknown location";

            HTMLTree.push([
                '<h2>Death Info</h2>',
                '<h4>Year</h4>',
                '<p>' + deatYear + '</p>',
                '<h4>Location</h4>',
                '<p>' + deatPlace + '</p>'
            ].join(''));
            HTMLTree.push('<br><hr><br>');
        }

        // Familias
        if(node.plugin.familles.length > 0) {
            HTMLTree.push("<h2>Familia</h2>")
            // Recolectamos la informacion de la familia
            node.plugin.familles.forEach((famille) => {
                // Conyuge
                let conyuge = (sex == "M") ? famille.wife : famille.husb;
                if(conyuge) {
                    HTMLTree.push('<a href="' + conyuge.id + '.html"><h3>' + conyuge.plugin.name.join('') + '</h3></a>');
                    if(famille.marr) {
                        if(famille.marr.date)
                            HTMLTree.push('<p>Casados el: ' + famille.marr.date + '</p>');
                        if(famille.marr.place)
                            HTMLTree.push('<p>En la ubicacion: ' + famille.marr.place + '</p>');
                    }
                }

                // Hijos
                if (famille.childs) {
                    HTMLTree.push("<h4>Hijos</h4>");
                    famille.childs.forEach((child) => {
                        HTMLTree.push('<a href="' + child.id + '.html"><p>' + child.plugin.name.join('') + '</p></a>');
                    });
                }

                HTMLTree.push('<br>');            
            });

            HTMLTree.push('<hr><br>');
        }

        // Footer
        if(node.plugin.familleParent) {
            let father = node.plugin.familleParent.husb;
            let familleParentName = (father) ? father.plugin.name[father.plugin.name.length - 1] : "";
            HTMLTree.push('<a href="' + node.plugin.familleParent.id + '.html">Go to ' + familleParentName + ' Pedigree</a>');
        }

        HTMLTree.push(HTMLBodyEnd);

        return HTMLTree.join('');
    }

    let generateHTMLAsFamily = (node) => {
        let HTMLTree = [];
        let adsenseSnippet = window.sessionStorage.getItem(ssURI.adSnippet);
        let currentTime = new Date().getTime();
        let familyName = (node.husb) ? node.husb.plugin.name[node.husb.plugin.name.length - 1] : "Unknown Family name";

        HTMLTree.push(HTMLHeadStart);

        HTMLTree.push([
            '<title>' + familyName + ' Pedigree</title>',
            '<meta name="Title" content="' + familyName + '"></meta>',
            '<meta name="CurrentDate" content="' + currentTime + '"></meta>',
            '<meta name="Description" content="' + familyName + '"></meta>',
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Nombre de familia
        HTMLTree.push('<h1 style="color: #00f;">' + familyName + ' Pedigree' + '</h1>');

        // Snippet para Adsense
        if(adsenseSnippet) {
            HTMLTree.push('<p>Our advertiser</p>');
            HTMLTree.push(adsenseSnippet);
            HTMLTree.push('<br>');
        }

        // Esposo
        if(node.husb) {
            HTMLTree.push('<h2>Husband</h2>');
            HTMLTree.push('<a href="' + node.husb.id + '.html">' + node.husb.plugin.name.join('') + '</a>');
            HTMLTree.push('<br><br>');
        }

        // Esposa
        if(node.wife) {
            HTMLTree.push('<h2>Wife</h2>');
            HTMLTree.push('<a href="' + node.wife.id + '.html">' + node.wife.plugin.name.join('') + '</a>');
            HTMLTree.push('<br><hr><br>');
        }

        // Informacion de matrimonio
        if(node.marr) {
            if(node.marr.date)
                HTMLTree.push('<h4>Casados el: ' + node.marr.date + '</h4>');
            if(node.marr.place)
                HTMLTree.push('<h4>En la ubicacion: ' + node.marr.place + '</h4>');
        }

        HTMLTree.push('<br><hr><br>');

        // Hijos
        HTMLTree.push("<h2>Childrens</h2>");
        node.childs.forEach((child) => {
            HTMLTree.push('<a href="' + child.id + '.html"><p>' + child.plugin.name.join('') + '</p></a>');
        });

        HTMLTree.push(HTMLBodyEnd);

        return HTMLTree.join('');
    }

    let generateHTMLAsSource = (node) => {}

    Templates.register(new Template('Base', generateHTMLAsHome, generateHTMLAsPerson, generateHTMLAsFamily, generateHTMLAsSource));
})();
