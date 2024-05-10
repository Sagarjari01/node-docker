module.exports = {
    MONGO_CONTAINER : process.env.MONGO_CONTAINER || 'mongo',
    MONGO_PORT : process.env.MONGO_PORT || 27017,
    MONGO_DATABASE_NAME : process.env.MONGO_DATABASE_NAME,
}