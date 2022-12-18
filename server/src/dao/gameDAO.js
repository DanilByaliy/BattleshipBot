'use strict'

class gameDAO {
  db = new Map();

  save(state) {
    this.db.set(state.gameId, state);
  }

  async get(gameId) {
    return await this.db.get(gameId);
  }

  delete(gameId) {
    return this.db.delete(gameId);
  }
}

module.exports = new gameDAO();