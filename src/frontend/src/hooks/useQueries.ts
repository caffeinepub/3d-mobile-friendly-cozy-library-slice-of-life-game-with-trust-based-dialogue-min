import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GameState } from '../backend';

/**
 * React Query hooks for backend operations.
 * 
 * IMPORTANT: These hooks are designed for online gameplay with backend sync.
 * In offline mode, gameplay should rely solely on local Zustand state (useGameStore)
 * and should NOT mount or call these hooks. The offline gameplay flow bypasses
 * all backend actor calls to ensure the game remains functional without network.
 */

export function useGameState() {
  const { actor, isFetching } = useActor();

  return useQuery<GameState>({
    queryKey: ['gameState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getGameState();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStartNewGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.startNewGame();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}

export function useContinueGame() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.continueGame();
    },
  });
}

export function useMakeChoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nodeId, choiceId }: { nodeId: bigint; choiceId: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.makeChoice(nodeId, choiceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}

export function useCompleteActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityName: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.completeActivity(activityName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}

export function usePlaceCustomization() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemName, description, location }: { itemName: string; description: string; location: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.placeCustomization(itemName, description, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}

export function useUnlockMoment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (momentTitle: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.unlockMoment(momentTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}

export function useWriteLetter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.writeLetter(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}

export function useResetProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.resetProgress();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}
