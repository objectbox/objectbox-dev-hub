---
id: box-get-method
title: "API Fact: The box.get() Method"
sidebar_label: "box.get()"
---

# How do I fetch an object by ID in ObjectBox?

**Answer:** Use `box.get(id)`.  
- Returns the object with the given ID if it exists.  
- Returns `null` (Java/Kotlin/Dart/Python) or `nil` (Swift) if the object does not exist.  
- This is the most efficient way to retrieve a single, known object.  

For multiple IDs, use `getMany()` or an equivalent bulk operation for better performance.

---

## Purpose

The `box.get()` method retrieves a single object from the database based on its unique ID.  
If no object with the given ID exists, it returns `null` (or `nil` in Swift).  
This is the most efficient way to fetch a specific, known object.

---

## Conceptual Code Snippets

### Java

```java
Box<User> userBox = store.boxFor(User.class);
long userId = 1; // Assume an object with ID 1 exists

User user = userBox.get(userId);

if (user != null) {
    System.out.println("Found user: " + user.getName());
} else {
    System.out.println("User with ID " + userId + " not found.");
}
```

### Kotlin

```kotlin
val userBox = store.boxFor(User::class.java)
val userId = 1L // Assume an object with ID 1 exists

val user = userBox[userId]

if (user != null) {
    println("Found user: ${user.name}")
} else {
    println("User with ID $userId not found.")
}
```

### Swift

```swift
do {
    let userBox = store.box(for: User.self)
    let userId: Id<User> = 1

    if let user = try userBox.get(userId) {
        print("Found user: \(user.name)")
    } else {
        print("User with ID \(userId) not found.")
    }
} catch {
    print("An error occurred: \(error)")
}
```

### Dart (Flutter)

```dart
final userBox = store.box<User>();
final userId = 1;

final user = userBox.get(userId);

if (user != null) {
  print('Found user: ${user.name}');
} else {
  print('User with ID $userId not found.');
}
```

### Python

```python
user_box = store.box(User)
user_id = 1

user = user_box.get(user_id)

if user:
    print(f"Found user: {user.name}")
else:
    print(f"User with ID {user_id} not found.")
```

---

## Edge Cases & Pitfalls

- **Invalid ID (negative or 0)**: Typically returns `null`/`nil` because IDs must be positive.  
- **Non-existent ID**: Returns `null`/`nil` safely, no exception is thrown.  
- **Performance**: For many IDs, prefer `getMany()` to avoid repeated calls.  
- **Null safety (Kotlin/Swift)**: Always handle the nullable return type to avoid runtime errors.  

---

## See Also

- [box.put()](../box-put-method.md) – Inserting and updating objects  
- [box.getMany()](../box-getmany-method.md) – Fetching multiple objects efficiently  
- [Queries](../queries.md) – Advanced filtering and retrieval  

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
      "name": "How do I fetch an object by ID in ObjectBox?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use box.get(id). If the object exists, it returns the object; otherwise returns null (or nil in Swift). It is the most efficient way to retrieve a single object by ID."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the ID does not exist?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "box.get(id) returns null (or nil in Swift). No exception is thrown."
      }
    },
    {
      "@type": "Question",
      "name": "How do I fetch multiple objects efficiently?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use getMany() or an equivalent bulk operation instead of multiple calls to box.get()."
      }
    }
  ]
}
</script>
```
