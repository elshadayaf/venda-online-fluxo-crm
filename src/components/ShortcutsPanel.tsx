
interface ShortcutsPanelProps {
  isVisible: boolean;
}

export function ShortcutsPanel({ isVisible }: ShortcutsPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 animate-fade-in">
      <h3 className="text-white font-semibold mb-2">Atalhos de Teclado</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
        <div>Ctrl+1 - Hoje</div>
        <div>Ctrl+2 - Ontem</div>
        <div>Ctrl+3 - Esta semana</div>
        <div>Ctrl+4 - Este mês</div>
        <div>Ctrl+R - Atualizar</div>
        <div>Ctrl+T - Alternar tema</div>
      </div>
    </div>
  );
}
