import Link from "@docusaurus/Link"
import { InfoCircleIcon, MinusIcon, PlusIcon, ShowIcon } from "@gbgr/icons"
import Layout from "@theme/Layout"
import type React from "react"
import { useState } from "react"
import styles from "./index.module.css"

export default function Home(): React.JSX.Element {
	const [toggleOn, setToggleOn] = useState(false)
	const [segment, setSegment] = useState("text 1")
	const [minutes, setMinutes] = useState(30)
	const [stepperValue, setStepperValue] = useState(2)

	const changeMinutes = (delta: number) => {
		setMinutes((current) => Math.min(90, Math.max(0, current + delta)))
	}

	const changeStepperValue = (delta: number) => {
		setStepperValue((current) => Math.min(9, Math.max(0, current + delta)))
	}

	return (
		<Layout title="GBGR Design" description="Design system documentation">
			<main className={styles.main}>
				<section className={styles.hero}>
					<p className={styles.kicker}>Figma Spec Playground</p>
					<h1 className={styles.title}>거북이 온앤온</h1>
					<p className={styles.description}>
						Figma 컴포넌트 보드(토글, 스텝퍼)를 문서 페이지에서 인터랙션까지
						재현한 샘플입니다.
					</p>
					<Link className={styles.docsLink} to="/docs/intro">
						문서로 이동 →
					</Link>
				</section>

				<section className={styles.grid}>
					<article className={styles.card}>
						<h2 className={styles.cardTitle}>Toogle</h2>
						<button
							type="button"
							className={`${styles.switch} ${toggleOn ? styles.switchOn : ""}`}
							onClick={() => setToggleOn((current) => !current)}
							aria-pressed={toggleOn}
						>
							<span className={styles.knob} />
						</button>
					</article>

					<article className={styles.card}>
						<h2 className={styles.cardTitle}>Toogle Switch</h2>
						<div className={styles.segmentedControl}>
							{["text 1", "text 2", "text 3", "text 4"].map((item) => (
								<button
									key={item}
									type="button"
									className={`${styles.segmentButton} ${
										segment === item ? styles.segmentButtonActive : ""
									}`}
									onClick={() => setSegment(item)}
								>
									{item}
								</button>
							))}
						</div>
					</article>

					<article className={styles.card}>
						<h2 className={styles.cardTitle}>Time Stepper</h2>
						<div className={styles.timeStepper}>
							<button
								type="button"
								className={styles.stepAction}
								onClick={() => changeMinutes(-5)}
							>
								<MinusIcon width={16} height={16} />
							</button>
							<span className={styles.timeValue}>{minutes}분</span>
							<button
								type="button"
								className={styles.stepAction}
								onClick={() => changeMinutes(5)}
							>
								<PlusIcon width={16} height={16} />
							</button>
						</div>
					</article>

					<article className={styles.card}>
						<h2 className={styles.cardTitle}>Stepper</h2>
						<div className={styles.verticalStepper}>
							<button
								type="button"
								className={styles.smallStepAction}
								onClick={() => changeStepperValue(1)}
							>
								<PlusIcon width={14} height={14} />
							</button>
							<div className={styles.stepValue}>{stepperValue}</div>
							<button
								type="button"
								className={styles.smallStepAction}
								onClick={() => changeStepperValue(-1)}
							>
								<MinusIcon width={14} height={14} />
							</button>
						</div>
					</article>

					<article className={styles.card}>
						<h2 className={styles.cardTitle}>Icons</h2>
						<div className={styles.iconRow}>
							<div className={styles.iconBadge}>
								<ShowIcon width={20} height={20} />
								<span>Show</span>
							</div>
							<div className={styles.iconBadge}>
								<InfoCircleIcon width={20} height={20} />
								<span>Information</span>
							</div>
						</div>
					</article>
				</section>
			</main>
		</Layout>
	)
}
