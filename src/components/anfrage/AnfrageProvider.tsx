"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Variante } from "@/lib/lead";
import { AnfrageDialog } from "./AnfrageDialog";

/**
 * Ein Formular, mehrere Auslöser.
 *
 * Der Dialog gehört ins Layout, nicht in den Hero – sonst könnte ihn nur
 * der Hero öffnen, und jeder weitere Einstieg (Kopfleiste, Footer, ein
 * späterer Knopf mitten im Text) bräuchte eine eigene Kopie samt eigenem
 * Zustand. Über den Kontext gibt es genau eine Instanz und beliebig viele
 * Knöpfe, die sie aufrufen.
 */
type AnfrageKontext = {
  /** `quelle` landet im CRM als Herkunft – so lässt sich später ablesen,
   *  welcher Einstieg tatsächlich Anfragen bringt. */
  oeffne: (quelle?: string) => void;
};

const Kontext = createContext<AnfrageKontext | null>(null);

export function useAnfrage() {
  const wert = useContext(Kontext);
  if (!wert) {
    throw new Error("useAnfrage benötigt <AnfrageProvider> im Baum darüber.");
  }
  return wert;
}

export function AnfrageProvider({
  children,
  /** Welcher Auftritt den Dialog stellt. Steht im Layout, nicht am Knopf:
   *  Die Variante ist eine Eigenschaft der Domain, nicht des Einstiegs. */
  variante = "beratung",
}: {
  children: React.ReactNode;
  variante?: Variante;
}) {
  const [offen, setOffen] = useState(false);
  const [quelle, setQuelle] = useState("Unbekannt");

  const oeffne = useCallback((q = "Unbekannt") => {
    setQuelle(q);
    setOffen(true);
  }, []);

  const wert = useMemo(() => ({ oeffne }), [oeffne]);

  return (
    <Kontext.Provider value={wert}>
      {children}
      <AnfrageDialog
        offen={offen}
        quelle={quelle}
        variante={variante}
        onSchliessen={() => setOffen(false)}
      />
    </Kontext.Provider>
  );
}
