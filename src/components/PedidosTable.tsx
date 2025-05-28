
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, FileText } from "lucide-react";

interface PedidosTableProps {
  selectedPeriod: string;
}

// Mock data - em uma aplicação real, isso viria de uma API
const mockOrders = {
  today: [
    {
      id: "#PED-001",
      name: "João Silva",
      date: "28/05/2025 14:30",
      value: "R$ 299,90",
      email: "joao@email.com",
      paymentMethod: "cartao",
      status: "pago"
    },
    {
      id: "#PED-002",
      name: "Maria Santos",
      date: "28/05/2025 12:15",
      value: "R$ 189,50",
      email: "maria@email.com",
      paymentMethod: "pix",
      status: "pago"
    },
    {
      id: "#PED-003",
      name: "Pedro Oliveira",
      date: "28/05/2025 10:45",
      value: "R$ 450,00",
      email: "pedro@email.com",
      paymentMethod: "boleto",
      status: "pendente"
    },
  ],
  yesterday: [
    {
      id: "#PED-004",
      name: "Ana Costa",
      date: "27/05/2025 16:20",
      value: "R$ 320,75",
      email: "ana@email.com",
      paymentMethod: "cartao",
      status: "pago"
    },
    {
      id: "#PED-005",
      name: "Carlos Lima",
      date: "27/05/2025 11:30",
      value: "R$ 180,90",
      email: "carlos@email.com",
      paymentMethod: "pix",
      status: "pago"
    },
  ],
  "7days": [
    {
      id: "#PED-006",
      name: "Fernanda Rocha",
      date: "26/05/2025 15:10",
      value: "R$ 275,40",
      email: "fernanda@email.com",
      paymentMethod: "cartao",
      status: "pago"
    },
    {
      id: "#PED-007",
      name: "Roberto Silva",
      date: "25/05/2025 09:45",
      value: "R$ 399,99",
      email: "roberto@email.com",
      paymentMethod: "boleto",
      status: "pendente"
    },
  ],
  month: [
    {
      id: "#PED-008",
      name: "Luciana Ferreira",
      date: "20/05/2025 13:25",
      value: "R$ 520,80",
      email: "luciana@email.com",
      paymentMethod: "pix",
      status: "pago"
    },
  ],
};

const getPaymentIcon = (method: string) => {
  switch (method) {
    case "cartao":
      return <CreditCard className="w-4 h-4" />;
    case "pix":
      return <Smartphone className="w-4 h-4" />;
    case "boleto":
      return <FileText className="w-4 h-4" />;
    default:
      return null;
  }
};

const getPaymentLabel = (method: string) => {
  switch (method) {
    case "cartao":
      return "Cartão";
    case "pix":
      return "PIX";
    case "boleto":
      return "Boleto";
    default:
      return method;
  }
};

export function PedidosTable({ selectedPeriod }: PedidosTableProps) {
  const orders = mockOrders[selectedPeriod as keyof typeof mockOrders] || [];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Lista de Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">Pedido</TableHead>
              <TableHead className="text-gray-400">Cliente</TableHead>
              <TableHead className="text-gray-400">Data</TableHead>
              <TableHead className="text-gray-400">Valor</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Pagamento</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <TableRow key={index} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="text-white font-medium">{order.id}</TableCell>
                  <TableCell className="text-white">{order.name}</TableCell>
                  <TableCell className="text-gray-300">{order.date}</TableCell>
                  <TableCell className="text-white font-semibold">{order.value}</TableCell>
                  <TableCell className="text-gray-300">{order.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-300">
                      {getPaymentIcon(order.paymentMethod)}
                      {getPaymentLabel(order.paymentMethod)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={order.status === "pago" ? "default" : "secondary"}
                      className={
                        order.status === "pago" 
                          ? "bg-green-600 hover:bg-green-500 text-white" 
                          : "bg-yellow-600 hover:bg-yellow-500 text-white"
                      }
                    >
                      {order.status === "pago" ? "Pago" : "Pendente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                  Nenhum pedido encontrado para o período selecionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
