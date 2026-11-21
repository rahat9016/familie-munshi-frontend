"use client";

import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { IListMeta } from "@/src/types/common/common";
import { IPermission, IPermissionTreeGroup } from "@/src/types/permission";
import { ChangeEvent, useMemo, useState } from "react";
import PermissionModuleFilter from "./PermissionModuleFilter";
import PermissionsTable from "./PermissionsTable";
import PermissionViewModal from "./PermissionViewModal";
import { GetPermissionColumns } from "./TableColumns/PermissionColumns";
import {
  PERMISSION_TREE_ENDPOINT,
  PERMISSIONS_ENDPOINT,
  PERMISSIONS_QUERY_KEY,
} from "./utils/permissionData";

/** Read-only catalogue — permissions are assigned per role (Roles page). */
export default function PermissionsPage() {
  const [viewId, setViewId] = useState<string>();
  const [module, setModule] = useState("");

  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();
  const { search, debouncedSearch, handleSearchChange } =
    useSearchDebounce(300);

  // Module options: GET /permissions/tree
  const { data: treeRes, isLoading: isTreeLoading } = useGet<
    IPermissionTreeGroup[]
  >(PERMISSION_TREE_ENDPOINT, [PERMISSIONS_QUERY_KEY, "tree"], undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const modules = useMemo(
    () =>
      (Array.isArray(treeRes?.data) ? treeRes.data : [])
        .map((g) => g.module)
        .sort(),
    [treeRes]
  );

  // GET /permissions?search=&module=&page=&size= (size max 100)
  const { data, isLoading, isFetching } = useGet<IPermission[]>(
    PERMISSIONS_ENDPOINT,
    [PERMISSIONS_QUERY_KEY],
    {
      search: debouncedSearch.trim(),
      module: module || undefined,
      page: currentPage,
      size: itemsPerPage > 0 ? Math.min(itemsPerPage, 100) : undefined,
    }
  );
  const items = data?.data ?? [];
  const totalRecords =
    (data?.meta as unknown as IListMeta | undefined)?.totalRecords ?? 0;

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e);
    setCurrentPage(1);
  };

  const onModuleChange = (value: string) => {
    setModule(value);
    setCurrentPage(1);
  };

  const columns = useMemo(
    () => GetPermissionColumns({ onView: (p) => setViewId(p.id) }),
    []
  );

  return (
    <div>
      <PermissionsTable
        columns={columns}
        data={items}
        isLoading={isLoading || isFetching}
        totalItems={totalRecords}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        search={search}
        showSearch
        handleSearchChange={onSearchChange}
        rightComponents={
          <PermissionModuleFilter
            value={module}
            onChange={onModuleChange}
            modules={modules}
            isLoading={isTreeLoading}
          />
        }
      />

      <PermissionViewModal
        permissionId={viewId}
        onClose={() => setViewId(undefined)}
      />
    </div>
  );
}
