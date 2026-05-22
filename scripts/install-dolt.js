#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const VERSION = "2.0.3";

function getPlatformInfo() {
    const platform = os.platform();
    const arch = os.arch();

    const isWindows = platform == "win32";
    return {
        platformName: isWindows ? "windows" : platform,
        binaryName: isWindows ? "dolt.exe" : "dolt",
        archName: arch == "x64" ? "amd64" : arch,
    };
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        console.log(`Downloading from: ${url}`);
        const file = fs.createWriteStream(dest);

        const request = https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlinkSync(dest);
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on("finish", () => file.close((err) => (err ? reject(err) : resolve())));
        });

        request.on("error", (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
        file.on("error", (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function install() {
    const { platformName, archName, binaryName } = getPlatformInfo();

    const binDir = path.join(__dirname, "..", "bin", "dolt");
    const binaryPath = path.join(binDir, binaryName);

    if (fs.existsSync(binaryPath)) {
        console.log(`dolt binary already present at ${binaryPath}, skipping download.`);
        return;
    }

    console.log(`Installing dolt v${VERSION} for ${platformName}-${archName}...`);

    const archiveName = `dolt-${platformName}-${archName}.tar.gz`;
    const downloadUrl = `https://github.com/dolthub/dolt/releases/download/v${VERSION}/${archiveName}`;
    const archivePath = path.join(binDir, archiveName);

    fs.mkdirSync(binDir, { recursive: true });

    await downloadFile(downloadUrl, archivePath);

    console.log(`Extracting ${archiveName}...`);
    // Dolt tarballs contain a top-level dir like dolt-darwin-arm64/bin/dolt
    execSync(`tar -xzf "${archivePath}" -C "${binDir}" --strip-components=2`, { stdio: "inherit" });

    fs.unlinkSync(archivePath);

    if (os.platform() !== "win32") {
        fs.chmodSync(binaryPath, 0o755);
    }

    try {
        const out = execSync(`"${binaryPath}" version`, { encoding: "utf8" });
        console.log(`dolt installed successfully: ${out.trim()}`);
    } catch {
        console.warn("Warning: could not verify dolt binary");
    }
}

install().catch((err) => {
    console.error(`Error installing dolt: ${err.message}`);
    process.exit(1);
});
