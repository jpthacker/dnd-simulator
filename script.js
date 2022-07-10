// Global HTML elements
const menu = document.querySelector(".menu--start");
const titleContainer = document.querySelector(".title");
const titleMain = document.querySelector(".title__main");
const titleMenu = document.querySelector(".menu__title");
const createContainer = document.querySelector(".character-creation");
const creationMessage = document.querySelector(".character-creation__message");
const nameForm = document.querySelector(".name");
const errorMessage = document.querySelector(".character-creation__error");
const classSelector = document.querySelector(".class__selector");
const speciesSelector = document.querySelector(".species__selector");
const abilitiesAll = document.querySelector(".ability__container");
const ability = document.querySelectorAll(".ability");
const abilitiesSelector = document.querySelectorAll(".ability__selector");
const abilityOptions = document.querySelectorAll(".ability__option");
const abilityScore = document.querySelectorAll(".ability__score");
const statsContainer = document.querySelector(".stats");
const statsName = document.querySelector(".stats__name-race-class");
const statsProficiency = document.querySelector(".stats__proficiency");
const statsHitPoints = document.querySelector(".stats__hit-points");
const statsWalkingSpeed = document.querySelector(".stats__walking-speed");
const statsInitiative = document.querySelector(".stats__initiative");
const statsArmourClass = document.querySelector(".stats__armour-class");
const statsAbilities = document.querySelector(".stats__abilities");
const statsSavingThrows = document.querySelector(".stats__saving-throws");
const statsSenses = document.querySelector(".stats__senses");
const statsEquipment = document.querySelector(".stats__equipment");
const statsSpells = document.querySelector(".stats__spells");
const statsBtn = document.querySelector(".stats__btn--game");
const game = document.querySelector(".game");
const gameMenu = document.querySelector(".game__menu");
const footer = document.querySelector(".footer");
const continueBtn = document.querySelector(".btn--continue");
const btnRibbon = document.querySelector(".character-creation__btn-ribbon");
const abilityBtn = document.querySelectorAll(".ability__btn");
const abilityResetBtn = document.querySelector(".btn--reset");
const backBtn = document.querySelector(".btn--back");
const gameTitle = document.querySelector(".game__title");
const gameBtns = document.querySelectorAll("[class*='game__btn']");
const gamePopup = document.querySelector(".game__popup");
const gamePopupTitle = document.querySelector(".game__popup-title");
const gamePopupResult = document.querySelector(".game__popup-result");
const gamePopupMessage = document.querySelector(".game__popup-message");
const gamePopupBtn = document.querySelector(".game__btn--popup");
const gameStatsBtn = document.querySelector(".game__btn--stats");

// Handles DnD standard dice rolls (original code courtesy of BryanBansbach (https://github.com/BryanBansbach/DiceRoller) - with revisions)
let rolledDice = [];
const standardDice = [4, 6, 8, 10, 12, 20];
const dice = (diceType, diceNumber) => {
  rolledDice = [];
  if (standardDice.includes(diceType)) {
    if (typeof diceNumber === "undefined") {
      finalDice = Math.floor(Math.random() * diceType) + 1;
      rolledDice.push(finalDice);
      console.log(rolledDice);
      return finalDice;
    } else {
      let diceC = 0;
      for (let i = 1; i <= diceNumber; i++) {
        let diceR = Math.floor(Math.random() * diceType) + 1;
        rolledDice.push(diceR);
        console.log(rolledDice);
        diceC = diceC + diceR;
      }
      console.log(diceC);
      return diceC;
    }
  } else {
    console.log("You must choose the right type of dice (4, 6, 8, 10, 12, 20)");
  }
};

const abilityList = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

