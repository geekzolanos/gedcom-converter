//
//  Template Manager
//  Un (Extremadamente) Simple administrador de plantillas
//

window.Template = function(name, gHome, gPerson, gFamily, gSource) {
    this.name = name;
    this.generateHome = gHome;
    this.generatePerson = gPerson;
    this.generateFamily = gFamily;
    this.generateSource = gSource;
}

window.Templates = {
    catalog: {},

    register: (obj) => {
        if(obj.constructor != Template)
            throw new TypeError('El objeto no es un Template');
        Templates.catalog[obj.name] = obj;
    },

    get: (name) => {
        let template = Templates.catalog[name];
        if(!template)
            throw new ReferenceError('La plantilla no existe.');
        return template;
    }
}