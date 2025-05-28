
import { useEffect } from 'react';

interface KeyboardShortcuts {
  onTodaySelect: () => void;
  onYesterdaySelect: () => void;
  onWeekSelect: () => void;
  onMonthSelect: () => void;
  onRefresh: () => void;
  onToggleTheme: () => void;
}

export const useKeyboardShortcuts = ({
  onTodaySelect,
  onYesterdaySelect,
  onWeekSelect,
  onMonthSelect,
  onRefresh,
  onToggleTheme
}: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Use Ctrl/Cmd + key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            onTodaySelect();
            break;
          case '2':
            event.preventDefault();
            onYesterdaySelect();
            break;
          case '3':
            event.preventDefault();
            onWeekSelect();
            break;
          case '4':
            event.preventDefault();
            onMonthSelect();
            break;
          case 'r':
            event.preventDefault();
            onRefresh();
            break;
          case 't':
            event.preventDefault();
            onToggleTheme();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTodaySelect, onYesterdaySelect, onWeekSelect, onMonthSelect, onRefresh, onToggleTheme]);
};