// Player object and functions
const player = {
  abilities: {},
  modifiers: {},
  savingThrows: {},
  senses: {},
  equipment: {
    weapons: {},
    armour: {},
    potions: {},
    items: {},
  },
  spells: {},
  attack: 0,
  damage: 0,
  assignAbilities() {
    for (let i = 0; i < abilityList.length; i++) {
      if (
        (abilityList[i] === "wisdom" && this.species === "Human") ||
        (abilityList[i] === "strength" && this.species === "Dwarf") ||
        (abilityList[i] === "dexterity" && this.species === "Elf")
      ) {
        this.abilities[abilityList[i]] = abilityScoreListOrdered[i] + 2;
      } else {
        this.abilities[abilityList[i]] = abilityScoreListOrdered[i];
      }
    }
  },
  assignAbilityModifiers(abilities) {
    Object.entries(abilities).forEach(([key, val]) => {
      this.modifiers[key] = Math.floor((val - 10) / 2);
    });
  },
  calculateSavingThrows(modifiers) {
    Object.entries(modifiers).forEach(([key, val]) => {
      this.savingThrows[key] = val;
      switch (this.class) {
        case "Cleric":
          if (key === "wisdom" || key === "charisma")
            this.savingThrows[key] = val + parseInt(this.proficiency);
          break;
        case "Fighter":
          if (key === "strength" || key === "constitution")
            this.savingThrows[key] = val + parseInt(this.proficiency);
          break;
        case "Rogue":
          if (key === "dexterity" || key === "intelligence")
            this.savingThrows[key] = val + parseInt(this.proficiency);
          break;
      }
    });
  },
  calculateSenses() {
    this.senses.perception = parseInt(this.modifiers.wisdom) + 10;
    this.senses.investigation = parseInt(this.modifiers.intelligence) + 10;
    this.senses.insight = parseInt(this.modifiers.wisdom) + 10;
  },
  formatStats(nestedObject) {
    Object.entries(nestedObject).forEach(([key, val]) => {
      if (val >= 0) {
        nestedObject[key] = "+" + val;
      }
    });
  },
  assignEquipment(equipment) {
    Object.keys(equipment).forEach((key) => {
      equipment[key] = {};
    });
    equipment.potions.healingPotionStandard = healingPotionStandard;
    switch (this.class) {
      case "Cleric":
        equipment.weapons.meleeWeapon = mace;
        equipment.armour.shield = shield;
        break;
      case "Fighter":
        equipment.weapons.meleeWeapon = battleaxe;
        equipment.weapons.rangedWeapon = throwingAxe;
        equipment.armour.plateArmour = plateArmour;
        break;
      case "Rogue":
        equipment.weapons.meleeWeapon = dagger;
        equipment.weapons.rangedWeapon = crossbow;
        equipment.armour.leatherArmour = leatherArmour;
        equipment.items.thievesTools = thievesTools;
    }
  },
  assignSpells(spells) {
    if (this.class === "Cleric") {
      spells.knock = knock;
      spells.sacredFlame = sacredFlame;
    } else {
      for (let prop in spells) {
        delete spells[prop];
      }
    }
  },
  calculateArmourClass() {
    Object.keys(this.equipment.armour).forEach((key) => {
      this.equipment.armour[key].getArmourBonus(this);
    });
    if (!this.equipment.armour.plateArmour) {
      player.armourClass += parseInt(this.modifiers.dexterity);
    }
  },
  calculateAttack() {
    let attackRoll = dice(20);
    this.attack =
      attackRoll +
      parseInt(this.modifiers.strength) +
      parseInt(this.proficiency);
  },
  getNameHTML(nameContainer) {
    nameContainer.innerHTML = `
    <h4 class="stats__name">${this.name}</h4>
    <h5 class="stats__species">${this.species}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;${this.class}</h5>
    `;
  },
  getProficiencyHTML(proficincyContainer) {
    proficincyContainer.innerHTML = `
    <h5 class="stats__proficiency-text1">PROFICIENCY</h5>
    <h4 class="stats__proficiency-no">${this.proficiency}</h4>
    <h5 class="stats__proficiency-text2">BONUS</h5>
    `;
  },
  getHitPointsHTML(hitPointsContainer) {
    hitPointsContainer.innerHTML = `
    <h5 class="stats__hit-points-text1">CURRENT / MAX</h5>
    <div class="stats__hit-points-no-container">
      <h4 class="stats__hit-points-current-no">${this.hitPointsCurrent}&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp</h4>
      <h4 class="stats__hit-points-max-no">${this.hitPointsMax}</h4>
    </div>
    <h5 class="stats__hit-points-text2">HIT POINTS</h5>
    `;
  },
  getWalkingSpeedHTML(walkingSpeedContainer) {
    walkingSpeedContainer.innerHTML = `
    <h5 class="stats__walking-speed-text1">WALKING</h5>
    <h4 class="stats__walking-speed-no">${this.walkingSpeed}</h4>
    <h5 class="stats__walking-speed-text2">SPEED (ft.)</h5>
    `;
  },
  getInitiativeHTML(initiativeContainer) {
    initiativeContainer.innerHTML = `
    <h5 class="stats__initiative-text1">INITIATIVE</h5>
    <h4 class="stats__initiative-no">${this.modifiers.dexterity}</h4>
    <h5 class="stats__initiative-text2"></h5>
    `;
  },
  getArmourClassHTML(armourClassContainer) {
    armourClassContainer.innerHTML = `
    <h5 class="stats__armour-class-text1">ARMOUR</h5>
    <h4 class="stats__armour-class-no">${this.armourClass}</h4>
    <h5 class="stats__armour-class-text2">CLASS</h5>
    `;
  },
  getAbilitiesHTML(abilitiesContainer) {
    abilitiesContainer.innerHTML = "";
    Object.keys(this.abilities).forEach((key) => {
      abilitiesContainer.innerHTML += `
    <div class="stats__ability--${key}">
      <h5 class="stats__ability-text--${key}">${key}</h5>
      <h4 class="stats__ability-modifier--${key}">${this.modifiers[key]}</h4>
      <h4 class="stats__ability-no--${key}">${this.abilities[key]}</h4>
    </div>`;
    });
  },
  getSavingThrowsHTML(savingThrowsContainer) {
    savingThrowsContainer.innerHTML = `
    <h4 class="stats__saving-throws-title">Saving Throws</h4>`;
    Object.keys(this.savingThrows).forEach((key) => {
      savingThrowsContainer.innerHTML += `
      <div class="stats__saving-throws--${key}">
      <h5 class="stats__saving-throws-text--${key}">${key}</h5>
      <h4 class="stats__saving-throws-modifier--${key}">
        ${this.savingThrows[key]}
      </h4>
    </div>`;
    });
  },
  getSensesHTML(sensesContainer) {
    sensesContainer.innerHTML = `
    <h4 class="stats__senses-title">Senses</h4>
    <div class="stats__senses--perception">
      <h4 class="stats__senses-modifier--perception">${this.senses.perception}</h4>
      <h5 class="stats__senses-text--perception">PASSIVE WIS (PERCEPTION)</h5>
    </div>
    `;
  },
  getEquipmentHTML(equipmentContainer) {
    equipmentContainer.innerHTML = `
    <h4 class="stats__equipment-title">Equipment</h4>
    <div class="stats__equipment--weapons">
      <div class="stats__equipment-table--four-items">
        <h5 class="stats__equipment-text">weapon</h5>
        <h5 class="stats__equipment-text">range (ft.)</h5>
        <h5 class="stats__equipment-text">hit/dc</h5>
        <h5 class="stats__equipment-text">damage</h5>
      </div>
    </div>
    <div class="stats__equipment--armour">
      <div class="stats__equipment-table">
        <h5 class="stats__equipment-text">armour</h5>
        <h5 class="stats__equipment-text">weight</h5>
        <h5 class="stats__equipment-text">ac bonus</h5>
      </div>
    </div>
    <div class="stats__equipment--potions">
      <div class="stats__equipment-table">
        <h5 class="stats__equipment-text">potion</h5>
        <h5 class="stats__equipment-text">rarity</h5>
        <h5 class="stats__equipment-text">hp bonus</h5>
      </div>
    </div>
    <div class="stats__equipment--items hidden">
      <div class="stats__equipment-table">
        <h5 class="stats__equipment-text">other</h5>
      </div>
    </div>
    `;
    const weaponsContainer = document.querySelector(
      ".stats__equipment--weapons"
    );
    const armourContainer = document.querySelector(".stats__equipment--armour");
    const potionsContainer = document.querySelector(
      ".stats__equipment--potions"
    );
    const itemsContainer = document.querySelector(".stats__equipment--items");
    getAllItemsHTML(this.equipment.weapons, weaponsContainer);
    getAllItemsHTML(this.equipment.armour, armourContainer);
    getAllItemsHTML(this.equipment.potions, potionsContainer);
    getAllItemsHTML(this.equipment.items, itemsContainer);
  },
  getSpellsHTML(spellsContainer) {
    spellsContainer.innerHTML = `
    <h4 class="stats__spells-title">Spells</h4>
    <div class="stats__spells--list">
      <div class="stats__spell-table--four-items">
        <h5 class="stats__spell-text">spell</h5>
        <h5 class="stats__spell-text">range (ft.)</h5>
        <h5 class="stats__spell-text">hit/dc</h5>
        <h5 class="stats__spell-text">effect</h5>
      </div>
    </div>
    `;
    const spellsListContainer = document.querySelector(".stats__spells--list");
    statsSpells.classList.add("hidden");
    getAllItemsHTML(this.spells, spellsListContainer);
    if (this.class === "Cleric") {
      statsSpells.classList.remove("hidden");
    }
  },
};

