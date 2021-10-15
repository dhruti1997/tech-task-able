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