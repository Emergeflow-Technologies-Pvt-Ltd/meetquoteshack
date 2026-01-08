export const getTextColorLoanStatus = (status: string) => {
  switch (status) {
    case "OPEN":
      return "#0057B5"; // Blue
    case "ASSIGNED_TO_LENDER":
      return "#DBB10B"; // Yellow
    case "ASSIGNED_TO_POTENTIAL_LENDER":
      return "#A6AC00"; // Olive
    case "IN_PROGRESS":
      return "#6100A1"; // Purple
    case "IN_CHAT":
      return "#804000"; // Brown (chat in progress)
    case "APPROVED":
      return "#1E7B43"; // Green
    case "REJECTED":
      return "#DD221C"; // Red
    case "ARCHIVED":
      return "#4C4C4C"; // Gray
    default:
      return "transparent";
  }
};

export const getBackgroundColorLoanStatus = (status: string) => {
  switch (status) {
    case "OPEN":
      return "#CCE5FF"; // Light blue
    case "ASSIGNED_TO_LENDER":
      return "#FFF7D7"; // Light yellow
    case "ASSIGNED_TO_POTENTIAL_LENDER":
      return "#f2ffd7ff"; // Light yellow
    case "IN_PROGRESS":
      return "#F7EAFF"; // Light purple
    case "IN_CHAT":
      return "#F5E3D7"; // Light brown/beige
    case "APPROVED":
      return "#D2F9E0"; // Light green
    case "REJECTED":
      return "#FFCDCC"; // Light red
    case "ARCHIVED":
      return "#E6E6E6"; // Light gray
    default:
      return "transparent";
  }
};
