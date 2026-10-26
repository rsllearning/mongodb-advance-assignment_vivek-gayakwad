
# Task 5: Indexing and Query Performance

## 5.1 Compound Index
Index name: departmentId_1_name_1
Index keys: departmentId (ascending), name (ascending)
Verified using: getIndexes()

## 5.2 Query Execution Statistics
Query: find({ departmentId: 10 }).sort({ name: 1 })

- Winning plan stage: [COLLSCAN or IXSCAN]
- nReturned: [actual value]
- totalDocsExamined: [actual value]
- totalKeysExamined: [actual value]

## 5.3 TTL Index
Collection: sessions
Index name: expiresAt_1
Index field: expiresAt (ascending)
expireAfterSeconds: 0




## Task 7: MongoDB Advanced Concepts — MCQs

| Question | Answer | Correct Option |
|---|---|---|
| Q1 | B | Rejects documents that do not follow required fields or data types |
| Q2 | B | Multiple conditions match the same array object |
| Q3 | C | Updates selected array elements matching a condition |
| Q4 | A | Several write operations can be sent together |
| Q5 | C | `$lookup` |
| Q6 | B | MongoDB used an index |
| Q7 | C | Uncommitted transaction changes are rolled back |
| Q8 | B | A majority of voting data-bearing replica-set members acknowledge the write |
| Q9 | C | Eligible members hold an election for a new Primary |
| Q10 | B | A high-cardinality field that distributes traffic and matches common queries |
| Q11 | A | Listen for inserts, updates, replacements, and deletes |
| Q12 | C | Use TLS, restricted network access, and least-privilege credentials |
