export default function BreadCrumb({heading}: {heading: string}){
    return(
        <div className="row">
            <div className="col-12 px-4">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                    <h4 className="mb-sm-0">{heading}</h4>
                </div>
            </div>
        </div>
    );
}