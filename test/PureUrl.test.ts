import {PureUrl} from '../src/index'

describe('PureUrl', () => {
    function createTestPureUrl(href = "") {
        return new PureUrl(href);
    }

    test('when create with nothing then all attributes are reset', () => {
        const testPureUrl = new PureUrl();

        expect(testPureUrl.protocol()).toBeUndefined();
        expect(testPureUrl.auth()).toBeUndefined();
        expect(testPureUrl.username()).toBeUndefined();
        expect(testPureUrl.password()).toBeUndefined();
        expect(testPureUrl.host()).toBeUndefined();
        expect(testPureUrl.hostname()).toBeUndefined();
        expect(testPureUrl.port()).toBeUndefined();
        expect(testPureUrl.path()).toBeUndefined();
        expect(testPureUrl.pathname()).toBeUndefined();
        expect(testPureUrl.pathnames()).toStrictEqual([]);
        expect(testPureUrl.search()).toBeUndefined();
        expect(testPureUrl.hash()).toBeUndefined();
    });

    test('when create with nothing then the query is empty', () => {
        const testPureUrl = new PureUrl();

        expect(testPureUrl.query.isEmpty()).toBe(true);
    });

    test('when create with url-like-string then all attributes are init', () => {
        const testPureUrl = createTestPureUrl('the_protocol://the_username:the_password@the_hostname:8888/the_pathname?the_key=the_value#the_hash');

        expect(testPureUrl.protocol()).toBe('the_protocol:');
        expect(testPureUrl.auth()).toBe('the_username:the_password');
        expect(testPureUrl.username()).toBe('the_username');
        expect(testPureUrl.password()).toBe('the_password');
        expect(testPureUrl.host()).toBe('the_hostname:8888');
        expect(testPureUrl.hostname()).toBe('the_hostname');
        expect(testPureUrl.port()).toBe('8888');
        expect(testPureUrl.path()).toBe('/the_pathname?the_key=the_value');
        expect(testPureUrl.pathname()).toBe('/the_pathname');
        expect(testPureUrl.pathnames()).toStrictEqual(['the_pathname']);
        expect(testPureUrl.search()).toBe('?the_key=the_value');
        expect(testPureUrl.hash()).toBe('#the_hash');
    });

    test('when create with url-like-string then query is init', () => {
        const testPureUrl = createTestPureUrl('the_protocol://the_username:the_password@the_hostname:8888/the_pathname?the_key=the_value#the_hash');

        expect(testPureUrl.query.has('the_key')).toBeTruthy();
        expect(testPureUrl.query.getAll('the_key')).toContain('the_value');
        expect(testPureUrl.query.toUrlString()).toContain('the_key=the_value');
    });

    test('when set protocol then update protocol only', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.protocol(' https: ');
        expect(testPureUrl.protocol()).toBe('https:');
        testPureUrl.protocol(' https ');
        expect(testPureUrl.protocol()).toBe('https:');
        testPureUrl.protocol(' https:// ');
        expect(testPureUrl.protocol()).toBe('https:');
    });

    test('when set protocol with falsy or blank then clear the protocol', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.protocol('http');

        testPureUrl.protocol(null);
        expect(testPureUrl.protocol()).toBeUndefined();

        testPureUrl.protocol("            ");
        expect(testPureUrl.protocol()).toBeUndefined();

        testPureUrl.protocol("      :      ");
        expect(testPureUrl.protocol()).toBeUndefined();
    });

    test('when set auth with username&password then update username and password', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.auth(' username :  password ');

        expect(testPureUrl.auth()).toBe('username:password');
        expect(testPureUrl.username()).toBe('username');
        expect(testPureUrl.password()).toBe('password');
    });

    test('when set auth with falsy or blank then clear username and password', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.auth(null);
        expect(testPureUrl.auth()).toBeUndefined();
        expect(testPureUrl.username()).toBeUndefined();
        expect(testPureUrl.password()).toBeUndefined();

        testPureUrl.auth("           ");
        expect(testPureUrl.auth()).toBeUndefined();
        expect(testPureUrl.username()).toBeUndefined();
        expect(testPureUrl.password()).toBeUndefined();
    });

    test('when set auth with username then update username and clear password', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.auth(' username  ');

        expect(testPureUrl.auth()).toBe('username');
        expect(testPureUrl.username()).toBe('username');
        expect(testPureUrl.password()).toBeUndefined();
    });

    test('when set username then update username but keep password', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.auth(' username :  password ');

        testPureUrl.username(' new_username ');

        expect(testPureUrl.auth()).toBe('new_username:password');
        expect(testPureUrl.username()).toBe('new_username');
        expect(testPureUrl.password()).toBe('password');
    });

    test('when set username with falsy or blank then clear username but keep password', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.auth(' username :  password ');
        testPureUrl.username(null);

        expect(testPureUrl.auth()).toBe(':password');
        expect(testPureUrl.username()).toBeUndefined();
        expect(testPureUrl.password()).toBe('password');

        testPureUrl.auth(' username :  password ');
        testPureUrl.username('          ');

        expect(testPureUrl.auth()).toBe(':password');
        expect(testPureUrl.username()).toBeUndefined();
        expect(testPureUrl.password()).toBe('password');
    });

    test('when set password then update password and keep username', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.auth(' username :  password ');

        testPureUrl.password(' new_password ');

        expect(testPureUrl.auth()).toBe('username:new_password');
        expect(testPureUrl.username()).toBe('username');
        expect(testPureUrl.password()).toBe('new_password');
    });

    test('when set password with falsy or blank then clear password but keep username', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.auth(' username :  password ');
        testPureUrl.password(null);

        expect(testPureUrl.auth()).toBe('username');
        expect(testPureUrl.username()).toBe('username');
        expect(testPureUrl.password()).toBeUndefined();

        testPureUrl.auth(' username :  password ');
        testPureUrl.password('            ');

        expect(testPureUrl.auth()).toBe('username');
        expect(testPureUrl.username()).toBe('username');
        expect(testPureUrl.password()).toBeUndefined();
    });

    test('when set host with hostname&port then update hostname and port', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.host(' hostname :  80 ');

        expect(testPureUrl.host()).toBe('hostname:80');
        expect(testPureUrl.hostname()).toBe('hostname');
        expect(testPureUrl.port()).toBe('80');
    });

    test('when set host with hostname then update hostname and clear port', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.host(' hostname    ');

        expect(testPureUrl.host()).toBe('hostname');
        expect(testPureUrl.hostname()).toBe('hostname');
        expect(testPureUrl.port()).toBeUndefined();
    });

    test('when set host with falsy or blank then clear hostname and port', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.host('hostname:80');
        testPureUrl.host(null);

        expect(testPureUrl.host()).toBeUndefined();
        expect(testPureUrl.hostname()).toBeUndefined();
        expect(testPureUrl.port()).toBeUndefined();

        testPureUrl.host('hostname:80');
        testPureUrl.host('           ');

        expect(testPureUrl.host()).toBeUndefined();
        expect(testPureUrl.hostname()).toBeUndefined();
        expect(testPureUrl.port()).toBeUndefined();
    });

    test('when set hostname then update hostname and keep port', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.host('hostname:80');
        testPureUrl.hostname(' new_hostname ');

        expect(testPureUrl.host()).toBe('new_hostname:80');
        expect(testPureUrl.hostname()).toBe('new_hostname');
        expect(testPureUrl.port()).toBe('80');
    });

    test('when set hostname with falsy or blank then clear hostname and keep port', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.host('hostname:80');
        testPureUrl.hostname(null);

        expect(testPureUrl.host()).toBe(':80');
        expect(testPureUrl.hostname()).toBeUndefined();
        expect(testPureUrl.port()).toBe('80');

        testPureUrl.host('hostname:80');
        testPureUrl.hostname('          ');

        expect(testPureUrl.host()).toBe(':80');
        expect(testPureUrl.hostname()).toBeUndefined();
        expect(testPureUrl.port()).toBe('80');
    });

    test('when set port then update port and keep hostname', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.host('hostname:80');

        testPureUrl.port(' 8000 ');

        expect(testPureUrl.host()).toBe('hostname:8000');
        expect(testPureUrl.hostname()).toBe('hostname');
        expect(testPureUrl.port()).toBe('8000');
    });

    test('when set port with falsy or blank then clear hostname and keep port', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.host('hostname:80');
        testPureUrl.port(null);

        expect(testPureUrl.host()).toBe('hostname');
        expect(testPureUrl.hostname()).toBe('hostname');
        expect(testPureUrl.port()).toBeUndefined();

        testPureUrl.host('hostname:80');
        testPureUrl.port('           ');

        expect(testPureUrl.host()).toBe('hostname');
        expect(testPureUrl.hostname()).toBe('hostname');
        expect(testPureUrl.port()).toBeUndefined();
    });

    test('when set path then update pathname and search', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        expect(testPureUrl.path()).toBe('/part1/part2?k1=v1&k2=v2');
        expect(testPureUrl.pathname()).toBe('/part1/part2');
        expect(testPureUrl.search()).toBe('?k1=v1&k2=v2');

        testPureUrl.path('/part1/part2');
        expect(testPureUrl.path()).toBe('/part1/part2');
        expect(testPureUrl.pathname()).toBe('/part1/part2');
        expect(testPureUrl.search()).toBeUndefined();

        testPureUrl.path('/');
        expect(testPureUrl.path()).toBe('/');
        expect(testPureUrl.pathname()).toBe('/');
        expect(testPureUrl.search()).toBeUndefined();

        testPureUrl.path('?k1=v1&k2=v2');
        expect(testPureUrl.path()).toBe('?k1=v1&k2=v2');
        expect(testPureUrl.pathname()).toBeUndefined();
        expect(testPureUrl.search()).toBe('?k1=v1&k2=v2');

        testPureUrl.path('?');
        expect(testPureUrl.path()).toBeUndefined();
        expect(testPureUrl.pathname()).toBeUndefined();
        expect(testPureUrl.search()).toBeUndefined();
    });

    test('when set path with falsy or blank then clear pathname and search', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        testPureUrl.path(null);

        expect(testPureUrl.path()).toBeUndefined();
        expect(testPureUrl.pathname()).toBeUndefined();
        expect(testPureUrl.search()).toBeUndefined();

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        testPureUrl.path('           ');

        expect(testPureUrl.path()).toBeUndefined();
        expect(testPureUrl.pathname()).toBeUndefined();
        expect(testPureUrl.search()).toBeUndefined();
    });

    test('when set pathname then update pathname and keep search', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.path('/part1/part2?k1=v1&k2=v2');

        testPureUrl.pathname('/new_part1/new_part2');
        expect(testPureUrl.path()).toBe('/new_part1/new_part2?k1=v1&k2=v2');

        testPureUrl.pathname('new_part1/new_part2');
        expect(testPureUrl.path()).toBe('/new_part1/new_part2?k1=v1&k2=v2');

        testPureUrl.pathname('/');
        expect(testPureUrl.path()).toBe('/?k1=v1&k2=v2');
    });

    test('when set pathname with falsy then clear pathname but keep search', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        testPureUrl.pathname(null);
        expect(testPureUrl.path()).toBe('?k1=v1&k2=v2');
        expect(testPureUrl.pathname()).toBeUndefined();

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        testPureUrl.pathname('');
        expect(testPureUrl.path()).toBe('?k1=v1&k2=v2');
        expect(testPureUrl.pathname()).toBeUndefined();
    });

    test('when set pathname fragments then update pathname and keep search', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.path('/part1/part2?k1=v1&k2=v2');

        testPureUrl.pathnames('a', 'b', 'c');

        expect(testPureUrl.path()).toBe('/a/b/c?k1=v1&k2=v2');
        expect(testPureUrl.pathnames()).toStrictEqual(['a', 'b', 'c']);
    });

    test('when set pathname fragments with empty value list then clear pathname but keep search', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.path('/part1/part2?k1=v1&k2=v2');

        // @ts-ignore
        testPureUrl.pathnames('  ', null, false);

        expect(testPureUrl.path()).toBe('?k1=v1&k2=v2');
        expect(testPureUrl.pathnames()).toStrictEqual([]);
    });

    test('when set search then update search and keep others', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        testPureUrl.search('?k1=new_v1&new_k2=v2');
        expect(testPureUrl.path()).toBe('/part1/part2?k1=new_v1&new_k2=v2');

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        testPureUrl.search('k1=new_v1&new_k2=v2');
        expect(testPureUrl.path()).toBe('/part1/part2?k1=new_v1&new_k2=v2');
    });

    test('when set search with falsy or blank then clear search but keep others', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        testPureUrl.search(null);
        expect(testPureUrl.path()).toBe('/part1/part2');
        expect(testPureUrl.pathname()).toBe('/part1/part2');
        expect(testPureUrl.search()).toBeUndefined();

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        testPureUrl.search('    ');
        expect(testPureUrl.path()).toBe('/part1/part2');
        expect(testPureUrl.pathname()).toBe('/part1/part2');
        expect(testPureUrl.search()).toBeUndefined();

        testPureUrl.path('/part1/part2?k1=v1&k2=v2');
        testPureUrl.search('?');
        expect(testPureUrl.path()).toBe('/part1/part2');
        expect(testPureUrl.pathname()).toBe('/part1/part2');
        expect(testPureUrl.search()).toBeUndefined();
    });

    test('when modify query then update query and search', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.path('/part1/part2?k1=v1&k2=v2');

        testPureUrl.query.set('k1', 'new_v1');
        testPureUrl.query.set('k3', 'v3');
        testPureUrl.query.remove('k1');
        testPureUrl.query.remove('k2');

        expect(testPureUrl.search()).not.toContain('k1=new_v1');
        expect(testPureUrl.search()).not.toContain('k2=v2');
        expect(testPureUrl.search()).toContain('k3=v3');
    });

    test('when set hash then update hash only', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.hash(' # ');
        expect(testPureUrl.hash()).toBeUndefined();

        testPureUrl.hash(' hash ');
        expect(testPureUrl.hash()).toBe('#hash');

        testPureUrl.hash('#hash');
        expect(testPureUrl.hash()).toBe('#hash');

        testPureUrl.hash('##hash');
        expect(testPureUrl.hash()).toBe('##hash');
    });

    test('when set hash with falsy or blank then clear hash', () => {
        const testPureUrl = createTestPureUrl();
        testPureUrl.hash('hash');

        testPureUrl.hash(null);
        expect(testPureUrl.hash()).toBeUndefined();

        testPureUrl.hash("       ");
        expect(testPureUrl.hash()).toBeUndefined();
    });

    test('when toUrlString then serialize with components', () => {
        const testPureUrl = createTestPureUrl();

        testPureUrl.hash('the_hash');
        expect(testPureUrl.toUrlString()).toBe('#the_hash');

        testPureUrl.path('/the_pathname?key=value');
        expect(testPureUrl.toUrlString()).toBe('/the_pathname?key=value#the_hash');

        testPureUrl.host('the_host');
        expect(testPureUrl.toUrlString()).toBe('//the_host/the_pathname?key=value#the_hash');

        testPureUrl.auth('the_username:the_password');
        expect(testPureUrl.toUrlString()).toBe('//the_username:the_password@the_host/the_pathname?key=value#the_hash');

        testPureUrl.protocol('the_protocol');
        expect(testPureUrl.toUrlString()).toBe('the_protocol://the_username:the_password@the_host/the_pathname?key=value#the_hash');
    });

});