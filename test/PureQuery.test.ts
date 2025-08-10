import {PureQuery} from '../src/index'

describe('UrlQuery', () => {
    function createTestPureQuery() {
        return new PureQuery();
    }

    test('when create a new UrlQuery with nothing then all are empty', () => {
        const testPureQuery = new PureQuery();

        expect(testPureQuery.isEmpty()).toBe(true);
        expect(testPureQuery.keys().length).toBe(0);
        expect(testPureQuery.toUrlString()).toBe('');
    });

    test('when create with qstring then add the keys with origin value', () => {
        const testPureQuery = new PureQuery('a=500%25&b=400&b=500');

        expect(testPureQuery.get("a")).toEqual('500%25');
        expect(testPureQuery.getAll("b")).toContain('400');
        expect(testPureQuery.getAll("b")).toContain('500');
    });

    test('when create with decode then add the keys with decoded value', () => {
        const testPureQuery = new PureQuery('a=500%25&b=400&b=500', true);

        expect(testPureQuery.get("a")).toEqual('500%');
        expect(testPureQuery.getAll("b")).toContain('400');
        expect(testPureQuery.getAll("b")).toContain('500');
    });

    test('when the key exit then true is returned', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.set("exist", 200);

        expect(testPureQuery.has("exist")).toBe(true);
    });

    test('when check a non-exist key then get false', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.set("exist", 200);

        expect(testPureQuery.has("non-exist")).toBe(false);
    });

    test('when get a exist key then get the value of the key', () => {
        const testPureQuery = createTestPureQuery();

        testPureQuery.set("exist", 200);

        expect(testPureQuery.get("exist")).toBe(200);
    });

    test('when get a non-exist key then get undefined', () => {
        const testPureQuery = createTestPureQuery();

        testPureQuery.set("exist", 200);

        expect(testPureQuery.get("non-exist")).toBeUndefined();
    });

    test('when set falsy to a key then a empty string is added', () => {
        const testPureQuery = createTestPureQuery();

        testPureQuery.set("a", null);

        expect(testPureQuery.get("a")).toBe('');
        expect(testPureQuery.toUrlString()).toBe('a=');
    });

    test('when set with a single value then replace the origin value with the value', () => {
        const testPureQuery = createTestPureQuery();

        testPureQuery.set("a", 200);
        testPureQuery.set("a", 300);

        expect(testPureQuery.get("a")).toBe(300);
    });

    test('when set with multi values then replace the origin value with array', () => {
        const testPureQuery = createTestPureQuery();

        testPureQuery.set("a", 200);
        testPureQuery.set("a", 200, 300);

        expect(testPureQuery.getAll("a")).toEqual([200, 300]);
    });

    test('when add value to a exist key then add the new value to the key', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.set("a", 200);

        testPureQuery.add("a", 300);

        expect(testPureQuery.getAll("a")).toEqual([200, 300]);
    });

    test('when add value to a non-exist key then create the key and add the value to the key', () => {
        const testPureQuery = createTestPureQuery();

        testPureQuery.add("a", 200);
        testPureQuery.add("a", 300);

        expect(testPureQuery.getAll("a")).toEqual([200, 300]);
    });

    test('when add same value to the key then the last value is ignored', () => {
        const testPureQuery = createTestPureQuery();

        testPureQuery.add("a", 200);
        testPureQuery.add("a", 300);
        testPureQuery.add("a", 300);

        expect(testPureQuery.getAll("a")).toEqual([200, 300]);
    });

    test('[addIfNotExist]when add value to a exist key then do nothing', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.set("a", 200);

        testPureQuery.addIfNotExist("a", 300);

        expect(testPureQuery.getAll("a")).toEqual([200]);
    });

    test('[addIfNotExist]when add value to a non-exist key then create the key and add the value to the key', () => {
        const testPureQuery = createTestPureQuery();

        testPureQuery.addIfNotExist("a", 200);
        testPureQuery.addIfNotExist("a", 300);

        expect(testPureQuery.getAll("a")).toEqual([200]);
    });

    test('when remove a key then delete the key', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.set("a", 200);

        testPureQuery.remove("a");

        expect(testPureQuery.has("a")).toBe(false);
    });

    test('when clear then delete all keys', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.set("a", 200);
        testPureQuery.set("b", 300);

        testPureQuery.clear();

        expect(testPureQuery.has("a")).toBe(false);
        expect(testPureQuery.has("b")).toBe(false);
    });

    test('when merge with qstring then replace the matched keys', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.set("a", 200, 300, 400);
        testPureQuery.set("c", 500);

        testPureQuery.merge('a=500%25&b=400');

        expect(testPureQuery.get("a")).toEqual('500%25');
        expect(testPureQuery.get("b")).toEqual('400');
        expect(testPureQuery.get("c")).toEqual(500);
    });

    test('when merge with decode then replace the matched keys with decoded value', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.set("a", 200, 300, 400);

        testPureQuery.merge('a=500%25&b=400', true);

        expect(testPureQuery.get("a")).toEqual('500%');
        expect(testPureQuery.get("b")).toEqual('400');
    });

    test('when merge with another UrlQuery then replace the matched keys', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.set("a", 300, 400);
        testPureQuery.set("c", 500);
        const anotherUrlQuery = new PureQuery();
        anotherUrlQuery.add("a", 100);
        anotherUrlQuery.add("b", 200);

        testPureQuery.merge(anotherUrlQuery);

        expect(testPureQuery.get("a")).toEqual(100);
        expect(testPureQuery.get("b")).toEqual(200);
        expect(testPureQuery.get("c")).toEqual(500);
    });

    test('when toUrlString() then serialize the query object', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.add("a", '200%25');
        testPureQuery.add("a", '300');
        testPureQuery.add("a", '400');
        testPureQuery.add("b", '400%25');

        const qstring = testPureQuery.toUrlString();

        expect(qstring).toContain('a=200%25');
        expect(qstring).toContain('a=300');
        expect(qstring).toContain('a=400');
        expect(qstring).toContain('b=400%25');
    });

    test('when toUrlString(true) then serialize the query object and encode values', () => {
        const testPureQuery = createTestPureQuery();
        testPureQuery.add("a", '200%25');
        testPureQuery.add("a", '300');
        testPureQuery.add("a", '400');
        testPureQuery.add("b", '400%25');

        const qstring = testPureQuery.toUrlString(true);

        expect(qstring).toContain('a=200%');
        expect(qstring).toContain('a=300');
        expect(qstring).toContain('a=400');
        expect(qstring).toContain('b=400%');
    });

    describe('addAll', () => {
        test('when addAll with object then add all key-value pairs', () => {
            const testPureQuery = createTestPureQuery();
            
            testPureQuery.addAll({
                a: 100,
                b: 200,
                c: 300
            });

            expect(testPureQuery.get('a')).toBe(100);
            expect(testPureQuery.get('b')).toBe(200);
            expect(testPureQuery.get('c')).toBe(300);
        });

        test('when addAll with object containing arrays then add all values for each key', () => {
            const testPureQuery = createTestPureQuery();
            
            testPureQuery.addAll({
                a: [100, 200],
                b: 300,
                c: [400, 500, 600]
            });

            expect(testPureQuery.getAll('a')).toEqual([100, 200]);
            expect(testPureQuery.get('b')).toBe(300);
            expect(testPureQuery.getAll('c')).toEqual([400, 500, 600]);
        });

        test('when addAll with array of tuples then add all key-value pairs', () => {
            const testPureQuery = createTestPureQuery();
            
            testPureQuery.addAll([
                ['a', 100],
                ['b', 200],
                ['c', 300]
            ]);

            expect(testPureQuery.get('a')).toBe(100);
            expect(testPureQuery.get('b')).toBe(200);
            expect(testPureQuery.get('c')).toBe(300);
        });

        test('when addAll with array of tuples containing arrays then add all values for each key', () => {
            const testPureQuery = createTestPureQuery();
            
            testPureQuery.addAll([
                ['a', [100, 200]],
                ['b', 300],
                ['c', [400, 500]]
            ]);

            expect(testPureQuery.getAll('a')).toEqual([100, 200]);
            expect(testPureQuery.get('b')).toBe(300);
            expect(testPureQuery.getAll('c')).toEqual([400, 500]);
        });

        test('when addAll to existing keys then append values correctly', () => {
            const testPureQuery = createTestPureQuery();
            testPureQuery.set('a', 100);
            testPureQuery.set('b', 200);
            
            testPureQuery.addAll({
                a: 300,
                c: 400
            });

            expect(testPureQuery.getAll('a')).toEqual([100, 300]);
            expect(testPureQuery.get('b')).toBe(200);
            expect(testPureQuery.get('c')).toBe(400);
        });

        test('when addAll with duplicate values then ignore duplicates', () => {
            const testPureQuery = createTestPureQuery();
            
            testPureQuery.addAll({
                a: [100, 200, 100],
                b: 200
            });

            expect(testPureQuery.getAll('a')).toEqual([100, 200]);
            expect(testPureQuery.get('b')).toBe(200);
        });

        test('when addAll with empty object then do nothing', () => {
            const testPureQuery = createTestPureQuery();
            
            testPureQuery.addAll({});

            expect(testPureQuery.isEmpty()).toBe(true);
        });

        test('when addAll with empty array then do nothing', () => {
            const testPureQuery = createTestPureQuery();
            
            testPureQuery.addAll([]);

            expect(testPureQuery.isEmpty()).toBe(true);
        });

        test('when addAll returns instance then allow method chaining', () => {
            const testPureQuery = createTestPureQuery();
            
            const result = testPureQuery.addAll({a: 100}).add('b', 200);

            expect(result).toBe(testPureQuery);
            expect(testPureQuery.get('a')).toBe(100);
            expect(testPureQuery.get('b')).toBe(200);
        });
    });
});