const getAllItemsHTML = (object, container) => {
  Object.keys(object).forEach((key) => {
    container.innerHTML += object[key].getItemHTML(player);
  });
};

// Weapon class
class Weapon {
  constructor(name, range, modifier, damageDie, html) {
    (this.name = name),
      (this.range = range),
      (this.modifier = modifier),
      (this.damageDie = damageDie),
      (this.html = html);
  }
  calculateWeaponDamage(user) {
    return dice(this.damageDie) + parseInt(user.modifiers[this.modifier]);
  }
  getItemHTML(user) {
    let damageModifier = "";
    if (user.modifiers[this.modifier] >= 1) {
      damageModifier = user.modifiers[this.modifier];
    }
    return `
    <div class="stats__equipment-weapon--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
      <h5 class="stats__equipment-text--${this.html}">${this.range}</h5>
      <h4 class="stats__equipment-modifier--${this.html}">${
      "+" +
      (parseInt(user.modifiers[this.modifier]) + parseInt(user.proficiency))
    }</h4>
    <h5 class="stats__equipment-text--${this.html}">
    1d${this.damageDie}${damageModifier}
    </h5>
    </div>
    `;
  }
}

// Melee weapons
const battleaxe = new Weapon("BattleAxe", 5, "strength", 8, "battleaxe");
const dagger = new Weapon("Dagger", 5, "dexterity", 4, "dagger");
const mace = new Weapon("Mace", 5, "strength", 6, "mace");
const shortsword = new Weapon("Shortsword", 5, "dexterity", 6, "shortsword");

// Ranged weapons
const crossbow = new Weapon("Crossbow", 80, "dexterity", 6, "crossbow");
const throwingAxe = new Weapon(
  "Throwing Axe",
  20,
  "strength",
  6,
  "throwing-axe"
);

// Armour class
class Armour {
  constructor(name, type, bonus, html) {
    (this.name = name),
      (this.type = type),
      (this.bonus = bonus),
      (this.html = html);
  }
  getArmourBonus(user) {
    user.armourClass = this.bonus;
  }
  getItemHTML(user) {
    return `
    <div class="stats__equipment-item--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
    <h5 class="stats__equipment-text--${this.html}">${this.type}</h5>
    <h4 class="stats__equipment-modifier--${this.html}">
    +${this.bonus}
    </h4>
    </div>
    `;
  }
}

// Armour types
const leatherArmour = new Armour("Leather Armour", "Light", 11, "leather");
const plateArmour = new Armour("Plate Armour", "Heavy", 16, "plate");
const shield = new Armour("Shield", "Medium", 10, "shield");

// Healing potion class
class HealingPotion {
  constructor(name, type, healingDieAmount, healingBonus, html) {
    (this.name = name),
      (this.type = type),
      (this.healingDieAmount = healingDieAmount),
      (this.healingBonus = healingBonus),
      (this.html = html);
  }
  calculateHealing(consumer) {
    let healing;
    healing = dice(4, healingDieAmount) + healingBonus;
    console.log(healing);
    consumer.hitPointsCurrent = consumer.hitPointsCurrent + healing;
  }
  getItemHTML(user) {
    return `
    <div class="stats__equipment-item--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
    <h5 class="stats__equipment-text--${this.html}">${this.type}</h5>
    <h5 class="stats__equipment-text--${this.html}">${this.healingDieAmount}d4+${this.healingBonus}</h5>
    </div>
    `;
  }
}

