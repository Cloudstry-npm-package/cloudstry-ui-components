import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";

const extensions = [".js", ".jsx"];

export default defineConfig({
    input: {
        index: "src/index.js",
        button: "src/components/buttons/index.js",
        input: "src/components/input/index.js",
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
            preserveModulesRoot: "src"
        },
        {
            dir: "dist/cjs",
            format: "cjs",
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: "src",
            exports: "named"
        }
    ],

    onwarn(warning, warn) {
        if (warning.code === "THIS_IS_UNDEFINED") return;
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
