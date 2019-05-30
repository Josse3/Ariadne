Ariadne (previously as "GrieksVoc") is a web application that makes it able to study vocabulary of the ancient Greek language online. 

This application was created using an express API as a database structure (this will however shortly be changed to a SQL-database!), and ReactJS as a ui-framework. 

## Features
### Current
Currently the application has an express API (still only containing very few vocabulary) for testing, and a so-called "Pocket mode" at its disposal, as well as an "Add-tool" (which is not being linked anywhere, but can be visited via `localhost:3000/addtool`).

The "Pocket mode" is in fact pretty much completed. Its job is to iterate through the list of vocabulary and show the correction to the user whenever he/she clicks the button.

The Add-tool is a UI page that functions together with the express API, and gives the possibility to send PUT-requests to the API in order to add or update the vocabulary list. The current UI though has only the possibility of pushing the information required for substantives of the first declension.

### Future
As mentioned before, in the future the much-needed change from an express UI as a database to the SQL-option will be worked on.

Furthermore, the "Correction Mode" (it is also quite likely that I wil opt for a better name") will be added, and it should serve as a "form page" on which the user can rehearse vocabulary by typing in answers and getting corrected by the app, as a sort of "quiz". 

## Notes
* A previous version written in jQuery can be found amongst my other repositories. Although this version isn't being worked on anymore, quite a lot of the functionality code of this project was already written during its development and is thus copy-pasted. 
* The UI, instructions and so on are all in Dutch, because the project is primarily written for use at a Dutch school. The ability to use the site in a different language would require the translation of the entire vocabulary which is a lot of work, and is thus unlikely to be added.