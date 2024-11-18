---
description: >-
  The ObjectBox C / C ++ database is setup within minutes. Get the library and
  the generator and start developing high performance data applications.
---

# Installation

## ObjectBox library

There are a couple of ways to get the ObjectBox library (we recommend CMake 3.14 or newer):

{% tabs %}
{% tab title="CMake 3.14+" %}
Use [CMake's FetchContent](https://cmake.org/cmake/help/latest/module/FetchContent.html) to get ObjectBox headers and library ready to use in your project:

{% code title="CMakeLists.txt" %}
```cmake
cmake_minimum_required(VERSION 3.14)
project(myapp)
set(CMAKE_CXX_STANDARD 11) # C++11 or higher

include(FetchContent)
FetchContent_Declare(
    objectbox
    GIT_REPOSITORY https://github.com/objectbox/objectbox-c.git
    GIT_TAG        v4.0.3
)

FetchContent_MakeAvailable(objectbox)

add_executable(myapp main.cpp)
target_link_libraries(myapp objectbox)
```
{% endcode %}



If you want to use an ObjectBox Sync variant of the library, change the `target_link_libraries` to:&#x20;

{% code title="" %}
```
target_link_libraries(myapp objectbox-sync)
```
{% endcode %}
{% endtab %}

{% tab title="CMake (v3.11+)" %}
Use [CMake's FetchContent](https://cmake.org/cmake/help/latest/module/FetchContent.html) to get ObjectBox headers and library into your project like this:

{% code title="CMakeLists.txt" %}
```cmake
cmake_minimum_required(VERSION 3.11)
project(myapp)
set(CMAKE_CXX_STANDARD 11) # C++11 or higher

include(FetchContent)
FetchContent_Declare(
    objectbox
    GIT_REPOSITORY https://github.com/objectbox/objectbox-c.git
    GIT_TAG        v4.0.3
)

FetchContent_GetProperties(objectbox)
if(NOT objectbox_POPULATED)
  FetchContent_Populate(objectbox)
endif()

add_executable(myapp main.cpp)
target_link_libraries(myapp objectbox)
```
{% endcode %}

If you want to integrate the ObjectBox-Generator via CMake (as an alternative to offline installation and pre-generation of C++ sources), use the following snippet:

<pre class="language-cmake"><code class="lang-cmake"><strong># find objectbox-generator (auto-download if not found on system per default)
</strong>find_package(ObjectBoxGenerator 4.0.0 REQUIRED)

# generate C++ files from tasklist.fbs and compile/link with target
add_obx_schema(
  TARGET myapp 
  SCHEMA_FILES tasklist.fbs 
  INSOURCE # Opt-in: Generate in source directory
  CXX_STANDARD 11 # Defaults to C++14 otherwise
)
</code></pre>

\
If you want to use an ObjectBox Sync variant of the library, change the list line to:&#x20;

{% code title="CMakeLists.txt" %}
```cmake
target_link_libraries(myapp objectbox-sync)
```
{% endcode %}
{% endtab %}

{% tab title="download.sh" %}
Using the download.sh script (on Windows, use something like Git Bash to run it)

* Get the [repo](https://github.com/objectbox/objectbox-c)'s [download.sh](https://github.com/objectbox/objectbox-c/blob/master/download.sh) and run it in a terminal:\
  `bash <(curl -s https://raw.githubusercontent.com/objectbox/objectbox-c/main/download.sh)`
* To get the ObjectBox Sync variant of the library, pass `--sync` to the previous command.

Details on the download.sh script:

* Creates a "download" directory and a version dependent sub directory named like "libobjectbox-0.1-some-hex-hash".
* Inside the version dependent sub directory, you will find the directories "include" and "lib"/
* The "lib" directory contains the binary library.
* Gives you an option to install the library to `/usr/lib` (linux) or `/usr/local/lib` (macOS).
{% endtab %}

{% tab title="Manual download" %}
Get the library for your platform from the latest GitHub release: \
[https://github.com/objectbox/objectbox-c/releases/latest](https://github.com/objectbox/objectbox-c/releases/latest)\
\
You can choose between three different versions per release:core, sync and jni;  \
As a good starting point for C/C++ Development download "ObjectBox Core" named `objectbox-<platform>-<arch>.{tar.gz,zip}`.
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Supported Platforms: \
Linux (x86\_64, aarch64, armv7hf, armv6hf), macOS (x64,arm64), Windows (x64,x86) \
\
On Windows you might have to install the latest [Microsoft Visual C++ Redistributable package (X64)](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2015-2017-2019-and-2022) to use the ObjectBox DLL.\
\
Support for other platforms and architectures on request (i.e. QNX, armv6)
{% endhint %}

Once you setup the headers and library like this, you can already start using the ObjectBox API! Here's a minimal example to verify your setup:

{% tabs %}
{% tab title="C++" %}
{% code title="main.cpp" %}
```cpp
#define OBX_CPP_FILE // Put this define in one file only before including
#include "objectbox.hpp"

int main() {
    printf("Using ObjectBox version %s\n", obx_version_string());
    return 0;
}
```
{% endcode %}

{% hint style="info" %}
**`#define OBX_CPP_FILE`** is not strictly required in this minimal example. However, when starting with the real C++ API, it is required to have **exactly one .cpp file** that defines OBX\_CPP\_FILE right before the inclusion of the "objectbox.hpp" header.
{% endhint %}
{% endtab %}

{% tab title="C" %}
{% code title="main.c" %}
```c
#include "objectbox.h"

int main() {
    printf("ObjectBox version %s\n", obx_version_string());
    return 0;
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

If you used CMake to setup your project you can already build and execute this program. Otherwise ensure your includes and the runtime shared library (libobjectbox.so, .dylib, .dll depending on the platform) are setup correctly for your compiler and linker environment.

## ObjectBox Generator

ObjectBox Generator is a tool that will help you with during development of your application (and as opposed to the ObjectBox shared library, it's not supposed to be distributed with your app).

{% tabs %}
{% tab title="CMake Generator" %}
Using the ObjectBox Generator with CMake  is straightforward (after the installation via `FetchContent` above):

```cmake
# Downloads automatically if not found on system per default)
find_package(ObjectBoxGenerator 4.0.0 REQUIRED)

# generate C++ files from tasklist.fbs and compile/link with target
add_obx_schema(
  TARGET myapp 
  SCHEMA_FILES tasklist.fbs 
  INSOURCE # Opt-in: Generate in source directory
  CXX_STANDARD 11 # Defaults to C++14 otherwise
)
```
{% endtab %}

{% tab title="Standalone Generator" %}
As an alternative, install the `objectbox-generator` executable by downloading the version for your OS from [releases](https://github.com/objectbox/objectbox-generator/releases/latest). If you want, add it to `$PATH` for convenience. Alternatively, instead of downloading, you can build the generator yourself by cloning this repo and running `make`. To build yourself, you need a recent Go version, CMake and a C++11 toolchain.

{% hint style="info" %}
Try running `objectbox-generator -help` to verify the installation and see the options.
{% endhint %}
{% endtab %}
{% endtabs %}

For more details, please refer to the [Generator documentation page](generator.md).

## FlatBuffers

ObjectBox uses FlatBuffers to represent objects at lower levels. It is a highly efficient binary representation that works across platforms. For advanced usage, you can opt to work with FlatBuffers directly.

{% tabs %}
{% tab title="CMake" %}
{% hint style="success" %}
If you are using the recommended CMake's FetchContent ObjectBox setup, there's no FlatBuffers setup required. You can skip this section.
{% endhint %}


{% endtab %}

{% tab title="C++ without CMake" %}
To set up ObjectBox for C++ projects, you need to provide the FlatBuffers headers additionally. The objectbox.hpp header file requires it; e.g. you will find the line `#include "flatbuffers/flatbuffers.h"` there. Thus, you also need it when using ObjectBox Generator (see above).

{% hint style="info" %}
The default ObjectBox mode of operation involves the Generator, which generates C++ data (entity) classes. It's a higher level abstraction which takes care of FlatBuffers internals so you don't have to.

Nevertheless, advanced users may also use FlatBuffers directly, e.g. for zero-copy data access, which can be even faster.
{% endhint %}

The ObjectBox shared library already includes **FlatBuffers symbols** so no additional linking should be necessary. For **headers**, there are the following options (chose one):

1. If you're using the **recommended CMake setup** with the `FetchContent` command like described above, you are **already set up** to work with FlatBuffers APIs. (The FlatBuffers headers are already part of the `objectbox` library interface include directories.)
2. Get the latest [FlatBuffers headers](https://github.com/google/flatbuffers/tree/master/include) and e.g. copy them into your source/include path.
3. Add the "[external](https://github.com/objectbox/objectbox-c/tree/main/external)" directory from our C/C++ GitHub repository as an include path to your project. This is likely not the latest version of FlatBuffers. On the upside it is tested to work with ObjectBox.

{% hint style="info" %}
**The `OBX_DISABLE_FLATBUFFERS` define**

For special setups, the objectbox.hpp header also allows a configuration, which does not depend on including FlatBuffers. This is a limited setup, as it does not allow putting entities created by ObjectBox Generator. It can be helpful though, e.g. if you want to verify your ObjectBox basic setup without generated entities yet as a first step. To enable this, simply add the `OBX_DISABLE_FLATBUFFERS` define to your C++ compiler configuration.&#x20;
{% endhint %}
{% endtab %}

{% tab title="C without CMake" %}
Get [flatcc library and headers](https://github.com/dvidelabs/flatcc). You can link your program to the to the static runtime library.

CMake example (check the link above for the latest version):

```
FetchContent_Declare(
    flatcc
    GIT_REPOSITORY https://github.com/dvidelabs/flatcc.git
    GIT_TAG        v0.6.0
)

FetchContent_GetProperties(flatcc)
if(NOT flatcc_POPULATED)
  FetchContent_Populate(flatcc)
endif()

add_executable(c99app main.c)
target_link_libraries(c99app objectbox flatccrt)
```
{% endtab %}
{% endtabs %}
