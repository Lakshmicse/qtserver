const switchDB = async (dbName, dbSchema) => {
  const dbConnection = await global.clientConnection;
  if (dbConnection.readyState === 1) {
    const db = dbConnection.useDb(dbName, { useCache: true });
    // Prevent from schema re-registration
    const models = Object.keys(db.models);
    dbSchema.forEach((schema, modelName) => {
      if (models.indexOf(modelName) === -1) {
        db.model(modelName, schema);
      }
    });
    return db;
  }
  throw new Error('err');
};

/**
 * @return model from mongoose
 */
const getDBModel = async (db, modelName) => {
  return db.model(modelName);
};

module.exports = { switchDB, getDBModel };
