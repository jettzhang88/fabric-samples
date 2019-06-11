/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

const docState = {
    ISSUED: 'ISSUED',
    SENT: 'SENT',
    RECEIVED: 'RECEIVED'
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Document extends State {

    constructor(obj) {
        super(Document.getClass(), [obj.issuer, obj.documentNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getDocumentContext(){
        return this.documentContext;
    }

    setDocumentContext(newDocumentContext){
        this.documentContext = newDocumentContext;
    }

    setIssued() {
        this.currentState = docState.ISSUED;
    }

    setSent() {
        this.currentState = docState.SENT;
    }

    setSent() {
        this.currentState = docState.RECEIVED;
    }

    static fromBuffer(buffer) {
        return Document.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Document);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(issuer, issueDateTime, documentNumber,documentContext) {
        return new Document({ issuer, issueDateTime, documentNumber ,documentContext});
    }

    static getClass() {
        return 'com.tradeshift.document';
    }
}

module.exports = Document;
