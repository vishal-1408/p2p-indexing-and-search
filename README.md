# Hyperbee

[Hyperbee](https://github.com/mafintosh/hyperbee) is P2P key/value store build on top of a Hypercore using an embedded index that projects a B-tree to find and store data.

That basically means we get to store key/value pairs efficiently where each `put(key, value)` just corresponds to a small append to the underlying Hypercore with the key and value plus some routing information that allows a reader to find any keys stored already in the log efficiently.

It also exposes a sorted iterator API that allows you to use the embedded index to efficiently find ranges between two keys, which is useful when you want to build generic databases with Hyperbee as a foundation.

Since Hyperbee stores all it's data in a Hypercore, it inherits all the great replication features from that, meaning it's P2P, very fast to sync only a subset, and all data is signed and secure by the writer producing the database.

The idea of "syncing only a subset" is Hyperbee's most important feature, so it's worth expanding on. Imagine you've created a huge database of Wikipedia articles, indexed by certain some attribute (perhaps the "See Also" links at the bottom). Any reader that runs the query "Find all articles that have 'See Also' links to 'Apollo 11'" will only need to download the portions of the database necessary to complete the query, in realtime. This is often a tiny fraction of the original database, depending on the size of the result set (how specific the query is).

So let's get started with comprehensive exercises on Hyperbee: [Problem 1](problems/01.md)