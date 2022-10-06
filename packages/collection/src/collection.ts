export class Collection<K, V> extends Map<K, V> {
	constructor(
		public readonly object?: Object | Map<K, V> | Record<any, V> | Collection<K, V> | Array<V>,
		public limit?: number,
	) {
		super();
		if (object) this.merge(object);
	}

	public add(key: K, value: V, replace: boolean = true): this | false {
		if (!key) throw new SyntaxError('Unique Key has not been Provided');
		else if (this.limit && this.limit <= Array.from(this.values()).length) {
			let fKey = this.firstKey;
			if (!(fKey && this.delete(fKey))) return false;
		}
		if (replace || !this.has(key)) this.set(key, value);
		else return false;
		return this;
	}

	public filter(func: (value: V, key: K, collection: this) => unknown): Collection<K, V> {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		const results: Collection<K, V> = new this.constructor[Symbol.species]<K, V>();
		for (const [k, v] of this) {
			if (func(v, k, this)) results.set(k, v);
		}
		return results;
	}

	public find(func: (value: V, key: K, collection: this) => unknown): V | undefined {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		for (const [k, v] of this) {
			if (func(v, k, this)) return v;
		}
		return undefined;
	}

	public findKey(func: (value: V, key: K, collection: this) => unknown): K | undefined {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		for (const [k, v] of this) {
			if (func(v, k, this)) return k;
		}
		return undefined;
	}

	public every(func: (value: V, key: K, collection: this) => unknown): boolean {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		for (const [k, v] of this) {
			if (!func(v, k, this)) return false;
		}
		return true;
	}

	public random(amount: number = 1, unique: boolean = false): Collection<K, V> {
		if (!(amount && typeof amount === 'number'))
			throw new TypeError('Invalid Amount Type is Detected');
		else if (!(amount > 0 && amount <= this.size)) amount = Math.floor(this.size / 2);
		let nMap = new Collection<K, V>(),
			rKey: K;
		while (amount < nMap.size) {
			rKey = this.toKeyArray[Math.floor(Math.random() * this.size)];
			if (rKey && !nMap.has(rKey)) nMap.set(rKey, this.get(rKey)!);
			else if (unique && rKey && nMap.has(rKey)) nMap.set(rKey, this.get(rKey)!);
		}
		return nMap;
	}

	public merge<O = Object | Map<K, V> | Record<any, V> | Collection<K, V> | Array<V>>(
		object: O,
	): this {
		let nCol = this.convert(object);
		if (nCol.size <= 0) throw new SyntaxError('Empty Collection is Detected');
		else if (nCol instanceof Collection && (nCol.limit == Infinity || this.limit === Infinity))
			this.limit = Infinity;
		else if (nCol instanceof Collection && nCol?.limit)
			this.limit = (this.limit ?? 0) + nCol.limit!;
		for (const [key, val] of nCol) {
			this.add(key, val);
		}
		return this;
	}

	public concat<O = Object | Map<K, V> | Record<any, V> | Collection<K, V> | Array<V>>(
		...object: Array<O>
	): Collection<K, V> {
		const nColl = this.clone();
		for (const coll of object) {
			for (const [key, val] of this.convert(coll)) nColl.set(key, val);
		}
		return nColl;
	}

	public equals<O = Object | Map<K, V> | Record<any, V> | Collection<K, V> | Array<V>>(
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

	public map<T>(func: (value: V, key: K, collection: this) => T, thisArgs?: unknown): T[] {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		const iter = this.entries();
		return Array.from({ length: this.size }, (): T => {
			const [key, value] = iter.next().value;
			return func(value, key, this);
		});
	}

	public mapValues<T>(func: (value: V, key: K, collection: this) => T, thisArgs?: unknown) {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (typeof thisArgs !== 'undefined') func = func.bind(thisArgs);
		const coll = new this.constructor[Symbol.species]<K, T>();
		for (const [key, val] of this) coll.set(key, func(val, key, this));
		return coll;
	}

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

	public reduce<T>(
		func: (accumulator: T, value: V, key: K, collection: this) => T,
		initialValue?: T,
	): T {
		if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
		else if (!this.first) throw new TypeError(`No Elements present in Collection!`);
		let accumulator = initialValue;
		for (const [key, val] of this) accumulator = func(accumulator! as T, val, key, this);
		return accumulator as T;
	}

	public hasAny(...keys: Array<K>): boolean {
		return keys.some((key) => super.has(key));
	}

	public hasAll(...keys: Array<K>): boolean {
		return keys.every((key) => super.has(key));
	}

	public clone<O = Object | Map<K, V> | Record<any, V> | Collection<K, V> | Array<V>>(
		object: O | this = this,
	): Collection<K, V> {
		return new this.constructor[Symbol.species](this.convert(object));
	}

	public convert<O = Object | Map<K, V> | Record<any, V> | Collection<K, V> | Array<V>>(
		object: O,
	): Collection<K, V> {
		if (!object) throw new TypeError('Object Value must be a Record or Something Close');
		let nColl = new Collection<K, V>();
		if (Array.isArray(object)) object.forEach((obj: V, index) => nColl.set(index as K, obj));
		else if (object instanceof Map)
			Array.from(object.keys()).forEach((key: K) => nColl.set(key, object.get(key)));
		else if (typeof object === 'object')
			Object.entries(object).forEach((arr) => nColl.set(arr?.[0] as K, arr?.[1] as V));
		return nColl as Collection<K, V>;
	}

	public toMap(collection: Collection<K, V> = this): Map<K, V> {
		let nMap = new Map<K, V>();
		for (const [key, val] of collection) {
			if (['number', 'string', 'symbol'].includes(typeof key)) nMap.set(key, val);
		}
		return nMap;
	}

	public toObject(collection: Collection<K, V> = this): Record<string, V> | Object {
		let nObj = {};
		for (const [key, val] of collection) {
			if (['number', 'string', 'symbol'].includes(typeof key)) nObj[`${key}`] = val;
		}
		return nObj;
	}

	public get first(): V | undefined {
		return this.toArray.shift();
	}

	public get firstKey(): K | undefined {
		return this.toKeyArray.shift();
	}

	public get last(): V | undefined {
		return this.toArray.pop();
	}

	public get lastkey(): K | undefined {
		return this.toKeyArray.pop();
	}

	public get toArray(): Array<V> {
		return Array.from(this.values());
	}

	public get toKeyArray(): Array<K> {
		return Array.from(this.keys());
	}
}
