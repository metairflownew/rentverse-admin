export type PropertyMini = {
  id: string;
  title?: string | null;
  city?: string | null;
  image?: string | null;
  isVerified?: boolean | null;
};

export type Property = {
  id: string;
  title?: string | null;
  description?: string | null;
  city?: string | null;
  images?: string[] | null;
  isVerified?: boolean | null;
  status?: string | null;
  price?: number | null;
  currency?: string | null;
  type?: string | null;
  submittedAt?: string | null;
  landlord?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  } | null;
  createdAt?: string | null;
};

export type PropertiesListResponse = {
  status: string;
  message: string;
  meta?: {
    page?: number;
    limit?: number;
    totalData?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  } | null;
  data: Property[];
};

export type VerifyPropertyRequest = {
  isVerified: boolean;
  rejectionReason?: string;
};

export interface PropertyRepository {
  getProperties(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<PropertiesListResponse>;
  verifyProperty(id: string, payload: VerifyPropertyRequest): Promise<Record<string, unknown>>;
}