// Healing potions
const healingPotionStandard = new HealingPotion(
  "Potion of Healing",
  "Common",
  2,
  2,
  "standard"
);
const healingPotionGreater = new HealingPotion(
  "Greater Potion of Healing",
  "Uncommon",
  4,
  4,
  "greater"
);
const healingPotionSuperior = new HealingPotion(
  "Superior Potion of Healing",
  "Rare",
  8,
  8,
  "superior"
);

// Items class
class Item {
  constructor(name, description, html) {
    (this.name = name), (this.description = description), (this.html = html);
  }
  getItemHTML(user) {
    const itemsContainer = document.querySelector(".stats__equipment--items");
    itemsContainer.classList.remove("hidden");
    return `
    <div class="stats__equipment-item--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
    <h5 class="stats__equipment-desc--${this.html}">${this.description}</h5>
    </div>
    `;
  }
}

// Items
const thievesTools = new Item(
  "Thieves' Tools",
  "This set of tools includes a set of lock picks, allowing you to attempt to open locks. Your proficiency bonus is added to any ability checks you make to open locks.",
  "tools"
);
const goldenRing = new Item(
  "Golden Ring",
  "A simple golden ring, dulled and lined with dirt.",
  "ring"
);

// Spells class
class Spell {
  constructor(name, html, range, modifier, effect) {
    (this.name = name),
      (this.html = html),
      (this.range = range),
      (this.modifier = modifier),
      (this.effect = effect);
  }
  calculateSpellHit(user) {
    return (
      dice(20) +
      parseInt(user.modifiers[this.modifier]) +
      parseInt(user.proficiency)
    );
  }
  getItemHTML(user) {
    return `
    <div class="stats__spell--${this.html}">
    <h5 class="stats__spell-text--${this.html}">${this.name}</h5>
      <h5 class="stats__spell-text--${this.html}">${this.range}</h5>
      <h4 class="stats__spell-mod--${this.html}">${
      "+" +
      (parseInt(user.modifiers[this.modifier]) + parseInt(user.proficiency))
    }</h4>
    <h5 class="stats__spell-text--${this.html}">${this.effect}</h5>
    </div>
    `;
  }
}

// Spells
const knock = new Spell("Knock", "knock", 5, "wisdom", "Unlocking");
const sacredFlame = new Spell(
  "Sacred Flame",
  "sacred-flame",
  60,
  "wisdom",
  "1d8 Damage"
);

let currentCreationStage = "start";

// Loads the character creation message
const loadCreationMessage = () => {
  titleContainer.classList.add("title--top");
  titleMain.classList.add("title__main--top");
  titleMenu.style.marginBottom = "0vh";
  // menu.classList.remove("menu--start");
  menu.classList.add("menu");
  document.querySelector(".menu__title").innerText = "Create Your Adventurer";
  createContainer.classList.remove("character-creation--start");
  backBtn.classList.add("hidden");
  continueBtn.innerText = "Continue";
  creationMessage.innerHTML += `
Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa error
temporibus sint minima iusto quisquam, eveniet architecto, odio quia quas
ullam laudantium consequuntur deserunt laboriosam perspiciatis suscipit quo
ducimus nesciunt impedit voluptatibus corrupti. Tempore, eius quae doloribus
nisi quis corporis sit illum, velit nobis, harum unde dolore at sunt
possimus.
`;
  currentCreationStage = "message";
};

//Loads the name entry form
const loadNameForm = () => {
  nameForm.classList.remove("hidden");
  creationMessage.innerHTML = "";
  creationMessage.classList.add("hidden");
  creationMessage.classList.remove("justified");
  document.querySelector(".menu__title").innerText =
    "Enter the Name of Your Adventurer";
  backBtn.classList.remove("hidden");
  currentCreationStage = "name";
};

// Loads the class selector
const loadClassSelector = () => {
  console.log(player.name);
  if (player.name) {
    nameForm.classList.add("hidden");
    classSelector.classList.remove("hidden");
    document.querySelector(".menu__title").innerText = "Choose Your Class";
    errorMessage.innerHTML = "";
    errorMessage.classList.add("hidden");
    currentCreationStage = "class";
  } else {
    errorMessage.innerHTML = "Please enter a name";
    errorMessage.classList.remove("hidden");
  }
};

// Loads the species selector
const loadSpeciesSelector = () => {
  if (player.class) {
    console.log(player.class);
    classSelector.classList.add("hidden");
    speciesSelector.classList.remove("hidden");
    creationMessage.innerHTML = "";
    creationMessage.classList.add("hidden");
    document.querySelector(".menu__title").innerText = "Choose Your Species";
    currentCreationStage = "species";
  } else {
    errorMessage.innerHTML = "Please select a class";
    errorMessage.classList.remove("hidden");
  }
};

// Loads the abilities generator
const loadAbilitiesGenerator = () => {
  if (player.species) {
    console.log(player.species);
    speciesSelector.classList.add("hidden");
    creationMessage.innerHTML = "";
    creationMessage.classList.add("hidden");
    document.querySelector(".menu__title").innerText =
      "Roll For Your Six Ability Scores";
    abilitiesAll.classList.remove("hidden");
    errorMessage.innerHTML = "";
    errorMessage.classList.add("hidden");
    currentCreationStage = "abilities";
  } else {
    errorMessage.innerHTML = "Please select a species";
    errorMessage.classList.remove("hidden");
  }
  if (abilityScoreList.length > 0) {
    abilityResetBtn.classList.remove("hidden");
  }
};

