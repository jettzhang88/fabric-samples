/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commercial paper state values
const cpState = {
    ISSUED: 1,
    TRADING: 2,
    REDEEMED: 3
};

const docState = {
    ISSUED: 'ISSUED',
    SENT: 'SENT',
    ACCEPTED: 'ACCEPTED',
    REJECTED_BY_RECEIVER: 'REJECTED_BY_RECEIVER'
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class CommercialPaper extends State {

    constructor(obj) {
        console.log(obj.issuer);
        super(CommercialPaper.getClass(), [obj.issuer, obj.paperNumber]);
        Object.assign(this, obj);

        console.log(this.getIssuer());
        console.log(this.getOwner());
        console.log(this.currentState);
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

    setStatus(status){
        this.currentState = status;
    }

    setIssued() {
        this.currentState = docState.ISSUED;
    }

    setSend() {
        this.currentState = docState.SENT;
    }

    setAccepted() {
        this.currentState = docState.ACCEPTED;
    }

    setRejected() {
        this.currentState = docState.REJECTED_BY_RECEIVER;
    }

    isIssued() {
        return this.currentState === docState.ISSUED;;
    }

    isSend() {
        return this.currentState === docState.SENT;
    }

    isAccepted() {
        return this.currentState === docState.ACCEPTED;
    }

    isRejected() {
        return this.currentState === docState.REJECTED_BY_RECEIVER;
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */
    // setIssued() {
    //     this.currentState = cpState.ISSUED;
    // }

    setStart() {
        this.currentState = 0;
    }

    setTrading() {
        this.currentState = cpState.TRADING;
    }

    setRedeemed() {
        this.currentState = cpState.REDEEMED;
    }

    isIssued() {
        return this.currentState === cpState.ISSUED;
    }

    isTrading() {
        return this.currentState === cpState.TRADING;
    }

    isRedeemed() {
        return this.currentState === cpState.REDEEMED;
    }

    static fromBuffer(buffer) {
        return CommercialPaper.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, CommercialPaper);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(ubl) {
        return new CommercialPaper(JSON.parse(ubl));
    }

    static getClass() {
        return 'org.papernet.commercialpaper';
    }
}

module.exports = CommercialPaper;
