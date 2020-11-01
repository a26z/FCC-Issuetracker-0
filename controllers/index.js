const ObjectId = require('mongodb').ObjectID;

// const isCollection = async (req, db, collection) => {
//
//     db = req.app.locals.db;
//     collection = db.collection(req.params['project']);
//
//     const dbs = await db.listCollections({}, {
//         nameOnly: true
//     }).toArray();
//
//     if (await !dbs.find(obj => obj.name === req.params['project'])) {
//         await db.createCollection(req.params['project'], {
//             validator: {
//                 $jsonSchema: {
//                     bsonType: "object",
//                     required: ["issue_title", "issue_text", "created_by"],
//                     properties: {
//                         issue_title: {
//                             bsonType: "string",
//                             pattern: "[a-zA-Z]+",
//                             description: "Title of the issue"
//                         },
//                         issue_text: {
//                             bsonType: "string",
//                             pattern: "[a-zA-Z]+",
//                             description: "Description of the issue"
//                         },
//                         created_by: {
//                             bsonType: "string",
//                             pattern: "[a-zA-Z]+",
//                             description: "Creator of the issue"
//                         },
//                         assigned_to: {
//                             bsonType: "string",
//                             description: "Issue assignment"
//                         },
//                         status_text: {
//                             bsonType: "string",
//                             description: "Status of the issue"
//                         },
//                         created_on: {
//                             bsonType: "string",
//                             description: "Date of creation (ISOString)"
//                         },
//                         updated_on: {
//                             bsonType: "string",
//                             description: "Date of update (ISOString)"
//                         },
//                         open: {
//                             bsonType: "bool",
//                             description: "Issue status"
//                         }
//
//                     }
//                 }
//             }
//         })
//     } else {
//         console.log("Using existing collection", req.params['project']);
//     }
// }

exports.getProject = async (req, res) => {
    try {
        const db = req.app.locals.db;
        let collection = db.collection(req.params['project']);

        // isCollection(db, collection);

        // const db = req.app.locals.db;
        // let collection = db.collection(req.params['project']);


        // const dbs = await db.listCollections({}, {
        //     nameOnly: true
        // }).toArray();
        //
        // if (await !dbs.find(obj => obj.name === req.params['project'])) {
        //     await db.createCollection(req.params['project'], {
        //         validator: {
        //             $jsonSchema: {
        //                 bsonType: "object",
        //                 required: ["issue_title", "issue_text", "created_by"],
        //                 properties: {
        //                     issue_title: {
        //                         bsonType: "string",
        //                         pattern: "[a-zA-Z]+",
        //                         description: "Title of the issue"
        //                     },
        //                     issue_text: {
        //                         bsonType: "string",
        //                         pattern: "[a-zA-Z]+",
        //                         description: "Description of the issue"
        //                     },
        //                     created_by: {
        //                         bsonType: "string",
        //                         pattern: "[a-zA-Z]+",
        //                         description: "Creator of the issue"
        //                     },
        //                     assigned_to: {
        //                         bsonType: "string",
        //                         description: "Issue assignment"
        //                     },
        //                     status_text: {
        //                         bsonType: "string",
        //                         description: "Status of the issue"
        //                     },
        //                     created_on: {
        //                         bsonType: "string",
        //                         description: "Date of creation (ISOString)"
        //                     },
        //                     updated_on: {
        //                         bsonType: "string",
        //                         description: "Date of update (ISOString)"
        //                     },
        //                     open: {
        //                         bsonType: "bool",
        //                         description: "Issue status"
        //                     }
        //
        //                 }
        //             }
        //         }
        //     })
        // } else {
        //     console.log("Using existing collection", req.params['project']);
        // }
        let params = req.query;
        await collection.find(params, {}).toArray(function(err, result) { // das ding ist ein Cursor
            if (err) throw err;
            res.status(200).json(result);
        });
    } catch (err) {
        console.log("Something went wrong (1)----->", err);
    }
};

exports.postIssue = async (req, res) => {

    const db = req.app.locals.db;
    let collection = await db.collection(req.params['project']);
    // isCollection(db, collection);

    let created_on = new Date().toISOString();
    let updated_on = new Date().toISOString();
    let open = true;
    try {
        let result = await collection.insertOne({
            ...req.body,
            created_on,
            updated_on,
            open
        })
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send(err);
        console.log("Something went wrong (2)----->", err);
    }
};

exports.updateIssue = async (req, res) => {
    const db = req.app.locals.db;
    let collection = await db.collection(req.params['project']);
    // await isCollection(db, collection);

    let query = {};
    for (let [key, value] of Object.entries(req.body)) {
        if (value && key != "_id") {
            if (value === 'false') {
                value = false;
            }
            query[key] = value;
        };
    }
    if (Object.keys(query).length) {
        query.updated_on = new Date().toISOString();
        try {
            await collection.updateOne({
                "_id": ObjectId(req.body._id)
            }, {
                $set: query
            });
        } catch (err) {
            console.log("could not update " + req.body._id, err);
            res.json("could not update " + req.body._id)
        }
        console.log("successfully updated " + req.body._id);
        res.json("successfully updated ")

    } else {
        console.log("no updated field sent");
        res.json("no updated field sent");
    }
};

exports.deleteIssue = async (req, res) => {
    const db = req.app.locals.db;
    let collection = await db.collection(req.params['project']);
    try {
        if (!req.body._id) {
            res.status(418).send('id error');
        } else {
            await collection.deleteOne({
                "_id": ObjectId(req.body._id)
            })
            res.json("deleted " + req.body._id)
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('could not delete ' + req.body._id)
    }
};
