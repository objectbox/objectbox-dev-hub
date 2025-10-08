id: realm-to-objectbox-api-mappingtitle: "Realm → ObjectBox API Mapping (Quick Reference)"sidebar_label: "Realm → ObjectBox Mapping"description: "A side-by-side cheat sheet and quick reference table mapping MongoDB Realm APIs to ObjectBox APIs for concepts like entities, queries, relationships, and sync."keywords:Realm to ObjectBoxAPI mappingRealm APIObjectBox APImigration cheat sheetRealm equivalentdatabase migrationSide-by-side cheat sheet to help you translate common Realm APIs and concepts to ObjectBox. For a full walkthrough of the migration process, see our Practical Migration Guide.ConceptRealm (Java/Kotlin)ObjectBox (Java/Kotlin)NotesEntity / Modelopen class Person : RealmObject()@Entity data class Person(@Id var id: Long = 0, var name: String)ObjectBox uses annotations; IDs are Long (0 = new).Primary Key@PrimaryKey var id: Long = 0@Id var id: Long = 0Auto-assigned on put() when id == 0.Relationshipsvar pets: RealmList<Pet>; var owner: Person?@Backlink(to = "owner") lateinit var pets: ToMany<Pet>; var owner: ToOne<Person>ObjectBox uses ToOne / ToMany; backlinks are derived with @Backlink.Box / DB HandleRealm.getDefaultInstance()val store = MyObjectBox.builder().androidContext(ctx).build(); val box = store.boxFor(Person::class.java)Keep one Store per process.Create / Updaterealm.executeTransaction { it.insertOrUpdate(obj) }box.put(obj)put() inserts or updates by ID.Read by IDrealm.where(Person::class.java).equalTo("id", id).findFirst()box.get(id)Returns null if not found (Kotlin: nullable).Deleteobj.deleteFromRealm() / realm.where(...).findAll().deleteAllFromRealm()box.remove(id) / box.remove(obj) / box.remove(ids)Bulk: removeMany() is fastest.Queries (simple)realm.where(Person::class.java).equalTo("name","Ann").findAll()box.query(Person_.name.equal("Ann")).build().find()ObjectBox has type-safe properties via Person_.*.Queries (AND/OR).greaterThan("age", 18).and().lessThan("age", 60)box.query(Person_.age.greater(18).and(Person_.age.less(60))).build().find()Chain with .and() / .or().Sorting.sort("age", Sort.DESCENDING)query.orderDesc(Person_.age).build().find()Call order()/orderDesc() before build().PaginationN/A (managed results)query.find(offset, limit)Also findIds(...).Transactionsrealm.executeTransaction { … }store.runInTx { … }Keep write sections short.Live / ReactiveRealmResults are live; addChangeListenerUse your app’s reactive layer; re-run queries or observe signalsObjectBox avoids hidden live objects; ensures predictable lifecycles.Schema MigrationMigrations via RealmMigrationMostly automatic; add/remove/rename properties supported by generatorBreaking changes may require ID/rename handling.SyncRealm Device Sync (Atlas)ObjectBox Sync (client-server)ObjectBox is local-first with selective sync rules.Vector SearchCloud-only (Atlas Vector Search)On-device HNSW vector index (@HnswIndex, nearestNeighbors)ObjectBox offers on-device vector DB; Realm’s vector search is server-side.Data BrowserRealm Studio (separate app)ObjectBox Admin (in-app, debug)Start Admin in debug builds and open at 127.0.0.1:8090.ThreadingRealm instances bound to threadStore safe to share; get thread-local Box as neededAvoid long running work inside one transaction.Minimal code examplesObject model with relations + vector index@Entity
data class Note(
  @Id var id: Long = 0,
  var title: String = "",
  var authorId: Long = 0,
  @HnswIndex(dimensions = 384) var embedding: FloatArray? = null,
  var createdAt: Long = System.currentTimeMillis()
)

@Entity
data class Author(
  @Id var id: Long = 0,
  var name: String = ""
) {
  @Backlink(to = "author")
  lateinit var notes: ToMany<Note>
}
CRUD & queriesval noteBox = store.boxFor(Note::class.java)
val id = noteBox.put(Note(title = "Hello", authorId = 1))

val n = noteBox.get(id)
noteBox.remove(id)

val q = noteBox.query(
  Note_.title.startsWith("He").and(Note_.createdAt.greater(0))
).build()

val results = q.find() // or q.find(0, 20)
Vector search (nearest neighbors)val nn = noteBox.query(
  Note_.embedding.nearestNeighbors(queryVector, 5)
).build().findWithScores()

for (hit in nn) {
  println("id=${hit.`object`.id}, score=${hit.score}")
}
