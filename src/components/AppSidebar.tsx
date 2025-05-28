
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  ShoppingCart,
  TrendingUp,
  Users,
  Calendar,
  Filter
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Vendas",
    url: "#",
    icon: ShoppingCart,
  },
  {
    title: "Faturamento",
    url: "#",
    icon: DollarSign,
  },
  {
    title: "Análises",
    url: "#",
    icon: BarChart3,
  },
  {
    title: "Pagamentos",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "CRM",
    url: "#",
    icon: Users,
  },
  {
    title: "Relatórios",
    url: "#",
    icon: TrendingUp,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SalesHub
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="w-full justify-start gap-3 px-3 py-2.5 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <a href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
