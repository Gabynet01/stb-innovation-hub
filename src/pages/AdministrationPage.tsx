import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { ApiError } from "@/services/baseApi";
import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  DataTable,
  RowActionsMenu,
  SimpleModal,
  LoadingSpinner,
  CompactErrorWithToast,
  ConfirmationModal,
  SegmentedTabs,
  useSnackbar,
  type DataTableColumn,
} from "@/components/ui";
import type {
  IdeahubIdeaCategory,
  IdeahubIdeaSource,
  IdeahubUserRead,
  IdeahubRoleRead,
  IdeahubGroupRead,
  IdeahubPermissionRead,
  IdeahubADMappingRead,
} from "@/types/ideahub";
import { PAGE_HERO_PATTERN_LIGHT, PAGE_HERO_SURFACE } from "@/constants/pageHero";
type Tab = "sources" | "categories" | "directory";

type PendingDelete =
  | { k: "source"; row: IdeahubIdeaSource }
  | { k: "category"; row: IdeahubIdeaCategory }
  | { k: "user"; row: IdeahubUserRead }
  | { k: "role"; row: IdeahubRoleRead }
  | { k: "group"; row: IdeahubGroupRead }
  | { k: "permission"; row: IdeahubPermissionRead }
  | { k: "ad"; row: IdeahubADMappingRead };

function formatShortDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

function errMessage(e: unknown) {
  return e instanceof ApiError ? e.message : "Request failed";
}

