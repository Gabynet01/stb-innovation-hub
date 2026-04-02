import { BaseApiService } from "./baseApi";
import { ApiResponse } from "@/types/api";
import type {
  IdeahubUserRead,
  IdeahubRoleRead,
  IdeahubGroupRead,
  IdeahubPermissionRead,
  IdeahubADMappingRead,
} from "@/types/ideahub";

export class UsersApiService extends BaseApiService {
  list(): Promise<ApiResponse<IdeahubUserRead[]>> {
    return this.requestAuth<IdeahubUserRead[]>("/users/");
  }

  get(id: string): Promise<ApiResponse<IdeahubUserRead>> {
    return this.requestAuth<IdeahubUserRead>(`/users/${id}`);
  }

  update(
    id: string,
    body: Partial<{ email: string; display_name: string; is_active: boolean }>
  ): Promise<ApiResponse<IdeahubUserRead>> {
    return this.requestAuthWithRetry<IdeahubUserRead>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete(id: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/users/${id}`, { method: "DELETE" });
  }

  effectivePermissions(
    id: string
  ): Promise<ApiResponse<{ permissions: string[] }>> {
    return this.requestAuth<{ permissions: string[] }>(
      `/users/${id}/permissions`
    );
  }

  assignRole(userId: string, role_id: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/users/${userId}/roles`, {
      method: "POST",
      body: JSON.stringify({ role_id }),
    });
  }

  removeRole(userId: string, roleId: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/users/${userId}/roles/${roleId}`, {
      method: "DELETE",
    });
  }

  assignGroup(userId: string, group_id: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/users/${userId}/groups`, {
      method: "POST",
      body: JSON.stringify({ group_id }),
    });
  }

  removeGroup(userId: string, groupId: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/users/${userId}/groups/${groupId}`, {
      method: "DELETE",
    });
  }

  assignPermission(
    userId: string,
    permission_id: string
  ): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/users/${userId}/permissions`, {
      method: "POST",
      body: JSON.stringify({ permission_id }),
    });
  }

  removePermission(
    userId: string,
    permissionId: string
  ): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(
      `/users/${userId}/permissions/${permissionId}`,
      { method: "DELETE" }
    );
  }
}

export class RolesApiService extends BaseApiService {
  list(): Promise<ApiResponse<IdeahubRoleRead[]>> {
    return this.requestAuth<IdeahubRoleRead[]>("/roles/");
  }

  get(id: string): Promise<ApiResponse<IdeahubRoleRead>> {
    return this.requestAuth<IdeahubRoleRead>(`/roles/${id}`);
  }

  create(body: {
    slug: string;
    description?: string;
  }): Promise<ApiResponse<IdeahubRoleRead>> {
    return this.requestAuthWithRetry<IdeahubRoleRead>("/roles/", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  delete(id: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/roles/${id}`, { method: "DELETE" });
  }

  update(
    id: string,
    body: Partial<{ description: string }>
  ): Promise<ApiResponse<IdeahubRoleRead>> {
    return this.requestAuthWithRetry<IdeahubRoleRead>(`/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  assignPermission(
    roleId: string,
    permission_id: string
  ): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/roles/${roleId}/permissions`, {
      method: "POST",
      body: JSON.stringify({ permission_id }),
    });
  }

  removePermission(
    roleId: string,
    permissionId: string
  ): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(
      `/roles/${roleId}/permissions/${permissionId}`,
      { method: "DELETE" }
    );
  }
}

export class GroupsApiService extends BaseApiService {
  list(): Promise<ApiResponse<IdeahubGroupRead[]>> {
    return this.requestAuth<IdeahubGroupRead[]>("/groups/");
  }

  get(id: string): Promise<ApiResponse<IdeahubGroupRead>> {
    return this.requestAuth<IdeahubGroupRead>(`/groups/${id}`);
  }

  create(body: {
    slug: string;
    description?: string;
  }): Promise<ApiResponse<IdeahubGroupRead>> {
    return this.requestAuthWithRetry<IdeahubGroupRead>("/groups/", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  delete(id: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/groups/${id}`, { method: "DELETE" });
  }

  update(
    id: string,
    body: Partial<{ description: string }>
  ): Promise<ApiResponse<IdeahubGroupRead>> {
    return this.requestAuthWithRetry<IdeahubGroupRead>(`/groups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  assignRole(groupId: string, role_id: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/groups/${groupId}/roles`, {
      method: "POST",
      body: JSON.stringify({ role_id }),
    });
  }

  removeRole(groupId: string, roleId: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/groups/${groupId}/roles/${roleId}`, {
      method: "DELETE",
    });
  }

  assignPermission(
    groupId: string,
    permission_id: string
  ): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/groups/${groupId}/permissions`, {
      method: "POST",
      body: JSON.stringify({ permission_id }),
    });
  }

  removePermission(
    groupId: string,
    permissionId: string
  ): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(
      `/groups/${groupId}/permissions/${permissionId}`,
      { method: "DELETE" }
    );
  }
}

export class PermissionsApiService extends BaseApiService {
  list(): Promise<ApiResponse<IdeahubPermissionRead[]>> {
    return this.requestAuth<IdeahubPermissionRead[]>("/permissions/");
  }

  create(body: {
    slug: string;
    description?: string;
  }): Promise<ApiResponse<IdeahubPermissionRead>> {
    return this.requestAuthWithRetry<IdeahubPermissionRead>("/permissions/", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  get(id: string): Promise<ApiResponse<IdeahubPermissionRead>> {
    return this.requestAuth<IdeahubPermissionRead>(`/permissions/${id}`);
  }

  update(
    id: string,
    body: Partial<{ description: string }>
  ): Promise<ApiResponse<IdeahubPermissionRead>> {
    return this.requestAuthWithRetry<IdeahubPermissionRead>(
      `/permissions/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    );
  }

  delete(id: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/permissions/${id}`, { method: "DELETE" });
  }
}

export class AdMappingsApiService extends BaseApiService {
  list(): Promise<ApiResponse<IdeahubADMappingRead[]>> {
    return this.requestAuth<IdeahubADMappingRead[]>("/ad-mappings/");
  }

  create(body: {
    ad_group_name: string;
    role_id: string;
  }): Promise<ApiResponse<IdeahubADMappingRead>> {
    return this.requestAuthWithRetry<IdeahubADMappingRead>("/ad-mappings/", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  get(id: string): Promise<ApiResponse<IdeahubADMappingRead>> {
    return this.requestAuth<IdeahubADMappingRead>(`/ad-mappings/${id}`);
  }

  update(
    id: string,
    body: Partial<{ ad_group_name: string; role_id: string }>
  ): Promise<ApiResponse<IdeahubADMappingRead>> {
    return this.requestAuthWithRetry<IdeahubADMappingRead>(
      `/ad-mappings/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    );
  }

  delete(id: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/ad-mappings/${id}`, { method: "DELETE" });
  }
}
