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
    transfurred: boolean;
    completedActivities: Array<string>;
    timesTransfurred: bigint;
    libraryCustomizations: Array<LibraryCustomization>;
}
export interface UserProfile {
    gamesPlayed: bigint;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeActivity(activityName: string): Promise<void>;
    continueGame(): Promise<GameState>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGameState(): Promise<GameState>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAvailable(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    makeChoice(nodeId: bigint, choiceId: bigint): Promise<void>;
    placeCustomization(itemName: string, description: string, location: string): Promise<void>;
    recordTransfurred(): Promise<void>;
    resetProgress(): Promise<void>;
    respondToLetter(letterIndex: bigint, response: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startNewGame(): Promise<void>;
    unlockMoment(momentTitle: string): Promise<void>;
    writeLetter(content: string): Promise<void>;
}
