;(function(
    _window, 
    _document,
    _namespace,
    bundle,
){
    var injected = false

    function createScript() {

        if(injected) return

        injected = true

        const currentScriptTag = _document.scripts[0]
        const newScriptTag = _document.createElement("script")

        newScriptTag.src = bundle
        newScriptTag.crossOrigin = "anonymous"

        newScriptTag.addEventListener("load", function(){
            let SDK = _window[_namespace]

            let oldInit = SDK.init

            let target

            SDK.init = function(options) {
                for (const key in options) {
                    if (Object.prototype.hasOwnProperty.call(options, key)) {
                        target[key] = options[key]
                    }
                }
                oldInit(target)
            }
        })

        currentScriptTag.parentNode.insertBefore(newScriptTag, currentScriptTag)
    }

    _window[_namespace] = _window[_namespace] || {}

    createScript()

})(window, document, "Sentry", '../dist/bundle.js')