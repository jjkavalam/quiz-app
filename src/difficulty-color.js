export function getColorByDifficulty(difficulty) {
  switch (difficulty) {
    default:
      return "black";
    case "Easy":
      return "green";
    case "Medium":
      return "yellow";
    case "Hard":
      return "red";
  }
}
