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

    // private methods
    _getProductCombination(attributes) {
        if(attributes.length == 1) {
            const lastAttributeValues = attributes[0].productAttributeValues;
            const lastAttributeName = attributes[0].productAttributeName;
    
            return lastAttributeValues.map((productAttributeValue) => {
                let productAttributeValueObject = {};
                productAttributeValueObject[lastAttributeName] = productAttributeValue.name;
                productAttributeValueObject["active"] = !productAttributeValue.active;
                
                return productAttributeValueObject;
            })
        }
        else {
            let productCombinations = [];
    
            const otherAttrbiuteCombination = getProductCombination(attributes.slice(1));
            const firstAttrbuteValues = attributes[0].productAttributeValues;
            const firstAttributeName = attributes[0].productAttributeName;
            
            for(let idx=0; idx<firstAttrbuteValues.length; idx++) {
                for(let idy=0; idy<otherAttrbiuteCombination.length; idy++) {
                    const productCombinationObject = JSON.parse(JSON.stringify(otherAttrbiuteCombination[idy]));
    
                    productCombinationObject[firstAttributeName] = firstAttrbuteValues[idx].name;
                    productCombinationObject["active"] = ! (productCombinationObject["active"] || firstAttrbuteValues[idx].active);
    
                    productCombinations.push(productCombinationObject);
                }
            }
    
            return productCombinations;
        }
    }

    // getters
    get productName() {
        return this.#name;
    }

    get productAttributes() {
        return this.#attributes.map((attribute) => { return attribute.productAttributeName });
    }

    get productSKUs() {
        return getProductCombination(this.#attributes);
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

function createTable(productDetailsTable, product) {
    const productAttributes = product.productAttributes;
    
    // 1. table headers
    // table headers - product name 
    let thead = productDetailsTable.createTHead();
    let headRow = thead.insertRow();

    let nameHead = document.createElement("th");
    let nameText = document.createTextNode(product.productName);

    nameHead.appendChild(nameText);
    headRow.appendChild(nameHead);

    // table headers - product attrbutes
    let attributeHeadRow = thead.insertRow();
    productAttributes.forEach((productAttribute) => {
        let th = document.createElement("th");
        let text = document.createElement(productAttribute);

        th.appendChild(text);
        attributeHeadRow.appendChild(th);
    })

    // 2. table body
    // table body - attrbite details
    let tbody = productDetailsTable.createTBody();
    productCombination.forEach((productCombination) => {
        let row = tbody.insertRow();

        productAttributes.forEach((attribute) => {
            let td = document.createElement("td");
            let text = document.createElement(productCombination[attribute]);

            td.appendChild(text);
            row.appendChild(td);
        })
    })
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