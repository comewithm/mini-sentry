
function isGlobalObject(obj) {
    return obj && obj.Math == Math ? obj : undefined
}

export const GLOBAL_OBJ = 
    (typeof globalThis == 'object' && isGlobalObject(globalThis)) ||
    (typeof window == 'object' && isGlobalObject(window)) ||
    (typeof self == 'object' && isGlobalObject(self)) || 
    (typeof global == 'object' && isGlobalObject(global)) ||
    (function(this:any){ return this })() ||
    {};

export const WINDOW = GLOBAL_OBJ