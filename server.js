const inquirer = require('inquirer');
const db = require('./config/connection');
const dbFunctions = require('./database/databaseFunctions')(db, inquirer);


// Main Menu //
function mainMenu() {
    inquirer
          .prompt([
                {
                    name: 'choice',
                    type: 'list',
                    message: 'What would you like to do?',
                    choices: [
                        'View all departments',
                        'View all roles', 
                        'View all employees', 
                        'Add a department', 
                        'Add a role', 
                        'Add an employee', 
                        'Update an employee role',
                        'View employees by manager',
                        'View employees by department',
                        'View combined salaries by department',
                        'Delete a department',
                        'Delete a role',
                        'Delete an employee',
                        'Exit'
                    ]
                }
            ])
            .then((answer) => {
                switch (answer.choice) {
                    case 'View all departments':
                        dbFunctions.viewAllDepartments(mainMenu);
                        break;
                    case 'View all roles':
                        dbFunctions.viewAllRoles(mainMenu);
                        break;
                    case 'View all employees':
                        dbFunctions.viewAllEmployees(mainMenu);
                        break;
                    case 'Add a department':
                        dbFunctions.addDepartment(mainMenu);
                        break;
                    case 'Add a role':
                        dbFunctions.addRole(mainMenu);
                        break;
                    case 'Add an employee':
                        dbFunctions.addEmployee(mainMenu);
                        break;
                    case 'Update an employee role':
                        dbFunctions.updateEmployeeRole(mainMenu);
                        break;
                    case 'View employees by manager':
                        dbFunctions.viewEmployeesByManager(mainMenu);
                        break;
                    case 'View employees by department':
                        dbFunctions.viewEmployeesByDepartment(mainMenu);
                        break;
                    case 'View combined salaries by department':
                        dbFunctions.viewCombinedSalariesByDepartment(mainMenu);
                        break;
                    case 'Delete a department':
                        dbFunctions.deleteDepartment(mainMenu);
                        break;
                    case 'Delete a role':
                        dbFunctions.deleteRole(mainMenu);
                        break;
                    case 'Delete an employee':
                        dbFunctions.deleteEmployee(mainMenu);
                        break;
                    case 'Exit':
                        db.end((err) => {
                            if (err) throw err;
                            console.log('\n\x1b[32mGoodbye!\n \nDatabase connection closed.\x1b[0m \n');
                        });
                        break;
                }
            });
}


// Start the application menu //
mainMenu();




