[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Refactoring Visualization

## Authors: Gavin Austin, Jacob Weikert

# Getting Started

**NOTE:** THIS ONLY WORKS WITH PYTHON FILES.

**Node Version Used:** NodeJS - 12.16.3

**Node Package Manager (NPM) Used:** NPM 6.14.4

1. Ensure that Java 8 and Graphviz (version 2.42.3) are installed.

2. Clone the repo.

3. In terminal change directory to the folder you placed the application.

4. When in this directory execute the command "npm install".
   This command will install all of the applications dependencies for the SERVER.

5. Now change the current directory to the client folder and execute the command "npm install".
   This command will install all of the applications dependencies for the CLIENT.

6. Navigate back to the applications folder and execute the command "npm run dev"
   This command will run a script that starts the NodeJS server and the React client concurrently.

# Running the Application
1. Upload all the python files of your project and the excel file with the list of commands.

- **Note:** The excel file must contain the command _MoveClass_ in the _command cell_ to perform a refactoring -- this is 
   currently the only refactoring that can be shown using our webapp. You need to fill in the _command cell_ after the 
   _target cell_. The target cell will contain the new location of the class 
   (e.g., Animal.Bobcat in the _target_cell_ moves the Bobcat class from its current location to the Animal file). 
   The _target cell_ must be located directly after the _command cell_. All other cells within the excel file are 
   ignored.
