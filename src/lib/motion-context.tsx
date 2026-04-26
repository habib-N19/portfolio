import { createContext, useContext, useEffect, useState } from "react";
import { type MotionTier, getMotionTier, getClientPerfSignals } from "#/lib/performance";

const MotionContext = createContext<MotionTier>("full");

export function useMotionTier() {
	return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
	const [tier, setTier] = useState<MotionTier>("full");

	useEffect(() => {
		const signals = getClientPerfSignals();
		setTier(getMotionTier(signals));
	}, []);

	return <MotionContext.Provider value={tier}>{children}</MotionContext.Provider>;
}