// Loads the player character's stats
const loadCharacterStats = () => {
  let abilitiesReady;
  abilitiesSelector.forEach((selector) => {
    if (selector.disabled === true) {
      abilitiesReady = true;
    } else {
      abilitiesReady = false;
    }
  });
  if (abilitiesReady === false) {
    errorMessage.innerHTML = "Please assign your ability rolls";
    errorMessage.classList.remove("hidden");
  } else {
    createContainer.classList.add("hidden");
    abilityResetBtn.classList.add("hidden");
    statsContainer.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    document.querySelector(".menu__title").innerText = "Your Adventurer";
    player.assignAbilities();
    player.assignAbilityModifiers(player.abilities);
    player.proficiency = "+2";
    player.walkingSpeed = 30;
    player.hitPointsMax =
      parseInt(player.modifiers.constitution) + player.hitDie;
    player.hitPointsCurrent = player.hitPointsMax;
    player.calculateSavingThrows(player.modifiers);
    player.calculateSenses();
    player.assignEquipment(player.equipment);
    player.assignSpells(player.spells);
    player.formatStats(player.modifiers);
    player.formatStats(player.savingThrows);
    player.calculateArmourClass();
    console.log(player);
    // Make HTML loading more efficient, i.e., use object loops and single function
    player.getNameHTML(statsName);
    player.getProficiencyHTML(statsProficiency);
    player.getHitPointsHTML(statsHitPoints);
    player.getWalkingSpeedHTML(statsWalkingSpeed);
    player.getInitiativeHTML(statsInitiative);
    player.getArmourClassHTML(statsArmourClass);
    player.getAbilitiesHTML(statsAbilities);
    player.getSavingThrowsHTML(statsSavingThrows);
    player.getSensesHTML(statsSenses);
    player.getEquipmentHTML(statsEquipment);
    player.getSpellsHTML(statsSpells);
    currentCreationStage = "stats";
    menu.style.rowGap = "5vh";
  }
};

const loadGame = () => {
  statsContainer.classList.add("hidden");
  btnRibbon.classList.add("hidden");
  game.classList.remove("hidden");
  footer.classList.remove("hidden");
  gameBtns[0].innerText = "Enter the crypt";
  goblin.assignAbilities();
  goblin.getMaxHP();
  goblin.assignAbilityModifiers(goblin.abilities);
  goblin.calculateAttack();
  console.log(goblin);
  currentCreationStage = "game start";
};

//Handles the character creation menu buttons
continueBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo(0, 0);
  switch (currentCreationStage) {
    case "start":
      loadCreationMessage();
      break;
    case "message":
      loadNameForm();
      break;
    case "name":
      loadClassSelector();
      break;
    case "class":
      loadSpeciesSelector();
      break;
    case "species":
      loadAbilitiesGenerator();
      break;
    case "abilities":
      loadCharacterStats();
      break;
    case "stats":
      loadGame();
  }
});

//Handles the back button
backBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo(0, 0);
  switch (currentCreationStage) {
    case "name":
      nameForm.classList.add("hidden");
      errorMessage.classList.add("hidden");
      creationMessage.classList.remove("hidden");
      creationMessage.style.marginTop = "0";
      creationMessage.classList.add("justified");
      continueBtn.innerHTML = "Start";
      loadCreationMessage();
      break;
    case "class":
      loadNameForm();
      classSelector.classList.add("hidden");
      errorMessage.classList.add("hidden");
      break;
    case "species":
      speciesSelector.classList.add("hidden");
      errorMessage.classList.add("hidden");
      loadClassSelector();
      break;
    case "abilities":
      loadSpeciesSelector();
      abilitiesAll.classList.add("hidden");
      abilityResetBtn.classList.add("hidden");
      break;
    case "stats":
      loadAbilitiesGenerator();
      statsContainer.classList.add("hidden");
      createContainer.classList.remove("hidden");
      abilityResetBtn.classList.remove("hidden");
      errorMessage.classList.remove("hidden");
  }
});

// Handles the name entry form
nameForm.addEventListener("input", (event) => {
  player.name = event.target.value;
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hidden");
});

// Handles the class selector
classSelector.addEventListener("change", (event) => {
  event.preventDefault();
  creationMessage.classList.remove("hidden");
  creationMessage.style.marginTop = "10vh";
  switch (event.target.value) {
    case "cleric":
      creationMessage.innerHTML = `A priestly champion who wields divine magic in service of a higher power<br/><br/>Primary Ability: Wisdom<br/>Saves: Wisdom & Charisma
      `;
      player.class = "Cleric";
      player.hitDie = 8;
      break;
    case "fighter":
      creationMessage.innerHTML = `A master of martial combat, skilled with a variety of weapons and armour<br/><br/>Primary Ability: Strength or Dexterity<br/>Saves: Strength & Constitution
      `;
      player.class = "Fighter";
      player.hitDie = 12;
      break;
    case "rogue":
      creationMessage.innerHTML = `A scoundrel who uses stealth and trickery to overcome obstacles and enemies<br/><br/>Primary Ability: Dexterity<br/>Saves: Dexterity & Intelligence
      `;
      player.class = "Rogue";
      player.hitDie = 10;
  }
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hidden");
});

