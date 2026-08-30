export default function AdPanel() {
  return null; // AdSense hidden — remove this line to re-enable
  return (
    <aside
      aria-label="Advertisements"
      className="hidden xl:flex flex-col shrink-0 w-[20%] min-w-[200px] max-w-[300px] border-l border-border/50 bg-background sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
    >
      <div className="flex flex-col gap-4 p-3">
        {/* Top ad slot — 300×250 */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 text-center select-none">
            Advertisement
          </p>
          <div
            className="w-full rounded-lg border border-dashed border-border/60 bg-muted/30 flex items-center justify-center text-xs text-muted-foreground/40"
            style={{ minHeight: 250 }}
            aria-hidden="true"
          >
            {/* Replace with AdSense code */}
            {/* <ins className="adsbygoogle" style={{ display:"block", width:"100%", height:"250px" }}
                data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXXXX" /> */}
            300 × 250
          </div>
        </div>

        {/* Mid ad slot — 300×600 */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 text-center select-none">
            Advertisement
          </p>
          <div
            className="w-full rounded-lg border border-dashed border-border/60 bg-muted/30 flex items-center justify-center text-xs text-muted-foreground/40"
            style={{ minHeight: 600 }}
            aria-hidden="true"
          >
            {/* Replace with AdSense code */}
            {/* <ins className="adsbygoogle" style={{ display:"block", width:"100%", height:"600px" }}
                data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXXXX" /> */}
            300 × 600
          </div>
        </div>
      </div>
    </aside>
  );
}
