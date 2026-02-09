import { promises as fs } from "node:fs"
import path from "node:path"

const TOKEN_DIST_DIR = path.join(process.cwd(), "packages", "tokens", "dist")
const DOCS_PUBLIC_TOKENS_DIR = path.join(
	process.cwd(),
	"apps",
	"docs",
	"public",
	"tokens",
)

async function copyTokenDistToDocs() {
	try {
		// 대상 디렉토리 생성
		await fs.mkdir(DOCS_PUBLIC_TOKENS_DIR, { recursive: true })

		// 토큰 dist 디렉토리의 파일 목록 읽기
		const files = await fs.readdir(TOKEN_DIST_DIR)

		for (const file of files) {
			const srcPath = path.join(TOKEN_DIST_DIR, file)
			const destPath = path.join(DOCS_PUBLIC_TOKENS_DIR, file)

			// 파일 복사
			await fs.copyFile(srcPath, destPath)
			console.log(`Copied: ${srcPath} -> ${destPath}`)
		}
		console.log(
			"Token dist files copied to docs public directory successfully.",
		)
	} catch (error) {
		console.error("Error copying token dist files:", error)
		process.exit(1)
	}
}

copyTokenDistToDocs()
