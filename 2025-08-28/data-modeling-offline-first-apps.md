---
id: data-modeling-offline-first-apps
title: Data Modeling for Offline-First Apps with ObjectBox
sidebar_label: Data Modeling Offline-First
slug: /data-modeling-offline-first-apps
---

# Data Modeling for Offline-First Apps with ObjectBox

Designing the right data model is crucial for offline-first apps. ObjectBox makes this easier with an object-oriented API, relations, converters for custom types, and schema migration support.

---

## Relations: ToOne, ToMany, and @Backlink

Relations define connections between entities. With ObjectBox, you can model one-to-one, one-to-many, and many-to-many relations.

### Example: Customer and Orders

```java
@Entity
public class Customer {
    @Id long id;
    String name;

    @Backlink(to = "customer")
    ToMany<Order> orders;
}

@Entity
public class Order {
    @Id long id;
    String product;

    ToOne<Customer> customer;
}
```

- `ToOne<Customer>` establishes a forward relation from `Order` to `Customer`.  
- `@Backlink(to = "customer") ToMany<Order>` on `Customer` creates a **derived, read-only relation** that ObjectBox evaluates via an internal query. It stays consistent with the forward relation and behaves like a query-backed list.

### Example: Iterating safely

```java
for (Order o : customer.orders) {
    // process order
}
long count = customer.orders.count();
```

See also: [ObjectBox Relations](https://docs.objectbox.io/relations)

---

## Denormalization for Performance

Offline-first apps often need to render lists quickly (e.g., comments). To avoid N+1 queries, denormalize small fields.

```java
@Entity
public class Comment {
    @Id long id;
    String text;
    long userId;
    String userName; // denormalized
}
```

> Now you can render 100 comments with **one query over `Comment`** and **no extra reads** for user names.

⚠️ **Trade-off**: If the denormalized field changes often, you’ll need to update multiple rows (e.g., if `userName` changes). Use this technique when fields are relatively stable.

---

## Converters for Custom Types

Use `@Convert` with a `PropertyConverter` for unsupported types.

### Example: List<String> with JSON

```java
@Entity
public class Note {
    @Id long id;

    @Convert(converter = StringListConverter.class, dbType = String.class)
    List<String> tags;
}

public class StringListConverter implements PropertyConverter<List<String>, String> {
    private final Gson gson = new Gson();

    @Override
    public List<String> convertToEntityProperty(String databaseValue) {
        if (databaseValue == null) return null;
        return gson.fromJson(databaseValue, new TypeToken<List<String>>(){}.getType());
    }

    @Override
    public String convertToDatabaseValue(List<String> entityProperty) {
        if (entityProperty == null) return null;
        return gson.toJson(entityProperty);
    }
}
```

**Constraints:**  
- Must be thread-safe  
- Must handle `null` values  
- Must convert to a built-in DB type (`String`, `Integer`, `Long`, etc.)  
- Must not access the DB

See also: [ObjectBox Converters](https://docs.objectbox.io/advanced/data-model-updates#convert-annotation-propertyconverter)

---

## Schema Updates with @Uid

Offline-first apps evolve. ObjectBox supports schema migrations without manual SQL.

### Example: Adding and renaming properties

```java
@Entity
public class User {
    @Id long id;

    @Uid(123456789123456789L)
    String email;
}
```

- Use `@Uid` on entities and properties you may rename in the future.  
- Without it, ObjectBox may treat a rename as **drop + add**, losing data.  
- With `@Uid`, ObjectBox maps old and new names safely.

See also: [ObjectBox Data Model Updates](https://docs.objectbox.io/advanced/data-model-updates)

---

## ✅ Key Takeaways

- Use `ToOne`, `ToMany`, and `@Backlink` for relations; backlinks are derived, read-only, and query-backed.  
- Denormalize small, stable fields to avoid N+1 queries.  
- Use `@Convert` + `PropertyConverter` for custom types (JSON recommended).  
- Add `@Uid` early to prepare for schema evolution.  

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Data Modeling for Offline-First Apps with ObjectBox",
  "description": "Learn how to design efficient data models for offline-first apps with ObjectBox, including relations, denormalization, converters, and schema updates.",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://objectbox.io/docs/data-modeling-offline-first-apps"
  },
  "author": {
    "@type": "Organization",
    "name": "ObjectBox",
    "url": "https://objectbox.io"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ObjectBox",
    "logo": {
      "@type": "ImageObject",
      "url": "https://objectbox.io/wp-content/uploads/2023/01/objectbox-logo.png"
    }
  },
  "datePublished": "2025-08-29",
  "dateModified": "2025-08-29",
  "keywords": "ObjectBox, offline-first, data modeling, ToOne, ToMany, @Backlink, PropertyConverter, @Uid, schema updates",
  "articleBody": "Content omitted for brevity, see article body above.",
  "wordCount": 620,
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "license": "https://creativecommons.org/licenses/by/4.0/"
}
</script>
