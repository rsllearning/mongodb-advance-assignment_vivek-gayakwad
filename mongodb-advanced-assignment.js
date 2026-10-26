
/*
 * MongoDB Advanced Assignment
 * Database: company_advanced
 * Tool: mongosh
 */

// ==========================================
// Task 1: Schema Validation and Data Creation
// ==========================================

// Step 1: Select a fresh database
db = db.getSiblingDB("company_advanced");

// Start fresh for this assignment
db.dropDatabase();


 // Step 3: Insert the starting employee dataset
db.employees.insertMany([
    {
        _id: 1,
        name: "John",
        departmentId: 10,
        skills: ["Java", "MongoDB"],
        experience: 4,
        active: true,
        certifications: [
            {
                name: "MongoDB",
                status: "Expired",
                expiryYear: 2026
            }
        ]
    },
    {
        _id: 2,
        name: "Alice",
        departmentId: 10,
        skills: ["Python", "MongoDB"],
        experience: 6,
        active: true,
        certifications: [
            {
                name: "MongoDB",
                status: "Active",
                expiryYear: 2028
            }
        ]
    },
    {
        _id: 3,
        name: "David",
        departmentId: 20,
        skills: ["Communication"],
        experience: 3,
        active: false,
        certifications: [
            {
                name: "Communication",
                status: "Active",
                expiryYear: 2027
            }
        ]
    }
]);


 // Step 4: Test schema validation

print("\n--- Step 4: Testing Schema Validation ---");

try {
    db.employees.insertOne({
        _id: 99,
        name: 123,
        departmentId: "HR",
        experience: "one",
        active: "yes"
    });

    print("ERROR: Invalid document was unexpectedly accepted.");
} catch (error) {
    print("Invalid document rejected by schema validation.");
    print(error.message);
}

// Verify the final document count
const validCount = db.employees.countDocuments();

print("Valid employee documents: " + validCount);
print("Expected valid documents: 3");

if (validCount === 3) {
    print("PASS: Exactly 3 valid employee documents exist.");
} else {
    print("FAIL: Expected 3 employee documents.");
}


// Task 2: Advanced Array Queries and Updates


// 2.1 Find employees with MongoDB certification having Active status
print("\n--- Task 2.1: Find Matching Array Object ---");

printjson(
    db.employees.find({
        certifications: {
            $elemMatch: {
                name: "MongoDB",
                status: "Active"
            }
        }
    }).toArray()
);

// 2.2 Change John's MongoDB certification status to Active
print("\n--- Task 2.2: Update One Matching Array Element ---");

db.employees.updateOne(
    {
        name: "John",
        "certifications.name": "MongoDB",
        "certifications.status": "Expired"
    },
    {
        $set: {
            "certifications.$.status": "Active"
        }
    }
);

print("John's MongoDB certification status updated to Active.");

// 2.3 Update selected array elements using arrayFilters
print("\n--- Task 2.3: Update Selected Array Elements ---");

db.employees.updateMany(
    {},
    {
        $set: {
            "certifications.$[cert].status": "Renewal Due"
        }
    },
    {
        arrayFilters: [
            { "cert.expiryYear": { $lt: 2027 } }
        ]
    }
);

print("Certifications expiring before 2027 updated.");

// Verify final certification values
print("\n--- Final Certification Values ---");

printjson(
    db.employees.find(
        { name: { $in: ["John", "Alice"] } },
        { _id: 0, name: 1, certifications: 1 }
    ).toArray()
);


// Task 3: Bulk Write Operations

print("\n--- Task 3: Bulk Write Operations ---");

const bulkResult = db.employees.bulkWrite([
    // 1. Increase John's experience by 1
    {
        updateOne: {
            filter: { name: "John" },
            update: { $inc: { experience: 1 } }
        }
    },

    // 2. Set Alice's active value to false
    {
        updateOne: {
            filter: { name: "Alice" },
            update: { $set: { active: false } }
        }
    },

    // 3. Insert Emma
    {
        insertOne: {
            document: {
                _id: 4,
                name: "Emma",
                departmentId: 20,
                skills: ["Excel"],
                experience: 2,
                active: true,
                certifications: [
                    {
                        name: "Excel",
                        status: "Active",
                        expiryYear: 2026
                    }
                ]
            }
        }
    }
]);

