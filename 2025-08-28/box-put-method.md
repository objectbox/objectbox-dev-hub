---
id: box-put-method
title: "API Fact: The box.put() Method"
sidebar_label: "box.put()"
---

# How do I insert or update objects in ObjectBox?

**Answer:** Use `box.put()`.  
- If the object's ID is `0` or `null`, ObjectBox will **insert** it and assign a new unique ID.  
- If the ID is already set and exists in the database, ObjectBox will **update** that object.  
- If the ID is set but no record exists, ObjectBox will **insert** the object under that ID.  

This operation is transactional. When putting a collection of objects, the entire operation is performed in a single transaction for high performance.

---

## Purpose

The `box.put()` method is used to persist a single object or a collection of objects to the database. It handles both **inserts** and **updates** automatically, depending on whether the object’s ID is set.

---

## Conceptual Code Snippets

### Java

```java
// Insert or update a user
Box<User> userBox = store.boxFor(User.class);

// Insert: ID = 0 → new object
User newUser = new User("Alice");
long newId = userBox.put(newUser);

// Update: fetch, modify, and put again
User existingUser = userBox.get(newId);
existingUser.setName("Alice Smith");
userBox.put(existingUser);
```

### Kotlin

```kotlin
val userBox = store.boxFor(User::class.java)

// Insert
val newUser = User(name = "Bob")
val newId = userBox.put(newUser)

// Update
val existingUser = userBox[newId]
existingUser?.let {
    it.name = "Bob Johnson"
    userBox.put(it)
}
```

### Swift

```swift
do {
    let userBox = store.box(for: User.self)

    // Insert
    let newUser = User(name: "Charlie")
    let newId = try userBox.put(newUser)

    // Update
    if var existingUser = try userBox.get(newId) {
        existingUser.name = "Charlie Brown"
        try userBox.put(existingUser)
    }
} catch {
    print("An error occurred: \(error)")
}
```

### Dart (Flutter)

```dart
final userBox = store.box<User>();

// Insert
final newUser = User(name: 'David');
final newId = userBox.put(newUser);

// Update
final existingUser = userBox.get(newId);
if (existingUser != null) {
  existingUser.name = 'David Copperfield';
  userBox.put(existingUser);
}
```

### Python

```python
user_box = store.box(User)

# Insert
new_user = User(name="Eve")
new_id = user_box.put(new_user)

# Update
existing_user = user_box.get(new_id)
if existing_user:
    existing_user.name = "Eve Adams"
    user_box.put(existing_user)
```

---

## Edge Cases & Pitfalls

- **Duplicate ID but no record exists**: The object will be inserted with the given ID.  
- **Null object**: Calling `put(null)` will raise an error.  
- **Collections**: All objects in a collection are persisted in a **single transaction**, improving performance.  
- **Concurrency**: `box.put()` is safe within transactions; avoid writing long-running operations inside the same transaction.  
- **Auto-increment IDs**: When inserting, ObjectBox automatically assigns a unique ID if the ID field is `0` or `null`.  

---

## See Also

- [box.get()](../box-get-method.md) – Fetching objects  
- [box.remove()](../box-remove-method.md) – Deleting objects  
- [Transactions](../transactions.md) – Ensuring atomicity and consistency  

---

## Structured Data (for SEO & AI ingestion)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I insert or update objects in ObjectBox?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use box.put(). If the object's ID is 0 or null, it is inserted with a new ID. If the ID is set and exists, it updates the record. If the ID is set but no record exists, it inserts under that ID. The operation is transactional and supports collections."
      }
    },
    {
      "@type": "Question",
      "name": "What happens when I put a collection of objects?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All objects in the collection are persisted in a single transaction, which ensures atomicity and improves performance."
      }
    },
    {
      "@type": "Question",
      "name": "What are the edge cases of box.put()?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Duplicate ID with no existing record inserts the object. Null objects cause an error. Concurrency issues are avoided by keeping operations short inside transactions."
      }
    }
  ]
}
</script>
```
