---
description: >-
  Learn how to create and update to-one and to-many relations between entities
  in ObjectBox C / C++ database.
---

# Relations

Objects may reference other objects, for example using a simple reference or a list of objects. In database terms, we call those references **relations**. The object defining a relation we call the **source** object, the referenced object we call the **target** object. So a relation has a direction.\
\
If there is one target object, we call the relation **to-one.** And if there can be multiple target objects, we call it **to-many**. Note, the direction of the relation matters, as there's also a link back in the reverse direction (the "backlink").

{% hint style="info" %}
If you are familiar with **1:N and N:M relations**, here are the corresponding object relations in ObjectBox:

1:N (one-to-many): to-one relation with its backlink\
N:M (many-to-many): to-many relation with its backlink
{% endhint %}

## To-One Relations

<figure><img src=".gitbook/assets/spaces_-LETufmyus5LFkviJjr4_uploads_1fSQLwbLzX2umwPHx2o3_to-one-relations.webp" alt=""><figcaption></figcaption></figure>

### To-One Relation Schema Definition

You define a to-one relation by using the property annotation `objectbox:relation=<TargetEntity>` in the source entity definition.

{% code title="schema.fbs" %}
```
table Customer {
    id: ulong;
    name: string;
}

table Order {
    id: ulong;
    product: string;
    /// objectbox:relation=Customer
    customerId: ulong;
}
```
{% endcode %}

### Queries using Relation Links

You can use relations in queries to combine query conditions across multiple entity types. At the API level, this is done by following relations from the source to the target by calling a `link(<RelationProperty>)` method on the Query Builder which returns new a Query Builder suitable to express conditions on the target entity.

Example for finding all "Potato" orders by customers who's name starts with "O":

{% tabs %}
{% tab title="C++" %}
```cpp
QueryBuilder<Order> qb = ordersBox.query( Order_::product.equals("Potato") );
QueryBuilder<Customer> qbCustomer = qb.link( Order_::customerId );
qbCustomer.with( Customer_::name.startsWith("O") );
auto orders = qb.build().find(); 
```
{% endtab %}

{% tab title="C" %}
```c
OBX_query_builder* qb = obx_query_builder(store, Order_ENTITY_ID);
obx_qb_equals_string(qb, Order_PROP_ID_product, "Potato", true);

// Relation "link" yields a "Customer"-based query builder for further conditions 
OBX_query_builder* qbCustomer = obx_qb_link_property(qb, Order_PROP_ID_customerId);
obx_qb_starts_with_string(qbCustomer, Customer_PROP_ID_name, "O", true);

OBX_query* query = obx_query(qb);
OBX_bytes_array* orders = obx_query_find(query);
```
{% endtab %}
{% endtabs %}

### To-One Backlinks

A to-one relation implies a direction. For example, when an order is made by a customer, it's the order that points to a customer (via a customer ID). However, in ObjectBox, relations are always **bidirectional**. Thus, we can also use the reverse direction, which we call the **backlink** of a relation. In the case of the "order -> customer" to-one relation, its backlink is "customer -> order". Note that one customer can have multiple orders, and thus we can say that the backlink is actually a "one-to-many" (1:N) relation.

### Queries using Relation Backlinks

To create a query following the backlink (the "reverse" direction), you can call `backlink(<RelationProperty>)` on the Query Builder starting from the "target entity" of the to-one relation. Analog to `link`, a Query Builder is returned to extend the query expression by conditions on the source entity.

Example for finding all customers with their name starting with "O" and who ordered potatoes:

{% tabs %}
{% tab title="C++" %}
```cpp
QueryBuilder<Customer> qb = customersBox.query( Customer_::name.startsWith("O") );
QueryBuilder<Order> qbOrder = qb.backlink( Order_::customerId );
qbOrder.with( Order_::product.equals("Potato") );
auto customers = qb.build().find();
```
{% endtab %}

{% tab title="C" %}
```c
OBX_query_builder* qb = obx_query_builder(store, Customer_ENTITY_ID);
obx_qb_starts_with_string(qb, Customer_PROP_ID_name, "O", true);

// Relation "backlink" yields a "Customer"-based query builder for further conditions 
OBX_query_builder* qbOrder = obx_qb_backlink_property(qb, Order_ENTITY_ID, Order_PROP_ID_customerId);
obx_qb_starts_with_string(qbOrder, Order_PROP_ID_product, "Potato", true);

OBX_query* query = obx_query(qb);
OBX_bytes_array* list = obx_query_find(query);
```
{% endtab %}
{% endtabs %}

## Many-To-Many Relations

<figure><img src=".gitbook/assets/many-to-many.png" alt=""><figcaption></figcaption></figure>

### To-Many Relation Schema Definition

You define a many-to-many relation by using the entity annotation `objectbox:relation(name=<SourceRelFieldName>,to=<TargetEntity>)`and apply it on source entity definition.

{% code title="schema.fbs" %}
```
table Teacher {
    id: ulong;
    name: string;
}

/// objectbox:relation(name=teachers,to=Teacher)
table Student {
    id: ulong;
    name: string;
}
```
{% endcode %}

### Setting Many-to-Many Relations

In contrast to to-one relations, many-to-many relations are stored "standalone" (not inside the objects themselves). Thus, a separate set of API calls exists for put, get and remove.

Example for putting a "teachers" relation from Student "Ferris" to Teacher "Rooney".

{% tabs %}
{% tab title="C++" %}
```cpp
students.standaloneRelPut<Teacher>(Student_::teachers, id_ferris, id_mr_rooney );  
```
{% endtab %}

{% tab title="C" %}
```c
obx_box_rel_put(students, Student_REL_ID_teachers, id_ferris, id_rooney);
```
{% endtab %}
{% endtabs %}

### Query with Many-to-Many Relations

Similar to To-One relations, building queries across relation links is done using the same `link` / `backlink` API style (see the to-section for basics and details).

Example for finding all students of Teacher "Rooney":

{% tabs %}
{% tab title="C++" %}
```cpp
QueryBuilder<Students> qb = studentsBox.query();
QueryBuilder<Teacher> qbTeacher = qb.link<Teacher>(Student_::teachers);
qbTeacher.with(Teacher_::name.equals("Rooney"));
auto students = qb.build().find();
```
{% endtab %}

{% tab title="C" %}
```c
OBX_query_builder* qb = obx_query_builder(store, Student_ENTITY_ID);

OBX_query_builder* qbTeachers = obx_qb_link_standalone(qb, Student_REL_ID_teachers);
obx_qb_equals_string(qbTeachers, Teacher_PROP_ID_name, "Rooney", true);    

OBX_query* query = obx_query(qb);
OBX_bytes_array* list = obx_query_find(query);
```
{% endtab %}
{% endtabs %}

Example for finding all teachers  of Student "Ferris":

{% tabs %}
{% tab title="C++" %}
```cpp
QueryBuilder<Teacher> qb = teachers.query();
QueryBuilder<Students> qbStudents = qb.backlink<Student>(Student_::teachers);
qbStudents.with(Student_::name.equals("Ferris"));
auto teachers = qb.build().find();

```
{% endtab %}

{% tab title="C" %}
```c
OBX_query_builder* qb = obx_query_builder(store, Teacher_ENTITY_ID);

OBX_query_builder* qbStudent = obx_qb_backlink_standalone(qb, Student_REL_ID_teachers);
obx_qb_equals_string(qbStudent, Student_PROP_ID_name, "Ferris", true);

OBX_query* query = obx_query(qb);
OBX_bytes_array* list = obx_query_find(query);
```
{% endtab %}
{% endtabs %}
