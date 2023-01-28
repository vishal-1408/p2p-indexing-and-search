const Hyperbee = require('hyperbee')
const Corestore = require('corestore')
const { kvPairs: dictionaryPairs } = require('websters-english-dictionary')

// Toggle this on-and-off to see how long a full scan takes.
const TEST_FULL_SCAN = true

start()

async function start () {
  // create a Corestore instance
  const store = new Corestore('my-storage-3')

  const core = store.get({ name: 'hyperbee-dictionary' })

  const db = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'utf-8' })

  await db.ready()

  console.log('Creating dictionary database...')
  const batch = db.batch()
  for (const { key, value } of dictionaryPairs()) {
    await batch.put(key, value)
  }
  await batch.flush()
  console.log('Finished creating dictionary database.')

  if(TEST_FULL_SCAN){
    console.log('Timing a full scan to find all entries with length 35...')
    console.time('full-scan')
    await fullScanQuery(db, 35)
    console.timeEnd('full-scan')
  }

  console.log('Building secondary index...')
  await generateSecondaryIndex(db)
  console.log('Built secondary index, running test queries...')

  const queries = [
    { gt: '35/', lt: '36/' },
    { gt: '45/b', lt: '45/c' },
    { gt: '22/', lt: '23/', limit: 10 }
  ]

  for (const query of queries) {
    const resultSet = []
    for await (const record of db.createReadStream(query)) {
      resultSet.push(record)
    }
    console.log('query:', query, 'results:', resultSet)
  }
}

async function generateSecondaryIndex (db) {
  const batch = db.batch()
  for await (const record of db.createReadStream()) {
    const definitionLength = record.value.length
    await batch.put(definitionLength + '/' + record.key, record.value)
  }
  return batch.flush()
}

async function fullScanQuery (db, length) {
  const matches = []
  for await (const record of db.createReadStream()) {
    if (record.value.length === length) matches.push(record)
  }
  console.log(`Found ${matches.length} definitions with length ${length}`)
}