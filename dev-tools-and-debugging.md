---
description: >-
  ObjectBox has tools that help during development. Learn more about looking at
  data inside the database and how to enable debug logs for additional
  information.
---

# Dev Tools and Debugging

## Database Viewer

[ObjectBox Admin](https://docs.objectbox.io/data-browser) is a web-app that can be used to view inside the ObjectBox database. Since it is available as a Docker container with a developer-friendly front-end script you can use it right from a developer console to get insights into your database.\
\
Example: Using just "docker" to run ObjectBox Admin on a database on path `./myapp` : &#x20;

```shell-session
$ docker run --rm -it --volume ./myapp:/db -u $(id -u) -p 8081:8081 objectboxio/admin:latest
Starting server on http://0.0.0.0:8081
001-10:37:02.7767 [INFO ] [SvHttp] Running in single-store mode, store path: /db
001-10:37:02.7767 [INFO ] [SvHttp] Listening on http://0.0.0.0:8081
001-10:37:02.7767 [INFO ] [SvHttp] User management: enabled
001-10:37:02.7771 [INFO ] [SvHttp] HttpServer listening on all interfaces, port 8081
```

Opening the URL `http://localhost:8081` with your browser will open the ObjectBox Admin UI:

<figure><img src="https://2056134408-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-LETufmyus5LFkviJjr4%2Fuploads%2F4l4B1wXLIHFxdoxtBEAn%2Fadmin-data.png?alt=media&#x26;token=b2faf98f-75a0-448b-8154-4cefcdcaa05f" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
See [ObjectBox Admin](https://docs.objectbox.io/data-browser) Documentation for further details and to download developer-friendly front-end launcher shell script.
{% endhint %}

## Logging

ObjectBox includes a logging facility for tracing, amongst others, transaction operations. \
The following C++ code below gives an example how to enable logging for transactions at the info level.

```cpp
    obx::Options options(create_obx_model());
    options.addDebugFlags(
        OBXDebugFlags_LOG_TRANSACTIONS_READ
    |   OBXDebugFlags_LOG_TRANSACTIONS_WRITE
    );

    obx::Store store(options);
```

A sample output of the debug log is given below:

```sh
$ ./build/myapp 
[..]
001-10:23:41.6403 [INFO ] TX #4 (read)
001-10:23:41.6403 [INFO ] TX #4 to be destroyed on owner thread (last committed: TX #2)...
001-10:23:41.6403 [INFO ] TX #4 destroyed
001-10:23:41.6403 [INFO ] TX #5 (write)
001-10:23:41.6403 [INFO ] TX #5 committing...
001-10:23:41.6546 [INFO ] TX #5 to be destroyed on owner thread (last committed: TX #5)...
001-10:23:41.6546 [INFO ] TX #5 destroyed
[..]
```

{% hint style="info" %}
See [C API Documentation of OBXDebugFlag](https://objectbox.io/docfiles/c/current/group\_\_c.html#gade842fb1271541e05f848925f32efa9d) for a list of available debug flags.&#x20;
{% endhint %}

{% hint style="info" %}
ObjectBox also offers a **DebugLog** which gives insights at a very detail level. This is typically not used by an application end-user but might be helpful when things go wrong or when developing improvements, enhancements and features. \
\
This feature is not available in the public release but on request.
{% endhint %}

