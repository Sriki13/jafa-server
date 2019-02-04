function NoSuchFoodException(id) {
    this.message = "No food exists with id " + id;
}

function AttributeIsMissing(objectName, attributeName) {
    this.message = "Attribute '" + attributeName + "' is missing from '" + objectName + "'" 
}

function NoRecipeTitle() {
    this.message = "Recipe must have multiple lines, and the first line is the recipe title";
}

function InvalidRecipeFormat() {
    this.message = "No ingredients could be found in the recipe. Ingredients must be formatted with one" +
        " ingredient by line and each ingredient line must start with \"-\" followed by the name and the quantity" +
        "of the ingredient required."
}

function InvalidRecipeIngredient(position) {
    this.message = "Illegal argument: no ingredient for recipe " + position;
}

function InvalidUserException(desc) {
    this.message = "This user cannot do this operation\n " + desc;
}

module.exports = {
    NoSuchFoodException,
    AttributeIsMissing,
    NoRecipeTitle,
    InvalidRecipeFormat,
    InvalidRecipeIngredient,
    InvalidUserException
};