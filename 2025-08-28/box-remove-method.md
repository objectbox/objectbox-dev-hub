---
id: box-remove-method
title: "API Fact: The box.remove() Method"
sidebar_label: "box.remove()"
---

# How do I delete an object in ObjectBox?

**Answer:** Use `box.remove(id)`.  
- If an object with that ID exists, it will be deleted and the method returns `true`.  
- If no object exists with that ID, it returns `false`.  
- For deleting multiple objects efficiently, use `removeMany()` or an equivalent bulk operation.  

---

## Purpose

The `box.remove()` method deletes a single object from the database based on its unique ID.  
It is transactional and ensures that either the object is removed successfully or the operation has no effect.  

---

## Conceptual Code Snippets

### Java

```java
Box<User> userBox = store.boxFor(User.class);
long userIdToDelete = 1; // Assume an object with ID 1 exists

boolean wasRemoved = userBox.remove(userIdToDelete);

if (wasRemoved) {
    System.out.println("Successfully removed user with ID " + userIdToDelete);
} else {
    System.out.println("Could not find user with ID " + userIdToDelete + " to remove.");
}
```

### Kotlin

```kotlin
val userBox = store.boxFor(User::class.java)
val userIdToDelete = 1L

val wasRemoved = userBox.remove(userIdToDelete)

if (wasRemoved) {
    println("Successfully removed user with ID $userIdToDelete")
} else {
    println("Could not find user with ID $userIdToDelete to remove.")
}
```

### Swift

```swift
do {
    let userBox = store.box(for: User.self)
    let userIdToDelete: Id<User> = 1

    let wasRemoved = try userBox.remove(userIdToDelete)
    
    if wasRemoved {
        print("Successfully removed user with ID \(userIdToDelete)")
    } else {
        print("Could not find user with ID \(userIdToDelete) to remove.")
    }
} catch {
    print("An error occurred: \(error)")
}
```

### Dart (Flutter)

```dart
final userBox = store.box<User>();
final userIdToDelete = 1;

final wasRemoved = userBox.remove(userIdToDelete);

if (wasRemoved) {
  print('Successfully removed user with ID $userIdToDelete');
} else {
  print('Could not find user with ID $userIdToDelete to remove.');
}
```

### Python

```python
user_box = store.box(User)
user_id_to_delete = 1

was_removed = user_box.remove(user_id_to_delete)

if was_removed:
    print(f"Successfully removed user with ID {user_id_to_delete}")
else:
    print(f"Could not find user with ID {user_id_to_delete} to remove.")
```

---

## Edge Cases & Pitfalls

- **Non-existent ID**: Returns `false` (does not throw an exception).  
- **Invalid ID (0 or negative)**: Treated as non-existent, returns `false`.  
- **Bulk deletes**: Use `removeMany()` for performance when removing multiple IDs.  
- **Remove by object reference**: Some bindings allow `remove(object)` in addition to `remove(id)`.  
- **Transactions**: Removing multiple objects can be wrapped in a single transaction for atomicity.  

---

## See Also

- [box.put()](../box-put-method.md) – Inserting and updating objects  
- [box.get()](../box-get-method.md) – Fetching objects  
- [box.removeMany()](../box-removemany-method.md) – Deleting multiple objects efficiently  

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
      "name": "How do I delete an object in ObjectBox?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use box.remove(id). If the object exists, it is deleted and the method returns true. If the object does not exist, it returns false."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the ID does not exist?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "box.remove(id) returns false. No exception is thrown."
      }
    },
    {
      "@type": "Question",
      "name": "How do I delete multiple objects efficiently?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use removeMany() or an equivalent bulk operation instead of calling remove() repeatedly."
      }
    }
  ]
}
</script>
```
