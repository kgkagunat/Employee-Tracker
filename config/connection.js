const mysql2 = require('mysql2');

const db = mysql2.createConnection(
    {
      host: 'localhost',
      user: 'your_user_goes_here',             // Please enter your MySQL username in this line          
      password: 'your_password_goes_here',     // Please enter your MySQL password in this line
      database: 'employee_tracker_db',      
    },
    () => {
      console.log(`Connected to the employee_tracker_db database.`);
    }
  );
  
  module.exports = db;
  