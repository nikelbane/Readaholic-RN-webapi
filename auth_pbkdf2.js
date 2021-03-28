const Pool = require("pg").Pool;
const pool = new Pool({
  user: "nikhil",
  host: "localhost",
  database: "readaholic",
  password: "rootpass",
  port: 5432,
});
const crypto = require("crypto");

async function getUserPass(body) {
  //const { user, pass } = body;
  let flagg = false;
  const user = body.email.email;
  const pass = body.password.password;
  let myPromise = new Promise(function (resolve, reject) {
    setTimeout(() => {
      pool.query(
        "SELECT password FROM users_user WHERE email LIKE $1;",
        [user],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result.rows[0].password);
        }
      );
    }, 1000);
  });
  await myPromise.then(
    (value) => {
      flagg = verify(pass, value);
      console.log(flagg);
      return flagg; // Success!
    },
    (reason) => {
      console.error(reason); // Error!
    }
  );
  return flagg;
}

const encode = (password, { algorithm, salt, iterations }) => {
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return `${algorithm}$${iterations}$${salt}$${hash.toString("base64")}`;
};

const decode = (encoded) => {
  const [algorithm, iterations, salt, hash] = encoded.split("$");
  return {
    algorithm,
    hash,
    iterations: parseInt(iterations, 10),
    salt,
  };
};
const verify = (password, encoded) => {
  const decoded = decode(encoded);
  const encodedPassword = encode(password, decoded);
  return encoded === encodedPassword;
};

module.exports = {
  getUserPass,
};
