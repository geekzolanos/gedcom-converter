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
    light: {
        BLUE: 1,
        ALPHA_LIGHT: 3,
        YELLOW: 4,
        LIGHT_GREEN: 5,
        LIGHT_BLUE: 6,
        DEEP_ORANGE: 7,
        SILVER: 8,
        POMEGRANATE: 9,
        VIOLET: 10
    },

    dark: {
        ALPHA_DARK: 2
    }
}

parseBool = (r) => {
    return ((r == "true") ? true : false);
}