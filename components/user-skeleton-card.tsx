import { Card, CardContent } from "@/components/ui/card"

export default function UserSkeletonCard() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="bg-primary/5 p-6 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-muted animate-pulse"></div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <div className="h-5 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4 mx-auto"></div>
                    </div>
                    <div className="pt-4 border-t border-border flex justify-between">
                        <div className="h-9 bg-muted rounded animate-pulse w-[48%]"></div>
                        <div className="h-9 bg-muted rounded animate-pulse w-[48%]"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
