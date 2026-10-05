import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { SelectList, type SelectItem } from "@earendil-works/pi-tui";

async function pickTheme(ctx: ExtensionCommandContext, items: SelectItem[]): Promise<string | undefined> {
	if (ctx.mode !== "tui") return ctx.hasUI ? ctx.ui.select("Choose a theme", items.map((item) => item.label)) : undefined;

	const originalTheme = ctx.ui.theme;
	const currentIndex = Math.max(0, items.findIndex((item) => item.value === originalTheme.name));
	const preview = (name: string) => {
		const theme = ctx.ui.getTheme(name);
		if (theme) ctx.ui.setTheme(theme);
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
				ctx.ui.theme.fg("accent", ctx.ui.theme.bold("Preview theme")),
				...list.render(width),
				ctx.ui.theme.fg("dim", "↑↓ preview · enter select · esc keep current theme"),
			],
			invalidate: () => list.invalidate(),
			handleInput: (data) => {
				list.handleInput(data);
				tui.requestRender();
			},
		};
	});

	if (!choice) ctx.ui.setTheme(originalTheme);
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
