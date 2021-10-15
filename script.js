// class declarations
/**
 * @class     ProductAttribute
 * @classdesc Definition for product attributes
*/
class ProductAttribute {
    // #region Constructor
    constructor(productAttribute) {
        this.#name = productAttribute.name;
        this.#values = productAttribute.values;
    }
    // #endregion

    // #region getters
    get productAttributeName() {
        return this.#name;
    }

    get productAttributeValues() {
        return this.#values;
    }
    // #endregion

    // #region private fields
    #name = "";
    #values = [];
    // #endregion

}

/**
 * @class     Product
 * @classdesc Basic Product Class - manages product name and attributes information
*/
class Product {
    // #region Constructor
    constructor(product) {
        this.#name = product.name;
    
        product.attributes.forEach((productAttribute) => {
            this.#attributes.push(new ProductAttribute(productAttribute))
        });
    }
    // #endregion

    // #region private methods
    /**
	 * @function _getProductCombination
	 * @memberof Product
	 * @returns  Unique product combinations
	 */
    _getProductCombination(attributes) {
        if(attributes.length == 1) {
            const lastAttributeValues = attributes[0].productAttributeValues;
            const lastAttributeName = attributes[0].productAttributeName;
    
            return lastAttributeValues.map((productAttributeValue) => {
                let productAttributeValueObject = {};
                productAttributeValueObject[lastAttributeName] = productAttributeValue.name;
                productAttributeValueObject["active"] = productAttributeValue.active;
                
                return productAttributeValueObject;
            })
        }
        else {
            let productCombinations = [];
    
            const otherAttrbiuteCombination = this._getProductCombination(attributes.slice(1));
            const firstAttrbuteValues = attributes[0].productAttributeValues;
            const firstAttributeName = attributes[0].productAttributeName;
            
            for(let idx=0; idx<firstAttrbuteValues.length; idx++) {
                for(let idy=0; idy<otherAttrbiuteCombination.length; idy++) {
                    const productCombinationObject = JSON.parse(JSON.stringify(otherAttrbiuteCombination[idy]));
    
                    productCombinationObject[firstAttributeName] = firstAttrbuteValues[idx].name;
                    productCombinationObject["active"] = productCombinationObject["active"] && firstAttrbuteValues[idx].active;
    
                    productCombinations.push(productCombinationObject);
                }
            }
    
            return productCombinations;
        }
    }
    // #endregion

    // #region getters
    get productName() {
        return this.#name;
    }

    get productAttributesName() {
        return this.#attributes.map((attribute) => { return attribute.productAttributeName });
    }

    get productAttributes() {
        return this.#attributes;
    }

    get productSKUs() {
        return this._getProductCombination(this.#attributes);
    }
    // #endregion

    // #region private fields
    #name = "";
    #attributes = [];
    // #endregion

}

/**
 * @function validateProductDetails
 * @returns  validation for input string
*/
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
        JSON.parse(productDetails);
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

    if(!productDetailsJSON.attributes || !productDetailsJSON.attributes.length) {
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

        if(!attribute.values || !attribute.values.length) {
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

/**
 * @function createTable
 * @summary  create table based on the given product details
*/
function createTable(productDetailsTable, product) {
    const productAttributes = product.productAttributesName;
    const productCombinations = product.productSKUs;
    
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
        let text = document.createTextNode(productAttribute);

        th.appendChild(text);
        attributeHeadRow.appendChild(th);
    })

    // 2. table body
    // table body - attrbite details
    let tbody = productDetailsTable.createTBody();
    productCombinations.forEach((productCombination) => {
        if(productCombination.active) {
            let row = tbody.insertRow();

            productAttributes.forEach((attribute) => {
                let td = document.createElement("td");
                let text = document.createTextNode(productCombination[attribute]);

                td.appendChild(text);
                row.appendChild(td);
            })
        }
    })

    productDetailsTable.rows[0].cells[0].colSpan = productAttributes.length;
}

/**
 * @function submitProductDetails
 * @summary  on submit function
*/
function submitProductDetails() {
    try {
        // 1. get the text field value
        const productDetails = document.getElementById("product-details-text").value;

        // 1.1. basic validations
        const productDetailsValidation = validateProductDetails(productDetails);
        if(!productDetailsValidation.isValid) {
            alert(productDetailsValidation.message);
            return true;
        }

        // 2. class objects
        const product = new Product(JSON.parse(productDetails));

        // 3. create table
        const productDetailsTable = document.getElementById("product-details-table");
        createTable(productDetailsTable, product);

        return true;
    }
    catch(err) {
        alert(err);
    }
}

/**
 * @function resetProductDetails
 * @summary  on reset function
*/
function resetProductDetails() {
    document.getElementById("product-details-text").value = null;
    $("#product-details-table").children().remove();
}

/**
 * @function resetProductDetails
 * @summary  function to redirect on test page
*/
function redirectToTestPage() {
    location.replace("test.html")
}

// sample JSON input
const sampleJSON = {
    "name": "Tshirt",
    "attributes": [
        {
            "name": "color",
            "values": [
                {
                  "name": "red",
                  "active": true
                },
                {
                  "name": "blue",
                  "active": true
                },
                {
                  "name": "green",
                  "active": true
                }
            ]
        },
        {
            "name": "size",
            "values": [
                {
                  "name": "S",
                  "active": true
                },
                {
                  "name": "M",
                  "active": false
                },
                {
                  "name": "L",
                  "active": true
                }
            ]
        }
    ]
}

// set sample JSON text on load
window.onload = function init() {
    const sampleJSONText = JSON.stringify(sampleJSON, undefined, 4);
    document.getElementById("sample-json").value = sampleJSONText;
}
