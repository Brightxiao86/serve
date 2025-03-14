const mysql = require('mysql2/promise');
const dbConfig = require('./config');
const tables = require('./tablesConfig');  // 引入表配置

/**
 * 异步函数 initDB 用于初始化数据库连接并创建所有表
 * 1. 创建数据库连接
 * 2. 遍历 tables 配置，检查并创建所有表
 * 3. 处理可能的错误
 * 4. 确保连接关闭
 * @async
 * @function initDB
 * @returns {Promise<void>} 无返回值
 */
async function initDB() {
  let connection;
  try {
    console.log("🔧 正在连接数据库...");
    connection = await mysql.createConnection(dbConfig);

    // 遍历创建所有表
    for (const { tableName, createSQL } of tables) {
      await checkAndCreateTable(connection, tableName, createSQL);
    }
    /* 
     * 循环说明：
     * - 遍历 tables 数组
     * - 对于每个表，调用 checkAndCreateTable 函数
     * - 传入连接、表名和创建 SQL 语句
     */

  } catch (error) {
    console.error("❌ 数据库初始化失败:", error); // 输出数据库初始化失败的错误信息
    throw error;
  } finally {
    if (connection) await connection.end(); // 确保连接关闭
  }
}

/**
 * 检查数据库中指定表是否存在，若不存在则创建表
 * @param {Object} connection - 数据库连接对象
 * @param {string} tableName - 要检查的表名
 * @param {string} createTableSQL - 创建表的SQL语句
 * @returns {Promise<void>} 无返回值
 * @throws {Error} 检查或创建表过程中可能抛出错误
 */
async function checkAndCreateTable(connection, tableName, createTableSQL) {
  try {
     // 执行SQL查询以检查指定表是否存在
    const [rows] = await connection.query(`SHOW TABLES LIKE ?`, [tableName]);
    // 判断表是否存在
    if (rows.length === 0) {
      await connection.query(createTableSQL); // 表不存在，输出提示信息并执行创建表操作
      console.log(`✅ 表 ${tableName} 创建成功`);
    } else {
      console.log(`✅ 表 ${tableName} 已存在，无需创建`); // 表存在，输出提示信息
    }
  } catch (error) {
    console.error(`❌ 检查或创建表 ${tableName} 时出错:`, error);  // 捕获并处理检查或创建表过程中可能发生的错误
  }
}



/**
 * 初始化数据库
 * @function initialization
 * @returns {Promise<void>} 无返回值
 */
async function initialization() {
  try {
    console.log("🔧 正在初始化数据库...");
    await initDB();
    console.log("✅ 数据库初始化完成");
  } catch (err) {
    console.error("❌ 数据库初始化失败:", err);
    process.exit(1);
  }
}




// 导出函数
module.exports = initialization;
