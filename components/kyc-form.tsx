"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FileDropZone } from "@/components/file-drop-zone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { kycSchema, type KycData } from "@/lib/onboarding-schema";
import { cn } from "@/lib/utils";

export const KYC_STEP_COUNT = 6;

type KycFormProps = {
  step: number;
  onStepChange: (step: number) => void;
};

type UploadField = "frontIdUrl" | "backIdUrl" | "selfieUrl";

async function uploadKycImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/v1/uploads/image?scope=kyc", {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  const json = (await res.json()) as {
    ok: boolean;
    data?: { url: string };
    error?: { message: string };
  };
  if (!res.ok || !json.ok || !json.data?.url) {
    throw new Error(json.error?.message ?? "Upload failed");
  }
  return json.data.url;
}

import { AnimatePresence, motion } from "framer-motion";

export function KycForm({ step, onStepChange }: KycFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [uploadingField, setUploadingField] = useState<UploadField | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KycData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      idType: undefined,
      idNumber: "",
      frontIdUrl: "",
      backIdUrl: "",
      selfieUrl: "",
    },
    mode: "onChange",
  });

  const idType = watch("idType");
  const idNumber = watch("idNumber");
  const frontIdUrl = watch("frontIdUrl");
  const backIdUrl = watch("backIdUrl");
  const selfieUrl = watch("selfieUrl");

  const onSubmit = async (data: KycData) => {
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/v1/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idType: data.idType,
          idNumber: data.idNumber,
          frontIdUrl: data.frontIdUrl,
          backIdUrl:
            data.idType === "PASSPORT"
              ? null
              : data.backIdUrl && data.backIdUrl.length > 0
                ? data.backIdUrl
                : null,
          selfieUrl: data.selfieUrl,
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: { message: string };
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error?.message ?? "Impossible de soumettre la vérification.");
      }
      toast.success("Vérification soumise. Nous examinerons vos documents sous peu.");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Impossible d'enregistrer. Réessayez.";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  const handleNext = () => {
    if (step < KYC_STEP_COUNT - 1) {
      onStepChange(step + 1);
    }
  };

  const stepValid = (() => {
    if (step === 0) return !!idType;
    if (step === 1) return idNumber.length >= 4;
    if (step === 2) return !!frontIdUrl;
    if (step === 3) return idType === "PASSPORT" || !!backIdUrl;
    if (step === 4) return !!selfieUrl;
    return true;
  })();

  const uploadForField = useCallback(
    async (file: File, field: UploadField) => {
      setUploadingField(field);
      try {
        const url = await uploadKycImage(file);
        setValue(field, url, { shouldValidate: true });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Le téléchargement a échoué";
        toast.error(message);
        throw e;
      } finally {
        setUploadingField(null);
      }
    },
    [setValue],
  );

  return (
    <div className="w-full max-w-md space-y-6 text-left">
      <div className="relative min-h-[140px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-6"
          >
            {step === 0 ? (
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-black">
                  Type de document
                </Label>
                <Select
                  onValueChange={(val) =>
                    setValue("idType", val as KycData["idType"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-md border-0 bg-black/4 px-3 py-2 text-sm text-foreground shadow-none transition-colors outline-none hover:bg-black/6 focus:ring-2 focus:ring-ring/25">
                    <SelectValue placeholder="Sélectionnez le type d'ID" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-black/5 shadow-xl">
                    <SelectItem value="PASSPORT">Passeport</SelectItem>
                    <SelectItem value="ID_CARD">Carte d&apos;identité nationale</SelectItem>
                    <SelectItem value="DRIVERS_LICENSE">
                      Permis de conduire
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-black/40">
                  Choisissez le document que vous avez prêt à télécharger.
                </p>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="idNumber"
                  className="text-sm font-semibold text-black"
                >
                  Numéro d&apos;ID
                </Label>
                <Input
                  id="idNumber"
                  {...register("idNumber")}
                  placeholder="e.g. 123456789"
                  className={cn(errors.idNumber && "ring-1 ring-red-500/30")}
                />
                {errors.idNumber ? (
                  <p className="text-[11px] text-red-500">
                    {errors.idNumber.message}
                  </p>
                ) : (
                  <p className="text-[11px] text-black/40">
                    Entrez le numéro exactement tel qu&apos;il apparaît sur votre ID.
                  </p>
                )}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-black">
                    Recto de l&apos;ID
                  </Label>
                  <p className="text-[11px] text-black/40">
                    Assurez-vous que tout le texte est clairement lisible et sans reflet.
                  </p>
                </div>
                <FileDropZone
                  onFileSelect={(file) => uploadForField(file, "frontIdUrl")}
                  remoteUrl={frontIdUrl}
                  onClear={() => setValue("frontIdUrl", "")}
                  isUploading={uploadingField === "frontIdUrl"}
                  className="border-0 bg-black/4"
                  hint="JPG, PNG ou WebP — la taille maximale suit la limite de votre compte. Les photos doivent être nettes et bien éclairées."
                />
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-3">
                {idType === "PASSPORT" ? (
                  <div className="space-y-4 text-center py-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/10 text-mint">
                      <Check className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-black">
                        Non requis pour le Passeport
                      </p>
                      <p className="text-xs text-black/40">
                        Les passeports ne nécessitent que la page d&apos;informations principale.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-mint font-semibold"
                      onClick={handleNext}
                    >
                      Passer cette étape
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-black">
                        Verso de l&apos;ID
                      </Label>
                      <p className="text-[11px] text-black/40">
                        Téléchargez le verso de votre carte d&apos;identification.
                      </p>
                    </div>
                    <FileDropZone
                      onFileSelect={(file) => uploadForField(file, "backIdUrl")}
                      remoteUrl={backIdUrl}
                      onClear={() => setValue("backIdUrl", "")}
                      isUploading={uploadingField === "backIdUrl"}
                      className="border-0 bg-black/4"
                      hint="Mêmes exigences que pour le recto : clair, net, carte entière visible."
                    />
                  </>
                )}
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-black">
                    Contrôle de vivacité (Selfie)
                  </Label>
                  <p className="text-[11px] text-black/40">
                    Prenez une photo claire de vous en regardant la caméra.
                  </p>
                </div>
                <FileDropZone
                  onFileSelect={(file) => uploadForField(file, "selfieUrl")}
                  remoteUrl={selfieUrl}
                  onClear={() => setValue("selfieUrl", "")}
                  isUploading={uploadingField === "selfieUrl"}
                  className="border-0 bg-black/4"
                  accept="image/*"
                  hint="Faites face à la caméra dans une bonne lumière. Pas de filtres ni de lunettes de soleil."
                />
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-6 text-center py-4">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint text-mint-foreground shadow-[0_10px_30px_-5px_rgba(15,130,97,0.3)]"
                >
                  <Check className="h-8 w-8" strokeWidth={3} />
                </motion.div>
                <div className="space-y-2">
                  <p className="text-xl font-display font-bold text-black tracking-tight">
                    Prêt à soumettre
                  </p>
                  <p className="text-sm text-black/50 max-w-[250px] mx-auto">
                    Veuillez vérifier vos documents avant de terminer. Une fois soumis,
                    les modifications ne peuvent plus être effectuées jusqu&apos;à ce que l&apos;examen soit terminé.
                  </p>
                </div>
              </div>
            ) : null}
            {error ? (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-medium text-red-500"
              >
                {error}
              </motion.p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>


      <div className="space-y-4 border-t border-black/5 pt-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: KYC_STEP_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => (i < step || stepValid ? onStepChange(i) : null)}
                disabled={i > step && !stepValid}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === step
                    ? "w-8 bg-mint"
                    : i < step
                      ? "w-1.5 bg-mint/30 hover:bg-mint/50"
                      : "w-1.5 bg-black/10 hover:bg-black/20",
                )}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex w-full items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full px-8 text-black/40 hover:bg-black/4 hover:text-black transition-colors"
              disabled={step === 0 || pending}
              onClick={() => onStepChange(Math.max(0, step - 1))}
            >
              Retour
            </Button>

            <Button
              type="button"
              className="rounded-full bg-mint px-6 font-semibold text-mint-foreground shadow-[0_10px_20px_-5px_rgba(15,130,97,0.25)] hover:bg-mint/90 active:scale-95 transition-all sm:px-10"
              disabled={!stepValid || pending}
              onClick={
                step === KYC_STEP_COUNT - 1
                  ? handleSubmit(onSubmit)
                  : handleNext
              }
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === KYC_STEP_COUNT - 1 ? (
                "Soumettre la vérification"
              ) : (
                "Continuer"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
