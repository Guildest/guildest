/**
 * Represents The Collection of Data extended from Map and with Custom Functions and Getter Methods.
 * @example new Collection<K,V>({ "foo" : "bar" } , 10)
 */
export class Collection<K extends string | number | symbol, V> extends Map<K, V> {
	/**
	 * @param object The Base Values to Merge with Collection.
	 * @param maxLimit The Max maxLimit of the Collection Item to Store.
	 */
	constructor(
		public readonly object?: Object | Map<K, V> | Record<K, V> | Collection<K, V> | Array<V>,
		public maxLimit?: number,
	) {
		super();
		if (object) this.merge(object);
	}

	/**
	 * Add Values with respect to Key in Collection.
	 * @param key Unique Key or Id to add value in Collection.
	 * @param value The Value for pointing to the Key in Collection.
	 * @param replace Replace Old Value if existing Key found with different Value is found.
	 * @returns Updated Collection or false on run-time error.
	 * @example Collection.add("foo" , "bar2" , true)
	 */

	public add(key: K, value: V, replace: boolean = true): this | false {
		if (!key) throw new SyntaxError('Unique Key has not been Provided');
		else if (this.maxLimit && this.maxLimit <= this.size) this.limit();
		if (!this.has(key) || (replace && this.get(key) !== value)) this.set(key, value);
		else if (this.get(key) !== value) return false;
		return this;
	}

	/**
	 * Filter Function like Array.filter() in Collection.
	 * @param func Array Filter Function like Array.filter(function) for Filtering Collection Items based on given Function.
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @example Collection.filter((value , key , collection) => value)
	 */

	public filter(
		func: (value: V, key: K, collection: this) => unknown,
		thisArgs?: unknown,
	): Collection<K, V> {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		const results: Collection<K, V> = new this.constructor[Symbol.species]<K, V>();
		for (const [k, v] of this) {
			if (func(v, k, this)) results.set(k, v);
		}
		return results;
	}

	/**
	 * Find Item Function like Array.find() in Collection.
	 * @param func Array Find Function like Array.find(function) for Checking Collection Items based on given Function.
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @returns Value in Collection associated with Key.
	 * @example Collection.find((value , key , collection) => value)
	 */

	public find(
		func: (value: V, key: K, collection: this) => unknown,
		thisArgs?: unknown,
	): V | undefined {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		for (const [k, v] of this) {
			if (func(v, k, this)) return v;
		}
		return undefined;
	}

	/**
	 * Find Item key Function like Array.find() in Collection But Returns Key.
	 * @param func Array Find Function like Array.find(function) for Checking Collection Items based on given Function.
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @returns Key of the verified Item from function.
	 * @example Collection.findKey((value , key , collection) => value)
	 */

	public findKey(
		func: (value: V, key: K, collection: this) => unknown,
		thisArgs?: unknown,
	): K | undefined {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		for (const [k, v] of this) {
			if (func(v, k, this)) return k;
		}
		return undefined;
	}

	/**
	 * Check If Every Item satisfy the Function like Array.every() in Collection.
	 * @param func Array Every Function like Array.every(function) for Checking Collection Items based on given Function.
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @returns Key of the verified Item from function.
	 * @example Collection.every((value , key , collection) => value)
	 */

	public every(
		func: (value: V, key: K, collection: this) => unknown,
		thisArgs?: unknown,
	): boolean {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		for (const [k, v] of this) {
			if (!func(v, k, this)) return false;
		}
		return true;
	}

	/**
	 * Get Collection of Random Items from Collection.
	 * @param amount Amount of Items to Collect from Collection.
	 * @param unique If Random Items should be Unique and not repeated.
	 * @returns Collection of Random Items from Collection
	 * @example Collection.random(10 , true)
	 */

	public random(amount: number = 1, unique: boolean = false): Collection<K, V> {
		if (!(amount && typeof amount === 'number'))
			throw new TypeError('Invalid Amount Type is Detected');
		else if (!(amount > 0 && amount <= this.size)) amount = Math.floor(this.size / 2);
		let nMap: Collection<K, V> = new this.constructor[Symbol.species]<K, V>(),
			rKey: K;
		while (amount < nMap.size) {
			rKey = this.toKeyArray[Math.floor(Math.random() * this.size)];
			if (rKey && !nMap.has(rKey)) nMap.set(rKey, this.get(rKey)!);
			else if (unique && rKey && nMap.has(rKey)) nMap.set(rKey, this.get(rKey)!);
		}
		return nMap;
	}

	/**
	 * Merge new Collection or Collection Resolve with Existing Collection.
	 * @param object Amount of Items to Collect from Collection.
	 * @returns Existing Collection with Merged new Collection Items.
	 * @example Collection.merge({ "foo" : "bar" })
	 */

