//
//  Basic Template for Gedcom Converter
//

(function() {
    /*
        Widgets
    */
    let GoogleSearchWidget = [
        '<form id="searchbox" action="https://www.google.com/">',
        '<input name="q" type="text" size="40" />',
        '<input type="submit" name="sa" value="Search" />',
        '</form>'
    ].join('');

    /*
        Snippets
    */
    let HTMLHeadStart = [
        '<html>',
        '<head>'
    ].join('');

    let HTMLHeadEnd = '</head>';

    let HTMLBodyEnd = [
        GoogleSearchWidget,        
        '<a href="index.html">Home</a>',
        '</body>',
        '</html>'
    ].join('');  

    let HTMLBodyStart = '<body style="background-color: #f7f7f7; text-align: center;">';
    
    /*
        Template methods
    */
    let generateHTMLAsHome = (data) => {
        let HTMLTree = [];
        let adsenseSnippet = window.sessionStorage.getItem(ssURI.adSnippet);
        let currentTime = new Date().getTime();

        HTMLTree.push(HTMLHeadStart);

        HTMLTree.push([
            '<title>Main Page</title>',
            '<meta name="title" content="Main Page"></meta>',
            '<meta name="currentdate" content="' + currentTime + '"></meta>',
            '<meta name="description" content="Main Page"></meta>',
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Title
        HTMLTree.push('<h1 style="color: #00f;">Main Page</h1>');

        // Adsense Snippet
        if(adsenseSnippet) {
            HTMLTree.push('<p>Our advertiser</p>');
            HTMLTree.push(adsenseSnippet);
            HTMLTree.push('<br>');
        }

        HTMLTree.push('<br><hr><br>');

        // Families
        HTMLTree.push("<h2>Families</h2>");
        data.families.forEach((family) => {
            HTMLTree.push('<a href="' + family.id + '.html"><p>' + family.value + '</p></a>');
        });

        HTMLTree.push('<br><hr><br>');

        // Persons
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
        let birthYear = (node.plugin.birt) ? node.plugin.birt.year : null;
        let birthPlace = (node.plugin.birt) ? node.plugin.birt.place : null;
        let sex = node.plugin.sexe;

        HTMLTree.push(HTMLHeadStart);

        HTMLTree.push([
            '<title>' + name + '</title>',
            '<meta name="title" content="' + name + '"></meta>',
            '<meta name="birthyear" content="' + birthYear + '"></meta>',
            '<meta name="currentdate" content="' + currentTime + '"></meta>',
            '<meta name="description" content="' + name + " - " + birthPlace + '"></meta>',
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Title
        HTMLTree.push('<h1 style="color: #00f;">' + name + ' (' + (birthYear || "Unknown") + ')' + '</h1>');

        // Adsense Snippet 
        if(adsenseSnippet) {
            HTMLTree.push('<p>Our advertiser</p>');
            HTMLTree.push(adsenseSnippet);
            HTMLTree.push('<br>');
        }

        // Sex
        HTMLTree.push("<h2>Sex</h2>");
        switch(sex) {
            case "M":
                HTMLTree.push('<p>Man</p>');
            break;
            case "F":
                HTMLTree.push('<p>Female</p>');
            break;
            default:
                HTMLTree.push('<p>Unknown</p>');
            break;
        }        
        HTMLTree.push('<br>');

        // Birth data
        HTMLTree.push([
            '<h2>Birth data</h2>',
            '<h4>Year</h4>',
            '<p>' + (birthYear || "Unknown") + '</p>',
            '<h4>Location</h4>',
            '<p>' + (birthPlace || "Unknown Location") + '</p>'
        ].join(''));
        HTMLTree.push('<br>');

        // Parents data
        if(node.plugin.familleParent) {
            let fatherNode = node.plugin.familleParent.husb;
            let motherNode = node.plugin.familleParent.wife;

            HTMLTree.push('<h2>Parents data</h2>');

            if(fatherNode)
                HTMLTree.push([
                    '<h4>Father</h4>',
                    '<a href="' + fatherNode.id + '.html"><p>' + fatherNode.plugin.name.join('') + '</p></a>'
                ].join(''));

            if(motherNode)
                HTMLTree.push([                    
                    '<h4>Mother</h4>',
                    '<a href="' + motherNode.id + '.html"><p>' + motherNode.plugin.name.join('') + '</p></a>'
                ].join(''));

            HTMLTree.push('<br>');
        }

        HTMLTree.push('<hr><br>');

        // Death data
        if(node.plugin.deat) {
            let deatDate = node.plugin.deat.date;
            let deatPlace = node.plugin.deat.place;

            if(deatDate || deatPlace) {
                HTMLTree.push([
                    '<h2>Death data</h2>',
                    '<h4>Year</h4>',
                    '<p>' + (deatDate || "Unknown") + '</p>',
                    '<h4>Location</h4>',
                    '<p>' + (deatPlace || "Unknown location") + '</p>'
                ].join(''));
                HTMLTree.push('<br><hr><br>');
            }
        }

        // Families
        if(node.plugin.familles) {
            HTMLTree.push("<h2>Family</h2>")
            node.plugin.familles.forEach((famille) => {
                let conyuge = (sex == "M") ? famille.wife : famille.husb;
                if(conyuge) {
                    HTMLTree.push("<h4>Spouse</h4>");
                    HTMLTree.push('<a href="' + conyuge.id + '.html"><p>' + conyuge.plugin.name.join('') + '</p></a>');
                    if(famille.marr) {
                        if(famille.marr.date)
                            HTMLTree.push('<p>Married on: ' + famille.marr.date + '</p>');
                        if(famille.marr.place)
                            HTMLTree.push('<p>Location: ' + famille.marr.place + '</p>');
                    }
                }

                // Hijos
                if (famille.childs) {
                    HTMLTree.push("<h4>Childrens</h4>");
                    famille.childs.forEach((child) => {
                        HTMLTree.push('<a href="' + child.id + '.html"><p>' + child.plugin.name.join('') + '</p></a>');
                    });
                }

                HTMLTree.push('<br><br>');
            });

            HTMLTree.push('<hr><br>');
        }

        // Footer
        if(node.plugin.familleParent) {
            let father = node.plugin.familleParent.husb;
            let familleParentName = (father) ? father.plugin.name[father.plugin.name.length - 1] : "";
            HTMLTree.push('<a href="' + node.plugin.familleParent.id + '.html"><p>Go to ' + familleParentName + ' Pedigree</p></a>');
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
            '<meta name="title" content="' + familyName + '"></meta>',
            '<meta name="currentdate" content="' + currentTime + '"></meta>',
            '<meta name="description" content="' + familyName + '"></meta>',
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Family name
        HTMLTree.push('<h1 style="color: #00f;">' + familyName + ' Pedigree' + '</h1>');

        // Adsense Snippet 
        if(adsenseSnippet) {
            HTMLTree.push('<p>Our advertiser</p>');
            HTMLTree.push(adsenseSnippet);
            HTMLTree.push('<br>');
        }

        // Husband
        if(node.husb) {
            HTMLTree.push('<h2>Husband</h2>');
            HTMLTree.push('<a href="' + node.husb.id + '.html">' + node.husb.plugin.name.join('') + '</a>');
            HTMLTree.push('<br><br>');
        }

        // Wife
        if(node.wife) {
            HTMLTree.push('<h2>Wife</h2>');
            HTMLTree.push('<a href="' + node.wife.id + '.html">' + node.wife.plugin.name.join('') + '</a>');
            HTMLTree.push('<br><hr><br>');
        }

        // Marriage Data
        if(node.marr) {
            if(node.marr.date)
                HTMLTree.push('<h4>Married on: ' + node.marr.date + '</h4>');
            if(node.marr.place)
                HTMLTree.push('<h4>Location: ' + node.marr.place + '</h4>');
        }

        HTMLTree.push('<br><hr><br>');

        // Childrens
        HTMLTree.push("<h2>Childrens</h2>");
        node.childs.forEach((child) => {
            HTMLTree.push('<a href="' + child.id + '.html"><p>' + child.plugin.name.join('') + '</p></a>');
        });

        HTMLTree.push(HTMLBodyEnd);

        return HTMLTree.join('');
    }

    Templates.register(new Template('Base', generateHTMLAsHome, generateHTMLAsPerson, generateHTMLAsFamily));
})();