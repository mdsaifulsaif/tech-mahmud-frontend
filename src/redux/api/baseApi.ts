
import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { getSession, signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let inFlightToken: string | null = null;
let sessionRefreshPromise: Promise<string | null> | null = null;

const fetchLatestSessionToken = async (): Promise<string | null> => {
    if (sessionRefreshPromise) {
        return sessionRefreshPromise;
    }

    sessionRefreshPromise = (async () => {
        try {
            const res = await fetch('/api/auth/session', { cache: 'no-store' });
            const session = await res.json();

            if (session?.error === 'RefreshAccessTokenError') {
                inFlightToken = null;
                await signOut({ redirect: true, callbackUrl: '/login' });
                return null;
            }

            const token = session?.accessToken as string | undefined;
            inFlightToken = token || null;
            return inFlightToken;
        } catch (error) {
            console.error('Session refresh error in RTK Query:', error);
            return inFlightToken;
        } finally {
            sessionRefreshPromise = null;
        }
    })();

    return sessionRefreshPromise;
};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: async (headers) => {
        try {
            const session = await getSession();

            if (session?.error === 'RefreshAccessTokenError') {
                inFlightToken = null;
                await signOut({ redirect: true, callbackUrl: '/login' });
                return headers;
            }

            if (!session?.user) {
                inFlightToken = null;
                return headers;
            }

            const token = inFlightToken || session.accessToken || null;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
        } catch (error) {
            console.error('Session fetch error in RTK Query:', error);
        }

        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const freshToken = await fetchLatestSessionToken();

        if (!freshToken) {
            return result;
        }

        result = await rawBaseQuery(args, api, extraOptions);
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'Stats', 'Orders', 'Products', 'Users', 'Analytics', 'PageContent',
        'SiteContent', 'Categories', 'Payments', 'Shipping', 'Coupons',
        'Reviews', 'Brands', 'Complaints', 'Area', 'Rider',
        'RiderApplication', 'User', 'StoreSetting', 'Riders', 'Complaint', 'RiderProfile','Brand','Area','Dashboard','Payout',
        'Subscribers', 'AreaRequests', 'Banners', 'Subscriptions', 'Chat'
    ],
    endpoints: () => ({}),

});
