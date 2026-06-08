import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";

const extensions = [".js", ".jsx"];

// Client-entry modules whose `"use client"` boundary must survive bundling.
// Rollup strips module-level directives from output (it only warns), so we
// re-inject the directive into exactly these chunks via a per-chunk `banner`
// (sourcemap-safe). The presentational `*.base.jsx` and `*SSR.jsx` modules are
// deliberately NOT listed — they must stay directive-free for SSR.
const CLIENT_ENTRY_SUFFIXES = [
    "components/input/input.jsx",
    "components/passwordField/passwordField.jsx",
    "components/searchField/searchField.jsx",
];

const useClientBanner = (chunk) => {
    const id = (chunk.facadeModuleId || "").replace(/\\/g, "/");
    return CLIENT_ENTRY_SUFFIXES.some((suffix) => id.endsWith(suffix))
        ? '"use client";'
        : "";
};

export default defineConfig({
    input: {
        index: "src/index.js",
        button: "src/components/buttons/index.js",
        input: "src/components/input/index.js",
        passwordField: "src/components/passwordField/index.js",
        searchField: "src/components/searchField/index.js",
        otp: "src/components/otp/index.js",
        footer: "src/components/footer/index.js",
        table: "src/components/table/index.js",
        ssr: "src/ssr.js"
    },

    output: [
        {
            dir: "dist/esm",
            format: "esm",
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: "src",
            banner: useClientBanner
        },
        {
            dir: "dist/cjs",
            format: "cjs",
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: "src",
            exports: "named",
            banner: useClientBanner
        }
    ],

    onwarn(warning, warn) {
        if (warning.code === "THIS_IS_UNDEFINED") return;
        // We intentionally author `"use client"` in source for discoverability
        // and re-inject it into client-entry chunks via `banner` (see above),
        // so Rollup's "directive was ignored" notice is expected — silence it.
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
    },

    plugins: [
        nodeResolve({ extensions }),
        commonjs(),

        postcss({
            extensions: [".css"],
            extract: "styles.css", // FINAL stylesheet name
            minimize: false
        }),

        babel({
            extensions,
            babelHelpers: "bundled",
            include: ["src/**/*"],
            presets: [
                ["@babel/preset-env", { modules: false, targets: { esmodules: true } }],
                ["@babel/preset-react", { runtime: "automatic" }]
            ]
        })
    ],

    external: (id) => {
        // React should never be bundled
        if (id === "react" || id === "react/jsx-runtime" || id === "react-dom") {
            return true;
        }

        // Exclude EVERYTHING inside @material/web
        if (id.startsWith("@material/web")) {
            return true;
        }

        return false;
    }

});
