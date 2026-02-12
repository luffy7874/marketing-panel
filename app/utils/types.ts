export type MetaDateRangeOption = {
    open: boolean;
	setOpen: (val: boolean) => void;
    dateRange: [Date | null, Date | null];
    setDateRange: (range: [Date | null, Date | null]) => void;
    onChange?: (start: Date | null, end: Date | null) => void;
}

export type Campaign = {
    campaign_id: string;
    campaign: string;
    budget: number;
    spend: number;
    purchases: number;
    value: number;
    cpp: number;
    roas: number;
    start_date: string;
    end_date: string;
    status: string;
    frequency: number;
    add_to_cart: number;
};

export type CampaignResponse = {
  campaigns: Campaign[];
};

export type Props = {
  onChange: (start: Date | null, end: Date | null) => void;
};

export type ApiData = {
    date: string;
    campaigns: Campaign[];
    totalSpend: number;
    currency: string;
}