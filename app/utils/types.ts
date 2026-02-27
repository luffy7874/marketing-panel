export type MetaDateRangeOption = {
    open: boolean;
	setOpen: (val: boolean) => void;
    dateRange: [Date | null, Date | null];
    setDateRange: (range: [Date | null, Date | null]) => void;
    compare: boolean;
    setCompare: (val: boolean) => void;
    compareRange: [Date | null, Date | null];
    setCompareRange: (range: [Date | null, Date | null]) => void;
    onApply: () => void;
}

export type Campaign = {
    campaign_id: string;
    campaign: string;
    budget: number;
    spend: number;
    purchases: number;
    value: number;
    cpp: number;
    cpm: number;
    impressions: number;
    reach: number;
    ctr: number;
    roas: number;
    start_date: string;
    end_date: string;
    status: string;
    frequency: number;
    add_to_cart: number;
};

export type CampaignResponse = {
  campaigns: Campaign[];
  total_spend: number;
};

export type Props = {
  onChange: (start: Date | null, end: Date | null) => void;
};

export type ApiData = {
    date: string;
    campaigns: Campaign[];
    total_spend: number;
    total_budget: number;
    best_campaign: Campaign | null;
}

export type RegisterData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export type RegisterError = {
    name: string[] | undefined,
    email: string[] | undefined,
    password: string[] | undefined;
    password_confirmation: string[] | undefined;
}

export type LoginError = {
    email: string[] | undefined,
    password: string[] | undefined;
}

export type TokenData = {
    id: string | number;
    provider: string;
    access_token: string;
    refresh_token?: string | null;
    expires_in: string;
    user: User | null;
}

export type User = {
    name: string;
    email: string;
}

export type AlertData = {
    type: "success" | "danger" | "warning";
    message: string;
}

export type AdSet = {
    campaign_id: string;
    campaign: string;
    status: string;
    budget: number;  // This is the Active Daily Basis budget
    spend: number;
    roas: number;
    purchases: number;
    value: number;   // Revenue
    impressions: number;
    clicks: number;
}

export type AccountDailyData = {
    date: string;
    day: string;
    spend: number;
    sales: number;
    roas: number;
    add_to_cart: number;
    checkouts: number;
    ctr: number;
    cpm: number;
    frequency: number;
    reach: number;
    impressions: number;
    value: number;
}