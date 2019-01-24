function NoSuchFoodException(id) {
    this.message = "No food exists with id " + id;
}

module.exports = {
    NoSuchFoodException,
};