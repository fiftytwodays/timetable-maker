import { useState } from "react";
import { message } from "antd";

const MAX_LOGO_SIZE = 400;

// react-pdf only embeds PNG and JPEG, so the logo is redrawn as a PNG. This
// accepts any format the browser can show (WebP, SVG, GIF, ...) and shrinks
// large images to keep the file small.
const toPngDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new window.Image();
    image.onload = () => {
      const width = image.naturalWidth || MAX_LOGO_SIZE;
      const height = image.naturalHeight || MAX_LOGO_SIZE;
      const scale = Math.min(1, MAX_LOGO_SIZE / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The logo is not an image the browser can read."));
    };
    image.src = url;
  });

// A logo that cannot be loaded is left out rather than failing the download.
const loadLogo = async (getLogoURL) => {
  try {
    const url = await getLogoURL?.();
    if (!url) {
      return null;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`The logo could not be fetched (${response.status}).`);
    }
    return await toPngDataUrl(await response.blob());
  } catch (error) {
    console.warn("Logo left out of the PDF:", error);
    message.warning("The school logo could not be added to the PDF.");
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
 * to show for a lesson cell. `getLogoURL()` is called at download time
 * because signed logo URLs expire. The PDF library is loaded on first use.
 */
export default function useDownloadTimetable({
  fileName,
  periods = [],
  getLogoURL,
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
          loadLogo(getLogoURL),
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
