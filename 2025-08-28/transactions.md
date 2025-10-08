---
id: transactions
title: "API Fact: Using Transactions in ObjectBox"
sidebar_label: "Transactions"
description: "Learn how to use transactions in ObjectBox with store.runInTx for atomic, consistent, and high-performance database operations."
keywords:
- ObjectBox transactions
- atomic operations
- database transaction
- ACID
- runInTx
- bulk update performance
---

# How do I use transactions in ObjectBox?

**Answer:** Use `store.runInTx { ... }` to execute multiple operations atomically.

-   All operations inside the `runInTx` block will either **all succeed (commit)** or **all fail (rollback)**.
-   This is the recommended way to ensure data consistency when modifying multiple objects at once.
-   It is also significantly faster for bulk operations than running them individually.
-   Note: Single operations like `box.put(object)` or `box.remove(id)` are already transactional by themselves.

---

## Purpose

The primary purpose of transactions is to guarantee the **ACID** properties of a database, especially **Atomicity** and **Consistency**.

1.  **Atomicity**: Ensures that a group of operations is treated as a single, indivisible unit. For example, when transferring funds, you must both debit one account and credit another. A transaction ensures that both actions complete successfully; if either fails, both are undone.
2.  **Performance**: Grouping many write operations (e.g., 1,000 `put` calls) into a single transaction drastically reduces overhead. The database only needs to lock the data once and commit to the disk once, resulting in a massive performance increase.

---

## Conceptual Code Snippets

This example demonstrates a safe bank transfer where two account balances are updated. If any part fails, the entire transaction is rolled back.

### Java

```java
// Assumes accountBox is a Box<Account>
store.runInTx(() -> {
    Account from = accountBox.get(fromId);
    Account to = accountBox.get(toId);

    if (from != null && to != null && from.getBalance() >= amount) {
        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);

        // Both objects are put within the same transaction
        accountBox.put(from, to);
    } else {
        // Optional: throw an exception to explicitly fail and roll back
        throw new IllegalStateException("Insufficient funds or account not found.");
    }
});