	public merge<O = Object | Map<K, V> | Record<K, V> | Collection<K, V> | Array<V>>(
		object: O,
	): this {
		let nCol = this.convert(object);
		if (nCol.size <= 0) throw new SyntaxError('Empty Collection is Detected');
		else if (nCol.maxLimit === Infinity || this.maxLimit === Infinity) this.maxLimit = Infinity;
		else if (typeof nCol?.maxLimit === 'number')
			this.maxLimit = (this.maxLimit ?? 0) + nCol.maxLimit!;
		else if (typeof this?.maxLimit === 'number') this.maxLimit = this.size + nCol.size!;
		for (const [key, val] of nCol) {
			this.add(key, val);
		}
		return this;
	}

	/**
	 * Concat Collection's Resolves with Existing Collection.
	 * @param objects Array of Collection's Resolves to Concat to Collection.
	 * @returns Existing Collection with Concated with Array of Collection's Resolves.
	 * @example Collection.concat({ "foo" : "bar" })
	 */

	public concat<O = Object | Map<K, V> | Record<K, V> | Collection<K, V> | Array<V>>(
		...objects: Array<O>
	): Collection<K, V> {
		const nColl = this.clone();
		for (const coll of objects) {
			for (const [key, val] of this.convert(coll)) nColl.set(key, val);
		}
		return nColl;
	}

	/**
	 * Check if Key and Values of Existing Collection's Resolves are equal to Existing Collection.
	 * @param object Collection's Resolves to Check for Equals with Collection.
	 * @returns Returns true if Collection's Resolves are equal to Existing Collection or false.
	 * @example Collection.equals({ "foo" : "bar" })
	 */

