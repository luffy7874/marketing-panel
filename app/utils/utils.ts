export const getTopCampaigns = (data: any) => {
    if (!data || !data.campaigns || data.total_spend === 0) return [];

    // 1. Filter: Spend Share > 20%
    const filtered = data.campaigns.filter((camp: any) => {
        const share = (camp.spend / data.total_spend) * 100;
        return share > 20;
    });

    // 2. Sort: By ROAS (Highest to Lowest)
    return filtered.sort((a, b) => b.roas - a.roas);
};