'use strict'

class userDAO {
  db = new Map();

  save(user) {
    this.db.set(user.tag, user);
  }

  get(userTag) {
    const user = this.db.get(userTag);
    return user;
  }

  delete(userTag) {
    return this.db.delete(userTag);
  }
}

module.exports = new userDAO();