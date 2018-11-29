const sql = require('mssql');

const config = {
    user: 'admin',
    password: 'admin',
    server: 'localhost\\SQLEXPRESS',
    database: 'SleepTracker',
    options: {
        trustedConnection: true
      }
}

// exports.query = function(query, res) {
//     new sql.ConnectionPool(config).connect().then(pool => {
//         return pool.request().query(query);
//     }).then(result => {
//         let rows = result.recordset;
//         res.setHeader('Access-Control-Allow-Origin', '*')
//         res.status(200).json(rows);
//         sql.close();
//     }).catch(err => {
//         res.send(err);
//         sql.close();
//     });
// }

// exports.getSubject = function(req, res) {
//     var fullNameArray = req.params.name.split(" ");
//     var firstName = fullNameArray[0];
//     var lastName = fullNameArray[1];
//     var date = req.params.date;

//     let query = `select * from Subject s
//         where s.FirstName = '${firstName}'
//         and s.LastName = '${lastName}'
//         and DATEDIFF(day, s.BirthDate, '${date}') = 0`;

//     module.exports.query(query, res);
// };

exports.getSleepData = function(req, res) {
    var fullNameArray = req.params.name.split(" ");
    var firstName = fullNameArray[0];
    var lastName = fullNameArray[1];
    var date = req.params.date;
    let query = `SELECT S.*, SD.* FROM Subject S
                JOIN SleepData SD ON S.ID = SD.TestSubjectID
                WHERE S.FirstName = '${firstName}'
                AND S.LastName = '${lastName}'
                AND DATEDIFF(day, S.BirthDate, '${date}') = 0`;
    
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(query);
    }).then(result => {
        let rows = result.recordset;
        res.setHeader('Access-Control-Allow-Origin', '*')
        //TODO fix ros (accumulate)
        res.status(200).json(rows);
        sql.close();
    }).catch(err => {
        res.send(err);
        sql.close();
    });
};