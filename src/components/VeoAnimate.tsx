import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Video, Sparkles, Download, Loader2, X, AlertCircle } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

export default function VeoAnimate({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const generateVideo = async () => {
    setLoading(true);
    setError("");
    setStatus("Preparing image...");

    try {
      // Check for API key selection
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: (process as any).env.API_KEY });
      
      // Fetch image and convert to base64
      const imgRes = await fetch(imageUrl);
      const blob = await imgRes.blob();
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(blob);
      });
      const base64Data = await base64Promise;

      setStatus("Starting video generation...");
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A cinematic drone shot moving towards the scene, showing the details of the civic issue in a realistic city environment.',
        image: {
          imageBytes: base64Data,
          mimeType: blob.type,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatus("Generating video (this may take a few minutes)...");
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoRes = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': (process as any).env.API_KEY,
          },
        });
        const videoBlob = await videoRes.blob();
        setVideoUrl(URL.createObjectURL(videoBlob));
      } else {
        throw new Error("Failed to get video download link");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key issue. Please re-select your API key.");
        await (window as any).aistudio.openSelectKey();
      } else {
        setError("Failed to generate video. Please try again later.");
      }
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-neutral-900 aspect-video md:aspect-auto flex items-center justify-center relative">
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
            ) : (
              <img src={imageUrl} alt="Source" className="w-full h-full object-contain opacity-50" />
            )}
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-6 text-center">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="font-bold text-lg">{status}</p>
                <p className="text-sm opacity-70 mt-2 italic">AI is imagining the scene...</p>
              </div>
            )}
          </div>

          <div className="p-8 flex flex-col justify-center">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <Sparkles size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">AI Video Generation</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-800">Animate Issue</h3>
              <p className="text-neutral-500 text-sm mt-2">
                Transform your static photo into a cinematic video to help officials better understand the context and scale of the problem.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-start gap-2">
                <AlertCircle className="mt-0.5 shrink-0" size={18} />
                <span>{error}</span>
              </div>
            )}

            {!videoUrl ? (
              <button
                onClick={generateVideo}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Generating..." : (
                  <>
                    <Video size={20} />
                    Generate AI Video
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <a
                  href={videoUrl}
                  download="janseva-issue-animation.mp4"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Video
                </a>
                <button
                  onClick={() => setVideoUrl(null)}
                  className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  Generate Again
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-neutral-100">
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest text-center">
                Powered by Google Veo AI
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
