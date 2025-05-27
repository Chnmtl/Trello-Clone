import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from './theme';

const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'dark' });

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState('dark');

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};
