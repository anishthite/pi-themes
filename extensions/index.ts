import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function themePicker(pi: ExtensionAPI) {
	pi.registerCommand("themes", {
		description: "Choose a theme for this Pi session",
		handler: async (args, ctx) => {
			const requested = args.trim();
			const names = ctx.ui
				.getAllThemes()
				.map((theme) => theme.name)
				.sort();
			const name = requested || (ctx.hasUI ? await ctx.ui.select("Choose a theme", names) : undefined);

			if (!name) return;

			const result = ctx.ui.setTheme(name);
			ctx.ui.notify(
				result.success ? `Theme set to ${name}. Use /settings to persist it.` : result.error ?? `Unknown theme: ${name}`,
				result.success ? "info" : "error",
			);
		},
	});
}
