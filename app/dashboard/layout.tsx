import Script from 'next/dist/client/script';
import Sidebar from './Components/Layout/sidebar';
import Header from './Components/Layout/header';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	
  return (
    <>

        <Script src="/assets/js/layout.js" strategy="afterInteractive" />
    
        <div id="layout-wrapper">

            <Header />	

            <Sidebar />

            <div className="main-content">
                {children}
            </div>
        </div>

        <Script src="/assets/libs/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/libs/simplebar/simplebar.min.js" strategy="afterInteractive" />
      <Script src="/assets/libs/node-waves/waves.min.js" strategy="afterInteractive" />
      <Script src="/assets/libs/feather-icons/feather.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/pages/plugins/lord-icon-2.1.0.js" strategy="afterInteractive" />
      <Script src="/assets/js/plugins.js" strategy="afterInteractive" />
      <Script src="/assets/js/app.js" strategy="afterInteractive" />
    </>
  );
}
