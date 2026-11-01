import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Literata, Source_Sans_3 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { AppShell, SidebarProvider } from "@/components/sidebar";
import { ActivityProvider } from "@/components/activity-dock";
import { ServerEventsProvider } from "@/components/server-events";
import { AppearanceProvider } from "@/components/settings/appearance";
import UpdateBanner from "@/components/update-banner";

// Minerali faces (2026-10-31): chrome = JetBrains Mono, prose = Literata,
// display/titles = Fraunces. next/font/google self-hosts at build time —
// the packaged desktop app never contacts a CDN. Source Sans 3 stays
// loaded for the incidental sans consumers (streamdown chrome, mermaid
// error cards) via --font-sans.
const ui = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const prose = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans3" });
const display = Fraunces({
	subsets: ["latin"],
	variable: "--font-fraunces",
	style: ["normal", "italic"],
	axes: ["SOFT", "WONK", "opsz"],
});
const body = Literata({
	subsets: ["latin"],
	variable: "--font-literata",
	style: ["normal", "italic"],
});

export const metadata: Metadata = {
	title: "Kiln",
	description: "A teacher agent with a memory — sessions, quizzes, and a knowledge graph of what you know.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`dark ${ui.variable} ${prose.variable} ${display.variable} ${body.variable}`}>
			<body className="min-h-dvh antialiased">
			{/* The notification channel rides OUTSIDE everything: sidebar, dock,
				 and pages all subscribe as the polls retire (push S3, 2026-10-02). */}
			<ServerEventsProvider>
				<AppearanceProvider>
					<SidebarProvider>
						<ActivityProvider>
							<AppShell>{children}</AppShell>
						</ActivityProvider>
					</SidebarProvider>
				</AppearanceProvider>
			</ServerEventsProvider>
			{/* Auto-update banner (Wave C): fixed card, Electron-only pushes. */}
			<UpdateBanner />
		</body>
		</html>
	);
}
