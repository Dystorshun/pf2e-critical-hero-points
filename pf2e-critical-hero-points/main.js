import { registerSettings } from "./settings.js";

Hooks.once("init", () => {
  registerSettings();
});

Hooks.on("createChatMessage", async (message) => {
  if (message.isRoll && message.roll.dice.length > 0) {
    const roll = message.roll;
    const d20Roll = roll.dice.find((die) => die.faces === 20);

    if (d20Roll && d20Roll.results.some((result) => result.result === 20)) {
      ui.notifications.info("Critical Hit!");

      const players = game.users.filter((u) => u.active && !u.isGM && u.character); //Improved player filtering
      if (players.length === 0) {
        ui.notifications.warn("No active players with characters to award hero points to.");
        return;
      }

      // More efficient way to update hero points
      await Promise.all(players.map(async (player) => {
        const actor = player.character;
        await actor.update({ "data.heroPoints.value": actor.data.data.heroPoints.value + 1 });
      }));

      //No longer need the dialog since we directly update
    }
  }
});
