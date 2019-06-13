/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const CommercialPaper = require('../contract/lib/paper.js');

const ubl_test = {
    "issuer" : "jett-test",
    "paperNumber" : "002",
    "DocumentId" : "fa36db76-3a06-4913-af47-c622fdb0cc1c",
    "ID" : "1",
    "URI" : "https://api-dev.cn-northwest-1.test.bwtsi.cn/tradeshift/rest/external/documents/fa36db76-3a06-4913-af47-c622fdb0cc1c",
    "DocumentType" : {
        "type" : "invoice"
    },
    "CreatedDateTime" : "2019-06-13T06:04:07.437Z",
    "LastEdit" : "2019-06-13T06:04:07.437Z",
    "SenderCompanyName" : "新奥集团",

    "ConversationId" : "b83cf0e0-1caf-4e68-aacb-8f72a0678235",
    "ReceiverCompanyName" : "苏州卡说信息技术有限公司",

    "ItemInfos" : [ {
        "type" : "document.currency",
        "value" : "CNY"
    }, {
        "type" : "document.total",
        "value" : "11.70"
    }, {
        "type" : "document.issuedate",
        "value" : "2019-06-13"
    } ],
    "ProcessState" : "PENDING",
    "ConversationStates" : [ {
        "Axis" : "PROCESS",
        "State" : "PENDING"
    }, {
        "Axis" : "DELIVERY",
        "State" : "SENT"
    } ],
    "UnifiedState" : "DELIVERED",
    "CopyIndicator" : false,
    "ConnectionId" : "fd155f86-459b-59c2-8483-2ecb9157a8a8",
    "OtherPartCompanyAccountId" : "d4a22460-2470-49e9-9a57-dde334f560b1",
    "Deleted" : false,
    "TenantId" : "5ecdf59d-7cc1-4dcc-8738-005f477a5225"
};

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');

// Main program function
async function main() {

  // A gateway defines the peers used to access Fabric networks
  const gateway = new Gateway();

  // Main try/catch block
  try {

    // Specify userName for network access
    // const userName = 'isabella.issuer@magnetocorp.com';
    const userName = 'User1@org1.example.com';

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled:false, asLocalhost: true }
    };

    // Connect to gateway using application specified parameters
    console.log('Connect to Fabric gateway.');

    await gateway.connect(connectionProfile, connectionOptions);

    // Access PaperNet network
    console.log('Use network channel: mychannel.');

    const network = await gateway.getNetwork('mychannel');

    // Get addressability to commercial paper contract
    console.log('Use org.papernet.commercialpaper smart contract.');

    const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

    // issue commercial paper
    console.log('Submit commercial paper issue transaction.');

    const issueResponse = await contract.submitTransaction('issue', JSON.stringify(ubl_test));

    // process response
    console.log('Process issue transaction response.');

    let paper = CommercialPaper.fromBuffer(issueResponse);

    console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully issued for value ${paper.faceValue}`);
    console.log('Transaction complete.');

  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);

  } finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.')
    gateway.disconnect();

  }
}
main().then(() => {

  console.log('Issue program complete.');

}).catch((e) => {

  console.log('Issue program exception.');
  console.log(e);
  console.log(e.stack);
  process.exit(-1);

});
