//
//  Util.js
//  Utilerias de la aplicacion
//

let ErrCode = {
    GEDCOM_FILE_NOT_EXISTS: 0,
    GEDCOM_FILE_INVALID_PARAMETER: 1,
    GEDCOM_PARSER_UNKNOWN: 2
} 

let Tones = {
    BLUE: 1,
    ALPHA_DARK: 2,
    ALPHA_LIGHT: 3
}

parseBool = (r) => {
    return ((r == "true") ? true : false);
}