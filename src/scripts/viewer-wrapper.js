//
// Viewer-Wrapper.js
// Wrapper for Gedcom-Viewer-JS external library
//

window.ViewerWrapper = function() {
    let parser = new GedcomParser();

    this.readFile = (fpath) => {
        return new Promise((res, rej) => {
            if(fpath.constructor != String)
                rej(ErrCode.GEDCOM_FILE_INVALID_PARAMETER);
            fs.readFile(path.normalize(fpath), (err, data) => {
                if (err) {
                    rej(ErrCode.GEDCOM_FILE_NOT_EXISTS)
                    return false;
                }
                    parser.parse(data.toString());
                    res(parser.DATAS);
            });
        });
    }
};