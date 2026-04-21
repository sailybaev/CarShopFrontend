'use client'

import { createContext, useState, ReactNode } from 'react';

interface ThemeContextType {
	theme: string;
	toggleTheme: () => void;
}

 export const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
	toggleTheme: () => {},
});
export default function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState('light');

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}