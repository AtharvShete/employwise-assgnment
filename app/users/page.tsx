"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, LogOut } from "lucide-react"
import UserEditModal from "@/components/user-edit-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import UserCard from "@/components/user-card"
import UserSkeletonCard from "@/components/user-skeleton-card"
import { userApi } from "@/lib/api"

interface User {
    id: number
    email: string
    first_name: string
    last_name: string
    avatar: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }

        fetchUsers(currentPage)
    }, [currentPage, router])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredUsers(users)
        } else {
            const filtered = users.filter(
                (user) =>
                    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            setFilteredUsers(filtered)
        }
    }, [searchQuery, users])

    const fetchUsers = async (page: number) => {
        setIsLoading(true)
        try {
            const data = await userApi.getUsers(page)
            setUsers(data.data)
            setFilteredUsers(data.data)
            setTotalPages(data.total_pages)
        } catch (error) {
            toast.error("Failed to fetch users. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditUser = (user: User) => {
        setSelectedUser(user)
        setIsEditModalOpen(true)
    }

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user)
        setIsDeleteModalOpen(true)
    }

    const handleUpdateUser = async (updatedUser: User) => {
        try {
            await userApi.updateUser(updatedUser.id, updatedUser)

            setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
            setIsEditModalOpen(false)

            toast.success("User updated successfully")
        } catch (error) {
            toast.error("Failed to update user. Please try again.")
        }
    }

    const confirmDeleteUser = async () => {
        if (!selectedUser) return

        try {
            await userApi.deleteUser(selectedUser.id)

            setUsers(users.filter((user) => user.id !== selectedUser.id))
            setIsDeleteModalOpen(false)

            toast.success("User deleted successfully")
        } catch (error) {
            toast.error("Failed to delete user. Please try again.")
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }

    return (
        <div className="container mx-auto py-8 px-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">User Management</h1>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 px-10">
                    {[...Array(8)].map((_, index) => (
                        <UserSkeletonCard key={index} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 px-10 py-10">
                        {filteredUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                            />
                        ))}
                    </div>

                    {filteredUsers.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No users found</p>
                        </div>
                    )}

                    <div className="flex justify-center mt-8 space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}

            {selectedUser && (
                <>
                    <UserEditModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        user={selectedUser}
                        onUpdate={handleUpdateUser}
                    />
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDeleteUser}
                        userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
                    />
                </>
            )}
        </div>
    )
}

