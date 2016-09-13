//
//  Template Manager
//  Un (Extremadamente) Simple administrador de plantillas
//

window.Template = function(name, gPerson, gFamily, gSource) {
    this.name = name;
    this.generatePerson = gPerson;
    this.generateFamily = gFamily;
    this.generateSource = gSource;
}

// TODO: Llevar esto al esquema de Getter y Setters
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