import { Monitor, Moon, Sun } from '@tamagui/lucide-icons';
import { CurrentThemeVariant, ThemeVariant } from 'app/utils/theme';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import type { ButtonProps } from 'tamagui';
import { Button } from 'tamagui';

const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

export const ThemeToggle = (props: ButtonProps) => {
  const [theme, setTheme] = useState<ThemeVariant>('system');
  const [currentTheme, setCurrentTheme] = useState<CurrentThemeVariant>(
    Appearance.getColorScheme() || 'light'
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        setCurrentTheme(colorScheme || 'light');
      }
    });

    return () => subscription.remove();
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    setTheme(newTheme);
    if (newTheme !== 'system') {
      Appearance.setColorScheme(newTheme);
      setCurrentTheme(newTheme);
    } else {
      const systemTheme = Appearance.getColorScheme() || 'light';
      setCurrentTheme(systemTheme);
    }
  };

  return (
    <Button
      size="$4"
      onPress={toggleTheme}
      aria-label="Toggle color scheme"
      icon={icons[theme]}
      {...props}
    />
  );
};