	public equals<O = Object | Map<K, V> | Record<K, V> | Collection<K, V> | Array<V>>(
		object: O,
	): boolean {
		let coll = this.convert(object);
		if (this === coll) return true;
		else if (this.size !== coll.size) return false;
		for (const [key, value] of this) {
			if (!coll.has(key) || value !== coll.get(key)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Sweeping Items from Collection on Function getting true response.
	 * @param func Function for Checking if Item should be delete.
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @returns Numbers of Items Sweeped in the Process.
	 * @example Collection.sweep((value , key , collection) => value)
	 */

	public sweep(
		func: (value: V, key: K, collection: this) => unknown,
		thisArgs?: unknown,
	): number {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		const pSize = this.size;
		for (const [key, val] of this) {
			if (func(val, key, this)) this.delete(key);
		}
		return pSize - this.size;
	}

	/**
	 * Making Partition of Items from Collection on Boolean Response.
	 * @param func Function for Checking if Item for Boolean Response based Partition.
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @returns Array of Boolean Based Collection Partition without Affecting existing Collection
	 * @example Collection.partition((value , key , collection) => value)
	 */

	public partition(
		func: (value: V, key: K, collection: this) => unknown,
		thisArgs?: unknown,
	): [Collection<K, V>, Collection<K, V>] {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		const results: [Collection<K, V>, Collection<K, V>] = [
			new this.constructor[Symbol.species]<K, V>(),
			new this.constructor[Symbol.species]<K, V>(),
		];
		for (const [key, val] of this) {
			if (func(val, key, this)) results[0].set(key, val);
			else results[1].set(key, val);
		}
		return results;
	}

	/**
	 * Mapping of Items from Collection like Array.map().
	 * @param func Array Map Function like Array.map(function) for Mapping Collection Items based on given Function.
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @returns Array of Items after Mapping of Collection Items.
	 * @example Collection.map((value , key , collection) => value)
	 */

	public map<T>(func: (value: V, key: K, collection: this) => T, thisArgs?: unknown): T[] {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		const iter = this.entries();
		return Array.from({ length: this.size }, (): T => {
			const [key, value] = iter.next().value;
			return func(value, key, this);
		});
	}

	/**
	 * Mapping Values of Items to dummy Collection from Existing Collection like Array.map().
	 * @param func Array Map Function like Array.map(function) for Mapping Collection Items based on given Function.
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @returns Collection of Return Values from mapping the Existing Collection.
	 * @example Collection.mapValues((value , key , collection) => value)
	 */

	public mapValues<T>(
		func: (value: V, key: K, collection: this) => T,
		thisArgs?: unknown,
	): Collection<K, T> {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		const coll = new this.constructor[Symbol.species]<K, T>();
		for (const [key, val] of this) coll.set(key, func(val, key, this));
		return coll;
	}

	/**
	 * Checking Some Values of Items from Existing Collection like Array.some().
	 * @param func Array Some Function like Array.some(function) for Checking Collection Items based on given Function.
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @returns Return Boolean on Checking Operation of Values in Collection
	 * @example Collection.some((value , key , collection) => value)
	 */

	public some(
		func: (value: V, key: K, collection: this) => unknown,
		thisArgs?: unknown,
	): boolean {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		for (const [key, val] of this) {
			if (func(val, key, this)) return true;
		}
		return false;
	}

	/**
	 * Reducing of Items from Existing Collection like Array.reduce().
	 * @param func Array Reduce Function like Array.reduce(function) for Reducing Collection Items based on given Function.
	 * @param initialValue Initial Value to Start Reduce Function like Array.reduce().
	 * @param thisArgs Function Extra Arguments bind to function if needed.
	 * @returns Final Accumulator Value from the Function on Exisitng Collection.
	 * @example Collection.reduce((value , key , collection) => value)
	 */

	public reduce<T>(
		func: (accumulator: T, value: V, key: K, collection: this) => T,
		initialValue?: T,
		thisArgs?: unknown,
	): T {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (!this.first) throw new TypeError(`No Elements present in Collection!`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		let accumulator = initialValue;
		for (const [key, val] of this) accumulator = func(accumulator! as T, val, key, this);
		return accumulator as T;
	}

	/**
	 * Check if Collection got any Key from the Series of Keys
	 * @param keys Array of keys for Check
	 * @returns Boolean Response on check operation on keys existent on Collection keys
	 * @example Collection.hasAny("abc")
	 */

	public hasAny(...keys: Array<K>): boolean {
		return keys.some((key) => super.has(key));
	}

	/**
	 * Check if Collection got All Key from the Series of Keys
	 * @param keys Array of keys for Check
	 * @returns Boolean Response on check operation on keys existent on Collection keys
	 * @example Collection.hasAll("abc")
	 */

	public hasAll(...keys: Array<K>): boolean {
		return keys.every((key) => super.has(key));
	}

	/**
	 * A Shallow Clone or Copy of Collection with no Points
	 * @param object Collection Resolve Data for Cloning
	 * @returns Cloned Collection from Operation
	 * @example Collection.clone()
	 */

	public clone<O = Object | Map<K, V> | Record<K, V> | Collection<K, V> | Array<V>>(
		object: O | this = this,
	): Collection<K, V> {
		return new this.constructor[Symbol.species](this.convert(object));
	}

	/**
	 * Convert Collection Reolves to Actual Collection to Support Multi Collection Alternatives Types
	 * @param object Collection Resolve Data for Parsing or to be Resolved
	 * @returns Collection from Operation
	 * @example Collection.convert({ "foo" : "bar" })
	 */

	public convert<O = Object | Map<K, V> | Record<K, V> | Collection<K, V> | Array<V>>(
		object: O,
	): Collection<K, V> {
		if (!object) throw new TypeError('Object Value must be a Record or Something Close');
		let nColl: Collection<K, V> = new this.constructor[Symbol.species]<K, V>();
		if (Array.isArray(object)) object.forEach((obj: V, index) => nColl.set(index as K, obj));
		else if (object instanceof Map)
			Array.from(object.keys()).forEach((key: K) => nColl.set(key, object.get(key)));
		else if (typeof object === 'object')
			Object.entries(object).forEach((arr) => nColl.set(arr?.[0] as K, arr?.[1] as V));
		return nColl as Collection<K, V>;
	}

	/**
	 * Removing and Maintaining the Collection Amount as per Limit with Collection.
	 * @param amount Amount of Items to Remove from Collection
	 * @returns Collection of Removed Items or undefined if no items has been Limited.
	 * @example Collection.limit(100)
	 */

	public limit(amount: number = this.maxLimit!): Collection<K, V> | false {
		if (amount > this.size) return false;
		let nColl: Collection<K, V> = new this.constructor[Symbol.species]<K, V>();
		for (const [key, value] of this) {
			if (nColl.size >= amount) break;
			nColl.set(key, value);
			this.delete(key);
		}
		return nColl;
	}

	/**
	 * Convert Collection to Map Type with supported properties
	 * @param collection Collection Instance
	 * @returns map Type Data after Conversion
	 * @example Collection.toMap()
	 */

	public toMap(collection: Collection<K, V> = this): Map<K, V> {
		let nMap = new Map<K, V>();
		for (const [key, val] of collection) {
			if (['number', 'string', 'symbol'].includes(typeof key)) nMap.set(key, val);
		}
		return nMap;
	}

	/**
	 * Convert Collection to object or Record Type with supported properties
	 * @param collection Collection Instance
	 * @returns object or Record Type Data after Conversion
	 * @example Collection.toObject()
	 */

	public toObject(collection: Collection<K, V> = this): Record<string, V> | Object {
		let nObj = {};
		for (const [key, val] of collection) {
			if (['number', 'string', 'symbol'].includes(typeof key))
				nObj[typeof key === 'number' ? Number(key) : String(key)] = val;
		}
		return nObj;
	}

	/** First Value in Collection. */
	public get first(): V | undefined {
		return this.toArray.shift();
	}

	/** First key in Collection. */
	public get firstKey(): K | undefined {
		return this.toKeyArray.shift();
	}

	/** Last Value in Collection. */
	public get last(): V | undefined {
		return this.toArray.pop();
	}

	/** Last key in Collection. */
	public get lastkey(): K | undefined {
		return this.toKeyArray.pop();
	}

	/** Array Conversion from Collection. */
	public get toArray(): Array<V> {
		return Array.from(this.values());
	}

	/** keys Array Conversion from Collection. */
	public get toKeyArray(): Array<K> {
		return Array.from(this.keys());
	}
}
