const sql = require('../config/bookCenterDB');

// constructor

const BookCenter = function(bookCenter) {
    this.id = bookCenter.id;
    this.name = bookCenter.name;
    this.tel = bookCenter.tel;
};

BookCenter.getAll = result => {
    sql.query("SELECT * FROM bookCenter;", 
    (err,res) => {
        if (err) {
            console.log("error: ", err);
            result(err,null);
            return;
        }
        
        console.log("bookCenter: ", res);
        result(null, res);
    });
};

module.exports = BookCenter;