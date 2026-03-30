import { useGSAP } from "@gsap/react";
import {
	Briefcase,
	Home,
	type LucideIcon,
	Mail,
	PenTool,
	User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "#/lib/gsap-setup";

const sections: { id: string; icon: LucideIcon; label: string }[] = [
	{ id: "hero", icon: Home, label: "HOME" },
	{ id: "about", icon: User, label: "ABOUT" },
	{ id: "work", icon: Briefcase, label: "WORK" },
	{ id: "blog", icon: PenTool, label: "BLOG" },
	{ id: "contact", icon: Mail, label: "CONTACT" },
];

const FloatingNav = ({ activeSection }: { activeSection: string }) => {
	const [visible, setVisible] = useState(false);
	const navRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const timer = setTimeout(() => setVisible(true), 2000);
		return () => clearTimeout(timer);
	}, []);

	const scrollToSection = (id: string) => {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};

	useGSAP(
		() => {
			if (visible && navRef.current) {
				gsap.fromTo(
					navRef.current,
					{ scale: 0.8, opacity: 0, filter: "blur(10px)" },
					{
						scale: 1,
						opacity: 1,
						filter: "blur(0px)",
						duration: 0.5,
						ease: "power2.out",
					},
				);
			}
		},
		{ dependencies: [visible], scope: navRef },
	);

	return (
		<>
			{visible && (
				<nav
					ref={navRef}
					className="fixed bottom-8 left-1/2 z-[90] -translate-x-1/2 rounded-full px-2 py-2 bg-[#0e0e0e]/85 backdrop-blur-[12px] border border-white/5 transition-transform duration-300 will-change-transform"
					style={{ opacity: 0 }}
				>
					<div className="flex items-center gap-1">
						{sections.map((section) => (
							<button
								type="button"
								key={section.id}
								onClick={() => scrollToSection(section.id)}
								className="group relative flex items-center gap-2 rounded-full px-3 py-2 transition-colors duration-400"
							>
								<section.icon
									size={18}
									strokeWidth={1.8}
									className={`relative z-10 transition-colors duration-200 ${
										activeSection === section.id
											? "text-primary"
											: "text-muted-foreground"
									}`}
								/>

								<span className="relative z-10 grid transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] grid-cols-[0fr] opacity-0 group-hover:grid-cols-[1fr] group-hover:opacity-100">
									<span className="overflow-hidden whitespace-nowrap font-mono text-[11px] tracking-widest text-foreground min-w-0">
										{section.label}
									</span>
								</span>

								{activeSection === section.id && (
									<div
										className="absolute inset-0 z-0 rounded-full transition-opacity duration-300"
										style={{ background: "hsl(68 100% 64% / 0.06)" }}
									/>
								)}
							</button>
						))}
					</div>
				</nav>
			)}
		</>
	);
};

export default FloatingNav;
