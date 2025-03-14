    /**
     *  id INT PRIMARY KEY AUTO_INCREMENT,  用户ID，自增主键
     *  username VARCHAR(50) NOT NULL,      用户名，最大长度50，不能为空
        password VARCHAR(100) NOT NULL,     密码，最大长度100，不能为空
        email VARCHAR(100),                 邮箱，最大长度100
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP. 创建时间，默认当前时间
     * 
    */

    /**
       * id INT PRIMARY KEY AUTO_INCREMENT,  // 文章ID，自增主键
         title VARCHAR(200) NOT NULL,       // 文章标题，最大长度200，不能为空
         content TEXT,                      // 文章内容，支持长文本
         author_id INT,                     // 作者ID，关联用户表
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  // 创建时间，默认当前时间
    */

module.exports = [
  {
    tableName: 'user',
    createSQL: `
      CREATE TABLE IF NOT EXISTS user (
        id INT PRIMARY KEY AUTO_INCREMENT, 
        username VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  {
    tableName: 'article',
    createSQL: `
      CREATE TABLE IF NOT EXISTS article (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  }
];
