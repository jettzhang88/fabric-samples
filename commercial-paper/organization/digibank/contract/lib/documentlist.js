/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const CommercialDocument = require('./document.js');

class DocumentList extends StateList {

    constructor(ctx) {
        super(ctx, 'com.tradeshift.documentlist');
        this.use(CommercialDocument);
    }

    async addDocument(document) {
        return this.addState(document);
    }

    async getDocument(documentKey) {
        return this.getState(documentKey);
    }

    async updateDocument(paper) {
        return this.updateState(paper);
    }
}


module.exports = DocumentList;
