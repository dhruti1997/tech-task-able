const chai = window.chai
const expect = chai.expect

describe("validateProductDetails", () => {
    it("should give an error for empty string", () => {
        expect(validateProductDetails("")).to.deep.equal({"isValid": false, "message": "Empty String"});
    })
    it("should give an error for invalid json format", () => {
        expect(validateProductDetails("{abc:1")).to.deep.equal({"isValid": false, "message": "Invalid JSON"});
    })
    it("should give an error for invalid input json format - no product name", () => {
        const invalidInputJSON = {
            "abc": 1,
            "attributes": []
        }
        expect(validateProductDetails(JSON.stringify(invalidInputJSON))).to.deep.equal({"isValid": false, "message": "Product Name not Found"});
    })
    it("should give an error for invalid input json format - no product attributes", () => {
        const invalidInputJSON = {
            "name": 1
        }
        expect(validateProductDetails(JSON.stringify(invalidInputJSON))).to.deep.equal({"isValid": false, "message": "Product Attributes not Found"});
    })
    it("should give an error for invalid input json format - no product attributes - empty array", () => {
        const invalidInputJSON = {
            "name": "T-shirt",
            "attributes": []
        }
        expect(validateProductDetails(JSON.stringify(invalidInputJSON))).to.deep.equal({"isValid": false, "message": "Product Attributes not Found"});
    })
    it("should give an error for invalid input json format - no product attributes name found", () => {
        const invalidInputJSON = {
            "name": "T-shirt",
            "attributes": [{
                "abc": 1,
                "values": []
            }]
        }
        expect(validateProductDetails(JSON.stringify(invalidInputJSON))).to.deep.equal({"isValid": false, "message": "Product Attribute Name not Found"});
    })
    it("should give an error for invalid input json format - no product attributes values found", () => {
        const invalidInputJSON = {
            "name": "T-shirt",
            "attributes": [{
                "name": "color",
            }]
        }
        expect(validateProductDetails(JSON.stringify(invalidInputJSON))).to.deep.equal({"isValid": false, "message": "Product Attribute Values not Found"});
    })
    it("should give an error for invalid input json format - no product attributes values found - empty array", () => {
        const invalidInputJSON = {
            "name": "T-shirt",
            "attributes": [{
                "name": "color",
            }]
        }
        expect(validateProductDetails(JSON.stringify(invalidInputJSON))).to.deep.equal({"isValid": false, "message": "Product Attribute Values not Found"});
    })
    it("should give an error for invalid input json format - invalid product attribute value - no attribute value name", () => {
        const invalidInputJSON = {
            "name": "T-shirt",
            "attributes": [{
                "name": "color",
                "values": [{
                    "abc": 1,
                    "active": true
                }]
            }]
        }
        expect(validateProductDetails(JSON.stringify(invalidInputJSON))).to.deep.equal({"isValid": false, "message": "Invalid Product Attribute Value"});
    })
    it("should give an error for invalid input json format - invalid product attribute value - active/inactive details missing", () => {
        const invalidInputJSON = {
            "name": "T-shirt",
            "attributes": [{
                "name": "color",
                "values": [{
                    "name": "red"
                }]
            }]
        }
        expect(validateProductDetails(JSON.stringify(invalidInputJSON))).to.deep.equal({"isValid": false, "message": "Invalid Product Attribute Value"});
    })
    it("should give excepts proper json input format", () => {
        const validInputJSON = {
            "name": "T-shirt",
            "attributes": [{
                "name": "color",
                "values": [{
                    "name": "red",
                    "active": true
                }]
            }]
        }
        expect(validateProductDetails(JSON.stringify(validInputJSON))).to.deep.equal({"isValid": true, "message": ""});
    })
})

describe("class::Product", () => {
    const validInputJSON = {
        "name": "T-shirt",
        "attributes": [{
            "name": "color",
            "values": [{
                "name": "red",
                "active": true
            }]
        }, {
            "name": "size",
            "values": [{
                "name": "S",
                "active": true
            }]
        }]
    }

    function getInstance (validInputJSON) {
        return new Product(validInputJSON);
    }
  
    const product = getInstance(validInputJSON)
    it("should have a getter property 'productName'", function () {
        expect(product.productName).to.be.a("string").and.to.deep.equal("T-shirt");
    })

    it("should have a getter property 'productAttributes'", function () {
        expect(product.productAttributes).to.deep.equal(["color", "size"]);
    })

    it("should have a getter property 'productSKUs'", function () {
        expect(product.productSKUs).to.deep.equal([
            {
                "color": "red",
                "size": "S",
                "active": true
            }
        ]);
    })
  
    it("should return product comibination with different input json - test-1", function () {
        const validInputJSON1 = {
            "name": "T-shirt",
            "attributes": [{
                "name": "color",
                "values": [{
                    "name": "red",
                    "active": true
                }]
            }, {
                "name": "size",
                "values": [{
                    "name": "S",
                    "active": false
                }]
            }]
        }

        const product = getInstance(validInputJSON1)
        expect(product.productSKUs).to.deep.equal([
            {
                "color": "red",
                "size": "S",
                "active": false
            }
        ]);
    })

    it("should return product comibination with different input json - test-2", function () {
        const validInputJSON1 = {
            "name": "T-shirt",
            "attributes": [{
                "name": "color",
                "values": [{
                    "name": "red",
                    "active": true
                }]
            }, {
                "name": "size",
                "values": [{
                    "name": "S",
                    "active": false
                },{
                    "name": "M",
                    "active": true
                }]
            }]
        }

        const product = getInstance(validInputJSON1)
        expect(product.productSKUs).to.deep.equal([
            {
                "color": "red",
                "size": "S",
                "active": false
            },
            {
                "color": "red",
                "size": "M",
                "active": true
            }
        ]);
    })

    it("should return product comibination with different input json - test-3", function () {
        const validInputJSON1 = {
            "name": "T-shirt",
            "attributes": [{
                "name": "color",
                "values": [{
                    "name": "red",
                    "active": true
                },{
                    "name": "green",
                    "active": true
                }]
            }, {
                "name": "size",
                "values": [{
                    "name": "S",
                    "active": false
                },{
                    "name": "M",
                    "active": true
                }]
            }]
        }

        const product = getInstance(validInputJSON1)
        expect(product.productSKUs).to.deep.equal([
            {
                "color": "red",
                "size": "S",
                "active": false
            },
            {
                "color": "red",
                "size": "M",
                "active": true
            },
            {
                "color": "green",
                "size": "S",
                "active": false
            },
            {
                "color": "green",
                "size": "M",
                "active": true
            }
        ]);
    })
})
