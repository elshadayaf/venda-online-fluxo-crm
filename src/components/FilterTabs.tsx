
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Filter } from "lucide-react";

interface FilterTabsProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const periods = [
  { id: "today", label: "Hoje", icon: Clock },
  { id: "yesterday", label: "Ontem", icon: Calendar },
  { id: "7days", label: "7 Dias", icon: Calendar },
  { id: "month", label: "Este Mês", icon: Calendar },
];

export function FilterTabs({ selectedPeriod, onPeriodChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-900 rounded-lg w-fit border border-gray-800">
      {periods.map((period) => (
        <Button
          key={period.id}
          variant={selectedPeriod === period.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onPeriodChange(period.id)}
          className={`flex items-center gap-2 transition-all ${
            selectedPeriod === period.id
              ? "bg-orange-600 shadow-sm text-white hover:bg-orange-500"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          <period.icon className="w-4 h-4" />
          {period.label}
        </Button>
      ))}
    </div>
  );
}
