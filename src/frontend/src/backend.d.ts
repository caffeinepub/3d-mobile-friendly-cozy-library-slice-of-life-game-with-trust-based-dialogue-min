import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LibraryCustomization {
    description: string;
    itemName: string;
    location: string;
}
export interface Letter {
    content: string;
    fromPlayer: boolean;
    response?: string;
    timestamp: Time;
}
export type Time = bigint;
export interface GameState {
    letters: Array<Letter>;
    currentDialogueNode?: bigint;
    trustLevel: bigint;
    endingsUnlocked: Array<string>;
    unlockedMoments: Array<string>;
    completedActivities: Array<string>;
    libraryCustomizations: Array<LibraryCustomization>;
}
export interface backendInterface {
    completeActivity(activityName: string): Promise<void>;
    continueGame(): Promise<GameState>;
    getGameState(): Promise<GameState>;
    makeChoice(nodeId: bigint, choiceId: bigint): Promise<void>;
    placeCustomization(itemName: string, description: string, location: string): Promise<void>;
    resetProgress(): Promise<void>;
    respondToLetter(letterIndex: bigint, response: string): Promise<void>;
    startNewGame(): Promise<void>;
    unlockMoment(momentTitle: string): Promise<void>;
    writeLetter(content: string): Promise<void>;
}
