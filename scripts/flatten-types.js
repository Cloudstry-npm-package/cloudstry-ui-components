const fs = require("fs");
const path = require("path");

const root = "dist/types";
const componentsDir = path.join(root, "components");

// 1. Flatten component folders: dist/types/components/<name>/index.d.ts → dist/types/<name>.d.ts
if (fs.existsSync(componentsDir)) {
    const components = fs.readdirSync(componentsDir);

    components.forEach((name) => {
        const indexPath = path.join(componentsDir, name, "index.d.ts");
        if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, path.join(root, `${name}.d.ts`));
            console.log(`Flattened component: ${name}.d.ts`);
        }
    });
}

const topLevelTypes = ["index", "button", "input", "passwordField", "searchField", "select", "otp", "footer", "table", "ssr"];

topLevelTypes.forEach((entry) => {
    const possiblePaths = [
        path.join(root, `${entry}.d.ts`), // direct output from tsc
        path.join(root, "components", entry, "index.d.ts"), // fallback
    ];

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            const out = path.join(root, `${entry}.d.ts`);
            if (p !== out) fs.copyFileSync(p, out);
            console.log(`Verified top-level: ${entry}.d.ts`);
            break;
        }
    }
});
