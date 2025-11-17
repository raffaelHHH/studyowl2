import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";
import classroomMap from "@/assets/classroom layout.png"; // ⬅ your downloaded map

// You can tweak these top/left values to line markers up with desks/areas
const qrLocations = [
  { id: 1, top: "18%", left: "22%" },
  { id: 2, top: "12%", left: "70%" },
  { id: 3, top: "40%", left: "30%" },
  { id: 4, top: "45%", left: "75%" },
  { id: 5, top: "72%", left: "25%" },
  { id: 6, top: "68%", left: "68%" },
];

const MapPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-background text-accent flex flex-col pb-20">
      {/* Top bar */}
      <header className="container mx-auto max-w-6xl px-4 pt-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="border-accent/40 text-accent"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-accent">Map</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex justify-center px-4 pb-8 pt-6">
        <div className="w-full max-w-6xl bg-card rounded-3xl border border-accent/20 shadow-[0_18px_50px_rgba(0,0,0,0.6)] p-5 md:p-6 flex flex-col gap-4">
          {/* Map area with real classroom map */}
          <div
            className="relative w-full flex-1 rounded-2xl overflow-hidden min-h-[320px] md:min-h-[480px]"
            style={{
              backgroundImage: `url(${classroomMap})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {qrLocations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className="absolute w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card border-2 border-accent shadow-[0_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center"
                style={{
                  top: loc.top,
                  left: loc.left,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-accent flex items-center justify-center bg-background">
                  <img
                    src={owlMascot}
                    alt="QR marker"
                    className="w-7 h-7 md:w-8 md:h-8 object-contain"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Cancel button */}
          <Button
            type="button"
            onClick={handleBack}
            size="lg"
            className="mt-1 w-full rounded-full h-12 md:h-14 text-base"
          >
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MapPage;
