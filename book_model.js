const Pool = require("pg").Pool;
const pool = new Pool({
  user: "nikhil",
  host: "localhost",
  database: "Readaholic",
  password: "rootpass",
  port: 5432,
});

const getBook = () => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'select t1.id, t1.name as title, t1."Image", t3.name as author, t1.stock as price from shop_book t1 inner join shop_book_authors t2 on t1.id = t2.book_id inner join shop_author t3 on t2.author_id = t3.id;',
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      }
    );
  });
};

const getCart = () => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'SELECT t2.id, t1.name as book, t1."Image", t2.count from shop_book t1 inner join shop_count t2 on t1.id = t2.book_id;',
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      }
    );
  });
};
const createMerchant = (body) => {
  return new Promise(function (resolve, reject) {
    const { name, email } = body;
    pool.query(
      "INSERT INTO merchants (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`A new merchant has been added added: ${results.rows[0]}`);
      }
    );
  });
};
const deleteMerchant = () => {
  return new Promise(function (resolve, reject) {
    const id = parseInt(request.params.id);
    pool.query(
      "DELETE FROM merchants WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Merchant deleted with ID: ${id}`);
      }
    );
  });
};

module.exports = {
  getBook,
  getCart,
  createMerchant,
  deleteMerchant,
};
