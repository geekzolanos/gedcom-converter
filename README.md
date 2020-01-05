# GEDCOM Converter

## Description
A Electron powered application to convert GEDCOM files to HTML.

## Autor
David Romero (@Geekzolanos)

## How to build
- Install Dependencies `npm install`

- Build the Application, using the following alternatives:
<table>
    <thead>
        <th>Command</th>
        <th>Description</th>
    </thead>
    <tbody>
        <tr>
            <td>npm run package</td>
            <td>Only for Windows. It runs a batch script to generate an Inno Setup Package (Requires Inno Setup 6 installed in his default LocalAppData folder)</td>
        </tr>
        <tr>
            <td>npm run build</td>
            <td>Makes an clean build</td>
        </tr>
        <tr>
            <td>npm run watch</td>
            <td>Makes an clean build, start Electron, and rebuild when source code changes.</td>
        </tr>
    </tbody>
</table>