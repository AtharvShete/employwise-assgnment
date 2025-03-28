import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"

interface User {
    id: number
    email: string
    first_name: string
    last_name: string
    avatar: string
}

interface UserCardProps {
    user: User
    onEdit: (user: User) => void
    onDelete: (user: User) => void
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex justify-center">
                    <div className="relative">
                        <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-md transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            {user.id}
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">
                            {user.first_name} {user.last_name}
                        </h2>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="pt-4 border-t border-border flex justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 mr-1 hover:bg-primary/10 hover:text-primary"
                            onClick={() => onEdit(user)}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 ml-1 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onDelete(user)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
