export default function Sidebox(){
    return(
        <div className="col-lg-6">
            <div className="p-lg-5 p-4 auth-one-bg h-100">
                <div className="bg-overlay"></div>
                <div className="position-relative h-100 d-flex flex-column">
                    <div className="mb-4">
                        <a href="index-2.html" className="d-block">
                            <img src="/assets/images/logo-light.png" alt="" height="18" />
                        </a>
                    </div>
                    <div className="mt-5">
                        <div className="mb-3">
                            <i className="ri-double-quotes-l display-4 text-success"></i>
                        </div>

                        <div id="qoutescarouselIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#qoutescarouselIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#qoutescarouselIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#qoutescarouselIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            </div>
                            <div className="carousel-inner text-center text-white-50 pb-5">
                                <div className="carousel-item active">
                                    <p className="fs-15 fst-italic">Great! Clean code, clean design, easy for customization. Thanks very much!</p>
                                </div>
                                <div className="carousel-item">
                                    <p className="fs-15 fst-italic">The theme is really great with an amazing customer support.</p>
                                </div>
                                <div className="carousel-item">
                                    <p className="fs-15 fst-italic">Great! Clean code, clean design, easy for customization. Thanks very much!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}