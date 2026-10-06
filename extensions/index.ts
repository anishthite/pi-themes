import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { SelectList, type SelectItem } from "@earendil-works/pi-tui";

async function pickTheme(ctx: ExtensionCommandContext, items: SelectItem[]): Promise<string | undefined> {
	if (ctx.mode !== "tui") return ctx.hasUI ? ctx.ui.select("Choose a theme", items.map((item) => item.label)) : undefined;

	const originalTheme = ctx.ui.theme;
	const currentIndex = Math.max(0, items.findIndex((item) => item.value === originalTheme.name));
	let previewTheme = originalTheme;
	const preview = (name: string) => {
		previewTheme = ctx.ui.getTheme(name) ?? originalTheme;
	};
	const choice = await ctx.ui.custom<string | undefined>((tui, _theme, _keybindings, done) => {
		const list = new SelectList(items, 12, {
			selectedPrefix: (text) => ctx.ui.theme.fg("accent", text),
			selectedText: (text) => ctx.ui.theme.fg("accent", text),
			description: (text) => ctx.ui.theme.fg("muted", text),
			scrollInfo: (text) => ctx.ui.theme.fg("dim", text),
			noMatch: (text) => ctx.ui.theme.fg("warning", text),
		});
		list.setSelectedIndex(currentIndex);
		list.onSelectionChange = (item) => preview(item.value);
		list.onSelect = (item) => done(item.value);
		list.onCancel = () => done(undefined);

		return {
			render: (width) => [
				ctx.ui.theme.fg("accent", ctx.ui.theme.bold("Choose a theme")),
				...list.render(width),
				previewTheme.fg("accent", previewTheme.bold(`Preview: ${previewTheme.name ?? "system"}`)),
				previewTheme.style("  Aa  ", { fg: "text", bg: "selectedBg" }) +
					" " +
					previewTheme.fg("success", "success") +
					" " +
					previewTheme.fg("warning", "warning") +
					" " +
					previewTheme.fg("error", "error"),
				previewTheme.fg("mdHeading", "# Heading") + "  " + previewTheme.fg("mdCode", "inline code"),
				ctx.ui.theme.fg("dim", "↑↓ preview · enter select · esc cancel"),
			],
			invalidate: () => list.invalidate(),
			handleInput: (data) => {
				list.handleInput(data);
				tui.requestRender();
			},
		};
	});

	return choice;
}

export default function themePicker(pi: ExtensionAPI) {
	pi.registerCommand("themes", {
		description: "Choose a theme for this Pi session",
		handler: async (args, ctx) => {
			const requested = args.trim();
			const themes = ctx.ui
				.getAllThemes()
				.map((theme) => ({ value: theme.name, label: theme.name }))
				.sort((a, b) => a.label.localeCompare(b.label));
			const name = requested || (await pickTheme(ctx, themes));

			if (!name) return;

			const result = ctx.ui.setTheme(name);
			ctx.ui.notify(
				result.success ? `Theme set to ${name}. Use /settings to persist it.` : result.error ?? `Unknown theme: ${name}`,
				result.success ? "info" : "error",
			);
		},
	});
}
