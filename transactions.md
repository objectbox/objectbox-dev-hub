---
description: >-
  The ObjectBox database is transactional and fully ACID compliant. ObjectBox
  gives developers Multiversion concurrency control (MVCC) semantics.
---

# Transactions

## What is a database transaction?

A transaction groups several operations into a unit of work. This unit of work (transaction) can either execute completely or not at all, but it cannot be "half-completed". Thus, you always know the status of your data. By definition a transaction must be ACID: A = [atomic](https://en.wikipedia.org/wiki/Atomicity\_\(database\_systems\)) (either entirely completed or without any effect), [consistent](https://en.wikipedia.org/wiki/Consistency\_\(database\_systems\)) (conforming to existing constraints in the database), [isolated](https://en.wikipedia.org/wiki/Isolation\_\(database\_systems\)) (not affecting other transactions) and [durable](https://en.wikipedia.org/wiki/Durability\_\(database\_systems\)) (persisted). This definition is based on Wikipedia, where you can dive deeper on [database transactions](https://en.wikipedia.org/wiki/Database\_transaction), if that is what you are looking for.&#x20;

## **ObjectBox is transactionally safe**

Nearly all interactions with ObjectBox involve transactions, e.g. when you call Box `put()` a write transaction is used. Or for example, a read transaction is used, when you `count()` objects in a box. All of this is transparent to you, while you don't need to take care of it yourself.

In C++, it may be fine to completely ignore transactions altogether in your app without running into any problems. In C, you will need to use explicit transactions in some situations, such as reading objects.

Understanding the transaction basics can help you to make your app more consistent and efficient, especially if you are working on a complex application.

### Explicit transactions

An implicit transaction is a transaction that is started automatically. An explicit one is started by a call to `store.tx()/obx_txn_write(store)`and is active until marked successful or aborted. By default, all Box operations run in implicit transactions unless an explicit transaction is in progress on the same thread. In the latter case, multiple operations share the (explicit) transaction. This means:

{% hint style="info" %}
With explicit transactions, you control the transaction boundary. You can use this to improve efficiency and consistency in your app.
{% endhint %}

Advantages of explicit database transactions:

* you can perform any number of operations and use objects of multiple boxes, while having a consistent view of the data,
* running multiple updates/inserts is faster because it doesn't involve starting an implicit transaction each time,
* being able to "roll-back" a transaction when an error occurs, potentially discarding changes from multiple updates.

Example for a write transaction which just inserts 1 000 000 objects (assumes an opened store & box):

{% tabs %}
{% tab title="C++" %}
```cpp
obx::Transaction tx = store.txWrite();
for (int i = 1000000; i > 0; i--) {
    box.put({});
}
tx.success();
```
{% endtab %}

{% tab title="C" %}
```c
OBX_txn* tx = obx_txn_write(store);
for (int i = 1000000; i > 0; i--) {
    ... flatbuffers serialization here, producing data & size variables ...
    obx_box_put_object(box, data, size, OBXPutMode_PUT);
}
obx_txn_success(txn); 

// don't forget to check results of all the C-API calls
```
{% endtab %}
{% endtabs %}

Understanding transactions is essential to mastering the database performance. If you just remember one sentence on this topic, it should be this one: a write transaction has its price, and it's the same whether it's implicit or explicit.

Committing a transaction involves syncing data to physical storage, which is a relatively expensive operation for databases. Only when the file system confirms that all data has been stored in a durable manner (not just memory cached), the transaction can be considered successful. This file sync required by a transaction may take a couple of milliseconds. Keep this in mind and try to group several operations (e.g.`put`calls) in one transaction.

### Read Transactions

In ObjectBox, read transactions are very cheap. Unlike write transactions, there is no commit and thus no expensive sync to the file system. Operations like `get` , `count` , and queries run inside an implicit read transaction if they are not called when already inside an explicit transaction (read or write). Note that it is illegal to `put` (or do any other write operation) when inside a read transaction.

While read transactions are cheaper than write transactions, there is still some overhead to start one. Thus, for a high number of reads (e.g. hundreds, in a loop), you can improve performance by grouping those reads in a single read transaction (see explicit transactions above).

### Multiversion concurrency

ObjectBox gives developers [Multiversion concurrency control (MVCC)](https://en.wikipedia.org/wiki/Multiversion\_concurrency\_control) semantics. This allows multiple concurrent readers (read transactions) which can execute immediately without blocking or waiting. This is guaranteed by storing multiple versions of (committed) data. Even if a write transaction is in progress, a read transaction can read the last consistent state immediately. Write transactions are executed sequentially to ensure a consistent state. Thus, it is advised to keep write transactions short to avoid blocking other pending write transactions. For example, it is usually a bad idea to do networking or complex calculations while inside a write transaction. Instead, do any expensive operation and prepare objects before entering a write transaction.

Note that you do not have to worry about making write transactions sequential yourself. If multiple threads want to write at the same time, one of the threads will be selected to go first, while the other threads have to wait. It works just like mutex locks.

#### Locking inside a Write Transaction

{% hint style="danger" %}
Avoid locking (e.g. with a mutex) when inside a write transaction when possible.
{% endhint %}

Because write transactions run exclusively, they effectively acquire a write lock internally. As with all locks, you need to pay close attention when multiple locks are involved. Always obtain locks in the same order to avoid deadlocks. If you acquire a lock “X” inside a transaction, you must ensure that your code does not start another write transaction while having the same lock “X”.
