import { apiClient } from "../../../core/api.client";
import { baseUrl } from "../../../core/api.urls";
import type { PropertyRepository, PropertiesListResponse, VerifyPropertyRequest } from "../domain/property.entity";

const PROPERTIES_BASE = `${baseUrl}/admin/properties`;

export class PropertyRepositoryImpl implements PropertyRepository {
  async getProperties(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<PropertiesListResponse> {
    const res = await apiClient.get(PROPERTIES_BASE, { params });
    return res.data as PropertiesListResponse;
  }

  async verifyProperty(id: string, payload: VerifyPropertyRequest): Promise<Record<string, unknown>> {
    const res = await apiClient.post(`${PROPERTIES_BASE}/${id}/verify`, payload);
    return res.data as Record<string, unknown>;
  }
}

export const propertyRepository = new PropertyRepositoryImpl();
