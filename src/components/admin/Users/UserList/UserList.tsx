"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useState } from "react";
import { toast } from "react-toastify";
import { mockUsersList } from "../data/mockUserData";
import CreateUpdateUser from "../Form/CreateUpdateUser";
import { UserFormValues } from "../Schema/userSchema";
import { GetUserColumns } from "../TableColumns/UserColumns";
import { IUser } from "../types";
import UsersTable from "../UsersTable";
import ViewUserInfoModal from "../ViewUserInfoModal";

type TStatusAction = "activate" | "deactivate" | null;

const resolveProfilePicture = (
  picture: UserFormValues["profilePicture"],
  fallback: string | null
) => {
  if (picture instanceof File) return URL.createObjectURL(picture);
  if (typeof picture === "string" && picture.trim()) return picture;
  return fallback;
};

export default function UserList() {
  const [users, setUsers] = useState<IUser[]>(mockUsersList);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IUser | undefined>();
  const [statusAction, setStatusAction] = useState<TStatusAction>(null);

  const { search, handleSearchChange } = useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const handleEdit = (item: IUser) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleView = (item: IUser) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleActivate = (item: IUser) => {
    setSelectedItem(item);
    setStatusAction("activate");
    setIsStatusConfirmOpen(true);
  };

  const handleDeactivate = (item: IUser) => {
    setSelectedItem(item);
    setStatusAction("deactivate");
    setIsStatusConfirmOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (!selectedItem || !statusAction) return;

    setUsers((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: statusAction === "activate" ? "ACTIVE" : "INACTIVE",
            }
          : item
      )
    );
    handleStatusConfirmClose();
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleStatusConfirmClose = () => {
    setIsStatusConfirmOpen(false);
    setStatusAction(null);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: UserFormValues) => {
    if (!selectedItem) return;

    setUsers((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              firstName: values.firstName,
              lastName: values.lastName,
              phone: values.phone || null,
              profilePicture: resolveProfilePicture(
                values.profilePicture,
                item.profilePicture
              ),
            }
          : item
      )
    );
    toast.success(`User "${values.firstName} ${values.lastName}" updated`);
    handleEditModalClose();
  };

  const filteredUsers = users.filter((item) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      `${item.firstName} ${item.lastName}`.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term);
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  const columns = GetUserColumns(
    handleView,
    handleEdit,
    handleActivate,
    handleDeactivate
  );

  return (
    <div>
      <UsersTable
        columns={columns}
        data={filteredUsers}
        totalItems={filteredUsers.length}
        currentPage={1}
        itemsPerPage={filteredUsers.length || 10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
      />

      <CreateUpdateUser
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />

      <ViewUserInfoModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        user={selectedItem}
      />

      <DeleteConfirmDialog
        isOpen={isStatusConfirmOpen}
        onClose={handleStatusConfirmClose}
        onConfirm={handleConfirmStatusChange}
        title={
          statusAction === "activate" ? "Activate User" : "Deactivate User"
        }
        description={`Are you sure you want to ${statusAction === "activate" ? "activate" : "deactivate"} this user?`}
        confirmLabel={statusAction === "activate" ? "Activate" : "Deactivate"}
        confirmClassName={
          statusAction === "activate"
            ? "bg-primary hover:bg-primary/90 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }
      />
    </div>
  );
}
