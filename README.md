# js-pure-url

A simple url-style-string builder with pure javascript

## Installation

```shell script
npm install @js-tiny/url
```

## Usage

### Basic Usage

```javascript
import { PureUrl, PureQuery } from "@js-tiny/url";

// Create a new URL
const url = new PureUrl("https://example.com/path?query=value#hash");

// Get URL components
console.log(url.protocol()); // 'https:'
console.log(url.hostname()); // 'example.com'
console.log(url.pathname()); // '/path'
console.log(url.search()); // '?query=value'
console.log(url.hash()); // '#hash'

// Modify URL components
url
  .protocol("http:")
  .hostname("newdomain.com")
  .pathname("/new/path")
  .hash("#new-hash");

console.log(url.toString()); // 'http://newdomain.com/new/path?query=value#new-hash'
```

### URL Components

#### Protocol

```javascript
const url = new PureUrl();
url.protocol("https"); // Auto adds ':' suffix
console.log(url.protocol()); // 'https:'

url.protocol(null); // Clear protocol
```

#### Authentication

```javascript
const url = new PureUrl();

// Set username and password together
url.auth("username:password");
console.log(url.auth()); // 'username:password'

// Or set separately
url.username("user");
url.password("pass");
console.log(url.auth()); // 'user:pass'
```

#### Host and Port

```javascript
const url = new PureUrl();

// Set host with port
url.host("example.com:8080");
console.log(url.host()); // 'example.com:8080'
console.log(url.hostname()); // 'example.com'
console.log(url.port()); // '8080'

// Or set separately
url.hostname("subdomain.example.com");
url.port("3000");
```

#### Path Management

```javascript
const url = new PureUrl();

// Set full path
url.pathname("/api/v1/users");

// Work with path segments
url.pathnames("api", "v1", "users");
console.log(url.pathname()); // '/api/v1/users'

// Get path segments
const segments = url.pathnames(); // ['api', 'v1', 'users']
```

#### Query Parameters with PureQuery

```javascript
const url = new PureUrl();

// Set query string
url.search("?key1=value1&key2=value2");

// Use the query object
url.query.set("param", "value");
url.query.add("tags", "javascript");
url.query.add("tags", "nodejs");

console.log(url.query.get("param")); // 'value'
console.log(url.query.getAll("tags")); // ['javascript', 'nodejs']

// Check if parameter exists
console.log(url.query.has("param")); // true

// Remove parameter
url.query.remove("param");

// Clear all query parameters
url.query.clear();
```

#### Hash Fragment

```javascript
const url = new PureUrl();
url.hash("section1"); // Auto adds '#' prefix
console.log(url.hash()); // '#section1'

url.hash(null); // Clear hash
```

### PureQuery API

The `PureQuery` class provides powerful query parameter management:

```javascript
import { PureQuery } from "@xesam/pure-url";

// Create from query string
const query = new PureQuery("a=1&b=2&b=3", true); // auto decode

// Get values
console.log(query.get("a")); // '1'
console.log(query.getAll("b")); // ['2', '3']

// Set values
query.set("c", "new-value");
query.set("d", "value1", "value2", "value3");

// Add values (avoid duplicates)
query.add("tags", "javascript");
query.add("tags", "javascript"); // Won't add duplicate

// Add multiple values at once
query.addAll({
  category: "programming",
  tags: ["javascript", "nodejs", "react"],
  status: "active"
});

// Or using array format
query.addAll([
  ["author", "john"],
  ["tags", ["frontend", "backend"]]
]);

// Add if not exists
query.addIfNotExist("config", "only-once");

// Merge with another query
query.merge("x=10&y=20");

// Serialize back to string
console.log(query.toUrlString()); // 'a=1&b=2&b=3&c=new-value&d=value1&d=value2&d=value3&x=10&y=20'

#### Batch Operations with addAll

The `addAll` method allows you to add multiple key-value pairs efficiently:

```javascript
const query = new PureQuery();

// Using object format
query.addAll({
  search: "javascript",
  page: "1",
  tags: ["react", "vue", "angular"]
});

// Using array format (tuples)
query.addAll([
  ["category", "frontend"],
  ["difficulty", ["beginner", "intermediate"]]
]);

// Works with existing data
query.set("existing", "value");
query.addAll({ existing: "new-value", newKey: "new-data" });
// Result: existing has both values, newKey is added

// Method chaining support
query.addAll({ param1: "value1" })
     .addAll([["param2", "value2"]])
     .add("param3", "value3");
```
```

### Chaining Methods

All setter methods return the instance, allowing method chaining:

```javascript
const url = new PureUrl()
  .protocol("https")
  .hostname("api.example.com")
  .port("443")
  .pathname("/v1/users")
  .query.set("limit", "10")
  .query.set("offset", "0")
  .hash("results");

console.log(url.toString());
// 'https://api.example.com:443/v1/users?limit=10&offset=0#results'
```

### Resetting Values

Any component can be reset by passing `null`, `undefined`, or empty string:

```javascript
const url = new PureUrl(
  "https://user:pass@example.com:8080/path?query=value#hash"
);

// Clear components
url.protocol(null);
url.auth(null);
url.host(null);
url.pathname(null);
url.search(null);
url.hash(null);

console.log(url.toString()); // '' (empty string)
```

## API Reference

### PureUrl Class

#### Constructor

- `new PureUrl(href?: string)` - Create a new URL instance, optionally from a string

#### Properties

- `query: PureQuery` - Query parameters manager

#### Methods

**Protocol:**

- `protocol(value?: string)` - Get/set protocol (e.g., 'http:', 'https:')

**Authentication:**

- `auth(value?: string)` - Get/set auth as 'username:password'
- `username(value?: string)` - Get/set username
- `password(value?: string)` - Get/set password

**Host:**

- `host(value?: string)` - Get/set host as 'hostname:port'
- `hostname(value?: string)` - Get/set hostname
- `port(value?: string)` - Get/set port

**Path:**

- `path(value?: string)` - Get/set path including query string
- `pathname(value?: string)` - Get/set pathname
- `pathnames(...fragments: string[])` - Get/set path segments

**Query:**

- `search(value?: string)` - Get/set query string

**Hash:**

- `hash(value?: string)` - Get/set hash fragment

**Serialization:**

- `toUrlString()` - Get full URL string
- `toString()` - Alias for toUrlString()

### PureQuery Class

#### Constructor

- `new PureQuery(qString?: string, decodeValue?: boolean)`

#### Methods

- `isEmpty()` - Check if query is empty
- `has(key: string)` - Check if key exists
- `keys()` - Get all keys
- `get(key: string, index?: number)` - Get value by key
- `getAll(key: string)` - Get all values for key
- `add(key: string, value: string)` - Add value to key
- `addAll(entries: object | array)` - Add multiple key-value pairs at once
- `addIfNotExist(key: string, value: string)` - Add only if key doesn't exist
- `set(key: string, ...values: string[])` - Set values for key
- `remove(key: string)` - Remove key
- `clear()` - Clear all keys
- `load(qString: string, decodeValue?: boolean)` - Load from query string
- `merge(otherQuery: string | PureQuery, decodeValue?: boolean)` - Merge with another query
- `toUrlString(encodeValue?: boolean)` - Serialize to query string
- `toString()` - Alias for toUrlString()
