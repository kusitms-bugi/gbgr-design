import Link from "@docusaurus/Link"
import Layout from "@theme/Layout"
import type React from "react"

export default function Home(): React.JSX.Element {
	return (
		<Layout title="GBGR Design" description="Design system documentation">
			<main style={{ padding: "2rem 1rem" }}>
				<h1>GBGR Design</h1>
				<p>디자인 시스템 문서 사이트입니다.</p>
				<p>
					<Link to="/docs/intro">문서로 이동 →</Link>
				</p>
			</main>
		</Layout>
	)
}
