"use client";

import AssetAnalysisPage from "@/components/AssetAnalysisPage";

// ASCII route for the Arabic URL /تحليل-تقني-الذهب (mapped in middleware
// OTHER_SLUGS). Arabic directories route unreliably on Vercel and 404 across
// deploys (see the /اسعار incident), so the page lives at an ASCII path and the
// Arabic URL is rewritten to it at the Edge. Public URL + canonical stay Arabic.
export default function TechnicalAnalysisPage() {
  return <AssetAnalysisPage asset="gold" />;
}
