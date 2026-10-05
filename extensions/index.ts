import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { SelectList, type SelectItem } from "@earendil-works/pi-tui";

async function pickTheme(ctx: ExtensionCommandContext, items: SelectItem[]): Promise<string | undefined> {
	if (ctx.mode !== "tui") return ctx.hasUI ? ctx.ui.select("Choose a theme", items.map((item) => item.label)) : undefined;

	return ctx.ui.custom<string | undefined>((tui, theme, _keybindings, done) => {
		const list = new SelectList(items, 12, {
			selectedPrefix: (text) => theme.fg("accent", text),
			selectedText: (text) => theme.fg("accent", text),
			description: (text) => theme.fg("muted", text),
			scrollInfo: (text) => theme.fg("dim", text),
			noMatch: (text) => theme.fg("warning", text),
		});
		list.onSelect = (item) => done(item.value);
		list.onCancel = () => done(undefined);

		return {
			render: (width) => list.render(width),
			invalidate: () => list.invalidate(),
			handleInput: (data) => {
				list.handleInput(data);
				tui.requestRender();
			},
		};
	});
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
