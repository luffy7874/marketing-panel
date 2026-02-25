import TopBarLoader from "@/app/Components/topLoader";
import { fetchApiData } from "@/app/libs/fetchData";
import AdsetTable from "./AdsetTable";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const loading = false;
    const { slug } = await params;
    
    const data = await fetchApiData(`${process.env.NEXT_PUBLIC_API_URL}/facebook/adsets/${slug}`);

    return (
        <div className="page-content">
            <TopBarLoader isLoading={loading} color="bg-danger" />

            <div className={`container-fluid p-4 ${loading ? 'opacity-50' : ''}`} style={{ transition: 'opacity 0.2s' }}>
                <div className="d-flex justify-content-between">
                    <h3>AdSet Data</h3>
                </div>

                <AdsetTable data={data} />
            </div>
        </div>
    );
}