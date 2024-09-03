import pb from "@/shared/lib/pocketbase";

export const getImageUrl = (record) => {
  const firstFilename = record?.logo;
  const url = pb.files.getUrl(record, firstFilename, { thumb: "100x250" });
  return url;
};