// Handles the species selector
speciesSelector.addEventListener("change", (event) => {
  event.preventDefault();
  creationMessage.classList.remove("hidden");
  creationMessage.style.marginTop = "10vh";
  switch (event.target.value) {
    case "dwarf":
      creationMessage.innerHTML = `Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal<br/><br/>Species Trait:<br/>+2 Strength
      `;
      player.species = "Dwarf";
      break;
    case "elf":
      creationMessage.innerHTML = `Elves are a magical people of otherworldly grace, living in the world but not entirely part of it<br/><br/>Species Trait:<br/>+2 Dexterity
      `;
      player.species = "Elf";
      break;
    case "human":
      creationMessage.innerHTML = `Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds<br/><br/>Species Trait:<br/>+2 Wisdom
      `;
      player.species = "Human";
  }
  // Reminds the player of their class choice
  switch (player.class) {
    case "cleric":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Cleric (Primary Ability: Wisdom, Saves: Wisdom & Charisma)";
      break;
    case "fighter":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Fighter (Primary Ability: Strength, Saves: Strength & Constitution)";
      break;
    case "rogue":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Rogue (Primary Ability: Dexterity, Saves: Dexterity & Intelligence)";
  }
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hidden");
});

// Handles the ability buttons and generates dice rolls for abilities (removes the lowest number of four d6 dice rolls and totals the remaining rolls)
let currentAbilityScore;
let abilityScoreList = [];
for (let i = 0; i < abilityBtn.length; i++) {
  abilityBtn[i].addEventListener("click", (event) => {
    if (abilityScoreList.length < 6) {
      event.preventDefault();
      dice(6, 4);
      let abilityRoll = rolledDice.sort().filter((_, i) => i);
      console.log(abilityRoll);
      currentAbilityScore = abilityRoll.reduce((a, b) => a + b);
      abilityScoreList.push(currentAbilityScore);
      abilityScore[i].innerHTML = currentAbilityScore;
      abilityBtn[i].classList.add("hidden");
      abilitiesSelector[i].classList.remove("hidden");
      if (i < 5) {
        ability[i + 1].classList.remove("hidden");
      }
      console.log(abilityScoreList);
    } else {
      errorMessage.innerHTML = "Press reset to re-roll your scores";
      errorMessage.classList.remove("hidden");
    }
  });
}

// Reorders the ability scores into correct order (after assignment)
const reorderAbilities = (ability, to) => {
  abilityScoreListOrdered.splice(to, 1, ability);
  console.log(abilityScoreListOrdered);
};

// Handles the assignment of ability scores
const abilityScoreListOrdered = [0, 0, 0, 0, 0, 0];
for (let i = 0; i < abilitiesSelector.length; i++) {
  abilitiesSelector[i].addEventListener("change", (event) => {
    let abilityOption = event.target.value;
    abilityResetBtn.classList.remove("hidden");
    switch (abilityOption) {
      case "1":
        reorderAbilities(abilityScoreList[i], 0);
        abilitiesSelector.forEach((selector) => {
          selector[1].disabled = true;
        });
        break;
      case "2":
        reorderAbilities(abilityScoreList[i], 1);
        abilitiesSelector.forEach((selector) => {
          selector[2].disabled = true;
        });
        break;
      case "3":
        reorderAbilities(abilityScoreList[i], 2);
        abilitiesSelector.forEach((selector) => {
          selector[3].disabled = true;
        });
        break;
      case "4":
        reorderAbilities(abilityScoreList[i], 3);
        abilitiesSelector.forEach((selector) => {
          selector[4].disabled = true;
        });
        break;
      case "5":
        reorderAbilities(abilityScoreList[i], 4);
        abilitiesSelector.forEach((selector) => {
          selector[5].disabled = true;
        });
        break;
      case "6":
        reorderAbilities(abilityScoreList[i], 5);
        abilitiesSelector.forEach((selector) => {
          selector[6].disabled = true;
        });
    }
    abilitiesSelector[i].disabled = true;
  });
}

// Handles the reset button and resets the ability selectors
abilityResetBtn.addEventListener("click", (event) => {
  event.preventDefault();
  abilityOptions.forEach((option) => {
    option.disabled = false;
  });
  abilitiesSelector.forEach((selector) => {
    selector[0].selected = true;
    selector[0].disabled = true;
    selector.disabled = false;
  });
});

//  Monster class
class Monster {
  constructor(
    name,
    ac,
    hitDie,
    speed,
    proficiency,
    abilitiesArray,
    meleeWeapon,
    rangedWeapon
  ) {
    (this.name = name),
      (this.ac = ac),
      (this.hitDie = hitDie),
      (this.speed = speed),
      (this.proficiency = proficiency),
      (this.meleeWeapon = meleeWeapon),
      this.rangedWeapon - rangedWeapon,
      (this.abilitiesArray = abilitiesArray);
    (this.abilities = {}), (this.modifiers = {});
  }
  getMaxHP() {
    this.maxHP = dice(this.hitDie, 2);
  }
  assignAbilities() {
    for (let i = 0; i < abilityList.length; i++) {
      this.abilities[abilityList[i]] = this.abilitiesArray[i];
    }
  }
  assignAbilityModifiers(abilities) {
    Object.entries(abilities).forEach(([key, val]) => {
      this.modifiers[key] = Math.floor((val - 10) / 2);
    });
  }
  calculateSenses() {
    this.perception = parseInt(this.modifiers.wisdom) + 10;
  }
  calculateAttack() {
    let attackRoll = dice(20);
    this.attack =
      attackRoll +
      parseInt(this.modifiers.strength) +
      parseInt(this.proficiency);
  }
}

// Monster(s)
const goblin = new Monster(
  "Goblin",
  15,
  6,
  30,
  2,
  [8, 14, 10, 10, 8, 8],
  shortsword,
  crossbow
);

// Object class
class Object {
  constructor(name, hp, ac) {
    (this.name = name), (this.hp = hp), (this.ac = ac);
  }
}

// Object(s)
const door = new Object("Door", 12, 2);

// Player/monster actions
// move; attack (melee, ranged); damage (melee, ranged); unlock; heal; percieve; investigate; pursuade;
// console.log(goblin.meleeWeapon.calculateWeaponDamage(goblin));

