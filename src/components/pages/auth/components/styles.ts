import { CSSProperties } from "react";
// Container styles for the Card component (e.g., max width, margin, border-radius)
export const containerStyles: CSSProperties = {
  maxWidth: "400px",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "8px",
  boxShadow:
    "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px rgba(0, 0, 0, 0.03)",
};



// Layout styles for the overall page layout
export const layoutStyles: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f0f2f5",
  padding: "24px",
};

// Title styles for the Card title text
export const titleStyles: CSSProperties = {
  textAlign: "center",
  marginBottom: 0,
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: 700,
  overflowWrap: "break-word",
  hyphens: "manual",
  textOverflow: "unset",
  whiteSpace: "pre-wrap",
};

export const headStyles: CSSProperties = {
  borderBottom: 0,
  padding: 0,
};

export const bodyStyles: CSSProperties = { padding: 0, marginTop: "32px" };


// New unified styles object for the Card component's header and body
export const styles = {
  header: {
    
    backgroundColor: "#fafafa",
    borderBottom: "1px solid #e8e8e8",
    padding: "0px",
  } as CSSProperties,
  body: {
    padding: "24px",
  } as CSSProperties,
};
