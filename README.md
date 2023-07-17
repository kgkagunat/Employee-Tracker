# Employee-Tracker

## Overview

This Employee Management System is a Node.js command-line application that allows users to view, add, update, and delete data about departments, roles, and employees in a company. 
It uses MySQL for data storage and Inquirer.js for creating an interactive command line user interface.

## Challenges and Acceptance Criteria

This project I was given an acceptance criteria that I had to fulfill. Below is my acceptance criteria.

Challenges I faced were incorporating the update employee role and the deletion operations.
They were a challenge because the id of the department had foreign keys on them. So if I deleted the department, the role and employee would be affected as well.
For deleting the department I essentially needed to update the employee associated with that department and also delete the role associated with the department as well.
That was a difficult task, but managed to somewhat figure it out.

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Key Features

- View all departments, roles, or employees.
- Add departments, roles, or employees.
- Update employee roles or managers.
- Delete departments, roles, or employees.
- View the total utilized budget of a department (i.e., the combined salaries of all employees in that department).

## Usage

To use this application, run `node server.js` in the command line. This will present a list of options to view, add, update, or delete departments, roles, and employees.

## Installation

1) Clone the repository to your local machine.
2) Run `npm install` in the command line to install the necessary dependencies.
3) Make sure to have MySQL installed on your machine.
4) Run the `schema.sql` in MySQL Workbench to set up the database.
5) If you want to populate the database with test values, you can run the `seeds.sql` file in MySQL Workbench.
6) Open the server.js file and modify the MySQL connection settings with your own credentials.

## Setting Up Your MySQL Connection
1) Open connection.js in your code editor.
2) Modify the user and password properties in the connection settings to match your MySQL credentials.

- Here's is what the connection settings look like in the `connection.js`:
```js
const db = mysql2.createConnection(
    {
      host: 'localhost',
      user: 'your_user_goes_here',             // Please enter your MySQL username in this line          
      password: 'your_password_goes_here',     // Please enter your MySQL password in this line
      database: 'employee_tracker_db',      
    },
```

3) Replace "your_user_goes_here" and "your_password_goes_here" with your MySQL user and password.

## License

This project is licensed under the terms of the MIT license.
