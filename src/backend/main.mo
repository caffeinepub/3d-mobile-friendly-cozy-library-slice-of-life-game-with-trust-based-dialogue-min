import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";



actor {
  public query ({ caller }) func isAvailable() : async Bool {
    true;
  };

  type DialogueNode = {
    id : Nat;
    text : Text;
    choices : [DialogueChoice];
    trustEffect : Int;
    nextNode : ?Nat;
  };

  type DialogueChoice = {
    id : Nat;
    text : Text;
    response : Text;
    trustEffect : Int;
    nextNode : ?Nat;
  };

  type Activity = {
    name : Text;
    description : Text;
    trustEffect : Int;
    isCompleted : Bool;
  };

  type LibraryCustomization = {
    itemName : Text;
    description : Text;
    location : Text;
  };

  type MemorableMoment = {
    title : Text;
    description : Text;
    trustRequirement : Int;
    unlocked : Bool;
  };

  type Letter = {
    fromPlayer : Bool;
    content : Text;
    timestamp : Time.Time;
    response : ?Text;
  };

  type GameState = {
    trustLevel : Int;
    currentDialogueNode : ?Nat;
    completedActivities : [Text];
    libraryCustomizations : [LibraryCustomization];
    unlockedMoments : [Text];
    letters : [Letter];
    endingsUnlocked : [Text];
  };

  let defaultState : GameState = {
    trustLevel = 50;
    currentDialogueNode = null;
    completedActivities = [];
    libraryCustomizations = [];
    unlockedMoments = [];
    letters = [];
    endingsUnlocked = [];
  };

  let gameStates = Map.empty<Blob, GameState>();

  let dialogueNodes = Map.fromIter<Nat, DialogueNode>([(0, {
    id = 0;
    text = "Welcome to the library! What would you like to do?";
    choices = [
      {
        id = 0;
        text = "Ask about the lab";
        response = "The lab is a place of many mysteries. I can't remember everything, but I try to make sense of it all.";
        trustEffect = 5;
        nextNode = ?1;
      },
      {
        id = 1;
        text = "Read together";
        response = "I'd love to read with you! What should we read today?";
        trustEffect = 10;
        nextNode = ?2;
      },
    ];
    trustEffect = 0;
    nextNode = null;
  })].values());

  let availableActivities = Map.fromIter<Text, Activity>(
    [
      (
        "Read Together",
        {
          name = "Read Together";
          description = "Enjoy a quiet reading session with Puro.";
          trustEffect = 10;
          isCompleted = false;
        },
      ),
      (
        "Listen to Stories",
        {
          name = "Listen to Stories";
          description = "Listen to Puro's stories about the lab.";
          trustEffect = 8;
          isCompleted = false;
        },
      ),
      (
        "Feed Oranges",
        {
          name = "Feed Oranges";
          description = "Share oranges from the bonsai tree with Puro.";
          trustEffect = 6;
          isCompleted = false;
        },
      ),
    ].values()
  );

  let memorableMoments = Map.fromIter<Text, MemorableMoment>(
    [
      (
        "Sitting on the Mat",
        {
          title = "Sitting on the Mat";
          description = "A quiet moment shared with Puro.";
          trustRequirement = 30;
          unlocked = false;
        },
      ),
      (
        "Snack Time",
        {
          title = "Snack Time";
          description = "Watching Puro enjoy his favorite snacks.";
          trustRequirement = 50;
          unlocked = false;
        },
      ),
    ].values()
  );

  public shared ({ caller }) func startNewGame() : async () {
    let callerId = caller.toBlob();
    gameStates.add(callerId, defaultState);
  };

  public shared ({ caller }) func continueGame() : async GameState {
    let callerId = caller.toBlob();
    switch (gameStates.get(callerId)) {
      case (null) { Runtime.trap("No saved game found. Please start a new game.") };
      case (?state) { state };
    };
  };

  public shared ({ caller }) func makeChoice(nodeId : Nat, choiceId : Nat) : async () {
    let callerId = caller.toBlob();
    switch (gameStates.get(callerId)) {
      case (null) { Runtime.trap("Game state not found") };
      case (?state) {
        switch (dialogueNodes.get(nodeId)) {
          case (null) { Runtime.trap("Dialogue node not found") };
          case (?node) {
            switch (node.choices.findIndex(func(choice) { choice.id == choiceId })) {
              case (null) { Runtime.trap("Invalid choice") };
              case (?index) {
                let choice = node.choices[index];
                let newTrust = state.trustLevel + choice.trustEffect;
                let newState : GameState = {
                  trustLevel = newTrust;
                  currentDialogueNode = choice.nextNode;
                  completedActivities = state.completedActivities;
                  libraryCustomizations = state.libraryCustomizations;
                  unlockedMoments = state.unlockedMoments;
                  letters = state.letters;
                  endingsUnlocked = state.endingsUnlocked;
                };
                gameStates.add(callerId, newState);
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func completeActivity(activityName : Text) : async () {
    let callerId = caller.toBlob();
    switch (gameStates.get(callerId)) {
      case (null) { Runtime.trap("Game state not found") };
      case (?state) {
        switch (availableActivities.get(activityName)) {
          case (null) { Runtime.trap("Activity not found") };
          case (?activity) {
            if (state.completedActivities.findIndex(func(act) { act == activityName }) != null) {
              Runtime.trap("Activity already completed");
            };

            let newTrust = state.trustLevel + activity.trustEffect;
            let newCompleted = state.completedActivities.concat([activityName]);
            let newState : GameState = {
              trustLevel = newTrust;
              currentDialogueNode = state.currentDialogueNode;
              completedActivities = newCompleted;
              libraryCustomizations = state.libraryCustomizations;
              unlockedMoments = state.unlockedMoments;
              letters = state.letters;
              endingsUnlocked = state.endingsUnlocked;
            };
            gameStates.add(callerId, newState);
          };
        };
      };
    };
  };

  public shared ({ caller }) func placeCustomization(itemName : Text, description : Text, location : Text) : async () {
    let callerId = caller.toBlob();
    switch (gameStates.get(callerId)) {
      case (null) { Runtime.trap("Game state not found") };
      case (?state) {
        let newCustomization : LibraryCustomization = {
          itemName;
          description;
          location;
        };
        let newCustomizations = state.libraryCustomizations.concat([newCustomization]);
        let newState : GameState = {
          trustLevel = state.trustLevel;
          currentDialogueNode = state.currentDialogueNode;
          completedActivities = state.completedActivities;
          libraryCustomizations = newCustomizations;
          unlockedMoments = state.unlockedMoments;
          letters = state.letters;
          endingsUnlocked = state.endingsUnlocked;
        };
        gameStates.add(callerId, newState);
      };
    };
  };

  public shared ({ caller }) func unlockMoment(momentTitle : Text) : async () {
    let callerId = caller.toBlob();
    switch (gameStates.get(callerId)) {
      case (null) { Runtime.trap("Game state not found") };
      case (?state) {
        switch (memorableMoments.get(momentTitle)) {
          case (null) { Runtime.trap("Moment not found") };
          case (?moment) {
            if (state.trustLevel < moment.trustRequirement) {
              Runtime.trap("Trust level not high enough to unlock this moment");
            };

            let newUnlocked = state.unlockedMoments.concat([momentTitle]);
            let newState : GameState = {
              trustLevel = state.trustLevel;
              currentDialogueNode = state.currentDialogueNode;
              completedActivities = state.completedActivities;
              libraryCustomizations = state.libraryCustomizations;
              unlockedMoments = newUnlocked;
              letters = state.letters;
              endingsUnlocked = state.endingsUnlocked;
            };
            gameStates.add(callerId, newState);
          };
        };
      };
    };
  };

  public shared ({ caller }) func writeLetter(content : Text) : async () {
    let callerId = caller.toBlob();
    switch (gameStates.get(callerId)) {
      case (null) { Runtime.trap("Game state not found") };
      case (?state) {
        let newLetter : Letter = {
          fromPlayer = true;
          content;
          timestamp = Time.now();
          response = null;
        };
        let newLetters = state.letters.concat([newLetter]);
        let newState : GameState = {
          trustLevel = state.trustLevel;
          currentDialogueNode = state.currentDialogueNode;
          completedActivities = state.completedActivities;
          libraryCustomizations = state.libraryCustomizations;
          unlockedMoments = state.unlockedMoments;
          letters = newLetters;
          endingsUnlocked = state.endingsUnlocked;
        };
        gameStates.add(callerId, newState);
      };
    };
  };

  public shared ({ caller }) func respondToLetter(letterIndex : Nat, response : Text) : async () {
    let callerId = caller.toBlob();
    switch (gameStates.get(callerId)) {
      case (null) { Runtime.trap("Game state not found") };
      case (?state) {
        if (letterIndex >= state.letters.size()) {
          Runtime.trap("Invalid letter index");
        };

        let updatedLetters = Array.tabulate(
          state.letters.size(),
          func(i) {
            if (i == letterIndex) {
              { state.letters[i] with response = ?response };
            } else {
              state.letters[i];
            };
          }
        );

        let newState : GameState = {
          trustLevel = state.trustLevel;
          currentDialogueNode = state.currentDialogueNode;
          completedActivities = state.completedActivities;
          libraryCustomizations = state.libraryCustomizations;
          unlockedMoments = state.unlockedMoments;
          letters = updatedLetters;
          endingsUnlocked = state.endingsUnlocked;
        };
        gameStates.add(callerId, newState);
      };
    };
  };

  public shared ({ caller }) func getGameState() : async GameState {
    let callerId = caller.toBlob();
    switch (gameStates.get(callerId)) {
      case (null) { Runtime.trap("Game state not found") };
      case (?state) { state };
    };
  };

  public shared ({ caller }) func resetProgress() : async () {
    let callerId = caller.toBlob();
    gameStates.add(callerId, defaultState);
  };
};
