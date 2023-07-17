module.exports = function (db, inquirer) {

    // View All Departments //
    function viewAllDepartments(mainMenu) {

        const sql = 'SELECT name AS `Department` FROM department';

        db.query(sql, (err, res) => {
            if (err) throw err;
            console.table(res);
            mainMenu(); 
        });
    };

    //=========================================================================================

    // View All Roles //
    function viewAllRoles(mainMenu) {

        const sql = `
                    SELECT r.id AS 'ID', 
                    r.title AS 'Title', 
                    r.salary AS 'Salary', 
                    d.name AS 'Department'
                    FROM role r
                    LEFT JOIN department d
                    ON r.department_id = d.id
                    `;

        db.query(sql, (err, res) => {
            if (err) throw err;
            console.table(res);
            mainMenu();
        });
    };

    //=========================================================================================

    // View All Employees //
    function viewAllEmployees(mainMenu) {

        const sql = `
                    SELECT e.id, e.first_name AS 'First name', 
                    e.last_name AS 'Last name', 
                    r.title AS 'Role', 
                    d.name AS 'Department', 
                    IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'Is Manager') AS 'Manager' 
                    FROM employee e
                    LEFT JOIN role r ON e.role_id = r.id
                    LEFT JOIN department d ON r.department_id = d.id
                    LEFT JOIN employee m ON e.manager_id = m.id;
                    `;

        db.query(sql, (err, res) => {
            if (err) throw err;
            console.table(res);
            mainMenu();
        });
    };

    //=========================================================================================

    // Add Departments //
    function addDepartment(mainMenu) {
        inquirer
            .prompt([
                {
                    name: 'department',
                    type: 'input',
                    message: 'What is the name of the department that you would like to add?'
                }
            ])
            .then((answer) => {

                const sql = 'INSERT INTO department (name) VALUES (?)';
                const params = [answer.department];

                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                    
                    console.log(`\n\x1b[32m${answer.department} department successfully added!\n \nSelect "View All Departments" to view your recently added department(s).\x1b[0m\n`);

                    console.table(res);

                    mainMenu();
                });
            });
    };

    //=========================================================================================

    // Add Roles //
    function addRole(mainMenu) {
        db.query('SELECT * FROM department', (err, department) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: 'title',
                        type: 'input',
                        message: 'What is the title of the role that you would like to add?'
                    },
                    {
                        name:'salary',
                        type: 'input',
                        message: 'What is the salary of the role that you would like to add?'
                    },
                    {
                        name: 'department_id',
                        type: 'list',
                        message: 'What is the department ID of the role that you would like to add?',
                        choices: department.map(department => ({name: department.name, value: department.id}))
                    }
                ])
                .then((answer) => {

                    const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?,?,?)';
                    const params = [answer.title, answer.salary, answer.department_id];

                    db.query(sql, params, (err, res) => {
                        if (err) throw err;
                        
                        console.log(`\n\x1b[32m${answer.title} role successfully added!\n \nSelect "View All Roles" to view your recently added role(s).\x1b[0m\n`);

                        console.table(res);

                        mainMenu();
                    });
                });
       
        });
    };

    //=========================================================================================

    // Add Employees //
    function addEmployee(mainMenu) {
        db.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;
            db.query('SELECT * FROM role', (err, roles) => {
                if (err) throw err;
                inquirer
                    .prompt([
                        {
                            name: 'first_name',
                            type: 'input',
                            message: 'What is the first name of the employee that you would like to add?'
                        },
                        {
                            name: 'last_name',
                            type: 'input',
                            message: 'What is the last name of the employee that you would like to add?'
                        },
                        {
                            name: 'role_id',
                            type: 'list',
                            message: 'What is the role of the employee that you would like to add?',
                            choices: roles.map(role => ({name: role.title, value: role.id}))
                        },
                        {
                            name: 'isManager',
                            type: 'confirm',
                            message: 'Is this employee a manager?',
                            default: false
                        }
                    ])
                    .then((answer) => {
                        if (answer.isManager) {

                            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,NULL)';
                            const params = [answer.first_name, answer.last_name, answer.role_id];

                            db.query(sql, params, (err, res) => {
                                if (err) throw err;

                                console.log(`\n\x1b[32m${answer.first_name} ${answer.last_name} successfully added as a manager!\n \nSelect "View All Employees" to view your recently added manager.\x1b[0m\n`);

                                console.table(res);

                                mainMenu();
                            });
                        } else {
                            inquirer
                                .prompt([
                                    {
                                        name:'manager_id',
                                        type: 'list',
                                        message: 'Who is the manager of the employee that you would like to add?',
                                        choices: employees.map(employee => ({name: `${employee.first_name} ${employee.last_name}`, value: employee.id}))
                                    }
                                ])
                                .then((managerAnswer) => {
                                    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
                                    const params = [answer.first_name, answer.last_name, answer.role_id, managerAnswer.manager_id];

                                    db.query(sql, params, (err, res) => {
                                        if (err) throw err;

                                        console.log(`\n\x1b[32m${answer.first_name} ${answer.last_name} successfully added as an employee!\n \nSelect "View All Employees" to view your recently added employee.\x1b[0m\n`);

                                        console.table(res);

                                        mainMenu();
                                    });
                                });
                        }
                    });
            });
        });
    };
    
    
    

    //=========================================================================================

    // Update Employee Role //
    function updateEmployeeRole(mainMenu) {
        db.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;
            db.query('SELECT * FROM role', (err, roles) => {
                if (err) throw err;
    
                const employeeChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
                const roleChoices = roles.map(role => role.title);
                const noneChoice = 'None (assigns employee to manager)';
    
                inquirer
                    .prompt([
                        {
                            name: 'employee',
                            type: 'list',
                            message: 'Which employee would you like to update?',
                            choices: employeeChoices
                        },
                        {
                            name: 'role',
                            type: 'list',
                            message: 'Which role would you like to assign to this employee?',
                            choices: roleChoices
                        },
                        {
                            name: 'manager',
                            type: 'list',
                            message: 'Who is the new manager for this employee?',
                            choices: [...employeeChoices, noneChoice]
                        }
                    ])
                .then((answer) => {

                    const selectedEmployee = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answer.employee);
                    const selectedRole = roles.find(role => role.title === answer.role);
                    const selectedManager = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answer.manager);
    
                    const sql = 'UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?';
                    const params = [
                                    selectedRole.id, 
                                    answer.manager === noneChoice ? null : selectedManager.id,
                                    selectedEmployee.id
                                    ];
    
                    db.query(sql, params, (err, res) => {
                        if (err) throw err;
    
                        console.log(`\n\x1b[32m${answer.employee} has been updated successfully!\n \nSelect "View All Employees" to view your updated employee.\x1b[0m\n`);
    
                        console.table(res);
    
                        mainMenu();
                    });
                });
    
            });
        });
    };

    //=========================================================================================

    // View Employees by Manager //
    function viewEmployeesByManager(mainMenu) {
        db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employee WHERE manager_id IS NULL", (err, managers) => {
            if (err) throw err;
    
            inquirer
                .prompt([
                    {
                        name: 'manager',
                        type: 'list',
                        message: 'Which manager\'s employees would you like to view?',
                        choices: managers.map(manager => manager.manager_name)
                    }
                ])
            .then((answer) => {
                const selectedManager = managers.find(manager => manager.manager_name === answer.manager);

                const sql = `
                            SELECT e.id AS 'ID', 
                            CONCAT(e.first_name, ' ', e.last_name) AS 'Employee Name', 
                            r.title AS 'Role'
                            FROM employee e 
                            JOIN role r ON e.role_id = r.id
                            WHERE e.manager_id = ?
                            `;

                db.query(sql, [selectedManager.id], (err, res) => {
                    if (err) throw err;
                    
                    console.table(res);

                    mainMenu();
                });
            });
        });
    };
    
    


    //=========================================================================================
    
    // View Employees by Department //
    function viewEmployeesByDepartment(mainMenu) {
        db.query('SELECT * FROM department', (err, departments) => {
           if (err) throw err;

            inquirer
                .prompt([
                    {
                    name: 'department',
                    type: 'list',
                    message: 'Which department would you like to view?',
                    choices: departments.map(department => department.name)
                    }
                ])
                .then((answer) => {
                    const selectedDepartment = departments.find(department => department.name === answer.department);
        
                    const sql = `
                        SELECT e.id as 'ID',
                        CONCAT(e.first_name, ' ', e.last_name) AS 'Employee Name', 
                        r.title AS 'Role',
                        r.salary AS 'Salary',
                        d.name AS 'Department',
                        IFNULL (CONCAT(m.first_name, ' ', m.last_name), 'Is Manager') AS 'Manager' 
                        FROM employee e
                        LEFT JOIN role r on e.role_id = r.id
                        LEFT JOIN department d on r.department_id = d.id
                        LEFT JOIN employee m ON e.manager_id = m.id
                        WHERE d.id = ?`;
        
                    db.query(sql, [selectedDepartment.id], (err, res) => {
                        if (err) throw err;
        
                        console.table(res);
        
                        mainMenu();
                    });
                });
        });
    }
    

    

    //=========================================================================================

    // View Combined Salaries by Department //
    function viewCombinedSalariesByDepartment(mainMenu) {
        const sql = `
                    SELECT d.name AS 'Department',
                    SUM(r.salary) AS 'Combined Salaries (sum)'
                    FROM employee e
                    LEFT JOIN role r on e.role_id = r.id
                    LEFT JOIN department d on r.department_id = d.id
                    GROUP BY d.name
                    `;

        db.query(sql, (err, res) => {
            if (err) throw err;

            console.table(res);

            mainMenu();
        });
    }

    //==========================================================================================
    
    // Delete Department //
    function deleteDepartment(mainMenu) {
        db.query('SELECT * FROM department', (err, departments) => {
            if (err) throw err;
    
            inquirer
                .prompt([
                    {
                        name: 'department',
                        type: 'list',
                        message: 'Which department would you like to delete?',
                        choices: departments.map(department => department.name)
                    }
                ])
            .then((answer) => {
                const selectedDepartment = departments.find(department => department.name === answer.department);
            
                const sqlEmployee = `UPDATE employee SET role_id = NULL WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)`;
    
                db.query(sqlEmployee, [selectedDepartment.id], (err, res) => {
                    if (err) throw err;
    
                    const sqlRole = `DELETE FROM role WHERE department_id = ?`;
    
                    db.query(sqlRole, [selectedDepartment.id], (err, res) => {
                        if (err) throw err;
                
                        const sqlDept = `DELETE FROM department WHERE id = ?`;
    
                        db.query(sqlDept, [selectedDepartment.id], (err, res) => {
                            if (err) throw err;
                
                            console.log(`\n\x1b[32m${selectedDepartment.name} has been deleted successfully!\n \nSelect "View All Departments" to view your updated department.\x1b[0m\n`);
    
                            console.table(res);
                
                            mainMenu();
                        });
                    });
                });
            });
        });
    };
    
  

    //=========================================================================================
    
    // Delete Role //
    function deleteRole(mainMenu) {
        db.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        name: 'role',
                        type: 'list',
                        message: 'Which role would you like to delete?',
                        choices: roles.map(role => role.title)
                    }
                ])
            .then((answer) => {
                const selectedRole = roles.find(role => role.title === answer.role);

                const sqlRole = `DELETE FROM role WHERE id =?`;

                db.query(sqlRole, [selectedRole.id], (err, res) => {
                    if (err) throw err;

                    console.log(`\n\x1b[32m${selectedRole.title} has been deleted successfully!\n \nSelect "View All Roles" to view your updated role.\x1b[0m\n`);

                    console.table(res);

                    mainMenu();
                });
            });
        });
    }
    
    //=========================================================================================

    // Delete Employee //
    function deleteEmployee(mainMenu) {
        db.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        name: 'employee',
                        type: 'list',
                        message: 'Which employee would you like to delete?',
                        choices: employees.map(employee => employee.first_name + '' + employee.last_name)
                    }
                ])
                .then((answer) => {
                    const selectedEmployee = employees.find(employee => employee.first_name + '' + employee.last_name === answer.employee);

                    const sqlEmployee = `DELETE FROM employee WHERE id =?`;

                    db.query(sqlEmployee, [selectedEmployee.id], (err, res) => {
                        if (err) throw err;

                        console.log(`\n\x1b[32m${selectedEmployee.first_name} ${selectedEmployee.last_name} has been deleted successfully!\n \nSelect "View All Employees" to view your updated\x1b[0m\n`);

                        console.table(res);

                        mainMenu();
                    });
                });
        });
    }

    
    //========================================================================================= 

    // Returns an object containing all of the functions to be used in the app //
    return {
        viewAllDepartments: viewAllDepartments, 
        viewAllRoles: viewAllRoles, 
        viewAllEmployees: viewAllEmployees, 
        addDepartment: addDepartment, 
        addRole: addRole, 
        addEmployee: addEmployee, 
        updateEmployeeRole: updateEmployeeRole,
        viewEmployeesByManager: viewEmployeesByManager,
        viewEmployeesByDepartment: viewEmployeesByDepartment,
        viewCombinedSalariesByDepartment: viewCombinedSalariesByDepartment,
        deleteDepartment: deleteDepartment,
        deleteRole: deleteRole,
        deleteEmployee: deleteEmployee
    };
};






