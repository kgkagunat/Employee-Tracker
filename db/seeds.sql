
INSERT INTO department (name) VALUES 
    ('Sales'), 
    ('Finance');





INSERT INTO role (title, salary, department_id) VALUES
    ('CEO of Sales', 70000, 1),
    ('Salesperson', 50000, 1),
    ('CEO of Marketing', 80000, 2),
    ('Accounting Secretary', 60000, 2);





INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Anna', 'Green', 3, NULL),
    ('Bob', 'Ross', 4, 3);

