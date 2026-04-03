import { useState, useCallback } from 'react';
import { gameData, GameAction } from './gameData';

export interface ActiveDialogue {
  characterId: string;
  currentNodeId: string;
}

export function useGameState() {
  const [currentLocation, setCurrentLocation] = useState<string>('home_bedroom');
  const [activeDialogue, setActiveDialogue] = useState<ActiveDialogue | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [internalThoughts, setInternalThoughts] = useState<string[]>([
    gameData.locations['home_bedroom'].entryThought
  ]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [visitedLocations, setVisitedLocations] = useState<string[]>(['home_bedroom']);

  const addThought = useCallback((thought: string) => {
    if (!thought) return;
    setInternalThoughts(prev => [thought, ...prev].slice(0, 5)); // Keep last 5 thoughts
  }, []);

  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  const moveTo = useCallback((locationId: string) => {
    const location = gameData.locations[locationId];
    if (location) {
      setCurrentLocation(locationId);
      
      if (!visitedLocations.includes(locationId)) {
        setVisitedLocations(prev => [...prev, locationId]);
      }
      
      if (location.entryThought) {
        addThought(location.entryThought);
      }
    }
  }, [visitedLocations, addThought]);

  const startDialogue = useCallback((characterId: string) => {
    // Determine the starting node for the character
    // In a full game, this might depend on state. Here we default to the first node.
    const startNodeId = `${characterId}_1`;
    const node = gameData.dialogues[startNodeId];
    
    if (node) {
      setActiveDialogue({
        characterId,
        currentNodeId: startNodeId
      });
      if (node.internalThought) {
        addThought(node.internalThought);
      }
    }
  }, [addThought]);

  const selectChoice = useCallback((choiceId: string) => {
    if (!activeDialogue) return;

    const currentNode = gameData.dialogues[activeDialogue.currentNodeId];
    if (!currentNode) return;

    const choice = currentNode.choices.find(c => c.id === choiceId);
    if (!choice) return;

    if (choice.nextNodeId) {
      const nextNode = gameData.dialogues[choice.nextNodeId];
      if (nextNode) {
        setActiveDialogue({
          characterId: activeDialogue.characterId,
          currentNodeId: choice.nextNodeId
        });
        if (nextNode.internalThought) {
          addThought(nextNode.internalThought);
        }
      } else {
        // End dialogue if next node doesn't exist
        setActiveDialogue(null);
      }
    } else {
      // End dialogue
      setActiveDialogue(null);
    }
  }, [activeDialogue, addThought]);

  const completeTask = useCallback((taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks(prev => [...prev, taskId]);
      addThought(`I finally finished doing: ${gameData.tasks[taskId]?.name}`);
    }
  }, [completedTasks, addThought]);

  const getAvailableActions = useCallback((): GameAction[] => {
    // Filter actions based on current location
    return gameData.actions.filter(action => {
      // Must be in the required location to perform the action
      if (action.requiredLocation !== currentLocation) {
        return false;
      }

      // If it's a talk action, the target character must be in the current location
      if (action.type === 'talk' && action.targetCharacter) {
        const character = gameData.characters[action.targetCharacter];
        if (!character || character.currentLocation !== currentLocation) {
          return false;
        }
      }

      // If it's a task action, check if it's already completed
      if (action.type === 'task' && action.targetTask) {
        if (completedTasks.includes(action.targetTask)) {
          return false; // Don't show completed tasks
        }
      }

      return true;
    });
  }, [currentLocation, completedTasks]);

  return {
    gameStarted,
    startGame,
    currentLocation,
    activeDialogue,
    completedTasks,
    internalThoughts,
    visitedLocations,
    moveTo,
    startDialogue,
    selectChoice,
    completeTask,
    getAvailableActions,
    locationData: gameData.locations[currentLocation]
  };
}
