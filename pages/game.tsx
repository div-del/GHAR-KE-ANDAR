import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGameState } from "../helpers/useGameState";
import { gameData } from "../helpers/gameData";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { House3DScene } from "../helpers/House3DScene";
import { 
  MapPin, 
  ArrowLeft, 
  ListChecks 
} from "lucide-react";
import styles from "./game.module.css";

export default function GamePage() {
  const {
    currentLocation,
    activeDialogue,
    completedTasks,
    visitedLocations,
    moveTo,
    startDialogue,
    selectChoice,
    completeTask,
    getAvailableActions,
    locationData,
    startGame,
    gameStarted
  } = useGameState();

  useEffect(() => {
    if (!gameStarted) {
      startGame();
    }
  }, [gameStarted, startGame]);

  const availableActions = getAvailableActions();

  const activeNode = activeDialogue ? gameData.dialogues[activeDialogue.currentNodeId] : null;
  const activeCharacter = activeDialogue ? gameData.characters[activeDialogue.characterId] : null;

  // Simple visual map for character representation
  const getCharacterEmoji = (id: string) => {
    switch(id) {
      case 'maa': return '👩🏽‍🍳';
      case 'papa': return '👨🏽‍💼';
      case 'dadi': return '👵🏽';
      case 'bhai': return '👦🏽';
      default: return '👤';
    }
  };

  const totalTasks = Object.keys(gameData.tasks).length;

  return (
    <div className={styles.layout}>
      <Helmet>
        <title>Playing - Ghar Ke Andar</title>
      </Helmet>

      <div className={styles.sceneContainer}>
        <House3DScene
          currentLocation={currentLocation}
          onMoveTo={moveTo}
          onTalkTo={startDialogue}
          onTask={completeTask}
          characters={gameData.characters}
          availableActions={availableActions}
          dialogueActive={!!activeDialogue}
        />
      </div>

      {/* Top Bar for contextual orientation */}
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <Button asChild variant="ghost" size="icon" className={styles.backButton}>
            <Link to="/" aria-label="Back to title">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div className={styles.locationIndicator}>
            <MapPin size={16} className={styles.locationIcon} />
            <span className={styles.locationName}>{locationData?.name}</span>
          </div>
        </div>
      </header>

      {/* Dialogue Overlay */}
      {activeDialogue && activeNode && activeCharacter && (
        <div key={activeNode.id} className={styles.dialogueOverlay}>
          <div className={styles.dialogueBox}>
            <div className={styles.characterHeader}>
              <span className={styles.characterEmoji}>{getCharacterEmoji(activeCharacter.id)}</span>
              <span className={styles.characterName}>{activeCharacter.name}</span>
            </div>
            
            <div className={styles.dialogueBody}>
              <p className={styles.speechText}>{activeNode.text}</p>

              {activeNode.internalThought && (
                <p className={styles.thoughtText}>"{activeNode.internalThought}"</p>
              )}

              <div className={styles.choicesList}>
                {activeNode.choices.map((choice) => (
                  <Button 
                    key={choice.id}
                    variant="outline"
                    className={styles.choiceButton}
                    onClick={() => selectChoice(choice.id)}
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom status bar for tracking progress */}
      <footer className={styles.bottomBar}>
        <div className={styles.statusGroup}>
          <div className={styles.dotsContainer}>
            {Object.keys(gameData.locations).map((locId) => (
              <div 
                key={locId} 
                className={`${styles.dot} ${visitedLocations.includes(locId) ? styles.dotVisited : ''}`}
                title={visitedLocations.includes(locId) ? gameData.locations[locId].name : 'Unknown Location'}
              />
            ))}
          </div>
          <span className={styles.statusText}>Places Explored</span>
        </div>
        
        <div className={styles.statusGroup}>
          <Badge variant={completedTasks.length === totalTasks ? "success" : "secondary"} className={styles.taskBadge}>
            <ListChecks size={14} className={styles.taskIcon} />
            {completedTasks.length} / {totalTasks} Tasks
          </Badge>
        </div>
      </footer>
    </div>
  );
}
