const db = require("../../data/db-config");
/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
const bul = async () => {
  return db("users").select("user_id", "username");
};

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
const goreBul = async (filtre) => {
  return db("users").where(filtre);
};

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  return db("users").where({ user_id }).first();
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  const id = await db("users").insert(user);
  const newUser = await idyeGoreBul(id);
  return newUser;
}

module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
};

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
