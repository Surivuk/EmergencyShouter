var WebSqlService = function() {

    //db context
    var db = openDatabase('websql://mydb', '1.0', 'my first database', 5 * 1024 * 1024);

    //create or open if exists mydb
    this.init = function() {

        console.log("mydb Opened.");

    }

    this.dropTable = function(tableName) {

        db.transaction(function(tx) {
            tx.executeSql("DROP TABLE " + tableName, [],
                function(tx, results) { console.log("Successfully Dropped") },
                function(tx, error) {
                    console.log("Could not delete.Error:");
                    console.log(error)
                }
            );
            //console.log("Table " + tableName + " droped.");
        });
    }
    this.createTable = function(tableName) {
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (id INTEGER PRIMARY KEY, text VARCHAR)', [],
                function(tx, results) {
                    alert("Table: " + tableName + " created.");
                },
                function(tx, error) {
                    alert("Error: " + error);
                });
            //console.log("Table " + tableName + " created.");
            //alert("Table " + tableName + " created.");
        });
    }
    this.insert = function(tableName, content) {
        db.transaction(function(
            tx) {
            tx.executeSql('INSERT INTO ' + tableName + ' (text) VALUES (?)', [content],
                function(tx, results) {
                    console.log("Successfully inserted in table " + tableName);
                    alert("Sexifuly inserted")
                },
                function(tx, error) {
                    console.log("Error with insert query for table " + tableName);
                    alert(error);
                    console.log(error);
                });
            console.log("Insert in  " + tableName + " finished.");
            //alert("Insert in  " + tableName + " finished.");
        });

    }
    this.select = function(tableName, callBack) {

        db.transaction(function(tx) {

            tx.executeSql('SELECT * FROM ' + tableName, [],
                function(tx, results) {
                    /*var len = results.rows.length,
                        i;
                    for (i = 0; i < len; i++) {
                        alert(results.rows.item(i).text);
                    }*/
                    /*console.log("Select in  " + tableName + " finished.Returning results...");
                    console.log(results);*/
                    callBack(results);
                    //return results.rows;
                },
                function(tx, error) {
                    console.log("Error with select query for table " + tableName);
                    console.log(error);
                });

        });

    }
    this.fullTest = function() {
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE omk (id unique, text)');
            console.log("Table created.");
            tx.executeSql('INSERT INTO omk (id,text) VALUES (7,"Darko")');
            console.log("Insert finished.");
            tx.executeSql('SELECT * FROM omk', [], function(tx, results) {

                console.log("Select in omk finished.Returning results...");
                return results;
            });
        });
    }
    this.getSelected = function private_name() {
        if (selectBuff.length == 0) {
            setTimeout(function() {
                return private_name();;
            }, 3000);

        } else {
            return selectBuff;
        }

    }
}
