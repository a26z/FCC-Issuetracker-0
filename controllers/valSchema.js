exports.valSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["issue_title", "issue_text", "created_by"],
            properties: {
                issue_title: {
                    bsonType: "string",
                    pattern: "[a-zA-Z]+",
                    description: "Title of the issue"
                },
                issue_text: {
                    bsonType: "string",
                    pattern: "[a-zA-Z]+",
                    description: "Description of the issue"
                },
                created_by: {
                    bsonType: "string",
                    pattern: "[a-zA-Z]+",
                    description: "Creator of the issue"
                },
                assigned_to: {
                    bsonType: "string",
                    description: "Issue assignment"
                },
                status_text: {
                    bsonType: "string",
                    description: "Status of the issue"
                },
                created_on: {
                    bsonType: "string",
                    description: "Date of creation (ISOString)"
                },
                updated_on: {
                    bsonType: "string",
                    description: "Date of update (ISOString)"
                },
                open: {
                    bsonType: "bool",
                    description: "Issue status"
                }

            }
        }
    }
}
