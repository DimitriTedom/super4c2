import React from "react";
import { Loader2, ShieldCheck, Clock } from "lucide-react";

export default function ExamensLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-6">
      <div className="relative flex items-center justify-center">
        <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-brand-crimson/20" />
        <div className="h-16 w-16 rounded-2xl bg-card border border-primary/30 shadow-2xl flex items-center justify-center">
          <ShieldCheck className="h-8 w-8 text-brand-crimson" />
        </div>
      </div>

      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-xl font-bold font-display text-foreground flex items-center justify-center gap-2">
          <span>Initialisation du Simulateur CBT</span>
          <Loader2 className="h-4 w-4 animate-spin text-brand-crimson" />
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Calibrage des questions officielles de France Éducation International, vérification du moteur audio ElevenLabs et synchronisation du chronomètre officiel.
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border">
        <Clock className="h-3.5 w-3.5 text-primary" />
        <span>Chronomètre CBT calibré au 1/1000e de seconde</span>
      </div>
    </div>
  );
}
