import { promises as fs } from "fs"
import * as path from "path"

async function main() {
  console.log("[Build] Copying package.json ...")
  const jsonStr = await fs.readFile("package.json", "utf8")
  const json: any = JSON.parse(jsonStr)
  const pkg = {
    name: json.name,
    version: json.version,
    type: json.type,
    description: json.description,
    main: "bin.cjs",
    bin: "bin.cjs",
    engines: json.engines,
    dependencies: json.dependencies,
    peerDependencies: json.peerDependencies,
    repository: json.repository,
    author: json.author,
    license: json.license,
    bugs: json.bugs,
    homepage: json.homepage,
    tags: json.tags,
    keywords: json.keywords
  }
  await fs.mkdir("dist", { recursive: true })
  await fs.writeFile(path.join("dist", "package.json"), JSON.stringify(pkg, null, 2), "utf8")
  console.log("[Build] Build completed.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
