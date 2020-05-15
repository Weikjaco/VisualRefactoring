const express = require('express');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const uploadFolderLoc = `${__dirname}/client/src/upload/`;
const app = express();
const execSync = require('child_process').execSync;

const xlsxFile = require('read-excel-file/node');

app.use(fileUpload());

let dataStorage = {};
let cntFilesUploaded = 0;


// Create a JSON file given a javascript Object, upload path, and file name.
const createJSONFile = (jsObj, uploadPath, fileName) => {
    // Convert Javascript object to string
    let jsonString = JSON.stringify(jsObj);

    // Upload string to path specified
    fs.writeFileSync(uploadPath + `/${fileName}.json`, jsonString);
};


// Create a UML text file for plantUML module given a json object, upload path, and file name.
const createUMLFile = async (jsObj, uploadPath, fileName) => { 
    console.log("Creating UML File");
    console.log(fileName);
    // Generate plantUML text file
    let umlString = "@startuml\n";
    // Search through each package with the javascript object and extract the classes and dependencies
    let currentClass = [];
    let inheritedClass = [];
    let classAssociation = [];

    // Extract needed information from JSON
    for (let i=0; i < jsObj.data.length; i++) {
        let children = jsObj.data[i].children;
        for (let j=0; j < children.length; j++) {
            currentClass.push(children[j].name);
            inheritedClass.push(children[j].inherited);
            classAssociation.push(children[j].associated);
        }
    }

    // Generate text for document (text will be parsed and executed through module PLANTUML)
    for (let i = 0; i < currentClass.length; i++) {  
        // Get inherited class if it exists
        if (inheritedClass[i] !== "") {
            umlString +=  (inheritedClass[i].replace(/['"]+/g, '') + " <|-- " + currentClass[i].replace(/['"]+/g, '') + "\n");
        } else {
            umlString += ("class " + currentClass[i].replace(/['"]+/g, '') + "\n");
        }

        // Get associations
        for (let j=0; j < classAssociation[i]; j++) {
            let association = classAssociation[i];
            umlString += (association[j].replace(/['"]+/g, '') + " <-- " + currentClass[i].replace(/['"]+/g, '') + "\n");
        }
    }
    umlString += "@enduml";

    console.log("Writing File");
    console.log(JSON.stringify(umlString));
    // Create UML text file and store in public folder location
    fs.writeFileSync(uploadPath + `/${fileName}_uml.txt`, umlString);
    console.log("File is wrote -------------");
};


// Function that moves a /path/to/file to new location
const moveFileUsingPath = (file, dir) => {
    try {

        const path = require('path');
        const f = path.basename(file);
        const dest = path.resolve(dir, f);

        fs.rename(file, dest, (err) => {
            if (err) throw err;
        });

    } catch (err) {
        console.error(err);
    }
};


// Function that moves a fileobject to new location
const moveFile = async (fileObj, to) => {
    // Take in file object and move to set location
    return fileObj.mv(to)
};


// Generate UML png based on the given text file
const generateUMLImage = async (umlTextFile) => {
    // const execSync = require('child_process').execSync;
    console.log("EXECUTION COMMAND:");
    console.log(`java -jar plantuml.jar ${umlTextFile}`);
    try {
        execSync(`java -jar plantuml.jar ${umlTextFile}`, { encoding: 'utf-8' });
        // exec
    } catch (e) {
        console.error(e);
    }
};


// Function to obtain all classes present in the data argument.
const get_classes = async (jsdata) => {

    let children = []; // classes in the package
    let packageDependencies = []; // dependencies associated with a class
    let classes = [];

    // For each line of code get it's classes and determine dependencies within class
    for (let lineid=0; lineid<jsdata.length; lineid++) {
        let line = jsdata[lineid];

        // Get imported dependencies
        if (line.includes("import")) {
            packageDependencies.push((line.split("import ")[1].split(".")[0].split(" ")[0]).replace(/(\r\n|\n|\r)/gm, ""));
            continue;
        }

        // If we found the start of a class
        if (line.includes("class") && line.includes(':\n')) {
            
            let className = line.replace("class ", "").replace(":\n", "").replace(/\s*\(.*\)\s*/g, '');
            let classAssociations = new Set();
            let classInherited = "";
            let classCode = ""; //code associated with a class found
            let initialClassLine = true;

            classes.push(className);

            // Get code associated with class
            for (let i=lineid; i<jsdata.length; i++) {// Gather dependencies associated with class
                 
                if (initialClassLine) {
                    // If a dependency occurs in respect to inheritance
                    for (let d=0; d<packageDependencies.length; d++) {
                        if (line.includes(packageDependencies[d])) {
                            classInherited = packageDependencies[d];
                            break;
                        }
                    }
                    for (let d=0; d<classes.length; d++) {
                        if (line.includes(classes[d]) && classes[d] !== className) {
                            classInherited = classes[d];
                            break;
                        }
                    }
                } else { 
                    // If a dependency occurs in respect to association
                    for (let d=0; d<packageDependencies.length; d++) {
                        if (line.includes(packageDependencies[d])) {
                            classAssociations.add(packageDependencies[d]);
                        }
                    }
                }
                
                // If class ended
                if (jsdata[i][1] !== " " && !initialClassLine) {
                    break;
                }

                classCode += jsdata[i];
                lineid += 1;
                initialClassLine = false;
            }

            // Create JSON and add to children
            let child = {
                "name": className,
                "beforeCode": classCode,
                "afterCode": classCode,
                "associated": classAssociations,
                "inherited": classInherited
            };

            children.push(child);
        }
    }
    return children;
};


// Takes in a filename and an array of strings to create a json Object for storing our data.
const generateJson = async (fileName, content) => {

    // Initialize the JSON file
    let json = {};
    json.data = [];
    const classes = await get_classes(content);

    // Create and Declare JSON data
    let pkg = {
        "name": "Package - " + fileName + " " + cntFilesUploaded,
        "umlImgBefore": "images/" + fileName + "_uml.png",
        "umlImgAfter": "images/" + fileName + "_after_uml.png",
        "children": classes
    };

    json.data.push(pkg);

    // Update number of files uploaded
    cntFilesUploaded += 1;
    return json;
};


// Creates the JSON.json, UML.txt files needed for each file uploaded from webapp 
const createNeededFiles = async (fromFile, fileName) => {

    // Get code data by reading in python file
    const code = await new Promise((resolve, reject) => {
        fs.readFile(fromFile, 'UTF-8', (err, codeData) => {
            if (err) throw err;
            resolve(codeData);
        });
    });
          
    // Prepare the file contents by splitting the content into an array wherever a new line resides
    // then add new lines back in for each item in array (the new line additions will be useful later
    // when we are parsing through the code)
    let fileContent = code.split(/\r?\n/);
    let preparedFileContent = [];
    
    for (var line in fileContent) {
        preparedFileContent.push(fileContent[line] + "\n");
    }

    // Generate JSON from file-content
    let json = await generateJson(fileName, preparedFileContent);
    dataStorage[`file-${cntFilesUploaded}`] = JSON.parse(JSON.stringify(json));
    await createUMLFile(json, uploadFolderLoc, fileName);
};


// If whitespace in the given path, add quotes around the directories containing the whitespace.
const handleSpaceInFilePath = async filepath => {

    let path = filepath;
    let iter = 0;

    // Check to see if whitespace present in file path
    if (filepath.indexOf(" ") >= 0) {
        // Loop through each character in file path
        while (iter < filepath.length) {
            // If start of a new directory
            if (filepath[iter] == "/" || filepath[iter] == "\\" ) {
                var start = iter + 1
                var whitespacePresent = false;

                // Determine if space in directory name, or move on if end of directory name
                for (let j=iter;j<filepath.length;j++){

                    // If space set flag
                    if (filepath[j+1] == " ") {
                        var whitespacePresent = true;
                    }

                    // if end of directory name
                    if (filepath[j+1] == "/" || filepath[j+1] == "\\") {
                        var end = j + 1;
                        break;
                    }
                    iter++;
                }

                // If whitespace was present in directory name
                if (whitespacePresent) {
                    path = path.substring(0, start) + "\"" + path.substring(start,end) + "\"" + path.substring(end, path.length)
                }
            }
            iter ++;
        }
    }
    return path;
};


// Function that gets the information from an excel file
const parseXLSX = async xlsxPath => {
    let xlsxArray = [];
    const xlsxRows = await new Promise((resolve, reject) => {	
        resolve(xlsxFile(xlsxPath));	
    });		
    for (let row in xlsxRows) {	
        for (let col in xlsxRows[row]) {	
            xlsxArray.push(xlsxRows[row][col]);	
        }	
    }	
    return xlsxArray;	
};
    

const getCommandsAndTargets = async xlsxArray => {
    let commandsAndTargets = {	
        moveClass: [],	
        moveStaticProperty: []	
    };	

    // Add targets to corresponding commands	
    for (let i = 0; i < xlsxArray.length; i++) {
        if (xlsxArray[i] === "MoveClass") {
            commandsAndTargets.moveClass.push(xlsxArray[i + 1]);
        } else if (xlsxArray[i] === "MoveStaticProperty") {	
            commandsAndTargets.MoveStaticProperty.push(xlsxArray[i + 1]);	
        }	
    }

    return commandsAndTargets;	
};

// Function to get item to be moved from target
const moveClass = async (pyClass) => {

    let className = pyClass.split(".").pop();
    let newClassLocation = pyClass.split(".").slice(0,-1);
    let classCode = "";
    
    // Go through JSON, find class and remove it from current location
    for (let file in dataStorage) {
        let fileData = dataStorage[file].data;
        let children = fileData.map(cls => cls.children).flat();

        for (let num=0; num < children.length; num++) {
            if (children[num].name === className) {
                classCode += JSON.stringify(children[num]);
                dataStorage[file].data[0].children.splice(num,1)
            }
        }
    }
    
    
    // Add class to new location
    for (let file in dataStorage) {
        let fileData = dataStorage[file].data;
        let newFileLocationName = newClassLocation[newClassLocation.length - 1];

        //  Get right file
        if (fileData[0].name.includes(newFileLocationName)) {
            fileData[0].children.push(JSON.parse(classCode));
            break;
        }
    } 

    // Upload new content to jsonData
    createJSONFile(dataStorage, uploadFolderLoc, 'jsonData');
};
// Function to delete classes that are being moved
const exeCommands = async (commandsAndTargets) => {
    let classMoved = commandsAndTargets.moveClass.map(pyClass => { moveClass(pyClass) })
};


// Upload Endpoint
app.post('/upload', async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    let fileUploaded = [];
    let excelFile = [];
    
    // For each file in the request, move to upload folder and parse the data into JSON
    for (let key in req.files) {
        let file = req.files[key];
        
        // ENHANCEMENT: Make work for folders with multiple folders not just multiple files.

        // POSSIBLE-ENHANCEMENT: Probably could of directly parsed the data instead of storing file then parsing it.
        try {
            const fileMoved = moveFile(file, uploadFolderLoc+`${file.name}`);
            await fileMoved;
        } catch (error) {
            console.error(error);
            return res.status(500).send("Could not upload file.");
        }
        
        if (file.name.includes(".xlsx")) {
            excelFile.push(file); 
        }
        
        if(!file.name.includes(".xlsx")) {   
            // Create the json and uml files from the uploaded file.
            const filesCreated = createNeededFiles(uploadFolderLoc+`${file.name}`, file.name);
            await filesCreated;
            
            // Generate Image from uml text file using module PLANTUML
            var umlTxtFile = `${__dirname}/client/src/upload/${file.name}_uml.txt`;
            const whiteSpaceHandled = await  handleSpaceInFilePath(umlTxtFile);
            const umlImgGenerated = generateUMLImage(whiteSpaceHandled.replace(/\\/g, "/"));
            await umlImgGenerated;
            // Move UML image generated to the public folder so we can render in our client	
            moveFileUsingPath(uploadFolderLoc +`${file.name}_uml.png`, './client/public/images');
        }

        // If file successfully uploaded add to fileuploaded array
        fileUploaded.push(file.name);
    }
    if (excelFile[0].name !== "") {
        // We have JSON of Python, now we need to create UMLTextFiles

        // Set datastorage to be previous JSON, as it resets each upload
        const file = excelFile[0];
        const xlsxArray = await parseXLSX(uploadFolderLoc + `${file.name}`);
        const commandsAndTargets = await getCommandsAndTargets(xlsxArray);
        const todo = exeCommands(commandsAndTargets);
        await todo;

        // Create UML Text for each file in JSON and then image
        for (let file in dataStorage) {
            let data = dataStorage[file];

            for (let item in data) {
                let temp = data[item][0].name.split('- ')[1];
                let fileName = temp.split(" ")[0];
                const umlAfterTxtGenerated = createUMLFile(data, uploadFolderLoc, `${fileName}_after`);
                await umlAfterTxtGenerated;

                // Create UML img
                var umlAfterTxtFile = `${__dirname}/client/src/upload/${fileName}_after_uml.txt`;
                const whiteSpaceHandled = await handleSpaceInFilePath(umlAfterTxtFile);
                const umlImageAfterGenerated = generateUMLImage(whiteSpaceHandled.replace(/\\/g, "/"));
                await umlImageAfterGenerated;

                // Move file
                moveFileUsingPath(uploadFolderLoc +`${fileName}_after_uml.png`, './client/public/images');
            }
        }
        fileUploaded.push(file.name);
    } else {
        res.json("No excel file with commands were uploaded to server"); 
    }
    
    createJSONFile(dataStorage, uploadFolderLoc, 'jsonData');
    
    // Send the files successfully uploaded to client
    res.json({ filesUploaded: fileUploaded });
});

app.listen(5000, () => console.log('Server Started...'));
