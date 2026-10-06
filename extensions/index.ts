import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { SelectList, type SelectItem } from "@earendil-works/pi-tui";

const agentDir = process.env.PI_CODING_AGENT_DIR ?? join(homedir(), ".pi", "agent");
const settingsPath = join(agentDir, "pi-themes.json");
const piSettingsPath = join(agentDir, "settings.json");

type Settings = { terminalBackground?: boolean };

function getSettings(): Settings {
	try {
		return JSON.parse(readFileSync(settingsPath, "utf8")) as Settings;
	} catch {
		return {};
	}
}

function setTerminalBackground(enabled: boolean) {
	writeFileSync(settingsPath, `${JSON.stringify({ ...getSettings(), terminalBackground: enabled }, null, 2)}\n`);
}

function saveTheme(name: string) {
	const settings = existsSync(piSettingsPath) ? JSON.parse(readFileSync(piSettingsPath, "utf8")) : {};
	writeFileSync(piSettingsPath, `${JSON.stringify({ ...settings, theme: name }, null, 2)}\n`);
}

function themeAppearance(path: string | undefined, name: string) {
	try {
		const appearance = path && JSON.parse(readFileSync(path, "utf8")).appearance;
		if (appearance === "dark" || appearance === "light") return appearance;
	} catch {}
	return name.endsWith("-light") ? "light" : "dark";
}

function pageBackground(path: string | undefined): string | undefined {
	if (!path || !existsSync(path)) return;
	try {
		const color = JSON.parse(readFileSync(path, "utf8")).export?.pageBg;
		return typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color) ? color : undefined;
	} catch {
		return;
	}
}

function oscBackground(color: string) {
	return `\x1b]11;${color}\x07`;
}

function oscRgb(color: { r: number; g: number; b: number }) {
	return `\x1b]11;rgb:${color.r.toString(16).padStart(2, "0")}/${color.g.toString(16).padStart(2, "0")}/${color.b.toString(16).padStart(2, "0")}\x07`;
}

async function pickTheme(
	ctx: ExtensionCommandContext,
	items: SelectItem[],
	paths: Map<string, string | undefined>,
	requested?: string,
): Promise<string | undefined> {
	if (ctx.mode !== "tui") return ctx.hasUI ? ctx.ui.select("Choose a theme", items.map((item) => item.label)) : undefined;

	const originalTheme = ctx.ui.theme;
	const currentIndex = Math.max(0, items.findIndex((item) => item.value === (requested || originalTheme.name)));
	return ctx.ui.custom(async (tui, _theme, _keybindings, done) => {
		const originalBackground = (await tui.queryTerminalColors({ timeoutMs: 100 })).background;
		let terminalBackground = getSettings().terminalBackground === true;
		const restoreBackground = () => originalBackground && tui.terminal.write(oscRgb(originalBackground));
		const preview = (item: SelectItem) => {
			ctx.ui.setTheme(item.value);
			if (terminalBackground) {
				const color = pageBackground(paths.get(item.value));
				if (color) tui.terminal.write(oscBackground(color));
			}
		};
		const list = new SelectList(items, 12, {
			selectedPrefix: (text) => ctx.ui.theme.fg("accent", text),
			selectedText: (text) => ctx.ui.theme.fg("accent", text),
			description: (text) => ctx.ui.theme.fg("muted", text),
			scrollInfo: (text) => ctx.ui.theme.fg("dim", text),
			noMatch: (text) => ctx.ui.theme.fg("warning", text),
		});
		list.setSelectedIndex(currentIndex);
		preview(list.getSelectedItem() ?? items[0]!);
		list.onSelectionChange = preview;
		list.onSelect = (item) => done(item.value);
		list.onCancel = () => {
			ctx.ui.setTheme(originalTheme.name ?? "system");
			restoreBackground();
			done(undefined);
		};

		return {
			render: (width) => [
				ctx.ui.theme.fg("accent", ctx.ui.theme.bold("Choose a theme")),
				...list.render(width),
				ctx.ui.theme.fg("dim", `↑↓ preview · b terminal background: ${terminalBackground ? "on" : "off"} · enter select · esc cancel`),
			],
			invalidate: () => list.invalidate(),
			handleInput: (data) => {
				if (data === "b") {
					terminalBackground = !terminalBackground;
					setTerminalBackground(terminalBackground);
					if (terminalBackground) {
						const item = list.getSelectedItem();
						if (item) preview(item);
					}
					else restoreBackground();
					tui.requestRender();
					return;
				}
				list.handleInput(data);
				tui.requestRender();
			},
		};
	});
}

export default function themePicker(pi: ExtensionAPI) {
	pi.registerCommand("themes", {
		description: "Choose a theme; /themes background on|off toggles terminal backgrounds",
		handler: async (args, ctx) => {
			const requested = args.trim();
			if (requested === "set") {
				const name = ctx.ui.theme.name;
				if (!name) return ctx.ui.notify("The system theme cannot be saved.", "error");
				saveTheme(name);
				return ctx.ui.notify(`Theme saved: ${name}.`, "info");
			}
			if (/^background\s+(on|off)$/i.test(requested)) {
				setTerminalBackground(requested.endsWith("on"));
				ctx.ui.notify(`Terminal background previews ${requested.endsWith("on") ? "enabled" : "disabled"}.`, "info");
			}
			const currentAppearance = ctx.ui.theme.appearance;
			const themes = ctx.ui
				.getAllThemes()
				.map((theme) => ({ value: theme.name, label: theme.name, description: theme.path, appearance: themeAppearance(theme.path, theme.name) }))
				.sort((a, b) =>
					a.appearance === b.appearance
						? a.label.localeCompare(b.label)
						: a.appearance === currentAppearance
							? -1
							: 1,
				);
			const paths = new Map(themes.map((theme) => [theme.value, theme.description]));
			let previousAppearance: "dark" | "light" | undefined;
			for (const theme of themes) {
				theme.description = theme.appearance === previousAppearance ? undefined : `${theme.appearance === "dark" ? "Dark" : "Light"} themes`;
				previousAppearance = theme.appearance;
				delete theme.appearance;
			}
			const name = await pickTheme(ctx, themes, paths, /^background\s+(on|off)$/i.test(requested) ? undefined : requested);

			if (!name) return;
			const result = ctx.ui.setTheme(name);
			ctx.ui.notify(
				result.success ? `Theme set to ${name}. Use /settings to persist it.` : result.error ?? `Unknown theme: ${name}`,
				result.success ? "info" : "error",
			);
		},
	});
}
