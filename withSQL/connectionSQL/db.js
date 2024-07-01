const mysql2 = require('mysql2');

 const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'multermysql',
});

connection.connect((err)=>{
    if(err){
        console.log('Error connecting to Db:',err);
        return;
    }else{
        console.log('Connected to MySQL');
    }
});

module.exports = connection;

