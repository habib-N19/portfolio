import { createContext, useContext, useMemo } from "react";
import {
	getClientPerfSignals,
	getMotionTier,
	type MotionTier,
} from "#/lib/performance";

const MotionContext = createContext<MotionTier>("full");

export function useMotionTier() {
	return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
	const tier = useMemo<MotionTier>(() => {
		if (typeof window === "undefined") return "full";
		return getMotionTier(getClientPerfSignals());
	}, []);

	return (
		<MotionContext.Provider value={tier}>{children}</MotionContext.Provider>
	);
}
