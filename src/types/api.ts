export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PagingMeta {
    current_page: number;
    total_page: number;
    size: number;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<T[]> {
    paging: PagingMeta;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    errors: string[];
}