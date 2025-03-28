"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Edit, Trash2, LogOut } from "lucide-react"
import UserEditModal from "@/components/user-edit-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import { toast } from "sonner"

interface User {
    id: number
    email: string
    first_name: string
    last_name: string
    avatar: string
}

interface ApiResponse {
    page: number
    per_page: number
    total: number
    total_pages: number
    data: User[]
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
        // Check if user is logged in
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
            const response = await fetch(`https://reqres.in/api/users?page=${page}`)
            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }
            const data: ApiResponse = await response.json()
            setUsers(data.data)
            setFilteredUsers(data.data)
            setTotalPages(data.total_pages)
        } catch (error) {
            toast("Error", {
                description: "Failed to fetch users. Please try again.",
                variant: "destructive",
            })
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
            const response = await fetch(`https://reqres.in/api/users/${updatedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            })

            if (!response.ok) {
                throw new Error("Failed to update user")
            }

            // Update user in the local state
            setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
            setIsEditModalOpen(false)

            toast("Success", {
                description: "User updated successfully"
            })
        } catch (error) {
            toast("Error", {
                description: "Failed to update user. Please try again.",
                variant: "destructive"
            })
        }
    }

    const confirmDeleteUser = async () => {
        if (!selectedUser) return

        try {
            const response = await fetch(`https://reqres.in/api/users/${selectedUser.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete user")
            }

            // Remove user from the local state
            setUsers(users.filter((user) => user.id !== selectedUser.id))
            setIsDeleteModalOpen(false)

            toast("Success", {
                description: "User deleted successfully"
            })
        } catch (error) {
            toast("Error", {
                description: "Failed to delete user. Please try again.",
                variant: "destructive"
            })
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }

    return (
        <div className="container mx-auto py-8 px-4">
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
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <Card key={user.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="bg-primary/10 p-6 flex justify-center">
                                        <img
                                            src={user.avatar || "/placeholder.svg"}
                                            alt={`${user.first_name} ${user.last_name}`}
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold">
                                            {user.first_name} {user.last_name}
                                        </h2>
                                        <p className="text-muted-foreground">{user.email}</p>
                                        <div className="flex mt-4 space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteUser(user)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
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

