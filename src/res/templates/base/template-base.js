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
    let HTMLBodyStart = '<body style="background-color: #f7f7f7; text-align: center;">';
    let HTMLHeadEnd = '</head>';
    let HTMLHeadStart = [
        '<html>',
        '<head>',
        '<meta charset="UTF-8">',
        '<style>',
        'footer a {margin: 0 5px;}',
        '</style>'
    ].join('');

    let HTMLBodyEnd = () => {
        let tree = [];        
        tree.push('</body>');        
        tree.push('<footer>');
        tree.push(GoogleSearchWidget);
        tree.push('<a href="index.html">Home</a>');
        if(Preferences.session.options.prologe === true)
            tree.push('<a href="prologe.html">Prologe</a>');
        if(Preferences.session.options.credits === true)
            tree.push('<a href="credits.html">Credits</a>');            
        tree.push('</footer>');
        tree.push('</html>');
        
        return tree.join('');
    }

    let GenerateChildren = (node) => {
        let name = node.plugin.name.join("\xa0");
        let birthDate = (node.plugin.birt) ? node.plugin.birt.date : null;
        let startPhrase = (node.plugin.sexe == "F") ? "A daughter" : "A son";
        return '<li><p>' + startPhrase + ', <a href="' + node.fixedID + '.html">' + name + '</a> was born ' + (birthDate || '- no date of birth or death') + '.</li></p>';     
    }
    
    /*
        Template methods
    */
    let generateHTMLAsHome = (data) => {
        let HTMLTree = [];
        let adsenseSnippet = Preferences.session.options.adSnippet;
        let currentDate = new Date();

        HTMLTree.push(HTMLHeadStart);

        HTMLTree.push([
            '<title>Main Page</title>',
            '<meta name="title" content="Main Page">',
            '<meta name="currentdate" content="' + currentDate + '">',
            '<meta name="description" content="Main Page">'
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Title
        HTMLTree.push('<h1 style="color: #00f;">Main Page</h1>');

        // Adsense Snippet
        if(!adsenseSnippet.empty()) {
            HTMLTree.push('<p>Our advertiser</p>');
            HTMLTree.push(adsenseSnippet);
            HTMLTree.push('<br>');
        }

        HTMLTree.push('<br><hr><br>');

        // Families
        if(Preferences.session.options.noFamily === false) {
            HTMLTree.push("<h2>Families</h2>");
            data.families.forEach((family) => {
                HTMLTree.push('<a href="' + family.id + '.html"><p>' + family.value + '</p></a>');
            });

            HTMLTree.push('<br><hr><br>');
        }

        // Persons
        HTMLTree.push("<h2>Persons</h2>");
        data.persons.forEach((person) => {
            HTMLTree.push('<a href="' + person.id + '.html"><p>' + person.value + '</p></a>');
        });

        HTMLTree.push('<br><hr><br>');

        HTMLTree.push(HTMLBodyEnd());

        return HTMLTree.join('');
    }

    let generateHTMLAsPerson = (node) => {
        let HTMLTree = [];
        let adsenseSnippet = Preferences.session.options.adSnippet;
        let currentDate = new Date();
        let name = node.plugin.name.join("\xa0");
        let birth = node.plugin.birt;
        let sex = node.plugin.sexe;

        HTMLTree.push(HTMLHeadStart);

        HTMLTree.push([
            '<title>' + name + '</title>',
            '<meta name="title" content="' + name + '\xa0' + (birth.year || "") + ' genealogy ' + currentDate + '">',
            '<meta name="birthyear" content="' + (birth.year || "Unknown") + '">',
            '<meta name="currentdate" content="' + currentDate + '">',
            '<meta name="description" content="' + name + ' family history">'
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Title
        HTMLTree.push('<h1 style="color: #00f;">' + name + '\xa0\xa0' + (birth.year || "")  + '</h1>');

        // Adsense Snippet 
        if(adsenseSnippet.empty() === false) {
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
            '<h4>Date</h4>',
            '<p>' + (birth.date || "Unknown") + '</p>',
            '<h4>Location</h4>',
            '<p>' + (birth.place || "Unknown Location") + '</p>'
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
                    '<a href="' + fatherNode.fixedID + '.html"><p>' + fatherNode.plugin.name.join('\xa0') + '</p></a>'
                ].join(''));

            if(motherNode)
                HTMLTree.push([                    
                    '<h4>Mother</h4>',
                    '<a href="' + motherNode.fixedID + '.html"><p>' + motherNode.plugin.name.join('\xa0') + '</p></a>'
                ].join(''));

            HTMLTree.push('<br>');
        }

        HTMLTree.push('<hr><br>');

        // Death data
        if(node.plugin.deat) {
            let deatDate = node.plugin.deat.date;
            let deatPlace = node.plugin.deat.place;
            let buriDate = (node.plugin.buri) ? node.plugin.buri.date : null;
            let buriPlace = (node.plugin.buri) ? node.plugin.buri.place : null;

            if(deatDate || deatPlace || buriDate || buriPlace) {
                HTMLTree.push([
                    '<h2>Death data</h2>',
                    '<h4>Date</h4>',
                    '<p>' + (deatDate || "Unknown") + '</p>',
                    '<h4>Location</h4>',
                    '<p>' + (deatPlace || "Unknown location") + '</p>',
                    '<h4>Burial Date</h4>',
                    '<p>' + (buriDate || "Unknown") + '</p>',
                    '<h4>Burial Site</h4>',
                    '<p>' + (buriPlace || "Unknown location") + '</p>'
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
                    HTMLTree.push('<a href="' + conyuge.fixedID + '.html"><p>' + conyuge.plugin.name.join('\xa0') + '</p></a>');
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
                    HTMLTree.push("<ul>");
                    famille.childs.forEach((child) => {
                        HTMLTree.push(GenerateChildren(child));
                    });
                    HTMLTree.push("</ul>");
                }

                HTMLTree.push('<br><br>');
            });

            HTMLTree.push('<hr><br>');
        }

        // Footer
        if(node.plugin.familleParent) {
            let father = node.plugin.familleParent.husb;
            let familleParentName = (father) ? father.plugin.name[father.plugin.name.length - 1] : "";
            if(Preferences.session.options.noFamily === true)
                HTMLTree.push('<a href="' + node.plugin.familleParent.name + '.html"><p>Go to ' + familleParentName + ' Pedigree</p></a>');
            else
                HTMLTree.push('<a href="' + node.plugin.familleParent.fixedID + '.html"><p>Go to ' + familleParentName + ' Pedigree</p></a>');
        }

        HTMLTree.push(HTMLBodyEnd());

        return HTMLTree.join('');
    }

    let generateHTMLAsFamily = (node) => {
        let HTMLTree = [];
        let adsenseSnippet = Preferences.session.options.adSnippet;
        let currentDate = new Date();

        HTMLTree.push(HTMLHeadStart);

        HTMLTree.push([
            '<title>' + node.name + ' Pedigree</title>',
            '<meta name="title" content="' + node.name + '">',
            '<meta name="currentdate" content="' + currentDate + '">',
            '<meta name="description" content="' + node.name + '">'
        ].join(''));

        HTMLTree.push(HTMLHeadEnd);
        HTMLTree.push(HTMLBodyStart);

        // Family name
        HTMLTree.push('<h1 style="color: #00f;">' + node.name + ' Pedigree' + '</h1>');

        // Adsense Snippet 
        if(!adsenseSnippet.empty()) {
            HTMLTree.push('<p>Our advertiser</p>');
            HTMLTree.push(adsenseSnippet);
            HTMLTree.push('<br>');
        }

        // Husband
        if(node.husb) {
            HTMLTree.push('<h2>Husband</h2>');
            HTMLTree.push('<a href="' + node.husb.fixedID + '.html"><p>' + node.husb.plugin.name.join('\xa0') + '</p></a>');
        }

        // Wife
        if(node.wife) {
            HTMLTree.push('<h2>Wife</h2>');
            HTMLTree.push('<a href="' + node.wife.fixedID + '.html"><p>' + node.wife.plugin.name.join('\xa0') + '</p></a>');
        }

        HTMLTree.push('<br><hr><br>');

        // Marriage Data
        if(node.marr) {
            if(node.marr.date)
                HTMLTree.push('<h4>Married on: ' + node.marr.date + '</h4>');
            if(node.marr.place)
                HTMLTree.push('<h4>Location: ' + node.marr.place + '</h4>');
            HTMLTree.push('<br><hr><br>');
        }        

        // Childrens
        if(node.childs) {            
            HTMLTree.push("<h2>Childrens</h2>");       
            HTMLTree.push("<ul>");
            node.childs.forEach((child) => {
                HTMLTree.push(GenerateChildren(child));
            });
            HTMLTree.push("</ul>");

            HTMLTree.push('<br><hr><br>');
        }

        HTMLTree.push(HTMLBodyEnd());

        return HTMLTree.join('');
    }

    Templates.register(new Template('Base', generateHTMLAsHome, generateHTMLAsPerson, generateHTMLAsFamily));
})();