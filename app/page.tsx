export default function Home() {
  console.log("[v0] Home page rendering")
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.25rem",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          color: "#0a0a0a",
        }}
      >
        Question Per Day
      </h1>
      <p
        style={{
          fontSize: "1.125rem",
          color: "#737373",
          textAlign: "center",
          maxWidth: "28rem",
        }}
      >
        Daily questions to spark your thinking. This project contains two apps:
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div
          style={{
            borderRadius: "0.5rem",
            border: "1px solid #e5e5e5",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0a0a0a" }}>
            QPD Web
          </h2>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#737373" }}>
            The public-facing question app
          </p>
        </div>
        <div
          style={{
            borderRadius: "0.5rem",
            border: "1px solid #e5e5e5",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0a0a0a" }}>
            QPD Admin
          </h2>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#737373" }}>
            The admin dashboard
          </p>
        </div>
      </div>
    </main>
  )
}
