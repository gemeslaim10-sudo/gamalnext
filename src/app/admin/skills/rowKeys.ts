// Stable React keys for list items that have no id of their own, so a row keeps its inputs and focus
// while it's typed in or moved up and down. An edited item (a new object) takes over the key of the
// item it replaces.

const keys = new WeakMap<object, number>();
let lastKey = 0;

export function rowKey(item: object) {
    let key = keys.get(item);
    if (key === undefined) {
        key = ++lastKey;
        keys.set(item, key);
    }
    return key;
}

export function inheritRowKey<T extends object>(previous: object, next: T): T {
    keys.set(next, rowKey(previous));
    return next;
}

/** Focuses an element once React has shown it (e.g. the first box of a row that was just added). */
export function focusSoon(id: string) {
    requestAnimationFrame(() => document.getElementById(id)?.focus());
}
