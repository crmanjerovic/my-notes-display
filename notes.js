var path = require("path");
var fs = require("fs");

// retrieve files in the structure ./Notes/#-Section_Name/#-Lesson_Name

_folderPath = path.resolve(__dirname, "Notes");
_folderNames = fs.readdirSync(_folderPath);



// read in directory, return array of file path strings
function getNoteDirs(){
    // arr to hold directory paths of foldernames
    var noteDirs = [];
    // get paths based on known folder names (_folderNames)

    for(let i=0; i<_folderNames.length; i++){
        const notesPath = path.resolve(_folderPath, _folderNames[i]);
        noteDirs.push(notesPath);
        }

    return noteDirs;
}



// read paths from getNoteDirs, return nested array of file names
function getNoteNames(){
    var noteDirs = getNoteDirs();
    // iterate through each folder and readdirssync() & create nested array with file names
    var noteNames = [];

    for(let i=0; i<noteDirs.length; i++){
        // get all files from folder i
        const files = fs.readdirSync(noteDirs[i]);
        noteNames[i] = files;
    }

    return noteNames;
}



function getNoteNamesStyled() {
    // arr to hold styled names
    var noteNamesStyled = [];
    var noteNames = getNoteNames();
    // restyle names of note txt files if in format a-Name_of_File

    for(let i=0; i<noteNames.length; i++) {
        var nested = [];

        for(let j=0; j<noteNames[i].length; j++) {
            const hyphenIndex = noteNames[i][j].indexOf("-");

            if(hyphenIndex>-1) {
                const styled = noteNames[i][j].substring(hyphenIndex+1)
                    .replace(/_/g, " ").replace(/.txt/g, "");
                nested.push(styled);
            }

            else {
                // If filename is not in correct format, just push unstyled name
                nested.push(noteNames[i][j]);
            }
        }

        // Each nested array represents one folder
        noteNamesStyled.push(nested);
    }

    return noteNamesStyled;
}



// creates an array of objects with the format
// [[{name:file name, text:file.txt}]]
function getNoteText(){
    var noteDirs = getNoteDirs();
    var noteNames = getNoteNames();
    var noteNamesStyled = getNoteNamesStyled();
    var noteText = [];

    for(let i=0; i<noteDirs.length; i++){ //for each folder
        currentDir = [];

        for(let j=0; j<noteNames[i].length; j++) { // for each file in folder [i]
            buffer = fs.readFileSync(
                path.join(noteDirs[i], noteNames[i][j]),
                { encoding: 'utf8' }
            );

            //convert line breaks, tabs, and whitespace to html
            // then push to current directory
            const bufferText = buffer.toString();
            var noteObject = {name: noteNamesStyled[i][j],
                              text: bufferText,
                              id: "note"+i+j};
            currentDir.push(noteObject);
        }

        noteText[i] = currentDir;
    }

    return noteText;
}



function getFolderNamesStyled() {
    // arr to hold styled names
    var folderNamesStyled = [];

    // restyle names of folders if in format 1-Name_of_Lesson
    for(let i=0; i<_folderNames.length; i++) {
        const hyphenIndex = _folderNames[i].indexOf("-");

        if(hyphenIndex>-1) {
            const styled = _folderNames[i].substring(hyphenIndex+1).replace(/_/g, " ");
            folderNamesStyled.push(styled);
        }

        else {
            // If filename is not in correct format, just push unstyled name
            folderNamesStyled.push(_folderNames[i]);
        }
    }

    return folderNamesStyled;
}



// 'notes' is an array of objects
// notes = [folders]
// folder: { folder name, text: [{text name, text file}] }
function getNotes(){
    var notesText = getNoteText(); 
    let notes = getFolderNamesStyled().map((folderName, index) => ({
        folder: folderName,
        note: notesText[index]
      }));

    return notes;
}



module.exports = {  getNotes };