print("Bulk write operations completed.");
printjson(bulkResult);

// Verify final state
const john = db.employees.findOne(
    { name: "John" },
    { _id: 0, experience: 1 }
);

const alice = db.employees.findOne(
    { name: "Alice" },
    { _id: 0, active: 1 }
);

const employeeCount = db.employees.countDocuments();

print("\n--- Verification ---");
print("John's experience: " + john.experience);
print("Alice's active status: " + alice.active);
print("Employee document count: " + employeeCount);

if (
    john.experience === 5 &&
    alice.active === false &&
    employeeCount === 4
) {
    print("PASS: All Task 3 requirements are satisfied.");
} else {
    print("FAIL: Please check the employee data.");
}



// Task 4: Advanced Aggregation

// Step 1: Create Departments Collection
print("\n--- Task 4: Create Departments ---");

db.departments.insertMany([
    { _id: 10, name: "Engineering" },
    { _id: 20, name: "HR" }
]);

// 4.1 Join Employees with Departments using $lookup and $unwind
print("\n--- Task 4.1: Employees with Departments ---");

printjson(
    db.employees.aggregate([
        {
            $lookup: {
                from: "departments",
                localField: "departmentId",
                foreignField: "_id",
                as: "department"
            }
        },
        {
            $unwind: "$department"
        },
        {
            $project: {
                _id: 0,
                name: 1,
                departmentName: "$department.name"
            }
        },
        {
            $sort: { name: 1 }
        }
    ]).toArray()
);

// 4.2 Count Employees for Each Skill
print("\n--- Task 4.2: Employee Count by Skill ---");

printjson(
    db.employees.aggregate([
        { $unwind: "$skills" },
        {
            $group: {
                _id: "$skills",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: -1,
                _id: 1
            }
        },
        {
            $project: {
                _id: 0,
                skill: "$_id",
                count: 1
            }
        }
    ]).toArray()
);

// 4.3 Return Active Employees and a Count using $facet
print("\n--- Task 4.3: Active Employees and Count ---");

printjson(
    db.employees.aggregate([
        { $match: { active: true } },
        {
            $facet: {
                activeEmployees: [
                    { $sort: { name: 1 } },
                    {
                        $project: {
                            _id: 0,
                            name: 1
                        }
                    }
                ],
                totalActiveCount: [
                    { $count: "count" }
                ]
            }
        },
        {
            $project: {
                activeEmployees: 1,
                totalActiveCount: {
                    $ifNull: [
                        { $arrayElemAt: ["$totalActiveCount.count", 0] },
                        0
                    ]
                }
            }
        }
    ]).toArray()
);




// Task 5: Indexing and Query Performance

// 5.1 Create and verify compound index
print("\n--- Task 5.1: Compound Index ---");

db.employees.createIndex(
    { departmentId: 1, name: 1 },
    { name: "departmentId_1_name_1" }
);

print("Employee indexes:");
printjson(db.employees.getIndexes());

// 5.2 Explain query execution statistics
print("\n--- Task 5.2: Query Execution Statistics ---");

const explainResult = db.employees
    .find({ departmentId: 10 })
    .sort({ name: 1 })
    .explain("executionStats");

printjson(explainResult);

print("\n--- Values for answers.md ---");
print("winning plan stage: Check winningPlan in the output");
print("nReturned: " + explainResult.executionStats.nReturned);
print("totalDocsExamined: " +
    explainResult.executionStats.totalDocsExamined);
print("totalKeysExamined: " +
    explainResult.executionStats.totalKeysExamined);

// 5.3 Create sessions collection and TTL index
print("\n--- Task 5.3: TTL Index ---");

db.createCollection("sessions");

db.sessions.insertOne({
    _id: 1,
    userName: "John",
    expiresAt: new Date(Date.now() + 600000)
});

db.sessions.createIndex(
    { expiresAt: 1 },
    {
        name: "expiresAt_1",
        expireAfterSeconds: 0
    }
);

print("Session indexes:");
printjson(db.sessions.getIndexes());

print("Task 5 completed.");
