id: realm-to-objectbox-migrationtitle: "Migrating from Realm to ObjectBox: A Practical Guide (2025)"sidebar_label: "Realm → ObjectBox Migration"description: "A complete, step-by-step guide to migrating your mobile database from MongoDB Realm to ObjectBox for Android (Kotlin/Java), including project setup, data migration, and vector search."keywords:Realm migrationObjectBoxMongoDB Realm alternativemobile databasevector searchoffline-firstAndroid databasedata syncon-device AIThis guide shows how to move from Realm to ObjectBox accurately and efficiently — using up-to-date APIs for Android/Java/Kotlin and linking to the official docs. For a side-by-side API quick reference, see the Realm → ObjectBox API Mapping.TL;DRObjectBox is a local-first database with on-device vector search (HNSW) and selective Data Sync.Migration is usually: recreate entities → export & import data → swap queries → (optional) add vector index & sync.ObjectBox pioneered on-device vector search and remains among the few offering a full on-device vector DB today. (Claim tuned for accuracy.)1) Project setup (Android, Kotlin/Java)Root build.gradle(.kts)buildscript {
    ext.objectboxVersion = "4.3.0" // Use the latest stable version
    repositories { mavenCentral() }
    dependencies {
        classpath("com.android.tools.build:gradle:8.0.2")
        classpath("io.objectbox:objectbox-gradle-plugin:$objectboxVersion")
    }
}
Module app/build.gradle(.kts)plugins {
    id("com.android.application")
    id("kotlin-android") // when using Kotlin
    id("kotlin-kapt")    // when using Kotlin
    id("io.objectbox")   // apply last
}

// The ObjectBox Gradle plugin adds the libraries automatically after sync.
📖 Docs: Getting Started, Java/Kotlin2) Define entities & relations@Entity
data class Person(
  @Id var id: Long = 0,
  var name: String = "",
  var age: Int = 0
)

@Entity
data class Pet(
  @Id var id: Long = 0,
  var name: String = "",
  var type: String = ""
) {
  lateinit var owner: ToOne<Person>
}
IDs are Long, set to 0 for new objects.ToOne / ToMany and @Backlink model relations.📖 Docs: Entities & Annotations3) Create a Store and Boxesval store = MyObjectBox.builder()
    .androidContext(applicationContext)
    .build()

val personBox = store.boxFor(Person::class.java)
val petBox = store.boxFor(Pet::class.java)
Keep a single Store per process/app.📖 Docs: ObjectBox Java/Kotlin README4) CRUD: put/get/remove// Create / update
val id = personBox.put(Person(name = "Ann", age = 30))

// Read
val p = personBox.get(id)

// Delete
personBox.remove(id)
put() inserts when id==0 and updates otherwise.📖 Docs: CRUD & Boxes5) Queries (filters, sorting, pagination)val q = personBox.query(
  Person_.name.equal("Ann").and(Person_.age.greater(18))
).orderDesc(Person_.age).build()

val results = q.find()       // all
val page = q.find(0, 20)     // pagination
val ids = q.findIds()        // just IDs
📖 Docs: Queries6) Data Browser (Admin) in debug buildsAdd Admin only for debugdependencies {
    debugImplementation("io.objectbox:objectbox-android-objectbrowser:$objectboxVersion")
    releaseImplementation("io.objectbox:objectbox-android:$objectboxVersion")
}
Start Admin after creating the Store (debug only)val store = MyObjectBox.builder().androidContext(this).build()
if (BuildConfig.DEBUG) {
    val started = io.objectbox.android.Admin(store).start(this)
    android.util.Log.i("ObjectBoxAdmin", "Started: $started")
    // On device: [http://127.0.0.1:8090](http://127.0.0.1:8090)
    // From desktop: run: adb forward tcp:8090 tcp:8090  → open [http://127.0.0.1:8090](http://127.0.0.1:8090)
}
📖 Docs: ObjectBox Admin (Data Browser)7) Optional: On-device vector search (RAG)Add a vector field with HNSW index@Entity
data class Doc(
  @Id var id: Long = 0,
  var text: String = "",
  @HnswIndex(dimensions = 768) var embedding: FloatArray? = null
)
Query nearest neighbors with scoresval docBox = store.boxFor(Doc::class.java)

val nn = docBox.query(
  Doc_.embedding.nearestNeighbors(queryVector, 5)
).build().findWithScores()

for (hit in nn) {
  val doc = hit.`object`
  val score = hit.score
  println("Doc ${doc.id} score=$score")
}
Works fully on-device; combine with filters for hybrid search.📖 Docs: On-Device Vector Search8) Optional: Selective, offline-first Syncval sync = Sync.client(
    store,
    "wss://YOUR-SERVER:PORT",
    SyncCredentials.userAndPassword("user", "password")
).buildAndStart()

// Define what to sync (rules/filters) on the server-side
Use wss:// for TLS.Sync only what you need (tags, last N items, etc.).📖 Docs: ObjectBox Sync9) Migrating dataExport from Realm (JSON/CSV or iterate and map).Transform to your new ObjectBox entities (IDs start at 0; set relations).Import via box.put() or box.putMany() in batches (e.g., 500–1,000 per transaction).Recreate queries using the mapping table.Tip: Use the Admin (Data Browser) to verify counts and spot schema issues.10) Common pitfalls (and fixes)Long transactions: Keep write transactions short (store.runInTx { … }).IDs: Don’t reuse Realm IDs unless you truly need to preserve them — let ObjectBox assign new IDs where possible.Relations: Ensure you set ToOne.targetId or toOne.setTarget(entity) before put().Index dimensions: The @HnswIndex(dimensions=…) must match your embedding size exactly.Testing: Build a small migration tool; verify entity counts and a few spot queries.See alsoAPI Mapping (Realm → ObjectBox): Quick Reference TableQueries: https://docs.objectbox.io/queriesEntities & Annotations: https://docs.objectbox.io/entity-annotationsVector Search: https://docs.objectbox.io/on-device-vector-searchAdmin (Data Browser): https://docs.objectbox.io/data-browserJava/Kotlin Getting Started: https://github.com/objectbox/objectbox-javaObjectBox Sync: https://objectbox.io/sync/Attribution note on vector searchObjectBox pioneered on-device vector search and remains one of the few databases providing a full on-device vector DB experience today. Competing solutions typically offer vector search in the cloud, whereas ObjectBox focuses on local-first with optional sync.