let currentGameStage = "game start";
let currentPopup = "";
let enemyStatus = "";

// Ability check (to be called when player or monster attempts an action)
const abilitiyCheck = (character, ability) => {
  return dice(20) + parseInt(character.modifiers[ability]);
};

// Displays the result of the ability on popup
const displayAbilityCheck = (text, check, dice, modifier) => {
  gamePopupResult.innerHTML = `${text} check (d20+modifier)<br><strong>${check} (${dice}${modifier})</strong>`;
};

// Displays the attach hit attempt
const displayAttackHit = (text, check, dice, modifier) => {
  gamePopupResult.innerHTML = `${text}: to hit (d20+modifier)<br><strong>${check} (${dice}${modifier})</strong>`;
};

// Displays the result of attack damage
const displayDamage = (text, attack, diceType, dice, modifier) => {
  gamePopupResult.innerHTML = `${text} attack (${diceType}+modifier)<br><strong>${attack} (${dice}${modifier})</strong>`;
};

// Handles popup button
gamePopupBtn.addEventListener("click", () => {
  gamePopup.classList.add("hidden");
  switch (currentPopup) {
    case "crypt look":
      gameBtns[0].classList.add("hidden");
      break;
    case "straw inspect":
      gameBtns[1].classList.add("hidden");
      break;
    case "door try":
      gamePopupResult.classList.remove("hidden");
      gameBtns[0].classList.add("hidden");
      gameBtns[2].innerText = "Force the door";
      gameBtns[2].classList.remove("hidden");
      break;
    case "door force success":
      loadHallway();
      break;
    case "door force failure":
      gameBtns[2].classList.add("hidden");
      break;
    case "door inspect":
      if (player.class === "Cleric" || player.class === "Rogue") {
        gameBtns[3].classList.remove("hidden");
      }
      if (player.class === "Cleric") {
        gameBtns[3].innerText = "Cast knock";
      } else {
        gameBtns[3].innerText = "Pick the lock";
      }
      gameBtns[1].classList.add("hidden");
      gameBtns[0].classList.remove("hidden");
      gameBtns[0].innerText = "Smash down the door";
      break;
    case "unlock failure":
      gameBtns[3].classList.add("hidden");
      break;
    case "unlock success":
      loadHallway();
      break;
    case "door attack success":
      loadHallway();
      break;
  }
});

// Shows player stats during game
gameStatsBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
  player.getEquipmentHTML(statsEquipment);
  gameMenu.classList.add("hidden");
  statsContainer.classList.remove("hidden");
  statsBtn.classList.remove("hidden");
});

// Returns player to game from stats
statsBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
  statsContainer.classList.add("hidden");
  gameMenu.classList.remove("hidden");
});

// Loads the crypt enter game stage
const loadCryptEnter = () => {
  gameTitle.innerText = "Entering the Crypt";
  gameBtns[1].classList.remove("hidden");
  gameBtns[2].classList.remove("hidden");
  gameBtns[0].innerText = "Look around";
  gameBtns[1].innerText = "Investigate the straw";
  gameBtns[2].innerText = "Approach the door";
  currentGameStage = "crypt enter";
};

// Handles the crypt look perception check
let cryptLookDC = 14;
const handleCryptLook = (DC) => {
  currentPopup = "crypt look";
  let perceptionCheck = abilitiyCheck(player, "wisdom");
  displayAbilityCheck(
    "Wisdom",
    perceptionCheck,
    rolledDice,
    player.modifiers.wisdom
  );
  if (perceptionCheck >= DC) {
    player.equipment.items.ring = goldenRing;
    gamePopup.classList.remove("hidden");
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "Out of the corner of your eye, you notice something glinting on the floor next to the pile of straw. You approach and pick up a simple gold ring, which you place in you pocket.";
  } else {
    gamePopup.classList.remove("hidden");
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The light is dim in this chamber. You notice nothing of interest beyond what you can already make out.";
  }
};

// Handles the crypt straw investigation check
let strawInspectDC1 = 12;
let strawInspectDC2 = 16;
const handleStrawInspect = (DC1, DC2) => {
  currentPopup = "straw inspect";
  let investigationCheck = abilitiyCheck(player, "intelligence");
  displayAbilityCheck(
    "Intelligence",
    investigationCheck,
    rolledDice,
    player.modifiers.intelligence
  );
  gamePopup.classList.remove("hidden");
  if (investigationCheck >= DC1 && investigationCheck < DC2) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You look over the straw. It's clear that a creature has been sleeping here recently, and you estimate that they were last hear about an hour ago.";
  } else if (investigationCheck >= DC2) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You look over the straw. You notice a putrid smell, which you recognise. A goblin slept here, no longer than a couple of hours ago.";
  } else {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The light is dim in this chamber. You notice nothing of interest beyond what you can already make out.";
  }
};

// Loads the door approach text + options
const loadDoorApproach = () => {
  gameTitle.innerText = "You approach the door";
  gameBtns[2].classList.add("hidden");
  gameBtns[0].classList.remove("hidden");
  gameBtns[1].classList.remove("hidden");
  gameBtns[0].innerText = "Try the door";
  gameBtns[1].innerText = "Investigate the door";
  currentGameStage = "door approach";
};

// Handles the door attempt
const loadDoorAttempt = () => {
  currentPopup = "door try";
  gamePopupResult.classList.add("hidden");
  gamePopup.classList.remove("hidden");
  gamePopupTitle.innerText = "The door is locked";
  gamePopupMessage.innerText =
    "Your turn the latch but the door is locked from the other side.";
};

