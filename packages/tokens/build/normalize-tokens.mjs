#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const TYPO_FIX = new Map([
	["sementic", "semantic"],
	["compoenent", "component"],
	["diabeld", "disabled"],
	["Minimun", "Minimum"],
])

/**
 * 공백/대문자/특수문자 정리 + 흔한 오타 교정
 * - "olive green" -> "olive-green"
 * - "device mode" -> "device-mode"
 */
function normalizeKey(rawKey) {
	if (TYPO_FIX.has(rawKey)) return TYPO_FIX.get(rawKey)

	return String(rawKey)
		.trim()
		.replace(/\s+/g, "-")
		.replace(/_/g, "-")
		.replace(/[^\w-]+/g, "-") // 알파넘/언더스코어/하이픈 외 제거
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
}

/**
 * 최상단 set 키에서 collection/mode 추출
 * - "Primitives/light/Primitives/light" -> { collection:"Primitives", mode:"light" }
 * - "global/global" -> { collection:"global", mode:"global" }
 */
function parseSetKey(setKey) {
	const parts = String(setKey).split("/").filter(Boolean)

	// 흔한 패턴: A/mode/A/mode
	if (parts.length >= 4 && parts[0] === parts[2] && parts[1] === parts[3]) {
		return { collection: parts[0], mode: parts[1] }
	}

	// 패턴: A/mode
	if (parts.length >= 2) {
		return { collection: parts[0], mode: parts[1] }
	}

	// fallback
	return { collection: parts[0] ?? setKey, mode: "default" }
}

/**
 * collection 이름 정규화 (Primitives -> primitives 등)
 */
function normalizeCollectionName(name) {
	return normalizeKey(name).toLowerCase()
}

/**
 * mode 이름 정규화 (light/dark/global)
 */
function normalizeModeName(name) {
	const m = normalizeKey(name).toLowerCase()
	if (m === "light" || m === "dark") return m
	if (m === "global") return "global"
	return m || "default"
}

/**
 * Tokens Studio 참조 리라이트
 * - "{color.semantic.point.olive green}" -> "{color.semantic.point.olive-green}"
 * - "{color.sementic.brand.primary}" -> "{color.semantic.brand.primary}"
 *
 * 주의: 중괄호 안은 "경로"라고 가정하고, '.' 세그먼트 단위로 normalizeKey를 적용한다.
 */
function normalizeReferencePath(refPath) {
	// 혹시 "a/b.c" 같이 섞여 오면 우선 '/'를 '.'로 취급하지 않고 그대로 두는 전략이 안전하다.
	// Tokens Studio 기본은 dot-path이므로 dot 기준으로만 처리한다.
	const parts = String(refPath).split(".")
	const normalized = parts.map((seg) => normalizeKey(seg))
	return normalized.join(".")
}

function rewriteReferencesInString(str) {
	// { ... } 패턴을 모두 찾아 내부 경로만 정규화
	// 예: "linear-gradient(...)" 같은 문자열은 영향 없음
	return String(str).replace(/\{([^}]+)\}/g, (_, inner) => {
		const next = normalizeReferencePath(inner)
		return `{${next}}`
	})
}

/**
 * 재귀적으로:
 * 1) object key 정규화
 * 2) string value 내부의 {..} 참조도 정규화
 */
function normalizeObjectKeysAndRefs(value) {
	if (Array.isArray(value)) return value.map(normalizeObjectKeysAndRefs)

	if (value && typeof value === "object") {
		const out = {}
		for (const [k, v] of Object.entries(value)) {
			// Tokens Studio 메타 키는 그대로 둠
			if (k.startsWith("$")) {
				out[k] = normalizeObjectKeysAndRefs(v)
				continue
			}

			const nk = normalizeKey(k)
			out[nk] = normalizeObjectKeysAndRefs(v)
		}
		return out
	}

	// string이면 참조 리라이트 적용
	if (typeof value === "string") {
		return rewriteReferencesInString(value)
	}

	return value
}

/**
 * 입력(Tokens Studio export) -> 정규화 결과
 */
function normalizeTokensStudio(input) {
	const output = {
		collections: {},
		$metadata: input.$metadata ?? {},
		$themes: input.$themes ?? [],
	}

	for (const [setKey, setValue] of Object.entries(input)) {
		if (setKey.startsWith("$")) continue

		const { collection, mode } = parseSetKey(setKey)
		const c = normalizeCollectionName(collection)
		const m = normalizeModeName(mode)

		if (!output.collections[c]) output.collections[c] = {}
		if (!output.collections[c][m]) output.collections[c][m] = {}

		// 내부 키 + 참조까지 정규화
		output.collections[c][m] = normalizeObjectKeysAndRefs(setValue)
	}

	// $metadata.tokenSetOrder도 "collections 구조로 바뀌었으니" 의미가 달라진다.
	// 필요하면 여기서 별도 변환/재생성하는 편이 안전하다.
	return output
}

/**
 * CLI
 * node normalize-tokens.mjs <input> <output>
 */
async function main() {
	const inputPath =
		process.argv[2] ?? path.resolve(process.cwd(), "src/tokens-studio.json")

	const outputPath =
		process.argv[3] ?? path.resolve(process.cwd(), "src/tokens.normalized.json")

	const raw = await readFile(inputPath, "utf-8")
	const json = JSON.parse(raw)

	const normalized = normalizeTokensStudio(json)

	await mkdir(path.dirname(outputPath), { recursive: true })
	await writeFile(outputPath, JSON.stringify(normalized, null, 2), "utf-8")

	console.log(`[normalize] ${inputPath} -> ${outputPath}`)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
