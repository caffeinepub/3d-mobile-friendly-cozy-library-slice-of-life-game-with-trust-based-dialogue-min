import Map "mo:core/Map";
import Blob "mo:core/Blob";

module {
  public type OldGameState = {
    trustLevel : Int;
    currentDialogueNode : ?Nat;
    completedActivities : [Text];
    libraryCustomizations : [OldLibraryCustomization];
    unlockedMoments : [Text];
    letters : [OldLetter];
    endingsUnlocked : [Text];
  };

  public type OldLibraryCustomization = {
    itemName : Text;
    description : Text;
    location : Text;
  };

  public type OldLetter = {
    fromPlayer : Bool;
    content : Text;
    timestamp : Int;
    response : ?Text;
  };

  public type NewGameState = {
    trustLevel : Int;
    currentDialogueNode : ?Nat;
    completedActivities : [Text];
    libraryCustomizations : [OldLibraryCustomization];
    unlockedMoments : [Text];
    letters : [OldLetter];
    endingsUnlocked : [Text];
    transfurred : Bool;
    timesTransfurred : Nat;
  };

  public type OldActor = {
    gameStates : Map.Map<Blob, OldGameState>;
    defaultState : OldGameState;
  };

  public type NewActor = {
    gameStates : Map.Map<Blob, NewGameState>;
  };

  public func run(old : OldActor) : NewActor {
    let newGameStates = old.gameStates.map<Blob, OldGameState, NewGameState>(
      func(_id, oldState) {
        { oldState with transfurred = false; timesTransfurred = 0 };
      }
    );
    { gameStates = newGameStates };
  };
};
