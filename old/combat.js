//Waits for user to click one of the action buttons
function waitForUserAttack() {
  return new Promise((resolve) => {
    const attack = document.getElementById("attackButton");
    const onAttackClick = () => {
      resolve("attack");
      removeListeners();
    };
    attack.addEventListener("click", onAttackClick);

    const second = document.getElementById("2ndActionButton");
    const onSecondClick = () => {
      resolve("second");
      removeListeners();
    };
    second.addEventListener("click", onSecondClick);

    const flee = document.getElementById("fleeButton");
    const onFleeClick = () => {
      resolve("flee");
      removeListeners();
    };
    flee.addEventListener("click", onFleeClick);

    const packItems = player.backpack;
    const onPackItemClick = () => {
      resolve("backpack");
      removeListeners();
    };

    // Add an event listener to each backpack item
    packItems.forEach(function (element) {
      const packEl = document.getElementById(element.name);
      packEl.addEventListener("click", onPackItemClick);
    });

    // Function to remove all event listeners
    function removeListeners() {
      attack.removeEventListener("click", onAttackClick);
      second.removeEventListener("click", onSecondClick);
      flee.removeEventListener("click", onFleeClick);
      packItems.forEach(function (element) {
        const packEl = document.getElementById(element.name);
        packEl.removeEventListener("click", onPackItemClick);
      });
    }
  });
}
