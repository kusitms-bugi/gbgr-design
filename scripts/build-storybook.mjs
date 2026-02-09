import { promises as fs } from "node:fs"
import path from "node:path"

const STORYBOOK_STATIC_DIR = path.join(
	process.cwd(),
	"apps",
	"docs",
	"storybook-static",
)
const DOCS_PUBLIC_STORYBOOK_DIR = path.join(
	process.cwd(),
	"apps",
	"docs",
	"public",
	"storybook",
)

async function copyStorybookBuildToDocs() {
	try {
		// 대상 디렉토리 생성
		await fs.mkdir(DOCS_PUBLIC_STORYBOOK_DIR, { recursive: true })

		// storybook-static 디렉토리의 모든 내용을 복사
		// 재귀적으로 디렉토리 내용을 복사하기 위해 rsync나 `cp -R`과 유사한 로직 필요
		// Node.js의 fs.cp를 사용하면 쉽게 구현 가능 (Node.js 16.7.0 이상)
		await fs.cp(STORYBOOK_STATIC_DIR, DOCS_PUBLIC_STORYBOOK_DIR, {
			recursive: true,
		})

		console.log(
			"Storybook build files copied to docs public directory successfully.",
		)
	} catch (error) {
		console.error("Error copying Storybook build files:", error)
		process.exit(1)
	}
}

copyStorybookBuildToDocs()
