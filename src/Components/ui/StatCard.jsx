import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, trend, trendValue, className }) {
    const isPositive = trend === "up";

    return (
        <Card className={cn("hover:shadow-lg transition-shadow", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h3 className="text-2xl font-bold mt-2">{value}</h3>
                        {trendValue && (
                            <div className={cn(
                                "flex items-center gap-1 mt-2 text-sm",
                                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                            )}>
                                {isPositive ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                <span>{Math.abs(trendValue)}%</span>
                            </div>
                        )}
                    </div>
                    <div className={cn(
                        "p-3 rounded-xl",
                        "bg-primary/10 text-primary"
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
