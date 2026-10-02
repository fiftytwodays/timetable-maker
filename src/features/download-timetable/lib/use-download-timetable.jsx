import { useState } from "react";
import { message } from "antd";

// react-pdf only supports PNG and JPEG images.
const PDF_IMAGE_TYPES = ["image/png", "image/jpeg"];

// The logo is embedded as a data URL; a logo that cannot be loaded or is in
// another format is left out rather than failing the download.
const loadLogo = async (url) => {
  if (!url) {
    return null;
  }
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    if (!response.ok || !PDF_IMAGE_TYPES.includes(blob.type)) {
      return null;
    }
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const saveFile = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const toFileName = (name) => `${name.replace(/[\\/:*?"<>|]/g, "-")}.pdf`;

/**
 * Downloads timetables as an A4 landscape PDF. `getTimetables()` returns
 * `[{ title, rows }]`, one page each; `getCellLines(cell)` returns the lines
 * to show for a lesson cell. The PDF library is loaded on first use.
 */
export default function useDownloadTimetable({
  fileName,
  periods = [],
  logoURL,
  getTimetables,
  getCellLines,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async () => {
    setIsDownloading(true);
    try {
      const [{ pdf }, { default: TimetableDocument }, logo, timetables] =
        await Promise.all([
          import("@react-pdf/renderer"),
          import("../ui/TimetableDocument"),
          loadLogo(logoURL),
          getTimetables(),
        ]);

      if (timetables.length === 0) {
        message.info("There is no timetable to download.");
        return;
      }

      const blob = await pdf(
        <TimetableDocument
          title={fileName}
          timetables={timetables}
          periods={periods}
          logo={logo}
          getCellLines={(cell) => getCellLines(cell).filter(Boolean)}
        />
      ).toBlob();
      saveFile(blob, toFileName(fileName));
    } catch (error) {
      console.error("Download failed:", error);
      message.error(`Could not create the PDF. ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading };
}
