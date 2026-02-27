import AdsetTable from "./AdsetTable";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    return (
        <div className="page-content">

            <div className={`container-fluid p-4`}>
                <div className="d-flex justify-content-between">
                    <h3>AdSet Data</h3>
                </div>

                <AdsetTable slug={slug} />
            </div>
        </div>
    );
}