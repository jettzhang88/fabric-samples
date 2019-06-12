/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const CommercialPaper = require('./paper.js');

class PaperList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.commercialpaperlist');
        this.use(CommercialPaper);
    }

    async addPaper(paper) {
        return this.addState(paper);
    }

    async getPaper(paperKey) {
        return this.getState(paperKey);
    }

    async updatePaper(paper) {
        return this.updateState(paper);
    }

    async get(){
        const response = {};
        this.ctx.stub.getTransient().forEach((v, k) => {response[k] = v.toString()});
        return JSON.stringify(response);
    }
}


module.exports = PaperList;
