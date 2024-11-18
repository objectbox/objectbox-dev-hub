---
description: >-
  ObjectBox Generator produces binding code for ObjectBox C & C++ APIs. This
  greatly simplifies the model declaration and FlatBuffers serialization,
  allowing you to concentrate on the application logic.
---

# How to get started

### Generating binding code

{% hint style="info" %}
ObjectBox Generator is a tool, which must be [downloaded separately](https://github.com/objectbox/objectbox-generator/releases). For details, please check the [installation](installation.md) page.
{% endhint %}

ObjectBox Generator uses FlatBuffer schema file (.fbs) as its primary input. The Generator also maintains some metadata around the data model in a JSON file (objectbox-model.json). Based on these two files, it generates code for the selected language (C or C++).&#x20;

Let’s have a look at a sample schema and how Generator helps us.

{% code title="tasklist.fbs" %}
```
table Task {
    id: ulong;
    text: string;
    date_created: ulong;
    date_finished: ulong;
}
```
{% endcode %}

Use CMake or launch the following command to generate the binding code from the FlatBuffers schema file:

{% tabs %}
{% tab title="CMake (C++)" %}
```cmake
find_package(ObjectBoxGenerator 4.0.0 REQUIRED)
add_obx_schema(TARGET myapp SCHEMA_FILES tasklist.fbs INSOURCE)
```

The following files will be generated:

* objectbox-model.h
* objectbox-model.json
* tasklist.obx.hpp
* tasklist.obx.cpp

{% hint style="info" %}
See [#cmake-support](generator.md#cmake-support "mention")for details on CMake integration.
{% endhint %}
{% endtab %}

{% tab title="C++" %}
```sh
# to generate for a single file
objectbox-generator -cpp tasklist.fbs

# to generate recursively for the current directory
objectbox-generator -cpp ./...
```

The following files will be generated:

* objectbox-model.h
* objectbox-model.json
* tasklist.obx.hpp
* tasklist.obx.cpp
{% endtab %}

{% tab title="C" %}
```sh
# to generate for a single file
objectbox-generator -c tasklist.fbs

# to generate recursively for the current directory
objectbox-generator -c ./...
```

The following files will be generated:

* objectbox-model.h
* objectbox-model.json
* tasklist.obx.h
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
You should add all these generated files to your source control (e.g. git), most importantly  `objectbox-model.json` which ensures compatibility with previous versions of your database after you make changes to the schema.
{% endhint %}

### Working with Object Boxes

Bet you wondered where our name comes from :)

From an ObjectBox Store, you get Box instances to manage your entities. While you can have multiple Box instances of the same type (for the same Entity) "open" at once, it's usually preferable to just use one instance and pass it around your code.&#x20;

Now, you can include the generated headers in your application and start working with your database. Consider the following main file:

{% tabs %}
{% tab title="C++" %}
{% code title="main.cpp" %}
```cpp
#define OBX_CPP_FILE
#include "objectbox.hpp"
#include "objectbox-model.h"
#include "tasklist.obx.hpp"

int main(int argc, char* args[]) {
    // create_obx_model() provided by objectbox-model.h
    // obx interface contents provided by objectbox.hpp
    obx::Store store(create_obx_model());
    obx::Box<Task> box(store);

    obx_id id = box.put({.text = "Buy milk"});  // Create
    std::unique_ptr<Task> task = box.get(id);   // Read
    if (task) {
        task->text += " & some bread";
        box.put(*task);                         // Update
        box.remove(id);                         // Delete
    }
    return 0;
}
```
{% endcode %}

{% hint style="info" %}
It's required to have **exactly one .cpp file** in your project that defines OBX\_CPP\_FILE right before the inclusion of the "objectbox.hpp" header.

This `#define` instructs the "objectbox.hpp" header to emit implementation definitions. If you accidentally have it in multiple files, the linker will complain about multiple symbols (having the same name).
{% endhint %}
{% endtab %}

{% tab title="C" %}
{% code title="main.c" %}
```c
#include "objectbox.h"
#include "objectbox-model.h"
#include "tasklist.obx.h"

obx_err print_last_error() {
    printf("Unexpected error: %d %s\n", 
        obx_last_error_code(), obx_last_error_message());
    return obx_last_error_code();
}

int main(int argc, char* args[]) {
    int rc = 0;
    OBX_store* store = NULL;
    OBX_box* box = NULL;
    Task* task = NULL;

    // Firstly, we need to create a model for our data and the store
    {
        OBX_model* model = create_obx_model();  // generated in objectbox-model.h
        if (!model) goto handle_error;
        if (obx_model_error_code(model)) {
            printf("Model definition error: %d %s\n", 
                obx_model_error_code(model), obx_model_error_message(model));
            obx_model_free(model);
            goto handle_error;
        }

        OBX_store_options* opt = obx_opt();
        obx_opt_model(opt, model);
        store = obx_store_open(opt);
        if (!store) goto handle_error;

        // obx_store_open() takes ownership of model and opt and frees them.
    }

    box = obx_box(store, Task_ENTITY_ID);  // Note the generated "Task_ENTITY_ID"

    obx_id id = 0;

    {  // Create
        Task new_task = {.text = "Buy milk"};
        id = Task_put(box, &new_task); // generated in tasklist.obx.h
        if (!id) goto handle_error;
        printf("New task inserted with ID %d\n", id);
    }

    {  // Read
        task = Task_Get(store, box, id); // generated in tasklist.obx.h
        if (!task) goto handle_error;
        printf("Task %d read with text: %s\n", id, task->text);
    }

    {  // Update
        const char* appendix = " & some bread";

        // Updating a string property is a little more involved 
        //  because of C memory management.
        size_t old_text_len = task->text ? strlen(task->text) : 0;
        char* new_text = 
            (char*) malloc((old_text_len + strlen(appendix) + 1) * sizeof(char));

        if (task->text) {
            memcpy(new_text, task->text, old_text_len);

            // free the memory allocated previously before overwritting below
            free(task->text);
        }
        memcpy(new_text + old_text_len, appendix, strlen(appendix) + 1);
        task->text = new_text;
        printf("Updated task %d with a new text: %s\n", id, task->text);
    }

    // Delete
    if (obx_box_remove(box, id) != OBX_SUCCESS) goto handle_error;

free_resources:  // free any remaining allocated resources
    if (task) Task_free(task); // free allocs by Task_new_from_flatbuffer()
    if (store) obx_store_close(store); // and close the store
    return rc;

handle_error:  // print error and clean up
    rc = print_last_error();
    if (rc <= 0) rc = 1;
    goto free_resources;
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

If you've followed the installation instructions, you should be able to compile the example

If you are using CMake, like shown in the [installation section](installation.md#cmake-3.14),  just add the generated `tasklist.obx.cpp` file to the `myapp`  target.

The `add_executable` call in the CMake file now looks like this:

```cmake
add_executable(myapp main.cpp tasklist.obx.cpp)
```

The rest of the CMakeLists.txt file stays unchanged. You can now use CMake as expected.

If you use _a build system other than CMake_, it has to do the proper action so the generated file is added to the build.&#x20;

{% tabs %}
{% tab title="C++" %}
<pre class="language-bash"><code class="lang-bash"><strong>g++ main.cpp tasklist.obx.cpp -I. -std=c++11 -lobjectbox
</strong></code></pre>
{% endtab %}

{% tab title="C" %}
```bash
gcc main.c -I. -lobjectbox -lflatccrt
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
The command snippet assumes you have [the libraries installed](installation.md) in a path recognized by your OS (e.g. /usr/local/lib/) and all the referenced headers are in the same folder alongside the main.c/.cpp file.
{% endhint %}

Wherever you have access to a Box, you can use it to persist objects and fetch objects from disk. **Boxes are thread-safe.** Here are some of the basic operations, have a look at the objectbox.h(pp) for more:

* **put:** persist an object at the given ID: either creating a new one or overwriting an existing one.
* **get:** read an object from the database. There's also a variant that takes a list of IDs as an argument and returns multiple objects.
* **remove:** deletes a previously persisted object from its box.&#x20;
* **count:** the number of objects stored in this box.

### Examples

Have a look at the following TaskList example apps, depending on your programming language and preference:

* [C, cursor, no generated code](https://github.com/objectbox/objectbox-c/blob/main/examples/c-cursor-no-gen) - plain C; using flatcc directly; without any generated code
* [C, with generated code](https://github.com/objectbox/objectbox-c/blob/main/examples/cpp-gen) - plain C, using code generated by `objectbox-generator`
* [C++, with generated code](https://github.com/objectbox/objectbox-c/blob/main/examples/cpp-gen) - C++, using code generated by `objectbox-generator`
