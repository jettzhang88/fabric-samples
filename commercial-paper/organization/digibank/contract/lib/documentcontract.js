/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const CommercialDocument = require('./document.js');
const DocumentList = require('./documentlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class DocumentContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.documentList = new DocumentList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class DocumentContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('com.tradeshift.document');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new DocumentContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Issue commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} issueDateTime paper issue date
     * @param {String} maturityDateTime paper maturity date
     * @param {Integer} faceValue face value of paper
    */
    async issue(ctx, issuer, issueDateTime, documentNumber ,documentContext) {

        // create an instance of the paper
        let document = CommercialDocument.createInstance(issuer, issueDateTime, documentNumber ,documentContext);

        // Smart contract, rather than paper, moves paper into ISSUED state
        //document.setIssued();

        // Newly issued paper is owned by the issuer
        document.setOwner(issuer);
        document.setIssued();


        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.documentList.addDocument(document);

        // Must return a serialized paper to caller of smart contract
        return document.toBuffer();
    }

    /**
     * Buy commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {Integer} price price paid for this paper
     * @param {String} purchaseDateTime time paper was purchased (i.e. traded)
    */
    async send(ctx, issuer, issueDateTime, documentNumber ) {

        // Retrieve the current paper using key fields provided
        let documentKey = CommercialDocument.makeKey([issuer, documentNumber]);
        let document = await ctx.documentList.getDocument(documentKey);

        // Validate current owner
        if (document.getOwner() !== currentOwner) {
            throw new Error('Doc ' + issuer + documentNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from ISSUED to TRADING
        if (document.isIssued()) {
            document.setSent();
        }

        // Update the paper
        await ctx.documentList.updateDocument(document);
        return document.toBuffer();
    }
}

module.exports = DocumentContract;
