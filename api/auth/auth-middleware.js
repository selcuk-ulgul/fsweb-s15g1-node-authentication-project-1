const model = require("../users/users-model");
const bcrypt = require("bcryptjs");

/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function sinirli(req, res, next) {
  try {
    if (req.session && req.session.user) {
      return next();
    }
    res.status(401).json({ message: "Geçemezsiniz!" });
  } catch (err) {
    next(err);
  }
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami(req, res, next) {
  try {
    const userExist = await model.goreBul({ username: req.body.username });
    if (userExist && userExist.length > 0) {
      return res.status(422).json({ message: "Username kullaniliyor" });
    }
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    next();
  } catch (err) {
    next(err);
  }
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function usernameVarmi(req, res, next) {
  try {
    const candidates = await model.goreBul({ username: req.body.username });
    let matchedUser = null;

    for (const candidate of candidates) {
      const passwordMatches = await bcrypt.compare(
        req.body.password,
        candidate.password
      );
      if (passwordMatches) {
        matchedUser = candidate;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: "Geçersiz kriter!" });
    }

    req.user = matchedUser;
    next();
  } catch (err) {
    next(err);
  }
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi(req, res, next) {
  try {
    if (!req.body.password || req.body.password.length < 3) {
      return res
        .status(422)
        .json({ message: "Şifre 3 karakterden fazla olmalı" });
    }
    next();
  } catch (err) {
    next(err);
  }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = { sifreGecerlimi, usernameBostami, usernameVarmi, sinirli };
