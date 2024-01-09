import { ExportToCsv } from "export-to-csv";
import { Button } from "@/components/Inputs";
import { Download, Loader } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useOsUrl } from "../Opensearch";
import { OsExportHeaderOptions } from "shared-types";

type Props<TData extends Record<string, any>> = {
  data: TData[] | (() => Promise<TData[]>);
  headers: OsExportHeaderOptions<TData>[];
  // | Record<string, HeaderOptions<TData>>
};

export const ExportButton = <TData extends Record<string, any>>({
  data,
  headers,
}: Props<TData>) => {
  const [loading, setLoading] = useState(false);
  const url = useOsUrl();

  const generateExport = async (): Promise<Record<any, any>> => {
    setLoading(true);

    const exportData: Record<any, any>[] = [];
    let resolvedData: TData[];

    if (data instanceof Function) {
      resolvedData = await data();
    } else {
      resolvedData = data;
    }

    for (const item of resolvedData) {
      const column: Record<any, any> = {};

      for (const header of headers) {
        column[header.name] = header.transform(item);
      }
      exportData.push(column);
    }

    setLoading(false);

    return exportData;
  };

  const handleExport = (data: Record<any, any>) => {
    const csvExporter = new ExportToCsv({
      useKeysAsHeaders: true,
      filename: `${url.state.tab}-export-${format(new Date(), "MM/dd/yyyy")}`,
    });

    csvExporter.generateCsv(data);
  };

  return (
    <Button
      variant="outline"
      onClick={async () => {
        handleExport(await generateExport());
      }}
      disabled={loading}
      className="hover:bg-transparent self-center h-10 flex gap-2"
    >
      {loading && (
        <motion.div
          animate={{ rotate: "360deg" }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <Loader className="w-4 h-4" />
        </motion.div>
      )}
      {!loading && <Download className="w-4 h-4" />}
      <span className="prose-sm">Export</span>
    </Button>
  );
};
