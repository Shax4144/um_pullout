import { createContext, useContext, useState } from "react"

const SelectedRowContext = createContext(undefined)

export const SelectedRowProvider = ({ children }) => {
	const [selectedRow, setSelectedRow] = useState(null)

	const clearSelectedRow = () => setSelectedRow(null)

	return (
		<SelectedRowContext.Provider
			value={{ selectedRow, setSelectedRow, clearSelectedRow }}
		>
			{children}
		</SelectedRowContext.Provider>
	)
}

export const useSelectedRow = () => {
	return useContext(SelectedRowContext)
}
