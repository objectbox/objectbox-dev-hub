---
description: >-
  ObjectBox database persistence for C and C++ is based on objects. Learn how to
  persist entities with entity annotations in this tutorial section.
---

# Entity Annotations

The source FlatBuffer schema can contain some ObjectBox-specific annotations, declared as specially formatted comments to `table` and `field` FlatBuffer schema elements.&#x20;

## Annotated schema example

Have a look at the following FlatBuffers schema example showing some ObjectBox annotations:

{% code title="schema.fbs" %}
```
/// This entity is not annotated and serves as a relation target in this example
table Simple {
    id:ulong;
}

/// objectbox: name=AnnotatedEntity
table Annotated {
    /// Objectbox requires an ID property. Recognized automatically 
    /// if it has a right name ("id"), otherwise it must be annotated.
    /// objectbox:id
    identifier:ulong;

    /// objectbox:name="name",index=hash64
    fullName:string;

    /// objectbox:id-companion, date
    time:int64;

    /// objectbox:transient
    skippedField:[uint64];

    /// objectbox:relation=Simple
    relId:ulong;
}

/// This entity is synchronized between clients.
/// Requires ObjectBox Sync (see below and https://objectbox.io/sync/)
/// objectbox:sync
table SharedInfo {
    id:ulong;
    
    ...
}
```
{% endcode %}

## Annotation format

To ensure that the annotations are recognized, follow these guidelines:

* Must be a comment immediately preceding an Entity or a Property (no empty lines between them).
* The comment must start with three slashes so it's picked up by FlatBuffer schema parser as a "documentation".
* Spaces between words inside the comment are skipped so you can use them for better readability if you like. See e.g. `Annotated`, `time`.
* The comment must start with the text `objectbox:` and is followed by one or more annotations, separated by commas.
* Each annotation has a name and some annotations also support specifying a value (some even require a value, e.g. the `name` annotation). See e.g. `Annotated`, `relId`.
* Value, if present, is added to the annotation by adding an equal sign and the actual value.
* A value may additionally be surrounded by double quotes but it's not necessary. See e.g. `fullName` showing both variants.

## Supported annotations

The following annotations are currently supported:

### **Entity annotations**

* **name** - specifies the name to use in the database if it's desired to be different than what the FlatBuffer schema "table" is called.
* **transient** - this entity is skipped, no code is generated for it. Useful if you have custom FlatBuffer handling but still want to generate ObjectBox binding code for some parts of the same file.
* **uid** - used to explicitly specify UID used with this entity; used when renaming entities. See [Schema changes](schema-changes.md) for more details.
* **relation** - adds a standalone (many-to-many) relation, usually to another entity. Example: creating a relation to the authors of a book: `objectbox:relation(name=authors,to=Author)`
* **sync** - enables synchronization for the entity - only relevant with [ObjectBox Sync](https://objectbox.io/sync/) library builds. Entities not marked with this annotation will not be synchronized to the server, i.e. they're local-only.
  * `sync(sharedGlobalIds)` can be used to switch from the default behaviour (ID-mapping) to using a global ID space. This flag tells ObjectBox to treat object IDs globally and thus no ID mapping (local <-> global) is performed. Often this is used with `id(assignable)` annotation and some special ID scheme.

### **Property annotations**

* **date** - tells ObjectBox the property is a timestamp in milliseconds, ObjectBox expects the value to be the number of milliseconds since UNIX epoch.
* **date-nano** - tells ObjectBox the property is a timestamp in nanoseconds, ObjectBox expects the value to be the number of nanoseconds since UNIX epoch.
* **id** - specifies this property is a unique identifier of the object - used for all CRUD operations.
  * assignable IDs (set as `id(assignable)`) to switch from the default (ObjectBox assigns object IDs during insert, following auto-increment order). This will allow putting an object with any valid ID. You can still set the ID to zero to let ObjectBox auto-assign a new ID.
* **id-companion** - identifies a companion property, currently only supported on `date/date-nano` properties in time-series databases.
* **index** - creates a database index. This can improve performance when querying for that property. You can specify an index type as the annotation value:
  * not specified - automatically choose the index type based on the property type (`hash` for string, `value` for others).
  * `value` - uses property values to build the index. For string, this may require more storage than a hash-based index.
  * `hash` - uses a 32-bit hash of property value to build the index. Occasional collisions may occur which should not have any performance impact in practice (with normal value distribution). Usually, a better choice than `hash64`, as it requires less storage.
  * `hash64` - uses a long hash of property values to build the index. Requires more storage than `hash` and thus should not be the first choice in most cases.
* **relation** - declares the field as a relation ID, linking to another Entity which must be specified as a value of this annotation.
* **name** - specifies the name to use in the database if it's desired to be different than what the FlatBuffer schema "field" is called.
* **transient** - this property is skipped, no code is generated for it. Useful if you have custom FlatBuffer handling but still want to generate ObjectBox binding code for the entity.
* **uid** - used to explicitly specify UID used with this property; used when renaming properties. See [Schema changes](schema-changes.md) for more details.
* **unique** - set to enforce that values are unique before an entity is inserted/updated. A `put` operation will abort and return an error if the unique constraint is violated.
