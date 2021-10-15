// class declarations
class ProductAttribute {
    constructor(productAttribute) {
        this.#name = productAttribute.name;
        this.#values = productAttribute.values;
    }

    // getters
    get productAttributeName() {
        return this.#name;
    }

    get productAttributeValues() {
        return this.#values;
    }

    // private fields
    #name = "";
    #values = [];
}

class Product {
    constructor(product) {
        this.#name = product.name;
    
        product.attributes.forEach((productAttribute) => {
            this.#attributes.push(new ProductAttribute(productAttribute))
        });
    }

    // getters
    get productName() {
        return this.#name;
    }

    get productAttributes() {
        return this.#attributes;
    }

    // private fields
    #name = "";
    #attributes = [];
}

function validateProductDetails(productDetails) {
    const validation = {
        "isValid": true,
        "message": ""
    }

    // empty string check
    if(productDetails === "") {
        validation.isValid = false;
        validation.message = "Empty String";

        return validation;
    }

    // validate the json 
    try {
        JSON.parse(JSON.stringify(productDetails));
    }
    catch(err) {
        validation.isValid = false;
        validation.message = "Invalid JSON";
        return validation;
    }

    // validate the json format
    const productDetailsJSON = JSON.parse(productDetails);
    if(!productDetailsJSON.name) {
        validation.isValid = false;
        validation.message = "Product Name not Found";
        return validation;
    }

    if(!productDetailsJSON.attributes) {
        validation.isValid = false;
        validation.message = "Product Attributes not Found";
        return validation;
    }

    productDetailsJSON.attributes.forEach((attribute) => {
        if(!attribute.name) {
            validation.isValid = false;
            validation.message = "Product Attribute Name not Found";
            return validation;
        }

        if(!attribute.values) {
            validation.isValid = false;
            validation.message = "Product Attribute Values not Found";
            return validation;
        }

        attribute.values.forEach((value) => {
            if(!value.name || (value.active == null || value.active == undefined)) {
                validation.isValid = false;
                validation.message = "Invalid Product Attribute Value";
                return validation;
            }
        })
    })

    return validation;
}

function submitProductDetails() {
    // 1. get the text field value
    const productDetails = document.getElementById("product-details-text").value;

    // 1.1. basic validations
    const productDetailsValidation = validateProductDetails(productDetails);
    if(!productDetailsValidation.isValid) {
        alert(productDetailsValidation.message);
    }

    // 2. class objects
    const product = new Product(JSON.parse(productDetails));

    // 3. create table
    const productDetailsTable = document.getElementById("product-details-table");
    createTable(productDetailsTable, product);

    return true;
}