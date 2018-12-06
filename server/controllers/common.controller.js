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

exports.getSleepData = function(req, res) {
    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var date = req.body.BirthDate;
    let query = `SELECT S.*, SD.* FROM Subject S
                JOIN SleepData SD ON S.ID = SD.TestSubjectID
                WHERE S.FirstName = '${firstName}'
                AND S.LastName = '${lastName}'
                AND DATEDIFF(day, S.BirthDate, '${date}') = 0`;
    
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(query);
    }).then(result => {
        let rows = result.recordset;
        if(rows == null || rows.length == 0) {
            res.status(200).json({});
        }

        var user = {
            ID: rows[0].ID,
            FirstName: rows[0].FirstName,
            LastName: rows[0].LastName,
            BirthDate: rows[0].BirthDate,
            ProfilePicture: rows[0].ProfilePicture,
            SleepData: []
        };
        for (let index = 0; index < rows.length; index++) {
            user.SleepData[index] = rows[index];
        }

        res.setHeader('Access-Control-Allow-Origin', '*')
        //TODO fix ros (accumulate)
        res.status(200).json(user);
        sql.close();
    }).catch(err => {
        res.send(err);
        sql.close();
    });
};