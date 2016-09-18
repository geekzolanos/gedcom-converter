concat-glob-cli -f *.js -o app.bundle.js
uglifyjs app.bundle.js -o app.min.js -c unused=false -screw-ie8 -m -d DEBUG=false
uglifyjs converting.js -o converting.min.js -c -m
uglifyjs destination.js -o destination.min.js -c -m
uglifyjs options.js -o options.min.js -c -m
uglifyjs selector.js -o selector.min.js -c -m

electron-packager ./ "Gedcom Converter" --app-version=1.1.0 --arch=ia32 --asar --icon="./res/icon.ico" --win32metadata.CompanyName="Geekzolanos" --win32metadata.FileDescription="Gedcom Converter" --win32metadata.OriginalFilename="gconv.exe" --win32metadata.ProductName="Gedcom Converter" --win32metadata.InternalName="GConv"