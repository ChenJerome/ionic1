/**
 * Created by Administrator on 2016/1/11.
 */
mySqlite = {
  Test: function() {
    //sqllite Demo
    var db = window.sqlitePlugin.openDatabase({name: "test.db"}); //打开数据库
    db.executeSql("create table if not exists tbl_A (registrationId varchar,time varchar)"); //创建数据表
    db.executeSql("select count(1) as datarowcount from tbl_A", [], function(res) {//数据表查询,executeSql(查询语句，数据，回调函数)
      //console.log(res.rows.length);
      //alert(res.rows.length);
      //res.rows.item(0)为查询的数据JSON对象，可直接.列名调用值
      if (res.rows.item(0).datarowcount == 0) {
        //数据插入，插入时executeSql第二个参数就为要插入的数据。
        db.executeSql("insert into tbl_A (registrationId) values (?,?)", ["JeromeChen", ""], function(tx, res) {
          alert(JSON.stringify(res));
        })
      } else {
        db.executeSql("select registrationId from tbl_A", [], function(r) {
          alert(JSON.stringify(r.rows.item(0)));
        })
      }
    });
  }
}
