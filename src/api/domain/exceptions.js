function NoSuchFoodException(id) {
    this.message = "No food exists with id " + id;
}

function AttributeIsMissing(objectName, attributeName) {
    this.message = "Attribute '" + attributeName + "' is missing from '" + objectName + "'" 
}

module.exports = {
    NoSuchFoodException,
    AttributeIsMissing,
};