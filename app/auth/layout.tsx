import Script from "next/script";

export default function GuestLayout({children} : Readonly<{
  children: React.ReactNode;
}>){
    return(
                
        <>
            <Script src="/assets/js/layout.js" strategy="afterInteractive" />
            
            { children }

            <Script src="/assets/libs/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
            <Script src="/assets/libs/simplebar/simplebar.min.js" strategy="afterInteractive" />
            <Script src="/assets/libs/node-waves/waves.min.js" strategy="afterInteractive" />
            <Script src="/assets/libs/feather-icons/feather.min.js" strategy="afterInteractive" />
            <Script src="/assets/js/pages/plugins/lord-icon-2.1.0.js" strategy="afterInteractive" />
            <Script src="/assets/js/plugins.js" strategy="afterInteractive" />
            {/* <Script src="/assets/js/app.js" strategy="afterInteractive" /> */}

            {/* <Script src="/assets/js/pages/form-validation.init.js" strategy="afterInteractive" />
            <Script src="/assets/js/pages/passowrd-create.init.js" strategy="afterInteractive" /> */}
        </>

    );
}