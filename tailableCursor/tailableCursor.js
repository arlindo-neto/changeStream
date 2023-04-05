const { MongoClient, Logger, BSON, Timestamp } = require("mongodb");

const client = new MongoClient(
    "mongodb://localhost:27018",
    {
        monitorCommands: true
    }
)

//client.on('commandStarted', (event) => console.debug(event));
//client.on('commandSucceeded', (event) => console.debug(event));
//client.on('commandFailed', (event) => console.debug(event));

client.connect()


const database = client.db('local');

const oplogRs = database.collection('oplog.rs');

// on() method is a handler for receiving change events and using a callback function
//


(async () => {

    const now = Timestamp(0, (Date.now() / 1000 | 0))

    const options = {
        tailable: true,
        awaitdata: true,
        oplogReplay: true,
        noCursorTimeout: true,
        tailableRetryInterval: 1000,
    }

//When querying the
//    # oplog, the oplog_replay option enables an optimization to quickly
//    # find the 'ts' value we're looking for. The oplog_replay option
//    # can only be used when querying the oplog. Starting in MongoDB 4.4
//    # this option is ignored by the server as queries against the oplog
//    # are optimized automatically by the MongoDB query engine.

    const tCursor = oplogRs.find(
            { fromMigrate : {$exists: false },
              'ts': {'$gt': now }
            }, options )
        .stream();
    tCursor.on('data', (doc)=>{
        console.log(doc)
    })
})()

