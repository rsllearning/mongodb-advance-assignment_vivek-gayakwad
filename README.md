
# MongoDB Advanced Assignment

## Overview
This assignment covers MongoDB schema validation, advanced array queries and updates, bulk write operations, aggregation pipelines, indexing, query performance, and backup and restore.

- **Database:** `company_advanced`
- **Tool:** MongoDB Shell (`mongosh`)
- **Language:** JavaScript
- **Environment:** Local MongoDB

## Project Structure

```text
mongodb-advanced-assignment/
├── company_advanced.js
├── answers.md
├── backup_restore.ps1
├── README.md
└── company_advanced.archive
```

## Prerequisites

- MongoDB Server installed and running.
- MongoDB Shell (`mongosh`) installed.
- MongoDB Database Tools (`mongodump` and `mongorestore`) installed and available in PATH.
- PowerShell available.

## Tasks Covered

### Task 1: Schema Validation and Data Creation
- Create a fresh `company_advanced` database.
- Create the `employees` collection with `$jsonSchema` validation.
- Insert the initial employee documents.
- Verify that invalid documents are rejected.

### Task 2: Advanced Array Queries and Updates
- Find matching certification objects using `$elemMatch`.
- Update an array element using the positional `$` operator.
- Update selected array elements using `arrayFilters`.

### Task 3: Bulk Write Operations
- Increase John's experience.
- Set Alice's active status to `false`.
- Insert Emma using `bulkWrite()`.

### Task 4: Advanced Aggregation
- Join employees with departments using `$lookup` and `$unwind`.
- Count employees by skill using `$unwind` and `$group`.
- Return active employee names and their total count using `$facet`.

### Task 5: Indexing and Query Performance
- Create and verify the compound index `departmentId_1_name_1`.
- Run `explain("executionStats")` and record the actual results in `answers.md`.
- Create a TTL index named `expiresAt_1` on the `sessions` collection.

### Task 6: Backup and Restore
- Back up `company_advanced` using `mongodump` with gzip compression.
- Restore the backup into `company_advanced_restore`.
- Verify the restored collection counts without overwriting the original database.

## How to Run

### 1. Execute Tasks 1–5

Open PowerShell in the assignment folder and run:

```powershell
mongosh company_advanced.js
```

**Note:** The script drops and recreates the `company_advanced` database at the beginning. Running it again resets the data and reruns all tasks.

### 2. Record Execution Statistics

Open `answers.md` and record the actual values printed for Task 5.2:

- Winning plan stage (`COLLSCAN` or `IXSCAN`)
- `nReturned`
- `totalDocsExamined`
- `totalKeysExamined`

The winning plan depends on the actual query planner result.

### 3. Run Backup and Restore

After Tasks 1–5 complete successfully, execute:

```powershell
.\backup_restore.ps1
```

The script creates a gzip-compressed archive and restores it into `company_advanced_restore`.

Ensure the original database remains unchanged.

### 4. Verify Restored Collection Counts

Open the MongoDB shell:

```powershell
mongosh
```

Run the following commands:

```javascript
use company_advanced_restore

print("Employees: " + db.employees.countDocuments());
print("Departments: " + db.departments.countDocuments());
print("Sessions: " + db.sessions.countDocuments());
```

Expected counts immediately after a successful restore:

| Collection | Expected Count |
|---|---:|
| employees | 4 |
| departments | 2 |
| sessions | 1 |

The session count may become zero later because TTL cleanup runs in the background.

## Submission Checklist

- [ ] `company_advanced.js` contains Tasks 1–5.
- [ ] `answers.md` contains the actual Task 5.2 execution statistics.
- [ ] `backup_restore.ps1` contains the backup and restore commands.
- [ ] Backup and restore completed successfully.
- [ ] Restored collection counts verified.

**Note:** Include `company_advanced.archive` in the submission only if the trainer requests the actual backup file.
