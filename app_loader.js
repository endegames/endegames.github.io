/*
        This file has been generated from a TypeScript source.
        Don't modify it manually.
    
        https://github.com/Furnyr/Dissonity/
*/

function getPath() {
    const pathname = window.location.pathname;
    const isFile = /\.[^\/]+$/.test(pathname);
    if (isFile) {
        return pathname.substring(0, pathname.lastIndexOf("/") + 1);
    }
    return pathname;
}
let baseUrl = `${window.location.protocol}//${window.location.host}${getPath()}`;
if (!baseUrl.endsWith("/"))
    baseUrl += "/";
let outsideDiscord = false;
let needsProxyPrefix = false;
let loaderPath = "Build/ngs_project-08_lifesim.loader.js";
const proxyBridgeImport = "dso_proxy_bridge/";
const normalBridgeImport = "dso_bridge/";
const hirpcFileName = "dissonity_hirpc.js";
const buildVariablesFileName = "dissonity_build_variables.js";
const MOBILE = "mobile";
let initialWidth = window.innerWidth;
let initialHeight = window.innerHeight;
async function initialize() {
    async function updatePaths() {
        if (window.location.hostname.endsWith(".discordsays.com")) {
            sessionStorage.setItem("dso_outside_discord", "false");
        }
        else {
            outsideDiscord = true;
            sessionStorage.setItem("dso_outside_discord", "true");
        }
        if (outsideDiscord || window.location.pathname.startsWith("/.proxy")) {
            sessionStorage.setItem("dso_needs_prefix", "false");
        }
        else {
            needsProxyPrefix = true;
            sessionStorage.setItem("dso_needs_prefix", "true");
        }
        if (needsProxyPrefix) {
            loaderPath = ".proxy/" + loaderPath;
        }
        if (outsideDiscord) {
            window.sessionStorage.setItem("dso_outside_discord", "true");
        }
        else {
            window.sessionStorage.setItem("dso_outside_discord", "false");
        }
        loaderPath = baseUrl + loaderPath;
    }
    await updatePaths();
}
async function handleHiRpc() {
    const isNested = window.parent != window.parent.parent;
    if (isNested && typeof window.parent?.dso_hirpc == "object") {
        Object.defineProperty(window, "dso_hirpc", {
            value: window.parent.dso_hirpc,
            writable: false,
            configurable: false
        });
        Object.freeze(window.dso_hirpc);
        window.dso_build_variables = window.parent.dso_build_variables;
        window.Dissonity = window.parent.Dissonity;
        initialize(window.parent.dso_hirpc, true);
        return;
    }
    if (typeof window.dso_hirpc == "object") {
        initialize(window.dso_hirpc, true);
        return;
    }
    await new Promise(async (resolve, _) => {
        if (needsProxyPrefix) {
            await import(`${proxyBridgeImport}${hirpcFileName}`);
            await import(`${proxyBridgeImport}${buildVariablesFileName}`);
            load();
        }
        else {
            await import(`${normalBridgeImport}${hirpcFileName}`);
            await import(`${normalBridgeImport}${buildVariablesFileName}`);
            load();
        }
        async function load() {
            const hiRpc = new window.Dissonity.HiRpc.default();
            await initialize(hiRpc, false || hiRpc.getBuildVariables().LAZY_HIRPC_LOAD);
            resolve(hiRpc);
        }
    });
    async function initialize(hiRpc, loaded) {
        hiRpc.lockHashAccess();
        if (!loaded) {
            await hiRpc.load(0);
        }
    }
}
async function handleUnityBuild() {
    const hiRpc = window.dso_hirpc;
    const query = hiRpc.getQueryObject();
    const canvas = document.querySelector("#unity-canvas");
    const defaultWidth = Number('960');
    const defaultHeight = Number('600');
    let width;
    let height;
    let autoSize = false;
    async function loadUnityBuild() {
        const loader = document.createElement("script");
        loader.setAttribute("src", loaderPath);
        loader.setAttribute("type", "text/javascript");
        const loaderPromise = new Promise(resolve => {
            loader.addEventListener("load", resolve);
        });
        document.head.appendChild(loader);
        await loaderPromise;
    }
    function handleResolution() {
        const RESOLUTION_TYPE = {
            Default: 1,
            Viewport: 2,
            Dynamic: 3,
            Max: 4
        };
        let viewportWidth = "[[[ WIDTH ]]] 960§";
        let viewportHeight = "[[[ HEIGHT ]]] 600§";
        let desktopResolution = "[[[ DESKTOP_RESOLUTION ]]] 4§";
        let mobileResolution = "[[[ MOBILE_RESOLUTION ]]] 4§";
        let browserResolution = "[[[ BROWSER_RESOLUTION ]]] 3§";
        let resolution;
        viewportWidth = Number(parseVariable(viewportWidth));
        viewportHeight = Number(parseVariable(viewportHeight));
        desktopResolution = Number(parseVariable(desktopResolution));
        mobileResolution = Number(parseVariable(mobileResolution));
        browserResolution = Number(parseVariable(browserResolution));
        if (outsideDiscord)
            resolution = browserResolution;
        if (query.platform == MOBILE || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            if (!resolution)
                resolution = mobileResolution;
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
            document.getElementsByTagName('head')[0].appendChild(meta);
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.position = "fixed";
            document.body.style.textAlign = "left";
        }
        else if (!resolution) {
            resolution = desktopResolution;
        }
        switch (resolution) {
            case RESOLUTION_TYPE.Default: {
                width = defaultWidth;
                height = defaultHeight;
                break;
            }
            case RESOLUTION_TYPE.Viewport: {
                width = viewportWidth;
                height = viewportHeight;
                break;
            }
            case RESOLUTION_TYPE.Dynamic: {
                autoSize = true;
                break;
            }
            case RESOLUTION_TYPE.Max: {
                width = initialWidth;
                height = initialHeight;
                setRatio();
                window.dso_expand_canvas = () => {
                    width = window.innerWidth;
                    height = window.innerHeight;
                    setRatio();
                };
            }
        }
        if (!autoSize) {
            setRatio();
            window.addEventListener("resize", () => {
                setRatio();
            });
        }
    }
    function parseVariable(variable) {
        const raw = variable.split("]]] ")[1].slice(0, -1);
        return raw;
    }
    function setRatio() {
        canvas.width = width;
        canvas.height = height;
        const aspectRatio = canvas.width / canvas.height;
        let newWidth = window.innerWidth;
        let newHeight = window.innerHeight;
        if (newWidth / newHeight > aspectRatio) {
            newWidth = newHeight * aspectRatio;
        }
        else {
            newHeight = newWidth / aspectRatio;
        }
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
    }
    let background = "#000000";
    if (background != "#000000") {
        background = needsProxyPrefix
            ? "url('.proxy/" + background
            : "url('" + background;
    }
    canvas.style.background = background;
    await loadUnityBuild();
    handleResolution();
    const USE_THREADS = /true|1/i.test("false");
    const USE_WASM = /true|1/i.test("true");
    const MEMORY_FILENAME = /true|1/i.test("");
    const SYMBOLS_FILENAME = /true|1/i.test("");
    const dataUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/ngs_project-08_lifesim.data` : `${baseUrl}Build/ngs_project-08_lifesim.data`;
    const frameworkUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/ngs_project-08_lifesim.framework.js` : `${baseUrl}Build/ngs_project-08_lifesim.framework.js`;
    let workerUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/` : `${baseUrl}Build/`;
    let codeUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/ngs_project-08_lifesim.wasm` : `${baseUrl}Build/ngs_project-08_lifesim.wasm`;
    let memoryUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/` : `${baseUrl}Build/`;
    let symbolsUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/` : `${baseUrl}Build/`;
    if (!USE_THREADS)
        workerUrl = undefined;
    if (!USE_WASM)
        codeUrl = undefined;
    if (!MEMORY_FILENAME)
        memoryUrl = undefined;
    if (!SYMBOLS_FILENAME)
        symbolsUrl = undefined;
    const companyName = '"NGS Studios"'.replace('"', "");
    const productName = '"New Town"'.replace('"', "");
    const productVersion = '"0.1.0"'.replace('"', "");
    createUnityInstance(canvas, {
        dataUrl,
        frameworkUrl,
        streamingAssetsUrl: "StreamingAssets",
        workerUrl,
        codeUrl,
        memoryUrl,
        symbolsUrl,
        companyName,
        productName,
        productVersion,
        matchWebGLToCanvasSize: autoSize,
    });
}
(async () => {
    await initialize();
    await handleHiRpc();
    await handleUnityBuild();
})();
export {};