// Handles door force check
let doorForceDC = 20;
const handleDoorForce = (DC) => {
  let strengthCheck = abilitiyCheck(player, "strength");
  displayAbilityCheck(
    "Strength",
    strengthCheck,
    rolledDice,
    player.modifiers.strength
  );
  gamePopup.classList.remove("hidden");
  if (strengthCheck >= DC) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You lean back and put all of your strength into a shoulder charge. The door's hinges splinter away from the wall and it falls to the ground with a large crash.";
    enemyStatus = "alert";
    currentPopup = "door force success";
  } else {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "You put all your weight behind the door but it's unless - it won't budge.";
    currentPopup = "door force failure";
  }
};

// Handles the door inspection check
let doorInspectDC = 10;
const handleDoorInspect = (DC) => {
  currentGameStage = "door inspect";
  currentPopup = "door inspect";
  let investigationCheck = abilitiyCheck(player, "intelligence");
  displayAbilityCheck(
    "Intelligence",
    investigationCheck,
    rolledDice,
    player.modifiers.intelligence
  );
  gamePopup.classList.remove("hidden");
  if (investigationCheck >= DC) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You inspect the door more closely. It may be locked, but you notice a weak spot - a crack in one of the central planks. You also discern that the lock might be susceptable to thieves tools or magic.";
    doorUnlockDC = 8;
    door.hp = 6;
  } else {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The light is dim in this chamber. You see a door, nothing special about it.";
  }
};

// Handles the door unlock check
let doorUnlockDC = 14;
const handleDoorUnlock = (DC) => {
  currentPopup = "door unlock";
  let unlockCheck = "";
  if (player.class === "Cleric") {
    unlockCheck = player.spells.knock.calculateSpellHit(player);
    displayAttackHit(
      player.spells.knock.name,
      unlockCheck,
      rolledDice,
      `+${parseInt(player.modifiers.wisdom) + parseInt(player.proficiency)}`
    );
  } else {
    unlockCheck =
      abilitiyCheck(player, "dexterity") + parseInt(player.proficiency);
    displayAbilityCheck(
      "Dexterity",
      unlockCheck,
      rolledDice,
      `+${parseInt(player.modifiers.dexterity) + parseInt(player.proficiency)}`
    );
  }
  gamePopup.classList.remove("hidden");
  if (unlockCheck >= DC) {
    currentPopup = "unlock success";
    gamePopupTitle.innerText = "Success!";
    if (player.class === "Cleric") {
      gamePopupMessage.innerText =
        "The spell finds its target. There is a loud knocking sound, before the latch undoes itself and door creaks open.";
    } else {
      gamePopupMessage.innerText =
        "You have to work the lock with a lockpick, but before long you find the final tumbler and the door swings open.";
    }
  } else {
    currentPopup = "unlock failure";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "This lock is to complex to be undone by the tools you possess.";
  }
};

// Handles the door attack machanic
const handleObjectAttack = (object) => {
  gamePopup.classList.remove("hidden");
  object.hp =
    object.hp -
    player.equipment.weapons.meleeWeapon.calculateWeaponDamage(player);
  console.log(object);
  if (object.hp <= 0) {
    currentPopup = "door attack success";
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "Your weapon carves through door and smashes the latch to pieces, with a loud crash. The door swings open.";
  } else {
    currentPopup = "door attack fail";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The door shows signs of damage. But for now, it holds fast.";
  }
};

// Loads the hallway stage
let trapStatus = "enabled";
const loadHallway = () => {
  gameTitle.innerText = "through the hallway";
  gameBtns[0].classList.remove("hidden");
  gameBtns[1].classList.remove("hidden");
  gameBtns[0].innerText = "Proceed down the hallway";
  gameBtns[1].innerText = "Check for traps";
  gameBtns[2].classList.add("hidden");
  gameBtns[3].classList.add("hidden");
  currentGameStage = "hallway";
};

//Handles the hallway test
const handleHallwayCheck = () => {
  if (trapStatus === "enabled") {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You hear a snap. You look down and see that your foot has triggered a wire. ";
    trapStatus = "disabled";
    currentPopup = "trap trigger";
  } else {
    // load next stage
  }
};

// Game switchboard
gameBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    switch (event.target.id) {
      case "a":
        switch (currentGameStage) {
          case "game start":
            loadCryptEnter();
            break;
          case "crypt enter":
            handleCryptLook(cryptLookDC);
            break;
          case "door approach":
            loadDoorAttempt();
            break;
          case "door inspect":
            handleObjectAttack(door);
            break;
          case "hallway":
            handleTrapTrigger();
        }
        break;
      case "b":
        switch (currentGameStage) {
          case "crypt enter":
            handleStrawInspect(strawInspectDC1, strawInspectDC2);
            break;
          case "door approach":
            handleDoorInspect(doorInspectDC);
            break;
        }
        break;
      case "c":
        switch (currentGameStage) {
          case "crypt enter":
            loadDoorApproach();
            break;
          case "door approach":
            handleDoorForce(doorForceDC);
            break;
          case "door inspect":
            handleDoorForce(doorForceDC);
        }
        break;
      case "d":
        switch (currentGameStage) {
          case "door inspect":
            handleDoorUnlock(doorUnlockDC);
        }
    }
    console.log(currentGameStage);
  });
});

// Polyfill for Object.entries
if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

// Polyfill for Object.keys
if (!Object.keys) {
  Object.keys = (function () {
    "use strict";
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString"),
      dontEnums = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor",
      ],
      dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (
        typeof obj !== "function" &&
        (typeof obj !== "object" || obj === null)
      ) {
        throw new TypeError("Object.keys called on non-object");
      }

      var result = [],
        prop,
        i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  })();
}
