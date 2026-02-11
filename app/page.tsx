export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Question Per Day
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-md">
        Daily questions to spark your thinking. This project contains two apps:
      </p>
      <div className="flex gap-4">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-semibold text-card-foreground">QPD Web</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The public-facing question app
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-semibold text-card-foreground">QPD Admin</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The admin dashboard
          </p>
        </div>
      </div>
    </main>
  )
}
