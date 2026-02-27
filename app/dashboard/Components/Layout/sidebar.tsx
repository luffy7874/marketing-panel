"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar()
{

    const pathname = usePathname();


    return(
        <div className="app-menu navbar-menu">
            {/* <!-- LOGO --> */}
            <div className="navbar-brand-box">
                {/* <!-- Dark Logo--> */}
                <a href="index-2.html" className="logo logo-dark">
                    <span className="logo-sm">
                        <Image src="/assets/images/logo-sm.png" alt="" height={22} width={100} />
                    </span>
                    <span className="logo-lg">
                        <Image src="/assets/images/logo-dark.png" alt="" height={17} width={100} />
                    </span>
                </a>
                {/* <!-- Light Logo--> */}
                <a href="index-2.html" className="logo logo-light">
                    <span className="logo-sm">
                        <Image src="/assets/images/logo-sm.png" alt="" height={22} width={100} />
                    </span>
                    <span className="logo-lg">
                        <Image src="/assets/images/logo-dark.png" alt="" height={17} width={100} />
                    </span>
                </a>
                <button type="button" className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover" id="vertical-hover">
                    <i className="ri-record-circle-line"></i>
                </button>
            </div>

            <div id="scrollbar">
                <div className="container-fluid">

                    <div id="two-column-menu"></div>
                    <ul className="navbar-nav" id="navbar-nav">
                        <li className="menu-title"><span data-key="t-menu">Menu</span></li>

                        <li className="nav-item">
                            <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
                                <i className="ri-dashboard-2-line"></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link menu-link" href="#facebookdrop" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="facebookdrop">
                                <i className="ri-facebook-circle-line"></i> <span data-key="t-dashboards">Facebook Ads</span>
                            </a>
                            <div className="collapse menu-dropdown" id="facebookdrop">
                                <ul className="nav nav-sm flex-column">
                                    <li className="nav-item">
                                        <Link href="/dashboard/facebook" className={`nav-link ${pathname === '/dashboard/facebook' ? 'active' : ''}`}>
                                            <span>Campaign Data</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/dashboard/facebook/daily" className={`nav-link ${pathname === '/dashboard/facebook/daily' ? 'active' : ''}`}>
                                            <span>Daily Spend</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        {/* <li className="nav-item">
                            <Link href="/dashboard/facebook" className={`nav-link ${pathname === '/dashboard/facebook' ? 'active' : ''}`}>
                                <i className="ri-dashboard-2-line"></i>
                                <span>Facebook Ads</span>
                            </Link>
                        </li> */}
                        {/* <li className="nav-item">
                            <Link href="/google" className={`nav-link ${pathname === '/google' ? 'active' : ''}`}>
                                <i className="ri-dashboard-2-line"></i>
                                <span>Google Ads</span>
                            </Link>
                        </li> */}

                        <li className="nav-item">
                            <Link href="/dashboard/tokens" className={`nav-link ${pathname === '/dashboard/tokens' ? 'active' : ''}`}>
                                <i className=" ri-settings-2-line"></i>
                                <span>Manage Tokens</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                {/* <!-- Sidebar --> */}
            </div>

            <div className="sidebar-background"></div>
        </div>
    );
}