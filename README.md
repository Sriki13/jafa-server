# Server

## Functionalities done
* search for existing foods in the DB according to given criteria
* assign foods an overall score according to some mix of criteria

## Functionalities to add :
* compare and order similar items according to some criteria, eg, nutritional value
* parse a simple recipe and search for suitable ingredients from the DB. Since this is initially aimed at students, recipes are really simple. For example, the classic macaroni & cheese contains macaroni...and cheese. However, the ingredients will be selected according to some criteria, eg, only macaroni and cheese with no EXXX additives
* missing from the database is any pricing information. Your app will present a way for users to add price information: price, store, date of entry. To prevent fraud, to ensure authenticity of pricing information and traceability, this information will be stored on a blockchain. To enter information, a user must be validated via public-key encryption
* a user must be able to consult the blockchain to recover information about all the product prices they have entered, the price information regarding a particular product over time, the price of similar items, etc. The blockchain guarantees that information can't be modified once it's entered
* determine the price of a given recipe based on the prices of given ingredients
* searching for items by price can be limited to a given store, or to all stores within a given region. Store locations can be geolocalized and displayed on a map
* Social aspects
* users can post their own recipes into a recipe-space, comment on recipes posted by others etc. These will also be blockchained to ensure legitimacy.
