/**
 * Centralized GSAP plugin registration.
 * Import this module once — it registers ScrollTrigger as a side effect.
 * All component files should import from here instead of calling registerPlugin themselves.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
