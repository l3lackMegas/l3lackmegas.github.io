/* Next's module */
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

/* External module */
import { AnimateSharedLayout, AnimatePresence } from 'framer-motion'

/* Component */
import PreLoader from '../components/MainLayout/PreLoader'

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx)

		return initialProps
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="icon" href="/img/favicon.jpg" type="image/gif" sizes="16x16"/>
					<meta name="keywords" content="Jaruwat Pohong, l3lackMegas, Resume, HTML, CSS, JavaScript"></meta>
					<meta name="description"
							content="I am Jaruwat Pohong, Frontend Developer.
									Actually I am a student in university who would like to do anything about web design and frontend development.
									I understand HTML, CSS and JavaScript as well. And I can use modern library like React.js, TypeScript, etc."
					/>

					<meta property="og:url" content="https://jaruwat.dev" />
					<meta property="og:type" content="website" />
					<meta property="og:title" content="l3lackMegas - Résumé" />
					<meta property="og:description"
							content="I am Jaruwat Pohong, Desktop and Web Developer. (or just wanna be)
							Actually I am a student in Computer Science who would like to do anything about web design and frontend development.
							I usually play video games, listen to music and coding my mini project."
					/>
					<meta property="og:image" content="https://jaruwat.dev/img/og-img.jpg" />
				</Head>
				<body>
					<div id="modal-root"></div>
					<PreLoader id="IE-Message" style={{ display: 'none', top: 50, width: '90%', color: 'orange' }}>Sorry, This website may not support your browser.</PreLoader>
					<Main />
					<NextScript />
					<script async src="/js/checkOutdataBrowser.js?v=3"/>
				</body>
			</Html>
		)
	}
}

export default MyDocument