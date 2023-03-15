import { triggerHandlers } from "trigger"
import { fill } from "utils";


let lastHref;

export function instrumentHistory() {
    // onpopstate
    const oldPopstate = window.onpopstate

    let to = window.location.href
    let from = lastHref
    lastHref = to
    triggerHandlers("history", {
        from,
        to,
    })
    
    if(oldPopstate) {
        try {
            return oldPopstate.apply(window, [...arguments] as any)
        } catch (error) {
            console.log("popstate error:", error)
            triggerHandlers("exception", {
                error
            })
        }
    }

    // pushState(data, title, url)
    // replaceState(data, title, url)
    function stateReplacement(originalStateFunction) {
    
        return function(this:History) {
    
            let args = [].slice.call(arguments, 1)
            
            const [state, title, url] = args
            
            if(url) {
                let from = lastHref
                let to = url + ''
                lastHref = to;
            
                triggerHandlers("history", {
                    from,
                    to,
                    params: state
                })
            
            }
            return originalStateFunction.apply(this, args as any)
        }
    }
    
    
    fill(history, "pushState", stateReplacement)
    fill(history, "replaceState", stateReplacement)
}

