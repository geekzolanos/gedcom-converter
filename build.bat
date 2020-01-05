@ECHO off

REM Cleanup
rmdir /s /q ".tmp"
rmdir /s /q ".dist"

REM Build the files
call npm run build

REM Create the electron package
SET DEBUG=*
call electron-packager .\ "Gedcom Converter" --arch=ia32 --asar --icon="build/res/icon.ico" --win32metadata.CompanyName="Geekzolanos" --win32metadata.FileDescription="Gedcom Converter" --executable-name="gconv" --win32metadata.ProductName="Gedcom Converter" --win32metadata.InternalName="GConv" --out=".tmp"

REM Copy for Inno
xcopy /e ".tmp\Gedcom Converter-win32-ia32\*" .tmp
rmdir /s /q ".tmp\Gedcom Converter-win32-ia32"

REM Create the installer
"%LocalAppData%\Programs\Inno Setup 6\iscc.exe" installer.iss

REM Final Cleanup
rmdir /s /q ".tmp"