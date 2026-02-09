#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";

function run(command) {
	return execSync(command, { stdio: ["ignore", "pipe", "pipe"] })
		.toString("utf8")
		.trim();
}

function getPullRequestMeta() {
	const eventPath = process.env.GITHUB_EVENT_PATH;
	if (!eventPath || !fs.existsSync(eventPath)) return null;
	try {
		const raw = fs.readFileSync(eventPath, "utf8");
		const json = JSON.parse(raw);
		if (!json.pull_request) return null;
		return {
			baseSha: json.pull_request.base?.sha,
			headSha: json.pull_request.head?.sha,
			title: json.pull_request.title ?? "",
			labels: (json.pull_request.labels ?? []).map((l) => l.name).filter(Boolean),
		};
	} catch {
		return null;
	}
}

function getChangedFiles({ baseSha, headSha }) {
	const candidates = [];

	if (baseSha && headSha) {
		candidates.push(`git diff --name-only ${baseSha}...${headSha}`);
	}
	candidates.push("git diff --name-only origin/main...HEAD");
	candidates.push("git diff --name-only HEAD~1...HEAD");

	for (const cmd of candidates) {
		try {
			const out = run(cmd);
			if (!out) return [];
			return out.split("\n").map((s) => s.trim()).filter(Boolean);
		} catch {
			// try next
		}
	}

	throw new Error("Unable to determine changed files via git diff.");
}

function isIgnoredChange(file) {
	if (file.startsWith(".changeset/")) return true;
	if (file === "pnpm-lock.yaml") return true;
	if (file.endsWith(".md")) return true;
	if (file.endsWith(".mdx")) return true;
	if (file.endsWith(".svg")) return true;
	if (file.endsWith(".png")) return true;
	if (file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".webp"))
		return true;
	if (file.includes("/dist/")) return true;
	if (file.endsWith(".map")) return true;
	return false;
}

function requiresChangeset(files) {
	const relevant = files.filter((f) => !isIgnoredChange(f));
	return relevant.some((f) => f.startsWith("packages/"));
}

function hasChangeset(files) {
	return files.some((f) => f.startsWith(".changeset/") && f.endsWith(".md"));
}

function main() {
	const meta = getPullRequestMeta();
	if (!meta) {
		console.log("Changeset check skipped (not running in a PR context).");
		return;
	}

	const labels = meta?.labels ?? [];
	const title = meta?.title ?? "";
	if (labels.includes("skip-changeset") || /\[skip changeset\]/i.test(title)) {
		console.log("Changeset check skipped (label/title).");
		return;
	}

	const changedFiles = getChangedFiles({
		baseSha: meta?.baseSha,
		headSha: meta?.headSha,
	});

	if (!requiresChangeset(changedFiles)) {
		console.log("No changeset required (no non-doc changes under packages/).");
		return;
	}

	if (hasChangeset(changedFiles)) {
		console.log("Changeset present.");
		return;
	}

	console.error(
		[
			"Missing changeset.",
			"",
			"This PR changes package code under `packages/` but does not include a `.changeset/*.md` file.",
			"",
			"Fix:",
			"- Run `pnpm changeset` and commit the generated file under `.changeset/`",
			"",
			"Bypass (only if you really mean it):",
			'- Add PR label `skip-changeset` OR include `[skip changeset]` in the PR title.',
		].join("\n"),
	);
	process.exit(1);
}

main();