export const AdministrationPage: React.FC = () => {
  const { isAuthenticated, hasPermission } = useAuth();
  const canUsersWrite = hasPermission("users:write");
  const canRolesWrite = hasPermission("roles:write");
  const canGroupsWrite = hasPermission("groups:write");
  const canPermissionsWrite = hasPermission("permissions:write");
  const canAdMappingsWrite = hasPermission("ad_mappings:write");
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [tab, setTab] = useState<Tab>("sources");
  const [loading, setLoading] = useState(true);
  const [dirLoading, setDirLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sources, setSources] = useState<IdeahubIdeaSource[]>([]);
  const [categories, setCategories] = useState<IdeahubIdeaCategory[]>([]);

  const [users, setUsers] = useState<IdeahubUserRead[]>([]);
  const [roles, setRoles] = useState<IdeahubRoleRead[]>([]);
  const [groups, setGroups] = useState<IdeahubGroupRead[]>([]);
  const [permissions, setPermissions] = useState<IdeahubPermissionRead[]>([]);
  const [adMappings, setAdMappings] = useState<IdeahubADMappingRead[]>([]);

  const [srcSlug, setSrcSlug] = useState("");
  const [srcName, setSrcName] = useState("");
  const [srcDesc, setSrcDesc] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catOrder, setCatOrder] = useState(0);

  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regDisplayName, setRegDisplayName] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSelectedRoleIds, setRegSelectedRoleIds] = useState<Set<string>>(
    () => new Set()
  );

  const [editUser, setEditUser] = useState<IdeahubUserRead | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editRoleIds, setEditRoleIds] = useState<Set<string>>(() => new Set());
  const [editInitialRoleIds, setEditInitialRoleIds] = useState<Set<string>>(
    () => new Set()
  );

  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null
  );
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [createSourceModalOpen, setCreateSourceModalOpen] = useState(false);
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
  const [sourceModalSubmitting, setSourceModalSubmitting] = useState(false);
  const [categoryModalSubmitting, setCategoryModalSubmitting] = useState(false);

  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [newRoleSlug, setNewRoleSlug] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [roleModalSubmitting, setRoleModalSubmitting] = useState(false);

  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [newGroupSlug, setNewGroupSlug] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [groupModalSubmitting, setGroupModalSubmitting] = useState(false);

  const [createPermOpen, setCreatePermOpen] = useState(false);
  const [newPermSlug, setNewPermSlug] = useState("");
  const [newPermDesc, setNewPermDesc] = useState("");
  const [permModalSubmitting, setPermModalSubmitting] = useState(false);

  const [createAdOpen, setCreateAdOpen] = useState(false);
  const [newAdGroupName, setNewAdGroupName] = useState("");
  const [newAdRoleId, setNewAdRoleId] = useState("");
  const [adModalSubmitting, setAdModalSubmitting] = useState(false);

  const [editRole, setEditRole] = useState<IdeahubRoleRead | null>(null);
  const [editRoleDesc, setEditRoleDesc] = useState("");
  const [editRolePermIds, setEditRolePermIds] = useState<Set<string>>(
    () => new Set()
  );
  const [editRoleInitialPermIds, setEditRoleInitialPermIds] = useState<
    Set<string>
  >(() => new Set());
  const [editRoleSubmitting, setEditRoleSubmitting] = useState(false);

  const [editGroup, setEditGroup] = useState<IdeahubGroupRead | null>(null);
  const [editGroupDesc, setEditGroupDesc] = useState("");
  const [editGroupRoleIds, setEditGroupRoleIds] = useState<Set<string>>(
    () => new Set()
  );
  const [editGroupInitialRoleIds, setEditGroupInitialRoleIds] = useState<
    Set<string>
  >(() => new Set());
  const [editGroupPermIds, setEditGroupPermIds] = useState<Set<string>>(
    () => new Set()
  );
  const [editGroupInitialPermIds, setEditGroupInitialPermIds] = useState<
    Set<string>
  >(() => new Set());
  const [editGroupSubmitting, setEditGroupSubmitting] = useState(false);

  const [editPerm, setEditPerm] = useState<IdeahubPermissionRead | null>(null);
  const [editPermDesc, setEditPermDesc] = useState("");
  const [editPermSubmitting, setEditPermSubmitting] = useState(false);

  const [editAd, setEditAd] = useState<IdeahubADMappingRead | null>(null);
  const [editAdGroupName, setEditAdGroupName] = useState("");
  const [editAdRoleId, setEditAdRoleId] = useState("");
  const [editAdSubmitting, setEditAdSubmitting] = useState(false);

  const loadCatalog = useCallback(async () => {
    const [s, c] = await Promise.all([
      apiService.catalog.listSources(),
      apiService.catalog.listCategories(),
    ]);
    if (s.ok && s.data) setSources(s.data);
    if (c.ok && c.data) setCategories(c.data);
  }, []);

  const loadDirectory = useCallback(async () => {
    setDirLoading(true);
    setError(null);
    try {
      const [u, r, g, p, m] = await Promise.all([
        apiService.users.list(),
        apiService.roles.list(),
        apiService.groups.list(),
        apiService.permissions.list(),
        apiService.adMappings.list(),
      ]);
      if (u.ok && u.data) setUsers(u.data);
      if (r.ok && r.data) setRoles(r.data);
      if (g.ok && g.data) setGroups(g.data);
      if (p.ok && p.data) setPermissions(p.data);
      if (m.ok && m.data) setAdMappings(m.data);
      if (!u.ok || !r.ok || !g.ok || !p.ok || !m.ok) {
        setError(
          "Some directory data could not be loaded. You may need users:read and related permissions."
        );
      }
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setDirLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: "/administration" } },
      });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        await loadCatalog();
      } catch (e) {
        if (!cancelled) setError(errMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, loadCatalog]);

  useEffect(() => {
    if (!isAuthenticated || tab !== "directory") return;
    void loadDirectory();
  }, [isAuthenticated, tab, loadDirectory]);

  useEffect(() => {
    if (editUser) {
      setEditEmail(editUser.email);
      setEditDisplayName(editUser.display_name);
      setEditActive(editUser.is_active);
    }
  }, [editUser]);

  /** Infer direct roles from effective permissions (no GET /users/{id}/roles on API). */
  useEffect(() => {
    if (!editUser) {
      setEditInitialRoleIds(new Set());
      setEditRoleIds(new Set());
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await apiService.users.effectivePermissions(editUser.id);
        if (!res.ok || !res.data || cancelled) return;
        const permSet = new Set(res.data.permissions);
        const inferred = new Set<string>();
        for (const r of roles) {
          const rp = r.permissions ?? [];
          if (rp.length === 0) continue;
          if (rp.every((p) => permSet.has(p.slug))) inferred.add(r.id);
        }
        if (cancelled) return;
        setEditInitialRoleIds(new Set(inferred));
        setEditRoleIds(new Set(inferred));
      } catch {
        if (!cancelled) {
          setEditInitialRoleIds(new Set());
          setEditRoleIds(new Set());
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editUser, roles]);

  useEffect(() => {
    if (!editRole) {
      setEditRoleInitialPermIds(new Set());
      setEditRolePermIds(new Set());
      return;
    }
    setEditRoleDesc(editRole.description ?? "");
    const ids = new Set((editRole.permissions ?? []).map((p) => p.id));
    setEditRoleInitialPermIds(ids);
    setEditRolePermIds(ids);
  }, [editRole]);

  useEffect(() => {
    if (!editGroup) {
      setEditGroupInitialRoleIds(new Set());
      setEditGroupRoleIds(new Set());
      setEditGroupInitialPermIds(new Set());
      setEditGroupPermIds(new Set());
      return;
    }
    setEditGroupDesc(editGroup.description ?? "");
    const rids = new Set((editGroup.roles ?? []).map((r) => r.id));
    setEditGroupInitialRoleIds(rids);
    setEditGroupRoleIds(rids);
    const pids = new Set((editGroup.permissions ?? []).map((p) => p.id));
    setEditGroupInitialPermIds(pids);
    setEditGroupPermIds(pids);
  }, [editGroup]);

  useEffect(() => {
    if (editPerm) {
      setEditPermDesc(editPerm.description ?? "");
    }
  }, [editPerm]);

  useEffect(() => {
    if (editAd) {
      setEditAdGroupName(editAd.ad_group_name);
      setEditAdRoleId(editAd.role_id);
    }
  }, [editAd]);

  const resetSourceForm = () => {
    setSrcSlug("");
    setSrcName("");
    setSrcDesc("");
  };

  const resetCategoryForm = () => {
    setCatSlug("");
    setCatName("");
    setCatDesc("");
    setCatOrder(0);
  };

  const createSource = async () => {
    if (!srcSlug.trim() || !srcName.trim()) return;
    setSourceModalSubmitting(true);
    setError(null);
    try {
      const res = await apiService.catalog.createSource({
        slug: srcSlug.trim(),
        name: srcName.trim(),
        description: srcDesc.trim() || "—",
      });
      if (res.ok) {
        resetSourceForm();
        setCreateSourceModalOpen(false);
        await loadCatalog();
        showSnackbar({
          type: "success",
          title: "Source created",
        });
      }
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setSourceModalSubmitting(false);
    }
  };

  const createCategory = async () => {
    if (!catSlug.trim() || !catName.trim()) return;
    setCategoryModalSubmitting(true);
    setError(null);
    try {
      const res = await apiService.catalog.createCategory({
        slug: catSlug.trim(),
        name: catName.trim(),
        description: catDesc.trim() || "—",
        sort_order: catOrder,
      });
      if (res.ok) {
        resetCategoryForm();
        setCreateCategoryModalOpen(false);
        await loadCatalog();
        showSnackbar({
          type: "success",
          title: "Category created",
        });
      }
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setCategoryModalSubmitting(false);
    }
  };

  const runPendingDelete = async () => {
    if (!pendingDelete) return;
    setDeleteSubmitting(true);
    setError(null);
    try {
      switch (pendingDelete.k) {
        case "source":
          await apiService.catalog.deleteSource(pendingDelete.row.id);
          await loadCatalog();
          showSnackbar({ type: "success", title: "Source removed" });
          break;
        case "category":
          await apiService.catalog.deleteCategory(pendingDelete.row.id);
          await loadCatalog();
          showSnackbar({ type: "success", title: "Category removed" });
          break;
        case "user":
          await apiService.users.delete(pendingDelete.row.id);
          await loadDirectory();
          showSnackbar({ type: "success", title: "User removed" });
          break;
        case "role":
          await apiService.roles.delete(pendingDelete.row.id);
          await loadDirectory();
          showSnackbar({ type: "success", title: "Role removed" });
          break;
        case "group":
          await apiService.groups.delete(pendingDelete.row.id);
          await loadDirectory();
          showSnackbar({ type: "success", title: "Group removed" });
          break;
        case "permission":
          await apiService.permissions.delete(pendingDelete.row.id);
          await loadDirectory();
          showSnackbar({ type: "success", title: "Permission removed" });
          break;
        case "ad":
          await apiService.adMappings.delete(pendingDelete.row.id);
          await loadDirectory();
          showSnackbar({ type: "success", title: "Mapping removed" });
          break;
      }
      setPendingDelete(null);
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const submitCreateUser = async () => {
    if (!regUsername.trim() || !regEmail.trim() || regPassword.length < 8) {
      setError("Username, email, and password (min 8 characters) are required.");
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setError("Password and confirmation do not match.");
      return;
    }
    if (!canUsersWrite) {
      setError("You need the users:write permission to create users and assign roles.");
      return;
    }
    setRegSubmitting(true);
    setError(null);
    try {
      const regRes = await apiService.auth.register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
        display_name: regDisplayName.trim(),
      });
      if (!regRes.ok || !regRes.data) {
        setError("Registration did not return a user.");
        return;
      }
      const userId = regRes.data.id;
      const assignedRoleCount = regSelectedRoleIds.size;
      for (const roleId of Array.from(regSelectedRoleIds)) {
        await apiService.users.assignRole(userId, roleId);
      }
      setCreateUserOpen(false);
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      setRegPasswordConfirm("");
      setRegDisplayName("");
      setRegSelectedRoleIds(new Set());
      await loadDirectory();
      showSnackbar({
        type: "success",
        title: "User created",
        message:
          assignedRoleCount > 0 ? "Roles were assigned." : undefined,
      });
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setRegSubmitting(false);
    }
  };

  const submitEditUser = async () => {
    if (!editUser) return;
    setEditSubmitting(true);
    setError(null);
    try {
      await apiService.users.update(editUser.id, {
        email: editEmail.trim(),
        display_name: editDisplayName.trim(),
        is_active: editActive,
      });
      if (canUsersWrite) {
        const uid = editUser.id;
        for (const id of Array.from(editInitialRoleIds)) {
          if (!editRoleIds.has(id)) {
            await apiService.users.removeRole(uid, id);
          }
        }
        for (const id of Array.from(editRoleIds)) {
          if (!editInitialRoleIds.has(id)) {
            await apiService.users.assignRole(uid, id);
          }
        }
      }
      setEditUser(null);
      await loadDirectory();
      showSnackbar({ type: "success", title: "User updated" });
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setEditSubmitting(false);
    }
  };

  const toggleRegRole = (id: string) => {
    setRegSelectedRoleIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleEditRole = (id: string) => {
    setEditRoleIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleEditRolePerm = (id: string) => {
    setEditRolePermIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleEditGroupRole = (id: string) => {
    setEditGroupRoleIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleEditGroupPerm = (id: string) => {
    setEditGroupPermIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const submitCreateRole = async () => {
    if (!newRoleSlug.trim()) return;
    setRoleModalSubmitting(true);
    setError(null);
    try {
      const res = await apiService.roles.create({
        slug: newRoleSlug.trim(),
        description: newRoleDesc.trim(),
      });
      if (res.ok) {
        setCreateRoleOpen(false);
        setNewRoleSlug("");
        setNewRoleDesc("");
        await loadDirectory();
        showSnackbar({ type: "success", title: "Role created" });
      }
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setRoleModalSubmitting(false);
    }
  };

  const submitCreateGroup = async () => {
    if (!newGroupSlug.trim()) return;
    setGroupModalSubmitting(true);
    setError(null);
    try {
      const res = await apiService.groups.create({
        slug: newGroupSlug.trim(),
        description: newGroupDesc.trim(),
      });
      if (res.ok) {
        setCreateGroupOpen(false);
        setNewGroupSlug("");
        setNewGroupDesc("");
        await loadDirectory();
        showSnackbar({ type: "success", title: "Group created" });
      }
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setGroupModalSubmitting(false);
    }
  };

  const submitCreatePermission = async () => {
    if (!newPermSlug.trim()) return;
    setPermModalSubmitting(true);
    setError(null);
    try {
      const res = await apiService.permissions.create({
        slug: newPermSlug.trim(),
        description: newPermDesc.trim(),
      });
      if (res.ok) {
        setCreatePermOpen(false);
        setNewPermSlug("");
        setNewPermDesc("");
        await loadDirectory();
        showSnackbar({ type: "success", title: "Permission created" });
      }
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setPermModalSubmitting(false);
    }
  };

  const submitCreateAdMapping = async () => {
    if (!newAdGroupName.trim() || !newAdRoleId) return;
    setAdModalSubmitting(true);
    setError(null);
    try {
      const res = await apiService.adMappings.create({
        ad_group_name: newAdGroupName.trim(),
        role_id: newAdRoleId,
      });
      if (res.ok) {
        setCreateAdOpen(false);
        setNewAdGroupName("");
        setNewAdRoleId("");
        await loadDirectory();
        showSnackbar({ type: "success", title: "AD mapping created" });
      }
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setAdModalSubmitting(false);
    }
  };

  const submitEditRole = async () => {
    if (!editRole) return;
    setEditRoleSubmitting(true);
    setError(null);
    try {
      await apiService.roles.update(editRole.id, {
        description: editRoleDesc.trim(),
      });
      const rid = editRole.id;
      for (const id of Array.from(editRoleInitialPermIds)) {
        if (!editRolePermIds.has(id)) {
          await apiService.roles.removePermission(rid, id);
        }
      }
      for (const id of Array.from(editRolePermIds)) {
        if (!editRoleInitialPermIds.has(id)) {
          await apiService.roles.assignPermission(rid, id);
        }
      }
      setEditRole(null);
      await loadDirectory();
      showSnackbar({ type: "success", title: "Role updated" });
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setEditRoleSubmitting(false);
    }
  };

  const submitEditGroup = async () => {
    if (!editGroup) return;
    setEditGroupSubmitting(true);
    setError(null);
    try {
      await apiService.groups.update(editGroup.id, {
        description: editGroupDesc.trim(),
      });
      const gid = editGroup.id;
      for (const id of Array.from(editGroupInitialRoleIds)) {
        if (!editGroupRoleIds.has(id)) {
          await apiService.groups.removeRole(gid, id);
        }
      }
      for (const id of Array.from(editGroupRoleIds)) {
        if (!editGroupInitialRoleIds.has(id)) {
          await apiService.groups.assignRole(gid, id);
        }
      }
      for (const id of Array.from(editGroupInitialPermIds)) {
        if (!editGroupPermIds.has(id)) {
          await apiService.groups.removePermission(gid, id);
        }
      }
      for (const id of Array.from(editGroupPermIds)) {
        if (!editGroupInitialPermIds.has(id)) {
          await apiService.groups.assignPermission(gid, id);
        }
      }
      setEditGroup(null);
      await loadDirectory();
      showSnackbar({ type: "success", title: "Group updated" });
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setEditGroupSubmitting(false);
    }
  };

  const submitEditPermission = async () => {
    if (!editPerm) return;
    setEditPermSubmitting(true);
    setError(null);
    try {
      await apiService.permissions.update(editPerm.id, {
        description: editPermDesc.trim(),
      });
      setEditPerm(null);
      await loadDirectory();
      showSnackbar({ type: "success", title: "Permission updated" });
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setEditPermSubmitting(false);
    }
  };

  const submitEditAd = async () => {
    if (!editAd) return;
    if (!editAdGroupName.trim() || !editAdRoleId) return;
    setEditAdSubmitting(true);
    setError(null);
    try {
      await apiService.adMappings.update(editAd.id, {
        ad_group_name: editAdGroupName.trim(),
        role_id: editAdRoleId,
      });
      setEditAd(null);
      await loadDirectory();
      showSnackbar({ type: "success", title: "AD mapping updated" });
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setEditAdSubmitting(false);
    }
  };

  const sourceColumns: DataTableColumn<IdeahubIdeaSource>[] = [
    {
      id: "name",
      header: "Name",
      cell: (s) => (
        <div>
          <p className="font-medium text-slate-900">{s.name}</p>
          <p className="text-xs text-slate-500">{s.slug}</p>
        </div>
      ),
    },
    {
      id: "desc",
      header: "Description",
      className: "max-w-md text-slate-600",
      cell: (s) => s.description,
    },
    {
      id: "actions",
      header: "",
      headerClassName: "w-14",
      className: "w-14 text-right",
      cell: (s) => (
        <RowActionsMenu
          ariaLabel={`Actions for ${s.name}`}
          items={[
            {
              key: "del",
              label: "Delete",
              danger: true,
              onClick: () => setPendingDelete({ k: "source", row: s }),
            },
          ]}
        />
      ),
    },
  ];

  const categoryColumns: DataTableColumn<IdeahubIdeaCategory>[] = [
    {
      id: "name",
      header: "Name",
      cell: (c) => (
        <div>
          <p className="font-medium text-slate-900">{c.name}</p>
          <p className="text-xs text-slate-500">
            {c.slug} · order {c.sort_order}
          </p>
        </div>
      ),
    },
    {
      id: "desc",
      header: "Description",
      className: "max-w-md text-slate-600",
      cell: (c) => c.description,
    },
    {
      id: "actions",
      header: "",
      headerClassName: "w-14",
      className: "w-14 text-right",
      cell: (c) => (
        <RowActionsMenu
          ariaLabel={`Actions for ${c.name}`}
          items={[
            {
              key: "del",
              label: "Delete",
              danger: true,
              onClick: () => setPendingDelete({ k: "category", row: c }),
            },
          ]}
        />
      ),
    },
  ];

  const userColumns: DataTableColumn<IdeahubUserRead>[] = useMemo(
    () => [
      {
        id: "user",
        header: "User",
        cell: (u) => (
          <div>
            <p className="font-medium text-slate-900">{u.username}</p>
            <p className="text-xs text-slate-500">{u.display_name || "—"}</p>
          </div>
        ),
      },
      { id: "email", header: "Email", cell: (u) => u.email },
      {
        id: "provider",
        header: "Provider",
        className: "text-slate-600",
        cell: (u) => u.provider,
      },
      {
        id: "active",
        header: "Status",
        cell: (u) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              u.is_active
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {u.is_active ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        id: "login",
        header: "Last login",
        className: "text-slate-600 text-xs whitespace-nowrap",
        cell: (u) => formatShortDate(u.last_login_at),
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-14",
        className: "w-14 text-right",
        cell: (u) =>
          canUsersWrite ? (
            <RowActionsMenu
              ariaLabel={`Actions for ${u.username}`}
              items={[
                {
                  key: "edit",
                  label: "Edit",
                  onClick: () => setEditUser(u),
                },
                {
                  key: "del",
                  label: "Delete",
                  danger: true,
                  onClick: () => setPendingDelete({ k: "user", row: u }),
                },
              ]}
            />
          ) : (
            <span className="text-slate-300">—</span>
          ),
      },
    ],
    [canUsersWrite]
  );

  const roleColumns: DataTableColumn<IdeahubRoleRead>[] = useMemo(
    () => [
      {
        id: "slug",
        header: "Role",
        cell: (r: IdeahubRoleRead) => (
          <span className="font-mono text-xs">{r.slug}</span>
        ),
      },
      {
        id: "desc",
        header: "Description",
        className: "text-slate-600",
        cell: (r: IdeahubRoleRead) => r.description || "—",
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-14",
        className: "w-14 text-right",
        cell: (r: IdeahubRoleRead) =>
          canRolesWrite ? (
            <RowActionsMenu
              ariaLabel={`Actions for ${r.slug}`}
              items={[
                {
                  key: "edit",
                  label: "Edit",
                  onClick: () => setEditRole(r),
                },
                {
                  key: "del",
                  label: "Delete",
                  danger: true,
                  onClick: () => setPendingDelete({ k: "role", row: r }),
                },
              ]}
            />
          ) : (
            <span className="text-slate-300">—</span>
          ),
      },
    ],
    [canRolesWrite]
  );

  const groupColumns: DataTableColumn<IdeahubGroupRead>[] = useMemo(
    () => [
      {
        id: "slug",
        header: "Group",
        cell: (g: IdeahubGroupRead) => (
          <span className="font-mono text-xs">{g.slug}</span>
        ),
      },
      {
        id: "desc",
        header: "Description",
        className: "text-slate-600",
        cell: (g: IdeahubGroupRead) => g.description || "—",
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-14",
        className: "w-14 text-right",
        cell: (g: IdeahubGroupRead) =>
          canGroupsWrite ? (
            <RowActionsMenu
              ariaLabel={`Actions for ${g.slug}`}
              items={[
                {
                  key: "edit",
                  label: "Edit",
                  onClick: () => setEditGroup(g),
                },
                {
                  key: "del",
                  label: "Delete",
                  danger: true,
                  onClick: () => setPendingDelete({ k: "group", row: g }),
                },
              ]}
            />
          ) : (
            <span className="text-slate-300">—</span>
          ),
      },
    ],
    [canGroupsWrite]
  );

  const permColumns: DataTableColumn<IdeahubPermissionRead>[] = useMemo(
    () => [
      {
        id: "slug",
        header: "Permission",
        cell: (p: IdeahubPermissionRead) => (
          <span className="font-mono text-xs">{p.slug}</span>
        ),
      },
      {
        id: "desc",
        header: "Description",
        className: "text-slate-600",
        cell: (p: IdeahubPermissionRead) => p.description || "—",
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-14",
        className: "w-14 text-right",
        cell: (p: IdeahubPermissionRead) =>
          canPermissionsWrite ? (
            <RowActionsMenu
              ariaLabel={`Actions for ${p.slug}`}
              items={[
                {
                  key: "edit",
                  label: "Edit",
                  onClick: () => setEditPerm(p),
                },
                {
                  key: "del",
                  label: "Delete",
                  danger: true,
                  onClick: () =>
                    setPendingDelete({ k: "permission", row: p }),
                },
              ]}
            />
          ) : (
            <span className="text-slate-300">—</span>
          ),
      },
    ],
    [canPermissionsWrite]
  );

  const adColumns: DataTableColumn<IdeahubADMappingRead>[] = useMemo(
    () => [
      {
        id: "ad",
        header: "AD group",
        cell: (m: IdeahubADMappingRead) => m.ad_group_name,
      },
      {
        id: "role",
        header: "Role",
        className: "text-xs",
        cell: (m: IdeahubADMappingRead) => {
          const slug = roles.find((r) => r.id === m.role_id)?.slug;
          return (
            <span className="font-mono text-xs">
              {slug ?? m.role_id}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-14",
        className: "w-14 text-right",
        cell: (m: IdeahubADMappingRead) =>
          canAdMappingsWrite ? (
            <RowActionsMenu
              ariaLabel={`Actions for ${m.ad_group_name}`}
              items={[
                {
                  key: "edit",
                  label: "Edit",
                  onClick: () => setEditAd(m),
                },
                {
                  key: "del",
                  label: "Delete",
                  danger: true,
                  onClick: () => setPendingDelete({ k: "ad", row: m }),
                },
              ]}
            />
          ) : (
            <span className="text-slate-300">—</span>
          ),
      },
    ],
    [canAdMappingsWrite, roles]
  );

  const deleteModalCopy = (p: PendingDelete | null) => {
    if (!p) return { title: "", message: "", type: "danger" as const };
    switch (p.k) {
      case "source":
        return {
          title: "Delete idea source?",
          message: `Remove “${p.row.name}” (${p.row.slug})? Ideas may still reference this source historically.`,
          type: "danger" as const,
        };
      case "category":
        return {
          title: "Delete category?",
          message: `Remove “${p.row.name}”?`,
          type: "danger" as const,
        };
      case "user":
        return {
          title: "Delete user?",
          message: `Remove ${p.row.username}? They will no longer be able to sign in.`,
          type: "danger" as const,
        };
      case "role":
        return {
          title: "Delete role?",
          message: `Remove role ${p.row.slug}?`,
          type: "danger" as const,
        };
      case "group":
        return {
          title: "Delete group?",
          message: `Remove group ${p.row.slug}?`,
          type: "danger" as const,
        };
      case "permission":
        return {
          title: "Delete permission?",
          message: `Remove permission ${p.row.slug}? This may break authorization checks.`,
          type: "danger" as const,
        };
      case "ad":
        return {
          title: "Remove AD mapping?",
          message: `Remove mapping for ${p.row.ad_group_name}?`,
          type: "danger" as const,
        };
    }
  };

  const dc = deleteModalCopy(pendingDelete);

  if (!isAuthenticated) return null;

  if (loading && sources.length === 0 && categories.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" color="primary" />
        <p className="text-slate-600">Loading administration…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="relative overflow-hidden border-b border-slate-200/90">
        <div className={PAGE_HERO_SURFACE} aria-hidden />
        <div
          className="absolute inset-0 opacity-80"
          style={{ backgroundImage: PAGE_HERO_PATTERN_LIGHT }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Administration
          </h1>
          <p className="mt-2 max-w-2xl text-base text-gray-600">
            Manage idea sources, assessment categories, and directory records.
            Templates and generated documents live under their own sidebar
            entries. Use row menus for destructive actions — confirmations
            protect your data.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl space-y-6 px-4 sm:px-6">
        {error && (
          <CompactErrorWithToast
            error={error}
            title="Notice"
            onRetry={() => setError(null)}
          />
        )}

        <SegmentedTabs<Tab>
          aria-label="Administration sections"
          items={[
            { id: "sources", label: "Idea sources" },
            { id: "categories", label: "Categories" },
            { id: "directory", label: "Directory" },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === "sources" && (
          <Card className="border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Idea sources
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Collection channels shown when ideas are submitted.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  setError(null);
                  resetSourceForm();
                  setCreateSourceModalOpen(true);
                }}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add source
              </Button>
            </div>
            <div className="mt-6">
              <DataTable
                columns={sourceColumns}
                rows={sources}
                getRowKey={(s) => String(s.id)}
                emptyMessage="No sources yet. Add one to get started."
              />
            </div>
          </Card>
        )}

        {tab === "categories" && (
          <Card className="border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Assessment categories
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Used for routing and reporting on submitted ideas.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  setError(null);
                  resetCategoryForm();
                  setCreateCategoryModalOpen(true);
                }}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add category
              </Button>
            </div>
            <div className="mt-6">
              <DataTable
                columns={categoryColumns}
                rows={[...categories].sort(
                  (a, b) => a.sort_order - b.sort_order
                )}
                getRowKey={(c) => String(c.id)}
                emptyMessage="No categories yet. Add one to get started."
              />
            </div>
          </Card>
        )}

        {tab === "directory" && (
          <div className="space-y-8">
            {dirLoading && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                <LoadingSpinner size="sm" color="primary" />
                Refreshing directory…
              </div>
            )}

            <Card className="space-y-4 border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Users
                  </h2>
                  <p className="text-sm text-slate-600">
                    Create accounts, update profile fields, or deactivate users.
                    User actions require the{" "}
                    <code className="rounded bg-slate-100 px-1 text-xs">
                      users:write
                    </code>{" "}
                    permission (shown in your JWT).
                  </p>
                </div>
                {canUsersWrite ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setError(null);
                      setRegSelectedRoleIds(new Set());
                      setRegPasswordConfirm("");
                      setCreateUserOpen(true);
                    }}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add user
                  </Button>
                ) : (
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-md">
                    Sign in with an account that has{" "}
                    <span className="font-mono text-xs">users:write</span> to add
                    or edit users.
                  </p>
                )}
              </div>
              <DataTable
                columns={userColumns}
                rows={users}
                getRowKey={(u) => u.id}
                emptyMessage="No users returned — check API permissions."
              />
            </Card>

            <Card className="space-y-4 border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Roles</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Create roles and attach permissions. Requires{" "}
                    <code className="rounded bg-slate-100 px-1 text-xs">
                      roles:write
                    </code>
                    .
                  </p>
                </div>
                {canRolesWrite ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setError(null);
                      setNewRoleSlug("");
                      setNewRoleDesc("");
                      setCreateRoleOpen(true);
                    }}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add role
                  </Button>
                ) : null}
              </div>
              <DataTable
                columns={roleColumns}
                rows={roles}
                getRowKey={(r) => r.id}
                emptyMessage="No roles."
              />
            </Card>

            <Card className="space-y-4 border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Groups</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Groups bundle roles and direct permissions. Requires{" "}
                    <code className="rounded bg-slate-100 px-1 text-xs">
                      groups:write
                    </code>
                    .
                  </p>
                </div>
                {canGroupsWrite ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setError(null);
                      setNewGroupSlug("");
                      setNewGroupDesc("");
                      setCreateGroupOpen(true);
                    }}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add group
                  </Button>
                ) : null}
              </div>
              <DataTable
                columns={groupColumns}
                rows={groups}
                getRowKey={(g) => g.id}
                emptyMessage="No groups."
              />
            </Card>

            <Card className="space-y-4 border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Permissions
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Permission slugs are referenced in code. Requires{" "}
                    <code className="rounded bg-slate-100 px-1 text-xs">
                      permissions:write
                    </code>
                    .
                  </p>
                </div>
                {canPermissionsWrite ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setError(null);
                      setNewPermSlug("");
                      setNewPermDesc("");
                      setCreatePermOpen(true);
                    }}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add permission
                  </Button>
                ) : null}
              </div>
              <DataTable
                columns={permColumns}
                rows={permissions}
                getRowKey={(p) => p.id}
                emptyMessage="No permissions."
              />
            </Card>

            <Card className="space-y-4 border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    AD mappings
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Map Active Directory group names to application roles.
                    Requires{" "}
                    <code className="rounded bg-slate-100 px-1 text-xs">
                      ad_mappings:write
                    </code>
                    .
                  </p>
                </div>
                {canAdMappingsWrite ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setError(null);
                      setNewAdGroupName("");
                      setNewAdRoleId(roles[0]?.id ?? "");
                      setCreateAdOpen(true);
                    }}
                    disabled={roles.length === 0}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add mapping
                  </Button>
                ) : null}
              </div>
              <DataTable
                columns={adColumns}
                rows={adMappings}
                getRowKey={(m) => m.id}
                emptyMessage="No AD mappings."
              />
            </Card>
          </div>
        )}
      </div>

      <SimpleModal
        isOpen={createSourceModalOpen}
        onClose={() => {
          if (sourceModalSubmitting) return;
          setCreateSourceModalOpen(false);
          resetSourceForm();
        }}
        title="Add idea source"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              disabled={sourceModalSubmitting}
              onClick={() => {
                setCreateSourceModalOpen(false);
                resetSourceForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={sourceModalSubmitting}
              onClick={() => void createSource()}
            >
              Create source
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Define a channel ideas can be attributed to (e.g. workshop, portal).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Slug"
              placeholder="e.g. branch-workshop"
              value={srcSlug}
              onChange={(e) => setSrcSlug(e.target.value)}
              autoComplete="off"
            />
            <Input
              label="Display name"
              placeholder="Shown in dropdowns"
              value={srcName}
              onChange={(e) => setSrcName(e.target.value)}
            />
          </div>
          <Textarea
            label="Description"
            placeholder="Short explanation for submitters and admins"
            value={srcDesc}
            onChange={(e) => setSrcDesc(e.target.value)}
            rows={3}
          />
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={createCategoryModalOpen}
        onClose={() => {
          if (categoryModalSubmitting) return;
          setCreateCategoryModalOpen(false);
          resetCategoryForm();
        }}
        title="Add assessment category"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              disabled={categoryModalSubmitting}
              onClick={() => {
                setCreateCategoryModalOpen(false);
                resetCategoryForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={categoryModalSubmitting}
              onClick={() => void createCategory()}
            >
              Create category
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Categories drive assessment routing and reporting. Lower sort order
            appears first in lists.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Slug"
              placeholder="e.g. customer-experience"
              value={catSlug}
              onChange={(e) => setCatSlug(e.target.value)}
              autoComplete="off"
            />
            <Input
              label="Display name"
              placeholder="Shown in forms and tables"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
          </div>
          <Input
            label="Sort order"
            type="number"
            placeholder="0"
            value={catOrder}
            onChange={(e) =>
              setCatOrder(
                e.target.value === "" ? 0 : Number(e.target.value)
              )
            }
          />
          <Textarea
            label="Description"
            placeholder="Assessment criteria or routing notes"
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
            rows={3}
          />
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={createUserOpen}
        onClose={() => {
          if (regSubmitting) return;
          setCreateUserOpen(false);
          setRegSelectedRoleIds(new Set());
          setRegPasswordConfirm("");
        }}
        title="Add user"
        size="xl"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setCreateUserOpen(false)}
              disabled={regSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={regSubmitting}
              disabled={
                regSubmitting ||
                !regUsername.trim() ||
                !regEmail.trim() ||
                regPassword.length < 8 ||
                regPassword !== regPasswordConfirm
              }
              onClick={() => void submitCreateUser()}
            >
              Create account
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="rounded-xl border border-[#0051FF]/20 bg-gradient-to-br from-[#F0F7FF] via-white to-white px-4 py-3.5 shadow-sm">
            <p className="text-sm font-semibold text-[#0033A1]">
              New account
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              The person will sign in with the username and password you set
              below. You can assign roles now or edit them later from this
              directory.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Profile
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                autoComplete="off"
              />
              <Input
                label="Email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="mt-4">
              <Input
                label="Display name"
                value={regDisplayName}
                onChange={(e) => setRegDisplayName(e.target.value)}
                placeholder="Optional"
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Password
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                helperText="Minimum 8 characters."
              />
              <Input
                label="Confirm password"
                type="password"
                value={regPasswordConfirm}
                onChange={(e) => setRegPasswordConfirm(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                error={
                  regPasswordConfirm.length > 0 &&
                  regPassword !== regPasswordConfirm
                    ? "Does not match the password above"
                    : undefined
                }
              />
            </div>
          </div>

          {roles.length > 0 && (
            <fieldset className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm">
              <legend className="px-1 text-sm font-semibold text-slate-900">
                Role access
              </legend>
              <p className="mb-3 text-sm text-slate-600">
                Optional. Selected roles are attached to the new account
                immediately after it is created.
              </p>
              <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                {roles.map((r) => (
                  <label
                    key={r.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 transition hover:border-[#0051FF]/25 hover:shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={regSelectedRoleIds.has(r.id)}
                      onChange={() => toggleRegRole(r.id)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0051FF] focus:ring-[#0051FF]"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-slate-900">
                        {r.slug}
                      </span>
                      {r.description ? (
                        <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                          {r.description}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={!!editUser}
        onClose={() => !editSubmitting && setEditUser(null)}
        title="Edit user"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditUser(null)}
              disabled={editSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={editSubmitting}
              onClick={() => void submitEditUser()}
            >
              Save changes
            </Button>
          </>
        }
      >
        {editUser && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Username{" "}
              <span className="font-mono font-medium text-slate-900">
                {editUser.username}
              </span>{" "}
              cannot be changed here.
            </p>
            <Input
              label="Email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <Input
              label="Display name"
              value={editDisplayName}
              onChange={(e) => setEditDisplayName(e.target.value)}
            />
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={editActive}
                onChange={(e) => setEditActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0051FF] focus:ring-[#0051FF]"
              />
              Account active
            </label>
            {canUsersWrite && roles.length > 0 && (
              <fieldset className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <legend className="px-1 text-sm font-semibold text-slate-800">
                  Roles
                </legend>
                <p className="mb-3 text-xs text-slate-500">
                  Initial checkboxes are inferred from effective permissions vs
                  each role&apos;s permissions (approximate). Adjust and save to
                  add or remove assignments.
                </p>
                <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                  {roles.map((r) => (
                    <label
                      key={r.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-2 py-1.5 hover:bg-white hover:shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={editRoleIds.has(r.id)}
                        onChange={() => toggleEditRole(r.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0051FF] focus:ring-[#0051FF]"
                      />
                      <span>
                        <span className="font-mono text-xs text-slate-900">
                          {r.slug}
                        </span>
                        {r.description ? (
                          <span className="ml-2 text-xs text-slate-500">
                            {r.description}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        )}
      </SimpleModal>

      <SimpleModal
        isOpen={createRoleOpen}
        onClose={() => {
          if (roleModalSubmitting) return;
          setCreateRoleOpen(false);
        }}
        title="Add role"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              disabled={roleModalSubmitting}
              onClick={() => setCreateRoleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={roleModalSubmitting}
              disabled={roleModalSubmitting || !newRoleSlug.trim()}
              onClick={() => void submitCreateRole()}
            >
              Create role
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Slug is permanent; use it consistently in authorization checks.
          </p>
          <Input
            label="Slug"
            placeholder="e.g. idea-reviewer"
            value={newRoleSlug}
            onChange={(e) => setNewRoleSlug(e.target.value)}
            autoComplete="off"
          />
          <Textarea
            label="Description"
            placeholder="What this role is for"
            value={newRoleDesc}
            onChange={(e) => setNewRoleDesc(e.target.value)}
            rows={3}
          />
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={createGroupOpen}
        onClose={() => {
          if (groupModalSubmitting) return;
          setCreateGroupOpen(false);
        }}
        title="Add group"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              disabled={groupModalSubmitting}
              onClick={() => setCreateGroupOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={groupModalSubmitting}
              disabled={groupModalSubmitting || !newGroupSlug.trim()}
              onClick={() => void submitCreateGroup()}
            >
              Create group
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Slug"
            placeholder="e.g. branch-managers"
            value={newGroupSlug}
            onChange={(e) => setNewGroupSlug(e.target.value)}
            autoComplete="off"
          />
          <Textarea
            label="Description"
            value={newGroupDesc}
            onChange={(e) => setNewGroupDesc(e.target.value)}
            rows={3}
          />
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={createPermOpen}
        onClose={() => {
          if (permModalSubmitting) return;
          setCreatePermOpen(false);
        }}
        title="Add permission"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              disabled={permModalSubmitting}
              onClick={() => setCreatePermOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={permModalSubmitting}
              disabled={permModalSubmitting || !newPermSlug.trim()}
              onClick={() => void submitCreatePermission()}
            >
              Create permission
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Slug must match what the API checks (e.g. ideas:write).
          </p>
          <Input
            label="Slug"
            placeholder="e.g. ideas:write"
            value={newPermSlug}
            onChange={(e) => setNewPermSlug(e.target.value)}
            autoComplete="off"
          />
          <Textarea
            label="Description"
            value={newPermDesc}
            onChange={(e) => setNewPermDesc(e.target.value)}
            rows={2}
          />
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={createAdOpen}
        onClose={() => {
          if (adModalSubmitting) return;
          setCreateAdOpen(false);
        }}
        title="Add AD mapping"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              disabled={adModalSubmitting}
              onClick={() => setCreateAdOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={adModalSubmitting}
              disabled={
                adModalSubmitting ||
                !newAdGroupName.trim() ||
                !newAdRoleId
              }
              onClick={() => void submitCreateAdMapping()}
            >
              Create mapping
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="AD group name"
            placeholder="As reported by the identity provider"
            value={newAdGroupName}
            onChange={(e) => setNewAdGroupName(e.target.value)}
            autoComplete="off"
          />
          <Select
            label="Application role"
            value={newAdRoleId}
            onChange={(e) => setNewAdRoleId(e.target.value)}
            options={roles.map((r) => ({
              value: r.id,
              label: r.slug,
            }))}
            placeholder="Choose a role"
          />
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={!!editRole}
        onClose={() => !editRoleSubmitting && setEditRole(null)}
        title="Edit role"
        size="xl"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditRole(null)}
              disabled={editRoleSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={editRoleSubmitting}
              onClick={() => void submitEditRole()}
            >
              Save changes
            </Button>
          </>
        }
      >
        {editRole && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Slug{" "}
              <span className="font-mono font-medium text-slate-900">
                {editRole.slug}
              </span>{" "}
              cannot be changed here.
            </p>
            <Textarea
              label="Description"
              value={editRoleDesc}
              onChange={(e) => setEditRoleDesc(e.target.value)}
              rows={3}
            />
            {permissions.length > 0 ? (
              <fieldset className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <legend className="px-1 text-sm font-semibold text-slate-800">
                  Permissions on this role
                </legend>
                <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                  {permissions.map((p) => (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-2 py-1.5 hover:bg-white hover:shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={editRolePermIds.has(p.id)}
                        onChange={() => toggleEditRolePerm(p.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0051FF] focus:ring-[#0051FF]"
                      />
                      <span>
                        <span className="font-mono text-xs text-slate-900">
                          {p.slug}
                        </span>
                        {p.description ? (
                          <span className="ml-2 text-xs text-slate-500">
                            {p.description}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>
        )}
      </SimpleModal>

      <SimpleModal
        isOpen={!!editGroup}
        onClose={() => !editGroupSubmitting && setEditGroup(null)}
        title="Edit group"
        size="xl"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditGroup(null)}
              disabled={editGroupSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={editGroupSubmitting}
              onClick={() => void submitEditGroup()}
            >
              Save changes
            </Button>
          </>
        }
      >
        {editGroup && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Slug{" "}
              <span className="font-mono font-medium text-slate-900">
                {editGroup.slug}
              </span>{" "}
              cannot be changed here.
            </p>
            <Textarea
              label="Description"
              value={editGroupDesc}
              onChange={(e) => setEditGroupDesc(e.target.value)}
              rows={3}
            />
            {roles.length > 0 ? (
              <fieldset className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <legend className="px-1 text-sm font-semibold text-slate-800">
                  Roles
                </legend>
                <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                  {roles.map((r) => (
                    <label
                      key={r.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-2 py-1.5 hover:bg-white hover:shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={editGroupRoleIds.has(r.id)}
                        onChange={() => toggleEditGroupRole(r.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0051FF] focus:ring-[#0051FF]"
                      />
                      <span className="font-mono text-xs text-slate-900">
                        {r.slug}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
            {permissions.length > 0 ? (
              <fieldset className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <legend className="px-1 text-sm font-semibold text-slate-800">
                  Direct permissions
                </legend>
                <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                  {permissions.map((p) => (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-2 py-1.5 hover:bg-white hover:shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={editGroupPermIds.has(p.id)}
                        onChange={() => toggleEditGroupPerm(p.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0051FF] focus:ring-[#0051FF]"
                      />
                      <span className="font-mono text-xs text-slate-900">
                        {p.slug}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>
        )}
      </SimpleModal>

      <SimpleModal
        isOpen={!!editPerm}
        onClose={() => !editPermSubmitting && setEditPerm(null)}
        title="Edit permission"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditPerm(null)}
              disabled={editPermSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={editPermSubmitting}
              onClick={() => void submitEditPermission()}
            >
              Save changes
            </Button>
          </>
        }
      >
        {editPerm && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Slug{" "}
              <span className="font-mono font-medium text-slate-900">
                {editPerm.slug}
              </span>{" "}
              cannot be changed here.
            </p>
            <Textarea
              label="Description"
              value={editPermDesc}
              onChange={(e) => setEditPermDesc(e.target.value)}
              rows={4}
            />
          </div>
        )}
      </SimpleModal>

      <SimpleModal
        isOpen={!!editAd}
        onClose={() => !editAdSubmitting && setEditAd(null)}
        title="Edit AD mapping"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditAd(null)}
              disabled={editAdSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={editAdSubmitting}
              disabled={
                editAdSubmitting ||
                !editAdGroupName.trim() ||
                !editAdRoleId
              }
              onClick={() => void submitEditAd()}
            >
              Save changes
            </Button>
          </>
        }
      >
        {editAd && (
          <div className="space-y-4">
            <Input
              label="AD group name"
              value={editAdGroupName}
              onChange={(e) => setEditAdGroupName(e.target.value)}
              autoComplete="off"
            />
            <Select
              label="Application role"
              value={editAdRoleId}
              onChange={(e) => setEditAdRoleId(e.target.value)}
              options={roles.map((r) => ({
                value: r.id,
                label: r.slug,
              }))}
            />
          </div>
        )}
      </SimpleModal>

      <ConfirmationModal
        isOpen={!!pendingDelete}
        onClose={() => !deleteSubmitting && setPendingDelete(null)}
        onConfirm={() => void runPendingDelete()}
        title={dc.title}
        message={dc.message}
        type={dc.type}
        isLoading={deleteSubmitting}
      />
    </div>
  );
};
