const dryRun = process.argv.includes("--dry-run");
const { name, version } = await Bun.file("package.json").json();
const tag = `v${version}`;
const registryUrl = `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`;

function run(command: string[]) {
	console.log(`$ ${command.join(" ")}`);
	if (!dryRun && !Bun.spawnSync(command, { stdio: ["inherit", "inherit", "inherit"] }).success) process.exit(1);
}

run(["git", "diff", "--quiet"]);
run(["git", "diff", "--cached", "--quiet"]);

const tagExists = Bun.spawnSync(["git", "rev-parse", "--verify", "--quiet", `refs/tags/${tag}`]).success;
if (tagExists) throw new Error(`${tag} already exists`);
if (dryRun) {
	console.log(`$ bun publish --access public\n$ git tag -a ${tag} -m ${tag}\n$ git push origin HEAD\n$ git push origin ${tag}\n$ gh release create ${tag} --generate-notes`);
	process.exit(0);
}

if (!(await fetch(registryUrl)).ok) {
	run(["bun", "publish", "--access", "public"]);
	for (let attempt = 0; attempt < 5 && !(await fetch(registryUrl)).ok; attempt++) {
		await Bun.sleep(2_000);
	}
	if (!(await fetch(registryUrl)).ok) throw new Error(`${name}@${version} was not published`);
}

run(["git", "tag", "-a", tag, "-m", tag]);
run(["git", "push", "origin", "HEAD"]);
run(["git", "push", "origin", tag]);
run(["gh", "release", "create", tag, "--generate-notes"]);
