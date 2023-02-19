module.exports = (classe) => {
  switch (classe) {
    case 0:
    case "0":
      return "PRE";
    case 1:
    case "1":
      return "1ª";
    case 2:
    case "2":
      return "2ª";
    case 3:
    case "3":
      return "3ª";
    case 4:
    case "4":
      return "4ª";
    case 5:
    case "5":
      return "5ª";
    case 6:
    case "6":
      return "6ª";
    case 7:
    case "7":
      return "7ª";
    case 8:
    case "8":
      return "8ª";
    case 9:
    case "9":
      return "9ª";
    case 10:
    case "10":
      return "10ª";
    case 11:
    case "11":
      return "11ª";
    case 12:
    case "12":
      return "12ª";
    case 13:
    case "13":
      return "13ª";

    default:
      return new Error("Classe invalida");
  }
};
