
export const isImgUrl = async (url: string) => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.headers == null) return false;
    const type = res.headers.get("Content-Type");
    if (type == null) return false;
    return type.startsWith("image");
  } catch (error) {
    return false;
  }
};

