import Script from 'next/dist/client/script';
import "@/public/assets/css/bootstrap.min.css";
import "@/public/assets/css/icons.min.css";
import "@/public/assets/css/app.min.css";
import "@/public/assets/css/custom.min.css";
import Header from './Components/Layout/header';
import Sidebar from './Components/Layout/sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-layout="vertical" data-topbar="light" data-sidebar="light" data-sidebar-size="lg" data-sidebar-image="none" data-preloader="disable">
		<head>
			<Script src='/assets/js/layout.js' strategy="afterInteractive" />
		</head>
		<body className="bg-light">

			<div id="layout-wrapper">

				<Header />	

				<Sidebar />

				<div className="main-content">
					{children}
				</div>
			</div>
			

			<Script
				src="/assets/libs/bootstrap/js/bootstrap.bundle.min.js"
				strategy="afterInteractive"
			/>
			<Script
				src="/assets/libs/simplebar/simplebar.min.js"
				strategy="afterInteractive"
			/>
			<Script
				src="/assets/libs/node-waves/waves.min.js"
				strategy="afterInteractive"
			/>
			<Script
				src="/assets/libs/feather-icons/feather.min.js"
				strategy="afterInteractive"
			/>

			{/* Plugins */}
			<Script
				src="/assets/js/pages/plugins/lord-icon-2.1.0.js"
				strategy="afterInteractive"
			/>
			<Script
				src="/assets/js/plugins.js"
				strategy="afterInteractive"
			/>

			{/* App JS – LAST */}
			<Script
				src="/assets/js/app.js"
				strategy="afterInteractive"
			/>
		</body>
    </html>
  );
}
