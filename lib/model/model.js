var pg = require('pg');

var connString = 'postgres://postgres@localhost:5432/postgres';

// You can also configure the connection like this:
var connConfig = {
  user     : 'postgres',
  database : '3Dwe',
  password: 'password',
  port     : 5432,
  host     : 'localhost'
};

var conn = connConfig;

exports.getUsers = function (callback) {
  pg.connect(conn, function (err, client, done) {
    if (err) {
      console.error(err);
      throw err;
    }
    client.query('select * from account', function (err, result) {
      done();
      if (err) {
        callback(err);
      }
      else {
        callback(undefined, result.rows);
      }
    });
  });
};

exports.addUser = function(fname, lname, email,password, callback) {
  pg.connect(conn, function (err, client, done) {
    if (err) {
      console.error(err);
      throw err;
    }

    var qry = 'insert into users (fname, lname, email, password) values ($1, $2, $3, $4) ' +
              'returning uid;';

    client.query(qry, [fname, lname, email, password],
                 function (err, result) {
                   // You can retrieve the row you inserted. This is very useful
                   // when you have SERIAL values:
                   console.log('resulting uid = ' + result.rows[0].uid);
                   done();
                   if (err) {
                     callback(err);
                   }
                   else {
                     callback(undefined, result.rows);
                   }
    });
  });
};

exports.deleteUser = function (fname, lname, callback) {
  pg.connect(conn, function (err, client, done) {
    if (err) {
      console.error(err);
      throw err;
    }

    var q1 = "select uid from users where fname = $1 and lname = $2;";
    var q2 = "delete from users where uid = $1;";
    var q3 = "delete from lives where uid = $1;";

    client.query(q1, [fname, lname], function (err, res) {
      if (err) {
        done();
        callback(err);
      }
      else {
        var uid = res.rows[0].uid;
        client.query(q2, [uid], function (err, res) {
          if (err) {
            done();
            callback(err);
          }
          else {
            client.query(q3, [uid], function (err, res) {
              done();
              if (err) {
                callback(err);
              }
              else {
                callback(err, res);
              }
            });
          }
        });
      }
    });
  });
};
