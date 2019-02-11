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

function InvalidOrderException(order) {
    this.message = "Invalid order used (" + order + "): valid options are asc and desc"
}

function InvalidRecipe(id) {
    this.message = "No recipe exists with id " + id;
}

function NoSuchStore(id) {
    this.message = "No store exists with id " + id;
}

function InvalidLocationSearch() {
    this.message = "Cannot filter by store and region at the same time";
}

function InvalidRegion(region) {
    this.message = "No shop exists in the region " + region;
}

module.exports = {
    NoSuchFoodException,
    AttributeIsMissing,
    NoRecipeTitle,
    InvalidRecipeFormat,
    InvalidRecipeIngredient,
    InvalidUserException,
    InvalidOrderException,
    InvalidRecipe,
    NoSuchStore,
    InvalidLocationSearch,
    InvalidRegion
};