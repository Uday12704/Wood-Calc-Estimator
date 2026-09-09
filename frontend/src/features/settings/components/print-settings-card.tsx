// import { useEffect, useState } from "react";
// import {
//   Check,
//   Printer,
//   Save,
// } from "lucide-react";
// import { toast } from "react-toastify";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// import {
//   getPrintSettings,
//   savePrintSettings,
// } from "../services/settings-storage";

// import type {
//   PrintLayout,
//   PrintSettings,
// } from "../types";
// import { useAuth } from "@/features/auth/auth-context";

// export function PrintSettingsCard() {
//   const { user } = useAuth();
//   const [settings, setSettings] =
//     useState<PrintSettings>(() =>
//       getPrintSettings(user!.accountId),
//     );

//   const [isSaving, setIsSaving] =
//     useState(false);

//   useEffect(() => {
//     if (!user?.accountId) {
//       return;
//     }

//     setSettings(getPrintSettings(user.accountId));
//   }, []);

//   function setLayout(
//     layout: PrintLayout,
//   ) {
//     setSettings((current) => ({
//       ...current,
//       defaultLayout: layout,
//     }));
//   }

//   function handleSave() {
//     setIsSaving(true);

//     try {
//       if (!user?.accountId) {
//         return;
//       }
//       savePrintSettings(user.accountId, settings);

//       toast.success(
//         "Print settings saved successfully.",
//       );
//     } catch (error) {
//       console.error(
//         "Failed to save print settings:",
//         error,
//       );

//       toast.error(
//         "Failed to save print settings.",
//       );
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
//           <Printer className="size-5" />
//           Print Settings
//         </CardTitle>

//         <p className="text-sm text-muted-foreground">
//           Configure the default print layout and
//           information shown on printed documents.
//         </p>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         {/* DEFAULT LAYOUT */}

//         <div className="space-y-3">
//           <div>
//             <h3 className="text-sm font-semibold">
//               Default Print Layout
//             </h3>

//             <p className="mt-0.5 text-xs text-muted-foreground">
//               Select the layout used when generating
//               documents.
//             </p>
//           </div>

//           <div className="grid gap-3 sm:grid-cols-2">
//             {/* A4 */}

//             <button
//               type="button"
//               onClick={() =>
//                 setLayout("A4")
//               }
//               className={`relative rounded-lg border p-4 text-left transition-colors cursor-pointer ${
//                 settings.defaultLayout ===
//                 "A4"
//                   ? "border-primary bg-primary/5"
//                   : "hover:bg-muted/40"
//               }`}
//             >
//               {settings.defaultLayout ===
//                 "A4" && (
//                 <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
//                   <Check className="size-3" />
//                 </span>
//               )}

//               <div className="mb-3 flex justify-center">
//                 <div className="flex h-28 w-20 items-center justify-center rounded-sm border-2 bg-background shadow-sm">
//                   <div className="w-12 space-y-1">
//                     <div className="h-1 rounded bg-muted-foreground/40" />
//                     <div className="h-1 rounded bg-muted-foreground/30" />
//                     <div className="h-1 rounded bg-muted-foreground/30" />
//                     <div className="mt-2 h-8 rounded border" />
//                     <div className="h-1 rounded bg-muted-foreground/20" />
//                   </div>
//                 </div>
//               </div>

//               <p className="text-sm font-semibold">
//                 Standard A4
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Portrait document layout.
//               </p>
//             </button>

//             {/* HALF A4 */}

//             <button
//               type="button"
//               onClick={() =>
//                 setLayout(
//                   "HALF_A4_LANDSCAPE",
//                 )
//               }
//               className={`relative rounded-lg border p-4 text-left transition-colors cursor-pointer ${
//                 settings.defaultLayout ===
//                 "HALF_A4_LANDSCAPE"
//                   ? "border-primary bg-primary/5"
//                   : "hover:bg-muted/40"
//               }`}
//             >
//               {settings.defaultLayout ===
//                 "HALF_A4_LANDSCAPE" && (
//                 <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
//                   <Check className="size-3" />
//                 </span>
//               )}

//               <div className="mb-3 flex justify-center">
//                 <div className="flex h-20 w-32 items-center justify-center rounded-sm border-2 bg-background shadow-sm">
//                   <div className="w-24 space-y-1">
//                     <div className="h-1 rounded bg-muted-foreground/40" />
//                     <div className="h-1 rounded bg-muted-foreground/30" />
//                     <div className="h-1 rounded bg-muted-foreground/30" />
//                     <div className="mt-2 h-6 rounded border" />
//                     <div className="h-1 rounded bg-muted-foreground/20" />
//                   </div>
//                 </div>
//               </div>

//               <p className="text-sm font-semibold">
//                 Half A4 Landscape
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Compact landscape document layout.
//               </p>
//             </button>
//           </div>
//         </div>

//         {/* DISPLAY OPTIONS */}

//         <div className="space-y-3 border-t pt-5">
//           <div>
//             <h3 className="text-sm font-semibold">
//               Document Information
//             </h3>

//             <p className="mt-0.5 text-xs text-muted-foreground">
//               Choose which financial information should
//               appear on printed documents.
//             </p>
//           </div>

//           <div className="space-y-3">
//             {/* GST */}

//             <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/40">
//               <div>
//                 <p className="text-sm font-medium">
//                   Show GST row on print
//                 </p>

//                 <p className="mt-1 text-xs text-muted-foreground">
//                   Display GST information in estimate
//                   documents.
//                 </p>
//               </div>

//               <input
//                 type="checkbox"
//                 checked={settings.showGstRow}
//                 onChange={(event) =>
//                   setSettings((current) => ({
//                     ...current,
//                     showGstRow:
//                       event.target.checked,
//                   }))
//                 }
//                 className="size-4"
//               />
//             </label>

//             {/* DISCOUNT */}

//             <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/40">
//               <div>
//                 <p className="text-sm font-medium">
//                   Show discount row on print
//                 </p>

//                 <p className="mt-1 text-xs text-muted-foreground">
//                   Display discount information in
//                   estimate documents.
//                 </p>
//               </div>

//               <input
//                 type="checkbox"
//                 checked={
//                   settings.showDiscountRow
//                 }
//                 onChange={(event) =>
//                   setSettings((current) => ({
//                     ...current,
//                     showDiscountRow:
//                       event.target.checked,
//                   }))
//                 }
//                 className="size-4"
//               />
//             </label>
//           </div>
//         </div>

//         {/* SAVE */}

//         <div className="flex justify-end border-t pt-5">
//           <Button
//             type="button"
//             onClick={handleSave}
//             disabled={isSaving}
//             className="cursor-pointer"
//           >
//             <Save className="mr-2 size-4" />

//             {isSaving
//               ? "Saving..."
//               : "Save Print Settings"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }